import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-400">
          Site-wide configuration used by the landing page and footer.
        </p>
      </div>
      <SettingsForm initial={data ?? null} />
    </div>
  );
}