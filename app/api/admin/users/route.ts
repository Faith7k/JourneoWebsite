import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const { email, password, name, role, subscription } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'E-posta, şifre ve isim alanları zorunludur.' },
        { status: 400 }
      );
    }

    // 1. Create auth user
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

    // 2. Profile update (handle potential trigger conflict gracefully)
    // The trigger public.handle_new_user() will insert a profile automatically.
    // We upsert to make sure we overwrite display_name and role with requested values.
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: name,
      role: role || 'user',
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3. Subscription handling
    if (subscription === 'premium') {
      const { error: subError } = await supabase.from('user_subscriptions').upsert({
        user_id: userId,
        status: 'active',
        product_id: 'yearly_plan_admin',
        period_type: 'normal',
      });
      if (subError) {
        console.error('Subscription creation error:', subError);
      }
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
    const { id, email, password, name, role, subscription } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Kullanıcı ID\'si zorunludur.' }, { status: 400 });
    }

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
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdatePayload)
        .eq('id', id);
      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    // 3. Update Subscription
    if (subscription === 'premium') {
      const { error: subError } = await supabase.from('user_subscriptions').upsert({
        user_id: id,
        status: 'active',
        product_id: 'yearly_plan_admin',
        period_type: 'normal',
      });
      if (subError) {
        console.error('Subscription update error:', subError);
      }
    } else if (subscription === 'free') {
      const { error: subError } = await supabase.from('user_subscriptions').delete().eq('user_id', id);
      if (subError) {
        console.error('Subscription deletion error:', subError);
      }
    }

    return NextResponse.json({ success: true });
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
      return NextResponse.json({ error: 'Kullanıcı ID\'si zorunludur.' }, { status: 400 });
    }

    // 1. Delete Auth User
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Explicit deletions to clean up related data
    await supabase.from('profiles').delete().eq('id', id);
    await supabase.from('user_subscriptions').delete().eq('user_id', id);
    await supabase.from('fcm_tokens').delete().eq('user_id', id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
