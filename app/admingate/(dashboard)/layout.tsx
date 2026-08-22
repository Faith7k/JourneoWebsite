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

  if (!user) {
    redirect('/admingate/login');
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans text-slate-900 antialiased relative selection:bg-blue-500 selection:text-white">
      {/* Subtle ambient light gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.05),rgba(255,255,255,0))]" />
      
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64 min-h-screen relative z-10">
        <AdminTopbar email={user.email ?? ''} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

