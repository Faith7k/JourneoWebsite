'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Smartphone,
  Crown,
  MapPin,
  Calendar,
  Activity,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Ticket,
  Sparkles,
  Infinity as InfinityIcon,
  ShieldCheck,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type UserItem = {
  id: string;
  email: string;
  name: string;
  username: string;
  platforms: string[];
  subscription: 'premium' | 'trip_pass' | 'free';
  planType: 'annual' | 'trip_pass' | 'free';
  hasUnlimited: boolean;
  unconsumedPasses: number;
  consumedPasses: number;
  planBadge: { label: string; style: string };
  tripRightsSummary: string;
  tripCount: number;
  aiCount: number;
  countries: string[];
  createdAt: string;
  lastActiveAt: string;
  role?: 'admin' | 'user';
  currentPeriodEnd?: string | null;
  subscriptionProductId?: string | null;
};

export function AdminUsersTable({ users: initialUsers }: { users: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'ios' | 'android'>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'unlimited' | 'passes' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'trips' | 'ai' | 'passes'>('newest');

  // Selected User for Detail Modal
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Quick Action Modal: Grant Trip Rights / Pass
  const [rightsModalUser, setRightsModalUser] = useState<UserItem | null>(null);
  const [customCreditCount, setCustomCreditCount] = useState('5');
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditFeedback, setCreditFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick Action: Toggle Premium State
  const [premiumActionLoadingId, setPremiumActionLoadingId] = useState<string | null>(null);
  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.id.toLowerCase().includes(search.toLowerCase());

        const matchPlatform = platformFilter === 'all' || u.platforms.includes(platformFilter);

        let matchSub = true;
        if (subFilter === 'unlimited') matchSub = u.hasUnlimited;
        else if (subFilter === 'passes') matchSub = u.unconsumedPasses > 0 && !u.hasUnlimited;
        else if (subFilter === 'free') matchSub = !u.hasUnlimited && u.unconsumedPasses === 0;

        return matchSearch && matchPlatform && matchSub;
      })
      .sort((a, b) => {
        if (sortBy === 'trips') return b.tripCount - a.tripCount;
        if (sortBy === 'ai') return b.aiCount - a.aiCount;
        if (sortBy === 'passes') return b.unconsumedPasses - a.unconsumedPasses;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [users, search, platformFilter, subFilter, sortBy]);

  // Handler: Toggle Premium (Annual Unlimited Subscription)
  async function handleTogglePremium(user: UserItem, targetState: boolean) {
    setPremiumActionLoadingId(user.id);
    setBannerNotice(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          action: 'toggle_premium',
          isPremium: targetState,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İşlem gerçekleştirilemedi.');

      // Update local state instantly
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              hasUnlimited: targetState,
              subscription: targetState ? 'premium' : u.unconsumedPasses > 0 ? 'trip_pass' : 'free',
              planType: targetState ? 'annual' : u.unconsumedPasses > 0 ? 'trip_pass' : 'free',
              planBadge: targetState
                ? { label: '👑 Sınırsız Premium (Yıllık)', style: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' }
                : u.unconsumedPasses > 0
                ? { label: `🎫 ${u.unconsumedPasses} Gezi Hakkı`, style: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' }
                : { label: 'Free (Kâşif)', style: 'border-slate-200 bg-slate-50 text-slate-700 font-medium' },
              tripRightsSummary: targetState ? '♾️ Sınırsız AI Gezisi' : u.unconsumedPasses > 0 ? `${u.unconsumedPasses} Gezi Kredisi` : 'Standart (1 AI / 3 Gezi)',
            };
          }
          return u;
        })
      );

      // If selectedUser is this user, update it too
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                hasUnlimited: targetState,
                subscription: targetState ? 'premium' : prev.unconsumedPasses > 0 ? 'trip_pass' : 'free',
                planType: targetState ? 'annual' : prev.unconsumedPasses > 0 ? 'trip_pass' : 'free',
                planBadge: targetState
                  ? { label: '👑 Sınırsız Premium (Yıllık)', style: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' }
                  : prev.unconsumedPasses > 0
                  ? { label: `🎫 ${prev.unconsumedPasses} Gezi Hakkı`, style: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' }
                  : { label: 'Free (Kâşif)', style: 'border-slate-200 bg-slate-50 text-slate-700 font-medium' },
                tripRightsSummary: targetState ? '♾️ Sınırsız AI Gezisi' : prev.unconsumedPasses > 0 ? `${prev.unconsumedPasses} Gezi Kredisi` : 'Standart (1 AI / 3 Gezi)',
              }
            : null
        );
      }

      setBannerNotice({
        type: 'success',
        message: targetState
          ? `${user.name} kullanıcısına 1 Yıllık Sınırsız Premium tanımlandı.`
          : `${user.name} kullanıcısının premium aboneliği sonlandırıldı.`,
      });
    } catch (err: any) {
      setBannerNotice({ type: 'error', message: err.message });
    } finally {
      setPremiumActionLoadingId(null);
    }
  }

  // Handler: Grant Trip Pass Credits (Hak Tanımlama)
  async function handleGrantCredits(amount: number) {
    if (!rightsModalUser) return;
    setCreditLoading(true);
    setCreditFeedback(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rightsModalUser.id,
          action: 'grant_credits',
          amount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Hak tanımlanırken hata oluştu.');

      // Update local state instantly
      const updatedUserId = rightsModalUser.id;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === updatedUserId) {
            const newPassCount = u.unconsumedPasses + amount;
            return {
              ...u,
              unconsumedPasses: newPassCount,
              subscription: u.hasUnlimited ? 'premium' : 'trip_pass',
              planType: u.hasUnlimited ? 'annual' : 'trip_pass',
              planBadge: u.hasUnlimited
                ? u.planBadge
                : { label: `🎫 ${newPassCount} Gezi Hakkı`, style: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' },
              tripRightsSummary: u.hasUnlimited ? '♾️ Sınırsız AI Gezisi' : `${newPassCount} Gezi Kredisi`,
            };
          }
          return u;
        })
      );

      // Also update selectedUser if open
      if (selectedUser?.id === updatedUserId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                unconsumedPasses: prev.unconsumedPasses + amount,
                tripRightsSummary: prev.hasUnlimited ? '♾️ Sınırsız AI Gezisi' : `${prev.unconsumedPasses + amount} Gezi Kredisi`,
              }
            : null
        );
      }

      setCreditFeedback({
        type: 'success',
        message: `Tebrikler! ${rightsModalUser.name} kullanıcısına +${amount} adet gezi hakkı başarıyla tanımlandı.`,
      });

      // Close modal after brief delay
      setTimeout(() => {
        setRightsModalUser(null);
        setCreditFeedback(null);
      }, 1400);
    } catch (err: any) {
      setCreditFeedback({ type: 'error', message: err.message });
    } finally {
      setCreditLoading(false);
    }
  }

  // Handler: Set Exact Credits
  async function handleSetExactCredits(targetCount: number) {
    if (!rightsModalUser) return;
    setCreditLoading(true);
    setCreditFeedback(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rightsModalUser.id,
          action: 'set_credits',
          targetCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Hak güncellenirken hata oluştu.');

      const updatedUserId = rightsModalUser.id;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === updatedUserId) {
            return {
              ...u,
              unconsumedPasses: targetCount,
              subscription: u.hasUnlimited ? 'premium' : targetCount > 0 ? 'trip_pass' : 'free',
              planType: u.hasUnlimited ? 'annual' : targetCount > 0 ? 'trip_pass' : 'free',
              planBadge: u.hasUnlimited
                ? u.planBadge
                : targetCount > 0
                ? { label: `🎫 ${targetCount} Gezi Hakkı`, style: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' }
                : { label: 'Free (Kâşif)', style: 'border-slate-200 bg-slate-50 text-slate-700 font-medium' },
              tripRightsSummary: u.hasUnlimited ? '♾️ Sınırsız AI Gezisi' : targetCount > 0 ? `${targetCount} Gezi Kredisi` : 'Standart (1 AI / 3 Gezi)',
            };
          }
          return u;
        })
      );

      setCreditFeedback({
        type: 'success',
        message: `Kullanıcının gezi hakkı ${targetCount} olarak güncellendi.`,
      });

      setTimeout(() => {
        setRightsModalUser(null);
        setCreditFeedback(null);
      }, 1400);
    } catch (err: any) {
      setCreditFeedback({ type: 'error', message: err.message });
    } finally {
      setCreditLoading(false);
    }
  }

  // Handlers: Create User
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

  // Handler: Update User Profile
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

  // Handler: Delete User
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
      password: '',
      role: user.role || 'user',
      subscription: user.hasUnlimited ? 'premium' : 'free',
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-4">
      {/* Toast / Notification Banner */}
      {bannerNotice && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            bannerNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerNotice.type === 'success' ? <Check className="h-4 w-4 text-emerald-600" /> : '⚠️'}
            <span>{bannerNotice.message}</span>
          </div>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-xs text-slate-400 hover:text-slate-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
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

          {/* Membership / Rights Filter */}
          <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => setSubFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({users.length})
            </button>
            <button
              onClick={() => setSubFilter('unlimited')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'unlimited' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 Sınırsız ({users.filter((u) => u.hasUnlimited).length})
            </button>
            <button
              onClick={() => setSubFilter('passes')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                subFilter === 'passes' ? 'bg-cyan-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎫 Gezi Hakkı Olanlar ({users.filter((u) => u.unconsumedPasses > 0 && !u.hasUnlimited).length})
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
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="text-slate-600 font-bold text-xs py-3.5 pl-4">Kullanıcı / Profil</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs">Cihaz</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs">Üyelik Durumu</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs">Kalan AI Gezi Hakkı</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs text-center">Geziler / AI</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs">Kayıt Tarihi</TableHead>
              <TableHead className="text-slate-600 font-bold text-xs text-right pr-4">Hızlı Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-slate-100">
                <TableCell colSpan={7} className="text-center py-12 text-xs text-slate-400 italic">
                  Arama kriterlerine uygun kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow
                  key={u.id}
                  className="border-slate-100 hover:bg-blue-50/20 transition-colors group"
                >
                  {/* User Profile Info */}
                  <TableCell
                    className="py-3 pl-4 cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
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

                  {/* Device Platforms */}
                  <TableCell onClick={() => setSelectedUser(u)} className="cursor-pointer">
                    <div className="flex items-center gap-1 flex-wrap">
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

                  {/* Membership Badge */}
                  <TableCell onClick={() => setSelectedUser(u)} className="cursor-pointer">
                    <Badge variant="outline" className={`${u.planBadge.style} text-[11px] shadow-2xs`}>
                      {u.planBadge.label}
                    </Badge>
                  </TableCell>

                  {/* Trip Rights Summary (Kalan Gezi Hakkı) */}
                  <TableCell onClick={() => setSelectedUser(u)} className="cursor-pointer">
                    {u.hasUnlimited ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs">
                        <InfinityIcon className="h-3.5 w-3.5 text-amber-600" />
                        <span>Sınırsız AI Gezisi</span>
                      </div>
                    ) : u.unconsumedPasses > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold text-xs shadow-2xs">
                        <Ticket className="h-3.5 w-3.5 text-cyan-600" />
                        <span>{u.unconsumedPasses} Gezi Kredisi</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium text-xs">
                        {u.tripCount >= 3 ? (
                          <span className="text-slate-400 italic">Kota Doldu (0 Hak)</span>
                        ) : (
                          `Standart (1 AI / 3 Gezi)`
                        )}
                      </span>
                    )}
                  </TableCell>

                  {/* Trip & AI Counts */}
                  <TableCell onClick={() => setSelectedUser(u)} className="text-center cursor-pointer">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs font-semibold text-slate-700">
                      <strong className="text-emerald-600 font-bold">{u.tripCount}</strong> gezi
                      <span className="text-slate-300">•</span>
                      <span className="text-purple-700 font-bold">{u.aiCount} AI</span>
                    </div>
                  </TableCell>

                  {/* Created At */}
                  <TableCell onClick={() => setSelectedUser(u)} className="text-xs text-slate-600 font-medium cursor-pointer">
                    {new Intl.DateTimeFormat('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(u.createdAt))}
                  </TableCell>

                  {/* Quick Actions (Direct Buttons) */}
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Grant Rights Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRightsModalUser(u);
                        }}
                        className="h-7 px-2 text-[11px] font-bold border-cyan-300 text-cyan-800 bg-cyan-50/60 hover:bg-cyan-100 rounded-lg flex items-center gap-1 shadow-2xs"
                        title="Gezi Hakkı / Trip Pass Tanımla"
                      >
                        <Ticket className="h-3 w-3 text-cyan-600" />
                        +Hak Tanımla
                      </Button>

                      {/* Toggle Premium Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={premiumActionLoadingId === u.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePremium(u, !u.hasUnlimited);
                        }}
                        className={`h-7 px-2 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs ${
                          u.hasUnlimited
                            ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                            : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                        }`}
                        title={u.hasUnlimited ? 'Premium Üyeliği Kaldır' : 'Sınırsız Premium Yap'}
                      >
                        {premiumActionLoadingId === u.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Crown className={`h-3 w-3 ${u.hasUnlimited ? 'text-amber-600' : 'text-slate-400'}`} />
                        )}
                        {u.hasUnlimited ? 'Sınırsız (Aktif)' : 'Premium Yap'}
                      </Button>

                      {/* Detail Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUser(u)}
                        className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Detay & Düzenle"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* QUICK RIGHTS MODAL (+HAK TANIMLAMA) */}
      {rightsModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Gezi Hakkı Tanımla</h3>
                  <p className="text-xs text-slate-500">{rightsModalUser.name} ({rightsModalUser.email})</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRightsModalUser(null);
                  setCreditFeedback(null);
                }}
                className="rounded-full text-slate-400 hover:text-slate-700 h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            {creditFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  creditFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {creditFeedback.type === 'success' ? <Check className="h-4 w-4 text-emerald-600" /> : '⚠️'}
                <span>{creditFeedback.message}</span>
              </div>
            )}

            {/* Current Status Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Mevcut Kullanılabilir Hak:</span>
                <p className="text-slate-900 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-cyan-600" />
                  {rightsModalUser.hasUnlimited ? (
                    <span className="text-amber-600 font-extrabold">Sınırsız Yıllık Abonelik (Limit Yok)</span>
                  ) : (
                    <span>{rightsModalUser.unconsumedPasses} Adet Trip Pass</span>
                  )}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 bg-white">
                {rightsModalUser.hasUnlimited ? 'Sınırsız Üye' : 'Standart Üye'}
              </Badge>
            </div>

            {/* Quick Add Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Gift className="h-3.5 w-3.5 text-cyan-600" />
                Hızlı Hak Ekle:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    disabled={creditLoading}
                    onClick={() => handleGrantCredits(amt)}
                    className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center p-1 transition-all ${
                      amt === 5
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-900 hover:bg-cyan-100 ring-1 ring-cyan-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-extrabold">+{amt}</span>
                    <span className="text-[9px] text-slate-500">{amt === 5 ? 'Önerilen' : 'Hak'}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Form */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Veya Özel Adet Tanımla:</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={customCreditCount}
                  onChange={(e) => setCustomCreditCount(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs font-bold h-9 flex-1"
                  placeholder="Örn: 5"
                />
                <Button
                  type="button"
                  disabled={creditLoading || !customCreditCount || Number(customCreditCount) <= 0}
                  onClick={() => handleGrantCredits(Number(customCreditCount))}
                  className="rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white h-9 px-4 flex items-center gap-1.5 shadow-xs"
                >
                  {creditLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Hak Ekle
                </Button>
              </div>
            </div>

            {/* Explanatory Info Card */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1 text-blue-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Nasıl Çalışır?
              </p>
              <p>
                Tanımlanan her 1 hak, mobil uygulamada anında <strong>Trip Pass</strong> olarak yansır. Kullanıcı kota limitine takılmadan tek seferlik sınırsız gezi ve AI planı oluşturabilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAIL PREVIEW & FULL EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
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

            {/* DELETE WARNING MODE */}
            {isDeleting ? (
              <div className="space-y-4 py-2">
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl space-y-2 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-sm">⚠️ Dikkat: Kullanıcı Siliniyor</p>
                  <p>
                    <strong>{selectedUser.name}</strong> ({selectedUser.email}) isimli kullanıcıyı tamamen silmek istediğinize emin misiniz?
                  </p>
                  <p className="text-[11px] text-red-600 font-medium">
                    Bu işlem kullanıcının tüm gezilerini, AI istek günlüklerini ve abonelik verilerini kaldırır. Bu işlem geri alınamaz!
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsDeleting(false)} className="rounded-xl text-xs font-bold">
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
              /* EDIT MODE */
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
                      <option value="premium">Premium (Yıllık Plan)</option>
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
              /* READ-ONLY & INTERACTIVE MANAGEMENT VIEW */
              <div className="space-y-4">
                {/* 1. Sınırsız Premium Üyelik Yönetimi */}
                <div className="p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-orange-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-800">
                        <Crown className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-950">Yıllık Sınırsız Premium Üyelik</h4>
                        <p className="text-[11px] text-amber-700 font-medium">
                          {selectedUser.hasUnlimited ? '👑 Aktif Sınırsız Abone' : 'Ücretsiz (Free) Hesap'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold shadow-2xs ${
                        selectedUser.hasUnlimited
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {selectedUser.hasUnlimited ? 'Yıllık Aktif' : 'Free Plan'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedUser.hasUnlimited
                      ? 'Bu kullanıcıya sınırsız AI gezi rotası oluşturma ve tüm premium özellikler tanımlanmıştır.'
                      : 'Bu kullanıcıyı tek tıkla 1 yıl boyunca sınırsız gezi hakkına sahip Premium abone yapabilirsiniz.'}
                  </p>

                  <Button
                    type="button"
                    disabled={premiumActionLoadingId === selectedUser.id}
                    onClick={() => handleTogglePremium(selectedUser, !selectedUser.hasUnlimited)}
                    className={`w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs ${
                      selectedUser.hasUnlimited
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {premiumActionLoadingId === selectedUser.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Crown className="h-3.5 w-3.5" />
                    )}
                    {selectedUser.hasUnlimited ? 'Premium Üyeliği Kaldır (Free Yap)' : '👑 1 Yıllık Sınırsız Premium Yap'}
                  </Button>
                </div>

                {/* 2. Tek Seferlik Gezi Hakları (Trip Pass Kredisi) */}
                <div className="p-4 rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/50 to-blue-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-800">
                        <Ticket className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-cyan-950">AI Gezi Hakları (Trip Pass)</h4>
                        <p className="text-[11px] text-cyan-700 font-medium">
                          Kullanılabilir: <strong>{selectedUser.unconsumedPasses} Adet</strong>
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setRightsModalUser(selectedUser)}
                      className="h-7 px-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="h-3 w-3" />
                      Hak Ekle
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-white/70 p-2.5 rounded-xl border border-cyan-100">
                    <span className="text-slate-600">Hızlı +5 Gezi Tanımla:</span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={creditLoading}
                      onClick={() => {
                        setRightsModalUser(selectedUser);
                        handleGrantCredits(5);
                      }}
                      className="h-7 px-3 text-xs font-bold border-cyan-300 text-cyan-800 bg-white hover:bg-cyan-50 rounded-lg"
                    >
                      +5 Hak Ekle
                    </Button>
                  </div>
                </div>

                {/* 3. Genel Aktivite & Detay Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Aktivite İstatistikleri</p>
                    <p className="font-bold text-slate-800 mt-1">
                      {selectedUser.tripCount} Gezi Planı • {selectedUser.aiCount} AI İsteği
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sistem Rolü</p>
                    <p className="font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <span className="capitalize">{selectedUser.role || 'user'}</span>
                      {selectedUser.role === 'admin' && (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-[8px] font-bold py-0.5 px-1.5">
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
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Son Görülme</p>
                    <p className="font-bold text-slate-800 mt-1">
                      {new Date(selectedUser.lastActiveAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kullanıcı ID</p>
                    <p className="font-mono text-[10px] text-slate-600 mt-1 select-all">{selectedUser.id}</p>
                  </div>
                </div>

                {/* Destinasyonlar */}
                {selectedUser.countries.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Planlanan Destinasyonlar</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.countries.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer Buttons */}
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleting(true)}
                    className="rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
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
                    <Button variant="outline" onClick={() => setSelectedUser(null)} className="rounded-xl text-xs font-bold">
                      Kapat
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  <label className="font-bold text-slate-700">Sistem Rolü</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'user' })}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <option value="user">Kullanıcı (user)</option>
                    <option value="admin">Yönetici (admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Üyelik Tipi</label>
                  <select
                    value={createForm.subscription}
                    onChange={(e) => setCreateForm({ ...createForm, subscription: e.target.value as 'premium' | 'free' })}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <option value="free">Free (Ücretsiz)</option>
                    <option value="premium">Premium (Yıllık Plan)</option>
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
    </div>
  );
}
