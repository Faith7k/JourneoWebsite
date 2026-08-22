'use client';

import { useState } from 'react';
import { Mail, MailOpen, Trash2, CheckCircle2, Search, Reply, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const [items, setItems] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactMessages | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const markRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: read }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_read: read } : m))
        );
        setSelected((prev) => (prev && prev.id === id ? { ...prev, is_read: read } : prev));
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== id));
        setSelected(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const fmtDate = (d: string) =>
    new Intl.DateTimeFormat('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(d));

  const filteredItems = items.filter((m) => {
    const matchFilter =
      filter === 'all' ? true : filter === 'unread' ? !m.is_read : m.is_read;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = items.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tümü ({items.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === 'unread'
                ? 'bg-white text-rose-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Okunmamış ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === 'read'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Okunmuş ({items.length - unreadCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Mesajlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-slate-200/80 shadow-2xs text-xs font-medium rounded-xl h-9 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages List */}
      {filteredItems.length === 0 ? (
        <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Mesaj Bulunamadı</p>
            <p className="text-xs text-slate-400 mt-1">Seçili filtreye uygun iletişim mesajı bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m);
                if (!m.is_read) markRead(m.id, true);
              }}
              className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-2xs transition-all duration-200 ${
                m.is_read
                  ? 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  : 'border-blue-200/80 bg-blue-50/30 hover:border-blue-300 hover:bg-blue-50/60 shadow-xs'
              }`}
            >
              {m.is_read ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shrink-0 border border-slate-200/60">
                  <MailOpen className="h-4.5 w-4.5" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shrink-0 shadow-xs">
                  <Mail className="h-4.5 w-4.5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {m.name}
                  </span>
                  {!m.is_read && (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold shadow-2xs">
                      Yeni
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs font-medium text-slate-500 font-mono">{m.email}</p>
              </div>

              <p className="line-clamp-1 hidden max-w-md flex-1 text-xs text-slate-600 md:block font-normal">
                {m.message}
              </p>

              <span className="shrink-0 text-[11px] font-bold text-slate-400 font-mono bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                {fmtDate(m.created_at)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="border-slate-200/80 bg-white text-slate-900 shadow-2xl sm:max-w-xl rounded-2xl p-6">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="flex items-center justify-between text-lg font-extrabold text-slate-900">
                <span>{selected.name}</span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {fmtDate(selected.created_at)}
                </span>
              </DialogTitle>
              <p className="text-xs font-bold text-blue-600 mt-0.5 font-mono">{selected.email}</p>
            </DialogHeader>

            <div className="py-4">
              <div className="rounded-xl bg-slate-50 p-4.5 border border-slate-200/60 shadow-2xs">
                <p className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {selected.message}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-between pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => handleDelete(selected.id)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-bold text-xs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Mesajı Sil
              </Button>
              <a href={`mailto:${selected.email}`}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-xs font-bold text-xs rounded-xl">
                  <Reply className="mr-2 h-4 w-4" />
                  E-posta İle Yanıtla
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}