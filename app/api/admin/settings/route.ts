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

    const payload = {
      app_store_url: body.app_store_url || null,
      play_store_url: body.play_store_url || null,
      support_email: body.support_email || null,
      press_email: body.press_email || null,
      phone: body.phone || null,
      address: body.address || null,
      twitter_url: body.twitter_url || null,
      instagram_url: body.instagram_url || null,
      linkedin_url: body.linkedin_url || null,
      privacy_policy_url: body.privacy_policy_url || null,
      terms_of_service_url: body.terms_of_service_url || null,
      privacy_policy_text_tr: body.privacy_policy_text_tr || null,
      privacy_policy_text_en: body.privacy_policy_text_en || null,
      terms_of_service_text_tr: body.terms_of_service_text_tr || null,
      terms_of_service_text_en: body.terms_of_service_text_en || null,
    };

    // Check if a site_settings row already exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing?.id) {
      result = await supabase
        .from('site_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('site_settings')
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: result.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
