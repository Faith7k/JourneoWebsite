import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatUsd } from '@/lib/costs';

const GRADIENTS: Record<string, string> = {
  gemini: 'from-violet-500 to-purple-500',
  google_places: 'from-amber-500 to-orange-500',
  mapbox: 'from-blue-500 to-cyan-500',
  fal_ai: 'from-pink-500 to-rose-500',
  r2: 'from-slate-500 to-slate-400',
};

/**
 * Spend share by provider or feature. Same gradient-bar treatment the
 * api-usage page already uses for endpoint/platform splits.
 */
export function AdminCostBreakdownCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: Record<string, number>;
}) {
  const rows = Object.entries(data)
    .map(([key, cost]) => ({ key, cost }))
    .sort((a, b) => b.cost - a.cost);

  const total = rows.reduce((sum, r) => sum + r.cost, 0);

  return (
    <Card className="border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900">{title}</CardTitle>
        <CardDescription className="text-xs text-slate-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && (
          <p className="text-xs text-slate-400 italic py-4">Bu aralıkta kaydedilmiş harcama bulunmuyor.</p>
        )}
        {rows.map((row) => {
          const pct = total > 0 ? Math.round((row.cost / total) * 100) : 0;
          return (
            <div key={row.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-mono text-xs font-semibold text-slate-800">{row.key}</span>
                <div className="ml-2 flex shrink-0 items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">%{pct}</span>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs font-semibold">
                    {formatUsd(row.cost, 4)}
                  </Badge>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
