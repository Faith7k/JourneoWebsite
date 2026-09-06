import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const body = await request.json();

    // 1. Check for specific admin action: grant_credits
    if (body.action === 'grant_credits') {
      const { userId, amount } = body;
      const count = Number(amount);
      if (!userId || !count || count <= 0) {
        return NextResponse.json({ error: 'Geçersiz kullanıcı veya hak adedi.' }, { status: 400 });
      }

      // Ensure profile exists for FK
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const name =
        authUser?.user?.user_metadata?.full_name ||
        authUser?.user?.user_metadata?.name ||
        authUser?.user?.email?.split('@')[0] ||
        'Kullanıcı';

      await supabase.from('profiles').upsert({
        id: userId,
        email: authUser?.user?.email,
        full_name: name,
        role: 'user',
      });

      const rows = Array.from({ length: count }, (_, i) => ({
        user_id: userId,
        source: 'pay_per_trip',
        source_ref: `admin_grant_${userId}_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        product_id: 'trip_pass_admin_grant',
        is_active: true,
        purchased_at: new Date().toISOString(),
      }));

      const { error: passErr } = await supabase.from('trip_pass_credits').insert(rows);
      if (passErr) {
        return NextResponse.json({ error: passErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `${count} adet tek seferlik gezi hakkı (Trip Pass) tanımlandı.`,
      });
    }

    // 2. Standard user creation
    const { email, password, name, role, subscription } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'E-posta, şifre ve isim alanları zorunludur.' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        name: name,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const userId = authData.user.id;

    // Profile upsert
    await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: name,
      role: role || 'user',
    });

    // Subscription handling
    if (subscription === 'premium') {
      await supabase.from('user_subscriptions').upsert({
        user_id: userId,
        status: 'active',
        product_id: 'yearly_plan_admin',
        store: 'app_store',
        period_type: 'normal',
        current_period_end: new Date(Date.now() + 365 * 86400_000).toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email, name, role, subscription },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: "Kullanıcı ID'si zorunludur." }, { status: 400 });
    }

    // ACTION A: Toggle / Set Premium (Annual Subscription - Sınırsız Gezi Üyeliği)
    if (action === 'toggle_premium' || action === 'set_premium') {
      const isPremium = Boolean(body.isPremium);

      if (isPremium) {
        // Ensure profile exists
        const { data: authUser } = await supabase.auth.admin.getUserById(id);
        const name =
          authUser?.user?.user_metadata?.full_name ||
          authUser?.user?.user_metadata?.name ||
          authUser?.user?.email?.split('@')[0] ||
          'Kullanıcı';

        await supabase.from('profiles').upsert({
          id,
          email: authUser?.user?.email,
          full_name: name,
          role: 'user',
        });

        // Grant 1 full year active annual subscription
        const { error: subError } = await supabase.from('user_subscriptions').upsert({
          user_id: id,
          status: 'active',
          product_id: 'yearly_plan_admin',
          store: 'app_store',
          period_type: 'normal',
          current_period_end: new Date(Date.now() + 365 * 86400_000).toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (subError) {
          return NextResponse.json({ error: subError.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Kullanıcıya 1 yıllık Sınırsız Premium abonelik hakkı tanımlandı.',
        });
      } else {
        // Expire subscription
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', id);

        if (subError) {
          return NextResponse.json({ error: subError.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Kullanıcının premium aboneliği sonlandırıldı (Free statüsüne alındı).',
        });
      }
    }

    // ACTION B: Grant Credits (+X Gezi Hakkı)
    if (action === 'grant_credits') {
      const amount = Number(body.amount);
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Geçersiz hak miktarı.' }, { status: 400 });
      }

      // Ensure profile exists
      const { data: authUser } = await supabase.auth.admin.getUserById(id);
      const name =
        authUser?.user?.user_metadata?.full_name ||
        authUser?.user?.user_metadata?.name ||
        authUser?.user?.email?.split('@')[0] ||
        'Kullanıcı';

      await supabase.from('profiles').upsert({
        id,
        email: authUser?.user?.email,
        full_name: name,
        role: 'user',
      });

      const rows = Array.from({ length: amount }, (_, i) => ({
        user_id: id,
        source: 'pay_per_trip',
        source_ref: `admin_grant_${id}_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        product_id: 'trip_pass_admin_grant',
        is_active: true,
        purchased_at: new Date().toISOString(),
      }));

      const { error: passErr } = await supabase.from('trip_pass_credits').insert(rows);
      if (passErr) {
        return NextResponse.json({ error: passErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `${amount} adet tek seferlik sınırsız gezi hakkı başarıyla tanımlandı.`,
      });
    }

    // ACTION C: Set Exact Credits Count (Belirli bir adede sabitleme / sıfırlama)
    if (action === 'set_credits') {
      const targetCount = Math.max(0, Number(body.targetCount));

      // Fetch unconsumed credits
      const { data: unconsumed, error: fetchErr } = await supabase
        .from('trip_pass_credits')
        .select('id')
        .eq('user_id', id)
        .is('consumed_trip_id', null)
        .eq('is_active', true);

      if (fetchErr) {
        return NextResponse.json({ error: fetchErr.message }, { status: 500 });
      }

      const current = unconsumed?.length ?? 0;

      if (targetCount > current) {
        const needed = targetCount - current;
        // Ensure profile exists
        const { data: authUser } = await supabase.auth.admin.getUserById(id);
        const name =
          authUser?.user?.user_metadata?.full_name ||
          authUser?.user?.user_metadata?.name ||
          authUser?.user?.email?.split('@')[0] ||
          'Kullanıcı';

        await supabase.from('profiles').upsert({
          id,
          email: authUser?.user?.email,
          full_name: name,
          role: 'user',
        });

        const rows = Array.from({ length: needed }, (_, i) => ({
          user_id: id,
          source: 'pay_per_trip',
          source_ref: `admin_grant_${id}_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
          product_id: 'trip_pass_admin_grant',
          is_active: true,
          purchased_at: new Date().toISOString(),
        }));
        await supabase.from('trip_pass_credits').insert(rows);
      } else if (targetCount < current) {
        const toRemove = current - targetCount;
        const idsToRemove = unconsumed.slice(0, toRemove).map((r) => r.id);
        await supabase.from('trip_pass_credits').delete().in('id', idsToRemove);
      }

      return NextResponse.json({
        success: true,
        message: `Kullanıcının kullanılabilir gezi hakkı ${targetCount} olarak güncellendi.`,
      });
    }

    // ACTION D: Standard user details update (Name, email, password, role, subscription)
    const { email, password, name, role, subscription } = body;

    // 1. Update Auth User
    const authUpdatePayload: any = {};
    if (email) authUpdatePayload.email = email;
    if (password) authUpdatePayload.password = password;
    if (name) {
      authUpdatePayload.user_metadata = {
        full_name: name,
        name: name,
      };
    }

    if (Object.keys(authUpdatePayload).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, authUpdatePayload);
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }
    }

    // 2. Update Profile
    const profileUpdatePayload: any = {};
    if (email) profileUpdatePayload.email = email;
    if (name) profileUpdatePayload.full_name = name;
    if (role) profileUpdatePayload.role = role;

    if (Object.keys(profileUpdatePayload).length > 0) {
      await supabase.from('profiles').update(profileUpdatePayload).eq('id', id);
    }

    // 3. Update Subscription if provided
    if (subscription === 'premium') {
      await supabase.from('user_subscriptions').upsert({
        user_id: id,
        status: 'active',
        product_id: 'yearly_plan_admin',
        store: 'app_store',
        period_type: 'normal',
        current_period_end: new Date(Date.now() + 365 * 86400_000).toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else if (subscription === 'free') {
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', id);
    }

    return NextResponse.json({ success: true, message: 'Kullanıcı bilgileri güncellendi.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Kullanıcı ID'si zorunludur." }, { status: 400 });
    }

    // 1. Delete Auth User
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Explicit deletions to clean up related data
    await supabase.from('profiles').delete().eq('id', id);
    await supabase.from('user_subscriptions').delete().eq('user_id', id);
    await supabase.from('trip_pass_credits').delete().eq('user_id', id);
    await supabase.from('fcm_tokens').delete().eq('user_id', id);

    return NextResponse.json({ success: true, message: 'Kullanıcı silindi.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
