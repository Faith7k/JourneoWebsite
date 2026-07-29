import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Wallet,
  Globe2,
  CloudSun,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';

type PlatformInsightsProps = {
  fcmTokensCount: number;
  notificationsDeliveredCount: number;
  dataExportRequestsCount: number;
  totalTripExpensesLogged: number;
  supportedLocalesCount: number;
  weatherCacheHitCount: number;
};

export function AdminPlatformInsightsCard({
  fcmTokensCount,
  notificationsDeliveredCount,
  dataExportRequestsCount,
  totalTripExpensesLogged,
  supportedLocalesCount,
  weatherCacheHitCount,
}: PlatformInsightsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            Operasyonel Platform & Derinlik Analizi
          </h3>
          <p className="text-xs text-slate-400">
            Push bildirimleri, grup seyahat bütçeleri, dil desteği ve sistem verimliliği.
          </p>
        </div>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs">
          Sistem Sağlığı: Mükemmel
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Push Notification / FCM */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-purple-400">
                <Bell className="h-4 w-4" />
                FCM Push Bildirimler
              </span>
              <Badge className="bg-purple-500/20 text-purple-300 border-none text-[10px]">
                {fcmTokensCount} Cihaz
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-100 mt-1">
              {notificationsDeliveredCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>Gönderilen anlık mobil bildirim sayısı.</p>
          </CardContent>
        </Card>

        {/* 2. Group Expense Ledger */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Wallet className="h-4 w-4" />
                Seyahat Gider Defteri
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                Ortak Bütçe
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-400 mt-1">
              ${totalTripExpensesLogged.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>Kullanıcıların kaydettiği geziler bütçesi.</p>
          </CardContent>
        </Card>

        {/* 3. Weather Cache & Locales */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <CloudSun className="h-4 w-4" />
                Hava Durumu Önbellek
              </span>
              <Badge variant="outline" className="border-amber-700/50 text-amber-300 text-[10px]">
                {supportedLocalesCount} Dil Desteği
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-amber-300 mt-1">
              {weatherCacheHitCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>Önbelleklenen şehir tahmini sayısı.</p>
          </CardContent>
        </Card>

        {/* 4. GDPR / KVKK Compliance */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-cyan-400">
                <ShieldCheck className="h-4 w-4" />
                KVKK & GDPR Uyumluluk
              </span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-none text-[10px]">
                %100 Uyumlu
              </Badge>
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-100 mt-1">
              {dataExportRequestsCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            <p>Bekleyen veri ihraç/silme talebi.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
