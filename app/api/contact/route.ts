import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    const rateLimitResult = rateLimit(ip, 5, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, locale } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters).' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Hash IP for privacy — store only a hash so we can correlate abuse without
    // storing raw IPs.
    const ipHash = await hashIp(ip);

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 320),
      message: String(message).slice(0, 5000),
      locale: locale ?? null,
      user_agent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
      ip_hash: ipHash,
      is_read: false,
    });

    if (insertError) {
      console.error('Contact insert error:', insertError);
      return NextResponse.json(
        { error: 'Could not store your message. Please try again.' },
        { status: 500 }
      );
    }

    // Send email to hello@journeo.ai asynchronously / await
    const emailResult = await sendContactEmail({
      name: String(name),
      email: String(email),
      message: String(message),
      locale: locale ?? 'tr',
    });

    if (!emailResult.success) {
      console.warn('Contact email status:', emailResult.error);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`journeo:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}