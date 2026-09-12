import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  Map,
  ShoppingBag,
  Zap,
  Target,
  BarChart3,
  Layers,
} from 'lucide-react';

type UnitEconomicsProps = {
  annualSubscribers: number;
  trialUsers: number;
  mrr: number;
  monthlyPricePerSubscriber: number;
  tripPassSales30d: number;
  tripPassRevenue30d: number;
  mapboxGeocodingCallsMonth: number;
  mapboxDirectionsCallsMonth: number;
  affiliateClicksTotal: number;
  affiliateConvertedTotal: number;
  affiliateCommissionTotal: number;
  affiliateCommission30d: number;
  estimatedTotalApiCost: number;
  costPerTrip: number;
  breakevenTripsPerUser: number;
  estimatedMonthlyRevenue: number;
  estimatedNetProfit: number;
};

// Mapbox free tiers are per API — Geocoding and Directions each get
// 100,000 requests/month before billing starts.
const MAPBOX_FREE_TIER = 100_000;

export function AdminUnitEconomicsCard({
  annualSubscribers,
  trialUsers,
  mrr,
  monthlyPricePerSubscriber,
  tripPassSales30d,
  tripPassRevenue30d,
  mapboxGeocodingCallsMonth,
  mapboxDirectionsCallsMonth,
  affiliateClicksTotal,
  affiliateConvertedTotal,
  affiliateCommissionTotal,
  affiliateCommission30d,
  estimatedTotalApiCost,
  costPerTrip,
  breakevenTripsPerUser,
  estimatedMonthlyRevenue,
  estimatedNetProfit,
}: UnitEconomicsProps) {
  const geocodingPct = Math.min(100, Math.round((mapboxGeocodingCallsMonth / MAPBOX_FREE_TIER) * 100));
  const directionsPct = Math.min(100, Math.round((mapboxDirectionsCallsMonth / MAPBOX_FREE_TIER) * 100));
  const mapboxQuotaPct = Math.max(geocodingPct, directionsPct);

  const conversionRate =
    affiliateClicksTotal > 0
      ? ((affiliateConvertedTotal / affiliateClicksTotal) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            Akıllı Analiz & Birim Ekonomisi (Unit Economics)
          </h3>
          <p className="text-xs text-slate-500">
            Son 30 günün geliri ve API gideri aynı pencerede; başabaş (breakeven) gezi sınırı, Mapbox kotaları ve Affiliate komisyon takibi.
          </p>
        </div>
        <Badge
          className={
            estimatedNetProfit >= 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
              : 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
          }
        >
          Net Kar: ${estimatedNetProfit.toFixed(2)} / 30 gün
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Breakeven Limit per Member */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                <Target className="h-4 w-4 text-amber-600" />
                Breakeven Sınırı
              </span>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px]">
                Kullanıcı Başı
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              ~{breakevenTripsPerUser}{' '}
              <span className="text-xs font-normal text-slate-500">gezi / ay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600">
            <p>
              Yıllık abonelikten aya düşen ${monthlyPricePerSubscriber.toFixed(2)} gelire karşılık bir üye ayda{' '}
              <strong className="text-slate-900 font-semibold">{breakevenTripsPerUser} gezi</strong> yapana kadar karlı kalırsınız.
            </p>
            <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
              Gezi başı ort. maliyet: ${costPerTrip} (son 30 gün, tüm servisler)
            </div>
          </CardContent>
        </Card>

        {/* 2. Monthly Revenue & API Expenditure */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Gelir vs Gider (30g)
              </span>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
                Finansal
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 mt-1 tabular-nums">
              ${estimatedMonthlyRevenue.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">gelir</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">API Harcaması (30g):</span>
              <span className="font-mono font-semibold text-rose-600">-${estimatedTotalApiCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Abonelik (MRR):</span>
              <span className="font-mono font-semibold text-slate-900">
                ${mrr.toFixed(2)} ({annualSubscribers} ödeyen{trialUsers > 0 ? ` · ${trialUsers} trial hariç` : ''})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trip Pass (30g):</span>
              <span className="font-mono font-semibold text-slate-900">
                ${tripPassRevenue30d.toFixed(2)} ({tripPassSales30d} satış)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Affiliate (30g):</span>
              <span className="font-mono font-semibold text-slate-900">${affiliateCommission30d.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Mapbox Usage */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-700">
                <Map className="h-4 w-4 text-cyan-600" />
                Mapbox Kotaları (bu ay)
              </span>
              <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-700 text-[10px]">
                {mapboxQuotaPct}%
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              {(mapboxGeocodingCallsMonth + mapboxDirectionsCallsMonth).toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-500">çağrı</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Geocoding</span>
              <span className="font-mono">
                {mapboxGeocodingCallsMonth.toLocaleString('tr-TR')} / 100k
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{ width: `${Math.max(geocodingPct, 1)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Directions</span>
              <span className="font-mono">
                {mapboxDirectionsCallsMonth.toLocaleString('tr-TR')} / 100k
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.max(directionsPct, 1)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">Her API'nin ayrı 100k/ay ücretsiz kademesi var.</p>
          </CardContent>
        </Card>

        {/* 4. Affiliate Revenue */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-purple-700">
                <ShoppingBag className="h-4 w-4 text-purple-600" />
                Affiliate Gelirleri
              </span>
              <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-[10px]">
                %{conversionRate} CR
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-purple-700 mt-1 tabular-nums">
              ${affiliateCommissionTotal.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">toplam</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Son 30 gün:</span>
              <span className="font-mono font-semibold text-slate-900">${affiliateCommission30d.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tıklama Sayısı:</span>
              <span className="font-mono font-semibold text-slate-900">{affiliateClicksTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dönüşen Rezervasyon:</span>
              <span className="font-mono font-semibold text-emerald-600">{affiliateConvertedTotal}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
