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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Finansal MRR & ARR Tekrarlayan Gelir Özeti
          </h3>
          <p className="text-xs text-slate-400">
            Aylık tekrarlayan gelir (MRR), yıllık projeksiyon (ARR), brüt/net gelir ve kar marjı hesabı.
          </p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
          Kar Marjı: %{grossMarginPct}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. MRR Card */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <CreditCard className="h-4 w-4" />
                Aylık Tekrarlayan Gelir (MRR)
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 text-[10px] border-none">
                {premiumUsers} Abone
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-400 mt-1">
              ${mrr.toLocaleString()}
              <span className="text-xs font-normal text-slate-400"> / ay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>
              Premium üyelerden gelen aylık sabit abonelik geliri ($9.99 / üye).
            </p>
          </CardContent>
        </Card>

        {/* 2. ARR Card */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                <TrendingUp className="h-4 w-4" />
                Yıllık Projeksiyon (ARR)
              </span>
              <Badge variant="outline" className="border-blue-700/50 text-blue-300 text-[10px]">
                12 Aylık
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-blue-300 mt-1">
              ${arr.toLocaleString()}
              <span className="text-xs font-normal text-slate-400"> / yıl</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>Mevcut MRR seviyesinin yıllıklandırılmış toplam brüt değeri.</p>
          </CardContent>
        </Card>

        {/* 3. Gross vs Net Revenue */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-purple-400">
                <PieChart className="h-4 w-4" />
                Brüt vs Net Aylık Gelir
              </span>
              <Badge variant="outline" className="border-purple-700/50 text-purple-300 text-[10px]">
                %{grossMarginPct} Marj
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-100 mt-1">
              ${netMonthlyRevenue.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">net kar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Toplam Brüt Gelir:</span>
              <span className="font-mono text-emerald-400">${grossMonthlyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span>API Harcamaları:</span>
              <span className="font-mono text-rose-400">-${estimatedTotalApiCost}</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Infrastructure Efficiency & Social Engagement */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-cyan-400">
                <Zap className="h-4 w-4" />
                Önbellek & Sosyal Ağ Etkisi
              </span>
              <Badge className="bg-cyan-500/20 text-cyan-300 text-[10px] border-none">
                %{cacheHitRatioPct} Önbellek
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-cyan-300 mt-1">
              %{cacheHitRatioPct}{' '}
              <span className="text-xs font-normal text-slate-400">cache hit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Share2 className="h-3 w-3 text-purple-400" />
                Ortak Geziler:
              </span>
              <span className="font-mono text-slate-200">{sharedTripsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Users2 className="h-3 w-3 text-amber-400" />
                Aktif Buluşmalar:
              </span>
              <span className="font-mono text-amber-300">{activeMeetupsCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
