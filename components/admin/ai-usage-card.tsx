import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Database, Zap, AlertTriangle } from 'lucide-react';
import { formatUsd } from '@/lib/costs';

type AIUsageProps = {
  aiCallsToday: number;
  aiCalls7d: number;
  aiCalls30d: number;
  aiByKind: { kind: string; count: number }[];
  googlePlacesCallsMonth: number;
  /** Backend GOOGLE_PLACES_MONTHLY_BUDGET mirror — the gate lives there. */
  googlePlacesMonthlyBudget: number;
  cachedPlacesCount: number;
  cachedAiPlansCount: number;
  /** Measured by cost_summary() over the last 30 days — not a price × count guess. */
  cacheSavingsUsd30d: number;
  placesCacheHits30d: number;
  placesPaidCalls30d: number;
  cacheHitRatioPct: number;
  unpricedEvents30d: number;
};

export function AdminAIUsageCard({
  aiCallsToday,
  aiCalls7d,
  aiCalls30d,
  aiByKind,
  googlePlacesCallsMonth,
  googlePlacesMonthlyBudget,
  cachedPlacesCount,
  cachedAiPlansCount,
  cacheSavingsUsd30d,
  placesCacheHits30d,
  placesPaidCalls30d,
  cacheHitRatioPct,
  unpricedEvents30d,
}: AIUsageProps) {
  const placesBudget = googlePlacesMonthlyBudget;
  const placesBudgetPct = Math.min(100, Math.round((googlePlacesCallsMonth / placesBudget) * 100));

  const totalAiKindCalls = aiByKind.reduce((s, k) => s + k.count, 0) || 1;

  const kindLabels: Record<string, string> = {
    itinerary: 'Itinerary Generation (Flash)',
    planner_chat: 'Voice & Text Chat (Flash)',
    city_cover: 'City Cover AI Waterfalls',
    place_resolve: 'Place Resolver Engine',
    fx_rate: 'Exchange Rate Lookup',
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Gemini LLM Usage Card */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Google Gemini LLM Engine
            </CardTitle>
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-semibold">
              {aiCallsToday} istek bugün
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Yalnızca gerçekten Gemini'ye giden istekler (token/model ölçümü olan satırlar).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Bugün</p>
              <p className="text-lg font-bold text-purple-700 tabular-nums">{aiCallsToday}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Son 7 Gün</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{aiCalls7d}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Son 30 Gün</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{aiCalls30d}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Kategori Bazlı AI Kullanımı
            </p>
            {aiByKind.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Henüz kaydedilmiş AI isteği yok.</p>
            ) : (
              aiByKind.map((k) => {
                const pct = Math.round((k.count / totalAiKindCalls) * 100);
                return (
                  <div key={k.kind} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">
                        {kindLabels[k.kind] ?? k.kind}
                      </span>
                      <span className="font-mono text-slate-500 font-medium">
                        {k.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50 p-2.5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="h-4 w-4 text-cyan-600" />
              Önbellek AI Planları (<code className="font-mono text-[11px]">ai_plan_cache</code>)
            </span>
            <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-700 font-semibold">
              {cachedAiPlansCount} cached
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Google Places & Cache Card */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Google Places & POI Cache
            </CardTitle>
            <Badge
              variant="outline"
              className={
                placesBudgetPct > 80
                  ? 'border-amber-200 bg-amber-50 text-amber-700 font-semibold'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold'
              }
            >
              %{placesBudgetPct} bütçe tüketimi
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Aylık Google Places kota kullanımı ve POI önbellek tasarrufu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Aylık Çağrı Bütçesi</span>
              <span className="font-mono text-slate-500">
                {googlePlacesCallsMonth.toLocaleString('tr-TR')} / {placesBudget.toLocaleString('tr-TR')} çağrı
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className={`h-full rounded-full transition-all ${
                  placesBudgetPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(placesBudgetPct, 2)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Database className="h-3.5 w-3.5 text-emerald-600" />
                Global POI Önbelleği
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900 tabular-nums">{cachedPlacesCount}</p>
              <p className="text-[10px] text-slate-500">Kayıtlı mekan (180g TTL)</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                Önbellek Tasarrufu
              </div>
              <p className="mt-1 text-xl font-bold text-amber-700 tabular-nums">
                {formatUsd(cacheSavingsUsd30d, 2)}
              </p>
              <p className="text-[10px] text-slate-500">
                Son 30 gün · %{cacheHitRatioPct} isabet ({placesCacheHits30d.toLocaleString('tr-TR')} hit /{' '}
                {placesPaidCalls30d.toLocaleString('tr-TR')} ücretli)
              </p>
            </div>
          </div>

          {unpricedEvents30d > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/80 p-2.5 text-[11px] text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span>
                <strong>{unpricedEvents30d.toLocaleString('tr-TR')} olay fiyatlandırılamadı</strong> (30g) — SKU{' '}
                <code>cost_price_book</code>'ta yok. Yukarıdaki maliyetler bu kadar eksik.
              </span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Bağlı Harici Servisler
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-slate-200/80 bg-white p-2 text-center text-xs">
                <p className="font-medium text-slate-700">OpenWeather</p>
                <Badge className="mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px]">
                  Aktif
                </Badge>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-white p-2 text-center text-xs">
                <p className="font-medium text-slate-700">ExchangeRate</p>
                <Badge className="mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px]">
                  Aktif
                </Badge>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-white p-2 text-center text-xs">
                <p className="font-medium text-slate-700">Pexels Photos</p>
                <Badge className="mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px]">
                  Aktif
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
