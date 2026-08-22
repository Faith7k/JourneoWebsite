'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Smartphone, Crown, MapPin, Calendar, Activity, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type UserItem = {
  id: string;
  email: string;
  name: string;
  username: string;
  platforms: string[];
  subscription: 'premium' | 'free';
  planBadge: { label: string; style: string };
  tripCount: number;
  aiCount: number;
  countries: string[];
  createdAt: string;
  lastActiveAt: string;
};

export function AdminUsersTable({ users }: { users: UserItem[] }) {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'ios' | 'android'>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase());

      const matchPlatform =
        platformFilter === 'all' || u.platforms.includes(platformFilter);

      const matchSub =
        subFilter === 'all' || u.subscription === subFilter;

      return matchSearch && matchPlatform && matchSub;
    });
  }, [users, search, platformFilter, subFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="İsim, e-posta veya kullanıcı adı ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 shadow-2xs text-xs font-medium rounded-xl h-9 focus-visible:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Platform Filter */}
          <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                platformFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Cihazlar
            </button>
            <button
              onClick={() => setPlatformFilter('ios')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                platformFilter === 'ios' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍎 iOS
            </button>
            <button
              onClick={() => setPlatformFilter('android')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                platformFilter === 'android' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🤖 Android
            </button>
          </div>

          {/* Sub Filter */}
          <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => setSubFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Üyeler
            </button>
            <button
              onClick={() => setSubFilter('premium')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'premium' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 Premium
            </button>
            <button
              onClick={() => setSubFilter('free')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'free' ? 'bg-slate-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Free
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-500 font-bold text-xs py-3.5">Kullanıcı / Profil</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs">Platform</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs">Üyelik / Paket</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs text-center">Geziler / AI Aktivitesi</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs">Ziyaret Edilen Ülkeler</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs">Kayıt Tarihi</TableHead>
              <TableHead className="text-slate-500 font-bold text-xs">Son Görülme</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-slate-100">
                <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-400 italic">
                  Arama kriterlerine uygun kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className="border-slate-100 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-extrabold text-white shadow-2xs">
                        {u.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.platforms.map((plt: string) => (
                        <Badge
                          key={plt}
                          variant="outline"
                          className={
                            plt === 'ios'
                              ? 'border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-bold shadow-2xs'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold shadow-2xs'
                          }
                        >
                          {plt === 'ios' ? '🍎 iOS' : plt === 'android' ? '🤖 Android' : '🌐 Web'}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${u.planBadge.style} text-[11px] shadow-2xs`}
                    >
                      {u.planBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs font-semibold text-slate-700">
                      <strong className="text-emerald-600 font-bold">{u.tripCount}</strong> gezi
                      <span className="text-slate-300">•</span>
                      <span className="text-purple-700 font-bold">{u.aiCount} AI</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.countries.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {u.countries.slice(0, 3).map((c: string) => (
                          <span
                            key={c}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 border border-slate-200 font-semibold"
                          >
                            {c}
                          </span>
                        ))}
                        {u.countries.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-bold">+{u.countries.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {new Intl.DateTimeFormat('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(u.createdAt))}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(u.lastActiveAt))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Preview Dialog / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-lg shadow-md">
                  {selectedUser.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Üyelik Durumu</p>
                <p className="font-bold text-slate-800 mt-1">{selectedUser.planBadge.label}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Aktivite Metrikleri</p>
                <p className="font-bold text-slate-800 mt-1">
                  {selectedUser.tripCount} Gezi Planı • {selectedUser.aiCount} AI İsteği
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kayıt Tarihi</p>
                <p className="font-bold text-slate-800 mt-1">
                  {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kullanıcı ID</p>
                <p className="font-mono text-[10px] text-slate-600 mt-1 truncate">{selectedUser.id}</p>
              </div>
            </div>

            {selectedUser.countries.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Planlanan Destinasyonlar</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.countries.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl text-xs font-bold"
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
