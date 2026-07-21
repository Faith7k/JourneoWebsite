'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Mail,
  Activity,
  Users,
  Settings,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/screenshots', label: 'Screenshots', icon: ImageIcon },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/api-usage', label: 'API Usage', icon: Activity },
  { href: '/admin/users', label: 'App Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <Image
          src="/logo.png"
          alt="Journeo Logo"
          width={32}
          height={32}
          className="w-8 h-8 rounded-lg shadow-sm object-cover"
        />
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent">
          Journeo
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-slate-300"
        >
          <Globe className="h-3 w-3" />
          View public site →
        </Link>
      </div>
    </aside>
  );
}