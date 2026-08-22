import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `screenshots/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('screenshots').getPublicUrl(path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: path,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
