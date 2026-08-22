import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  Zap,
  Users2,
  Share2,
  Calendar,
  ShieldCheck,
  Crown,
} from 'lucide-react';

type FinancialMRRProps = {
  mrr: number;
  arr: number;
  grossMonthlyRevenue: number;
  netMonthlyRevenue: number;
  grossMarginPct: number;
  cacheHitRatioPct: number;
  sharedTripsCount: number;
  activeMeetupsCount: number;
  estimatedTotalApiCost: number;
  premiumUsers: number;
};

export function AdminFinancialMRRCard({
  mrr,
  arr,
  grossMonthlyRevenue,
  netMonthlyRevenue,
  grossMarginPct,
  cacheHitRatioPct,
  sharedTripsCount,
  activeMeetupsCount,
  estimatedTotalApiCost,
  premiumUsers,
}: FinancialMRRProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Finansal MRR & ARR Tekrarlayan Gelir Özeti
          </h3>
          <p className="text-xs text-slate-500">
            Aylık tekrarlayan gelir (MRR), yıllık projeksiyon (ARR), brüt/net gelir ve kar marjı hesabı.
          </p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs">
          Kar Marjı: %{grossMarginPct}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. MRR Card */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Aylık Tekrarlayan Gelir (MRR)
              </span>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-semibold">
                {premiumUsers} Abone
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 mt-1 tabular-nums">
              ${mrr.toLocaleString('tr-TR')}
              <span className="text-xs font-normal text-slate-500"> / ay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600">
            <p>
              Yıllık aboneliklerden ($49.99/yıl) ve Trip Pass ($7.99) satışlarından oluşan aylık düzenli gelir.
            </p>
          </CardContent>
        </Card>

        {/* 2. ARR Card */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-blue-700">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Yıllık Projeksiyon (ARR)
              </span>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-semibold">
                12 Aylık
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-blue-600 mt-1 tabular-nums">
              ${arr.toLocaleString('tr-TR')}
              <span className="text-xs font-normal text-slate-500"> / yıl</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600">
            <p>Mevcut MRR seviyesinin yıllıklandırılmış toplam brüt değeri.</p>
          </CardContent>
        </Card>

        {/* 3. Gross vs Net Revenue */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-purple-700">
                <PieChart className="h-4 w-4 text-purple-600" />
                Brüt vs Net Aylık Gelir
              </span>
              <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-[10px] font-semibold">
                %{grossMarginPct} Marj
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              ${netMonthlyRevenue.toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-500">net kar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Toplam Brüt Gelir:</span>
              <span className="font-mono font-semibold text-emerald-600">${grossMonthlyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">API Harcamaları:</span>
              <span className="font-mono font-semibold text-rose-600">-${estimatedTotalApiCost}</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Infrastructure Efficiency & Social Engagement */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-700">
                <Zap className="h-4 w-4 text-cyan-600" />
                Önbellek & Sosyal Ağ Etkisi
              </span>
              <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200/60 text-[10px] font-semibold">
                %{cacheHitRatioPct} Önbellek
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-cyan-700 mt-1 tabular-nums">
              %{cacheHitRatioPct}{' '}
              <span className="text-xs font-normal text-slate-500">cache hit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Share2 className="h-3.5 w-3.5 text-purple-600" />
                Ortak Geziler:
              </span>
              <span className="font-mono font-semibold text-slate-900">{sharedTripsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Users2 className="h-3.5 w-3.5 text-amber-600" />
                Aktif Buluşmalar:
              </span>
              <span className="font-mono font-semibold text-amber-700">{activeMeetupsCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
