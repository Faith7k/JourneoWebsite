import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { ScreenshotsManager } from '@/components/admin/screenshots-manager';

export default async function AdminScreenshotsPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const { data: screenshots } = await supabase
    .from('screenshots')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Screenshots</h2>
        <p className="text-sm text-slate-400">
          Upload and manage screenshots shown on the public gallery.
        </p>
      </div>
      <ScreenshotsManager initialScreenshots={screenshots ?? []} />
    </div>
  );
}