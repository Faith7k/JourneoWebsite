import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  // requireAdmin returns null for non-admins. Middleware also guards this,
  // but this is the defense-in-depth check for direct renders.
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar email={user.email ?? ''} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
