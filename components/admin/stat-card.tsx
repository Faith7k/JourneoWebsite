import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AdminStatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: string;
  trend?: string;
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'from-blue-500 to-cyan-500',
  trend,
}: AdminStatCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/50 transition-colors hover:border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {title}
            </p>
            <p className="text-3xl font-bold text-slate-100">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
              accent
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="text-emerald-400">●</span> {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}