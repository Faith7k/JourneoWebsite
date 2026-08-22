import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AdminStatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: string;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  sparklineData?: number[];
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'bg-blue-500/10 text-blue-600 border-blue-200/50',
  trend,
  trendUp = true,
  badge,
}: AdminStatCardProps) {
  return (
    <Card className="relative overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-xl hover:shadow-blue-500/5 rounded-2xl group">
      {/* Top ambient glowing line on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover:via-blue-600 transition-all duration-300" />
      
      {/* Background radial glow */}
      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {title}
              </p>
              {badge && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.2 text-[9px] font-extrabold text-slate-600 border border-slate-200">
                  {badge}
                </span>
              )}
            </div>

            <p className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
            </p>

            {subtitle && (
              <p className="text-xs font-medium text-slate-500 leading-snug">{subtitle}</p>
            )}
          </div>
          
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs',
              accent
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {trend && (
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100/80 text-xs">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold text-[10px] shadow-2xs',
                trendUp
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/80'
              )}
            >
              {trendUp ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-rose-600" />
              )}
              {trend}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">vs son dönem</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}