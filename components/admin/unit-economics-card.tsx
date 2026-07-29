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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Akıllı Analiz & Birim Ekonomisi (Unit Economics)
          </h3>
          <p className="text-xs text-slate-400">
            Abonelik gelirleri, başabaş (breakeven) gezi sınırı, Mapbox haritası ve Affiliate komisyon takibi.
          </p>
        </div>
        <Badge
          className={
            estimatedNetProfit >= 0
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          }
        >
          Net Kar: ${estimatedNetProfit} / ay
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Breakeven Limit per Member */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-300">
                <Target className="h-4 w-4" />
                Breakeven Sınırı
              </span>
              <Badge variant="outline" className="border-amber-700/50 text-amber-300 text-[10px]">
                Kullanıcı Başı
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-100 mt-1">
              ~{breakevenTripsPerUser}{' '}
              <span className="text-xs font-normal text-slate-400">gezi / ay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>
              $9.99 abonelik ücretine karşılık bir üye ayda{' '}
              <strong className="text-amber-300">{breakevenTripsPerUser} gezi</strong> yapana kadar karlı kalırsınız.
            </p>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              Gezi başı maliyet: ${costPerTrip}
            </div>
          </CardContent>
        </Card>

        {/* 2. Monthly Revenue & API Expenditure */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <DollarSign className="h-4 w-4" />
                Aylık Gelir vs Gider
              </span>
              <Badge variant="outline" className="border-emerald-700/50 text-emerald-300 text-[10px]">
                Finansal
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-400 mt-1">
              ${estimatedMonthlyRevenue}{' '}
              <span className="text-xs font-normal text-slate-400">gelir</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Toplam API Harcaması:</span>
              <span className="font-mono text-rose-400">${estimatedTotalApiCost}</span>
            </div>
            <div className="flex justify-between">
              <span>Abonelik (MRR):</span>
              <span className="font-mono text-slate-300">
                ${(premiumUsers * 9.99).toFixed(2)} ({premiumUsers} premium)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Mapbox Usage */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-cyan-400">
                <Map className="h-4 w-4" />
                Mapbox Harita Kotası
              </span>
              <Badge variant="outline" className="border-cyan-700/50 text-cyan-300 text-[10px]">
                {mapboxQuotaPct}%
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-100 mt-1">
              {mapboxCallsMonth}{' '}
              <span className="text-xs font-normal text-slate-400">çağrı</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${mapboxQuotaPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>100k Ücretsiz Tier</span>
              <span>Kalan: {(mapboxQuota - mapboxCallsMonth).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Affiliate Revenue */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-purple-400">
                <ShoppingBag className="h-4 w-4" />
                Affiliate Gelirleri
              </span>
              <Badge variant="outline" className="border-purple-700/50 text-purple-300 text-[10px]">
                %{conversionRate} CR
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-300 mt-1">
              ${affiliateCommissionTotal.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Tıklama Sayısı:</span>
              <span className="font-mono text-slate-300">{affiliateClicksTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Dönüşen Rezervasyon:</span>
              <span className="font-mono text-emerald-400">{affiliateConvertedTotal}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
