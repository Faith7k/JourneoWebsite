import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

// Mobile app logs API usage here. Public (anon key) — RLS allows inserts.
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`api-usage:${ip}`, 60, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    const body = await request.json();
    const { endpoint, method, user_id, app_version, platform, status_code, duration_ms } = body;

    if (!endpoint || !method || typeof status_code !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('api_usage').insert({
      endpoint: String(endpoint).slice(0, 200),
      method: String(method).slice(0, 10),
      user_id: user_id ?? null,
      app_version: app_version ?? null,
      platform: platform ?? null,
      status_code: Number(status_code),
      duration_ms: duration_ms ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}