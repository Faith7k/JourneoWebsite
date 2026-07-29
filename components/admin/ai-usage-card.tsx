import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Database, Zap, Cpu } from 'lucide-react';

type AIUsageProps = {
  aiCallsToday: number;
  aiCalls7d: number;
  aiCalls30d: number;
  aiByKind: { kind: string; count: number }[];
  googlePlacesCallsMonth: number;
  cachedPlacesCount: number;
  cachedAiPlansCount: number;
};

export function AdminAIUsageCard({
  aiCallsToday,
  aiCalls7d,
  aiCalls30d,
  aiByKind,
  googlePlacesCallsMonth,
  cachedPlacesCount,
  cachedAiPlansCount,
}: AIUsageProps) {
  // Monthly Google Places budget limit from backend config (e.g. 5,000 requests)
  const placesBudget = 5000;
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
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Google Gemini LLM Engine
            </CardTitle>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {aiCallsToday} requests today
            </Badge>
          </div>
          <CardDescription className="text-slate-400">
            Real-time track of LLM itinerary generation and chat turns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-center">
            <div>
              <p className="text-xs text-slate-400">Today</p>
              <p className="text-lg font-bold text-purple-300">{aiCallsToday}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">7 Days</p>
              <p className="text-lg font-bold text-slate-100">{aiCalls7d}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">30 Days</p>
              <p className="text-lg font-bold text-slate-100">{aiCalls30d}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Usage by Request Category
            </p>
            {aiByKind.length === 0 ? (
              <p className="text-xs text-slate-500">No AI requests logged yet.</p>
            ) : (
              aiByKind.map((k) => {
                const pct = Math.round((k.count / totalAiKindCalls) * 100);
                return (
                  <div key={k.kind} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        {kindLabels[k.kind] ?? k.kind}
                      </span>
                      <span className="font-mono text-slate-400">
                        {k.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="h-4 w-4 text-cyan-400" />
              Cached AI Plans (`ai_plan_cache`)
            </span>
            <Badge variant="outline" className="border-slate-700 text-cyan-300">
              {cachedAiPlansCount} cached
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Google Places & Cache Card */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MapPin className="h-5 w-5 text-emerald-400" />
              Google Places & POI Cache
            </CardTitle>
            <Badge
              variant="outline"
              className={
                placesBudgetPct > 80
                  ? 'border-amber-700 text-amber-300'
                  : 'border-emerald-700 text-emerald-300'
              }
            >
              {placesBudgetPct}% budget used
            </Badge>
          </div>
          <CardDescription className="text-slate-400">
            Monthly Google Places call tracking and cache efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Monthly Call Budget</span>
              <span className="font-mono text-slate-400">
                {googlePlacesCallsMonth} / {placesBudget} calls
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${
                  placesBudgetPct > 80
                    ? 'from-amber-500 to-red-500'
                    : 'from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${placesBudgetPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Database className="h-4 w-4 text-emerald-400" />
                Global POI Cache
              </div>
              <p className="mt-1 text-xl font-bold text-slate-100">{cachedPlacesCount}</p>
              <p className="text-[10px] text-slate-500">Places stored (180d TTL)</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Zap className="h-4 w-4 text-amber-400" />
                API Cost Savings
              </div>
              <p className="mt-1 text-xl font-bold text-amber-300">
                ~${(cachedPlacesCount * 0.017).toFixed(1)}
              </p>
              <p className="text-[10px] text-slate-500">Saved by Cache Hits</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connected External Services
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-slate-800 bg-slate-900 p-2 text-center text-xs">
                <p className="text-slate-400">OpenWeather</p>
                <Badge className="mt-1 bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                  Active
                </Badge>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900 p-2 text-center text-xs">
                <p className="text-slate-400">ExchangeRate</p>
                <Badge className="mt-1 bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                  Active
                </Badge>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900 p-2 text-center text-xs">
                <p className="text-slate-400">Pexels Photos</p>
                <Badge className="mt-1 bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
