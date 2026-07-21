import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { MessagesList } from '@/components/admin/messages-list';

export default async function AdminMessagesPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Contact Messages</h2>
        <p className="text-sm text-slate-400">
          Submissions from the public contact form.
        </p>
      </div>
      <MessagesList initialMessages={messages ?? []} />
    </div>
  );
}