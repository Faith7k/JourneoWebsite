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
  premiumUsers: number;
  freeUsers: number;
  mapboxCallsMonth: number;
  affiliateClicksTotal: number;
  affiliateConvertedTotal: number;
  affiliateCommissionTotal: number;
  estimatedTotalApiCost: number;
  costPerTrip: number;
  breakevenTripsPerUser: number;
  estimatedMonthlyRevenue: number;
  estimatedNetProfit: number;
};

export function AdminUnitEconomicsCard({
  premiumUsers,
  freeUsers,
  mapboxCallsMonth,
  affiliateClicksTotal,
  affiliateConvertedTotal,
  affiliateCommissionTotal,
  estimatedTotalApiCost,
  costPerTrip,
  breakevenTripsPerUser,
  estimatedMonthlyRevenue,
  estimatedNetProfit,
}: UnitEconomicsProps) {
  // Mapbox free quota: 100,000 geocoding calls/month
  const mapboxQuota = 100000;
  const mapboxQuotaPct = Math.min(100, Math.round((mapboxCallsMonth / mapboxQuota) * 100));

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
            Abonelik gelirleri, başabaş (breakeven) gezi sınırı, Mapbox harita kotası ve Affiliate komisyon takibi.
          </p>
        </div>
        <Badge
          className={
            estimatedNetProfit >= 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
              : 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
          }
        >
          Net Kar: ${estimatedNetProfit} / ay
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
              $9.99 abonelik ücretine karşılık bir üye ayda{' '}
              <strong className="text-slate-900 font-semibold">{breakevenTripsPerUser} gezi</strong> yapana kadar karlı kalırsınız.
            </p>
            <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
              Gezi başı ort. maliyet: ${costPerTrip}
            </div>
          </CardContent>
        </Card>

        {/* 2. Monthly Revenue & API Expenditure */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Aylık Gelir vs Gider
              </span>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
                Finansal
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 mt-1 tabular-nums">
              ${estimatedMonthlyRevenue}{' '}
              <span className="text-xs font-normal text-slate-500">gelir</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Toplam API Harcaması:</span>
              <span className="font-mono font-semibold text-rose-600">${estimatedTotalApiCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Abonelik (MRR):</span>
              <span className="font-mono font-semibold text-slate-900">
                ${(premiumUsers * 9.99).toFixed(2)} ({premiumUsers} premium)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Mapbox Usage */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-700">
                <Map className="h-4 w-4 text-cyan-600" />
                Mapbox Harita Kotası
              </span>
              <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-700 text-[10px]">
                {mapboxQuotaPct}%
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              {mapboxCallsMonth.toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-500">çağrı</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{ width: `${Math.max(mapboxQuotaPct, 1)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>100k Ücretsiz Tier</span>
              <span>Kalan: {(mapboxQuota - mapboxCallsMonth).toLocaleString('tr-TR')}</span>
            </div>
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
              ${affiliateCommissionTotal.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
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
