'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X, Shield, ChevronDown, Activity, Sparkles, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdminSidebar } from './sidebar';

export function AdminTopbar({ email }: { email: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admingate/login');
    router.refresh();
  };

  const initials = email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 sm:px-6 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="hidden sm:inline">Sistem Aktif & Çalışıyor</span>
            <span className="sm:hidden">Aktif</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Info Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-full border border-slate-200/60">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span>Admin Paneli</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white p-1 pr-3 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-2xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden flex-col text-left sm:flex">
                  <span className="text-xs font-bold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
                    {email.split('@')[0]}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">Yönetici</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:text-slate-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-xl text-slate-800 rounded-2xl p-1.5">
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">{email}</p>
                  <p className="text-[10px] font-medium text-slate-400">Super Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Oturumu Kapat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}