'use client';

import { useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { ContactMessages } from '@/lib/supabase/types';

type Props = { initialMessages: ContactMessages[] };

export function MessagesList({ initialMessages }: Props) {
  const supabase = createClient();
  const [items, setItems] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactMessages | null>(null);

  const markRead = async (id: string, read: boolean) => {
    await supabase.from('contact_messages').update({ is_read: read }).eq('id', id);
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: read } : m))
    );
    setSelected((prev) => (prev && prev.id === id ? { ...prev, is_read: read } : prev));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setItems((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  };

  const fmtDate = (d: string) =>
    new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(d));

  return (
    <>
      {items.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="py-16 text-center text-slate-400">
            No messages yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m);
                if (!m.is_read) markRead(m.id, true);
              }}
              className="flex w-full items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900"
            >
              {m.is_read ? (
                <MailOpen className="h-4 w-4 shrink-0 text-slate-500" />
              ) : (
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-slate-100">{m.name}</span>
                  {!m.is_read && (
                    <Badge className="bg-blue-500/20 text-blue-300">New</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500">{m.email}</p>
              </div>
              <p className="line-clamp-1 hidden max-w-xs flex-1 text-sm text-slate-400 md:block">
                {m.message}
              </p>
              <span className="shrink-0 text-xs text-slate-500">{fmtDate(m.created_at)}</span>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="border-slate-800 bg-slate-900 text-slate-100">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selected.name}
                <span className="text-xs font-normal text-slate-500">
                  &lt;{selected.email}&gt;
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{fmtDate(selected.created_at)}</p>
              <p className="whitespace-pre-wrap text-sm text-slate-200">{selected.message}</p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleDelete(selected.id)}
                className="border-red-900/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <a href={`mailto:${selected.email}`}>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
                  Reply by email
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}