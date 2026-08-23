'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Smartphone, Crown, MapPin, Calendar, Activity, ChevronRight, Check, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
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
  role?: 'admin' | 'user';
};

export function AdminUsersTable({ users }: { users: UserItem[] }) {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'ios' | 'android'>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // User Creation States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'free' as 'premium' | 'free',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // User Edit/Delete States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'free' as 'premium' | 'free',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Handlers
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kullanıcı oluşturulurken bir hata oluştu.');
      
      setIsCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user', subscription: 'free' });
      window.location.reload();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kullanıcı güncellenirken bir hata oluştu.');
      
      setIsEditing(false);
      setSelectedUser(null);
      window.location.reload();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kullanıcı silinirken bir hata oluştu.');
      
      setIsDeleting(false);
      setSelectedUser(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const startEdit = (user: UserItem) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // blank to keep unchanged
      role: user.role || 'user',
      subscription: user.subscription,
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="İsim, e-posta veya kullanıcı adı ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 shadow-2xs text-xs font-medium rounded-xl h-9 focus-visible:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => platformFilter !== 'ios' && setPlatformFilter('ios')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                platformFilter === 'ios' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍎 iOS
            </button>
            <button
              onClick={() => platformFilter !== 'android' && setPlatformFilter('android')}
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
              onClick={() => subFilter !== 'premium' && setSubFilter('premium')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'premium' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 Premium
            </button>
            <button
              onClick={() => subFilter !== 'free' && setSubFilter('free')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'free' ? 'bg-slate-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Free
            </button>
          </div>

          {/* Add User Button */}
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Kullanıcı Ekle
          </Button>
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
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {u.name}
                          </p>
                          {u.role === 'admin' && (
                            <Badge className="bg-red-50 text-red-700 border-red-200 text-[9px] font-bold py-0.5 px-1.5 shadow-2xs">
                              Yönetici
                            </Badge>
                          )}
                        </div>
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

      {/* CREATE USER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-950">Yeni Kullanıcı Ekle</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full text-slate-400 hover:text-slate-700 h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              {createError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {createError}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">İsim Soyisim</label>
                <Input
                  required
                  placeholder="Ahmet Yılmaz"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="rounded-xl border-slate-200 h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-posta Adresi</label>
                <Input
                  required
                  type="email"
                  placeholder="ornek@journeo.ai"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="rounded-xl border-slate-200 h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Şifre</label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="rounded-xl border-slate-200 h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-medium">Sistem Rolü</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'user' })}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs ring-offset-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    <option value="user">Kullanıcı (user)</option>
                    <option value="admin">Yönetici (admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 font-medium">Üyelik Tipi</label>
                  <select
                    value={createForm.subscription}
                    onChange={(e) => setCreateForm({ ...createForm, subscription: e.target.value as 'premium' | 'free' })}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs ring-offset-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    <option value="free">Free (Ücretsiz)</option>
                    <option value="premium">Premium (Yıllık)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl text-xs font-bold h-9"
                >
                  Vazgeç
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 flex items-center gap-1.5"
                >
                  {createLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Oluştur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAIL PREVIEW & EDIT & DELETE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative">
            
            {/* Header */}
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
                onClick={() => {
                  setSelectedUser(null);
                  setIsEditing(false);
                  setIsDeleting(false);
                }}
                className="rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            {/* Content Switcher */}
            {isDeleting ? (
              // DELETE WARNING MODE
              <div className="space-y-4 py-2">
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl space-y-2 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-sm">
                    ⚠️ Dikkat: Kullanıcı Siliniyor
                  </p>
                  <p>
                    <strong>{selectedUser.name}</strong> ({selectedUser.email}) isimli kullanıcıyı tamamen silmek istediğinize emin misiniz? 
                  </p>
                  <p className="text-[11px] text-red-600 font-medium">
                    Bu işlem kullanıcının tüm gezilerini, AI istek günlüklerini ve abonelik verilerini kaldırır. Bu işlem geri alınamaz!
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleting(false)}
                    className="rounded-xl text-xs font-bold"
                  >
                    Vazgeç
                  </Button>
                  <Button
                    onClick={handleDeleteUser}
                    disabled={deleteLoading}
                    className="rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
                  >
                    {deleteLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    Kullanıcıyı Tamamen Sil
                  </Button>
                </div>
              </div>
            ) : isEditing ? (
              // EDIT MODE
              <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
                {editError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                    {editError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">İsim Soyisim</label>
                  <Input
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="rounded-xl border-slate-200 h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">E-posta Adresi</label>
                  <Input
                    required
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="rounded-xl border-slate-200 h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex justify-between items-center">
                    <span>Şifre</span>
                    <span className="text-[10px] text-slate-400 font-normal">Değiştirmek istemiyorsanız boş bırakın</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="rounded-xl border-slate-200 h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Sistem Rolü</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'user' })}
                      className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <option value="user">Kullanıcı (user)</option>
                      <option value="admin">Yönetici (admin)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Üyelik Tipi</label>
                    <select
                      value={editForm.subscription}
                      onChange={(e) => setEditForm({ ...editForm, subscription: e.target.value as 'premium' | 'free' })}
                      className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <option value="free">Free (Ücretsiz)</option>
                      <option value="premium">Premium (Yıllık)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDeleting(true)}
                    className="rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-3"
                  >
                    Sil
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl text-xs font-bold h-9"
                    >
                      Vazgeç
                    </Button>
                    <Button
                      type="submit"
                      disabled={editLoading}
                      className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 flex items-center gap-1.5"
                    >
                      {editLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                      Güncelle
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              // READ-ONLY / SUMMARY VIEW MODE
              <>
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sistem Rolü</p>
                    <p className="font-bold text-slate-850 mt-1 flex items-center gap-1.5">
                      <span className="capitalize">{selectedUser.role || 'user'}</span>
                      {selectedUser.role === 'admin' && (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-[8px] font-bold py-0.5 px-1.5 shadow-3xs scale-90">
                          Yönetici
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kayıt Tarihi</p>
                    <p className="font-bold text-slate-800 mt-1">
                      {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kullanıcı ID</p>
                    <p className="font-mono text-[10px] text-slate-650 mt-1 select-all">{selectedUser.id}</p>
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

                <div className="pt-2 flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleting(true)}
                    className="rounded-xl text-xs font-bold text-red-650 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sil
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => startEdit(selectedUser)}
                      className="rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      className="rounded-xl text-xs font-bold"
                    >
                      Kapat
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
