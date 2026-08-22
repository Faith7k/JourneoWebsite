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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            Operasyonel Platform & Derinlik Analizi
          </h3>
          <p className="text-xs text-slate-500">
            Push bildirimleri, grup seyahat bütçeleri, dil desteği ve sistem verimliliği.
          </p>
        </div>
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
          Sistem Sağlığı: Mükemmel
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Push Notification / FCM */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-purple-700">
                <Bell className="h-4 w-4 text-purple-600" />
                FCM Push Bildirimler
              </span>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-semibold">
                {fcmTokensCount} Cihaz
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              {notificationsDeliveredCount.toLocaleString('tr-TR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <p>Gönderilen anlık mobil bildirim sayısı.</p>
          </CardContent>
        </Card>

        {/* 2. Group Expense Ledger */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <Wallet className="h-4 w-4 text-emerald-600" />
                Seyahat Gider Defteri
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                Ortak Bütçe
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 mt-1 tabular-nums">
              ${totalTripExpensesLogged.toLocaleString('tr-TR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <p>Kullanıcıların kaydettiği geziler bütçesi.</p>
          </CardContent>
        </Card>

        {/* 3. Weather Cache & Locales */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                <CloudSun className="h-4 w-4 text-amber-600" />
                Hava Durumu Önbellek
              </span>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-semibold">
                {supportedLocalesCount} Dil Desteği
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-amber-700 mt-1 tabular-nums">
              {weatherCacheHitCount.toLocaleString('tr-TR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <p>Önbelleklenen şehir tahmini sayısı.</p>
          </CardContent>
        </Card>

        {/* 4. GDPR / KVKK Compliance */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-700">
                <ShieldCheck className="h-4 w-4 text-cyan-600" />
                KVKK & GDPR Uyumluluk
              </span>
              <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200/60 text-[10px] font-semibold">
                %100 Uyumlu
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
              {dataExportRequestsCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <p>Bekleyen veri ihraç/silme talebi.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
