import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/admin';

// Public: list published screenshots
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('screenshots')
    .select('id, title, description, alt_text, image_url, icon, color_theme, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ screenshots: data ?? [] });
}

// Admin only: create
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('screenshots')
    .insert({
      title: body.title,
      description: body.description ?? null,
      alt_text: body.alt_text ?? null,
      image_url: body.image_url,
      storage_path: body.storage_path ?? null,
      icon: body.icon ?? null,
      color_theme: body.color_theme ?? null,
      sort_order: body.sort_order ?? 0,
      is_published: body.is_published ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ screenshot: data }, { status: 201 });
}

// Admin only: update
export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createAdminClient();
  const body = await request.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('screenshots')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ screenshot: data });
}

// Admin only: delete
export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Fetch storage_path before delete so we can remove the file too
  const { data: row } = await supabase
    .from('screenshots')
    .select('storage_path')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('screenshots').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (row?.storage_path) {
    await supabase.storage.from('screenshots').remove([row.storage_path]);
  }

  return NextResponse.json({ success: true });
}