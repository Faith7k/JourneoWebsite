'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Mail,
  Activity,
  DollarSign,
  Users,
  Settings,
  Globe,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    title: 'GENEL',
    items: [
      { href: '/admingate', label: 'Genel Bakış', icon: LayoutDashboard, exact: true },
      { href: '/admingate/screenshots', label: 'Ekran Görüntüleri', icon: ImageIcon },
      { href: '/admingate/messages', label: 'Mesajlar', icon: Mail },
    ],
  },
  {
    title: 'ANALİTİK & KULLANICI',
    items: [
      { href: '/admingate/api-usage', label: 'API Kullanımı', icon: Activity },
      { href: '/admingate/costs', label: 'Maliyet & Finans', icon: DollarSign },
      { href: '/admingate/users', label: 'Kullanıcılar', icon: Users },
    ],
  },
  {
    title: 'SİSTEM',
    items: [
      { href: '/admingate/settings', label: 'Ayarlar', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-xs lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100/80 px-5">
        <Link href="/admingate" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Journeo Logo"
              width={34}
              height={34}
              className="h-8.5 w-8.5 rounded-xl shadow-xs object-cover transition-transform group-hover:scale-105"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Journeo
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Admin Console
            </span>
          </div>
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
          <Sparkles className="h-2.5 w-2.5" /> PRO
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-blue-600/10 text-blue-600 font-bold shadow-2xs border-l-3 border-blue-600 pl-2.5'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-800'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-blue-600/70 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">Canlı Siteyi Gör</span>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-500">journeo.app</span>
            </div>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </aside>
  );
}