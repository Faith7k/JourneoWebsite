'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
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
    router.replace('/admin/login');
    router.refresh();
  };

  const initials = email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-300"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-sm font-medium text-slate-300">Admin Dashboard</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/50 p-1 pr-3 transition-colors hover:bg-slate-800">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-xs text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-xs text-slate-300 sm:block">{email}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
            <DropdownMenuLabel className="text-slate-300">{email}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}