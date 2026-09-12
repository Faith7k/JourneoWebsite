import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminApiChart } from '@/components/admin/api-chart';
import { AdminStatCard } from '@/components/admin/stat-card';
import { AdminAIUsageCard } from '@/components/admin/ai-usage-card';
import { AdminUnitEconomicsCard } from '@/components/admin/unit-economics-card';
import { AdminTopCreatorsCard } from '@/components/admin/top-creators-card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertCircle, Clock, Smartphone } from 'lucide-react';
import { AppleIcon, AndroidIcon } from '@/components/admin/platform-icons';

export default async function AdminApiUsagePage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const stats = await getAdminStats();

  // Only the live table is fetched here; the 14-day series and endpoint split
  // come from getAdminStats (paged, UTC-keyed) so this page cannot disagree
  // with the overview.
  const { data: recent } = await supabase
    .from('api_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const chartData = stats.apiCallsByDay;
  const endpoints = stats.apiCallsByEndpoint;
  const totalEndpointCalls = endpoints.reduce((s, e) => s + e.count, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">API Kullanımı & Sistem Metrikleri</h2>
        <p className="text-sm text-slate-500 mt-1">
          Mobil uygulamadan gelen gerçek zamanlı API trafiği, hata oranları, maliyet ve uç nokta dağılımı.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Bugünkü Çağrılar"
          value={stats.apiCallsToday}
          subtitle={`${stats.apiCalls7d.toLocaleString('tr-TR')} bu hafta`}
          icon={Activity}
          accent="bg-blue-50 text-blue-600 border border-blue-100"
          trend={`${stats.apiCalls30d.toLocaleString('tr-TR')} / 30 gün`}
        />
        <AdminStatCard
          title="Hata Oranı (7g)"
          value={`%${stats.apiErrorRate}`}
          subtitle="4xx / 5xx yanıtları"
          icon={AlertCircle}
          accent={stats.apiErrorRate > 5 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}
        />
        <AdminStatCard
          title="Ort. Yanıt Süresi"
          value={stats.avgResponseMs !== null ? `${stats.avgResponseMs}ms` : '—'}
          subtitle="7 günlük ortalama gecikme"
          icon={Clock}
          accent="bg-purple-50 text-purple-600 border border-purple-100"
        />
        <AdminStatCard
          title="Aktif Platformlar"
          value={stats.apiByPlatform.length}
          subtitle={stats.apiByPlatform.map((p) => p.platform).join(' · ') || 'Veri bekleniyor'}
          icon={Smartphone}
          accent="bg-amber-50 text-amber-600 border border-amber-100"
        />
      </div>

      {/* Akıllı Analiz & Unit Economics */}
      <AdminUnitEconomicsCard
        annualSubscribers={stats.annualSubscribers}
        trialUsers={stats.trialUsers}
        mrr={stats.mrr}
        monthlyPricePerSubscriber={stats.monthlyPricePerSubscriber}
        tripPassSales30d={stats.tripPassSales30d}
        tripPassRevenue30d={stats.tripPassRevenue30d}
        mapboxGeocodingCallsMonth={stats.mapboxGeocodingCallsMonth}
        mapboxDirectionsCallsMonth={stats.mapboxDirectionsCallsMonth}
        affiliateClicksTotal={stats.affiliateClicksTotal}
        affiliateConvertedTotal={stats.affiliateConvertedTotal}
        affiliateCommissionTotal={stats.affiliateCommissionTotal}
        affiliateCommission30d={stats.affiliateCommission30d}
        estimatedTotalApiCost={stats.estimatedTotalApiCost}
        costPerTrip={stats.costPerTrip}
        breakevenTripsPerUser={stats.breakevenTripsPerUser}
        estimatedMonthlyRevenue={stats.estimatedMonthlyRevenue}
        estimatedNetProfit={stats.estimatedNetProfit}
      />

      {/* AI & Places API Engine Stats */}
      <AdminAIUsageCard
        aiCallsToday={stats.aiCallsToday}
        aiCalls7d={stats.aiCalls7d}
        aiCalls30d={stats.aiCalls30d}
        aiByKind={stats.aiByKind}
        googlePlacesCallsMonth={stats.googlePlacesCallsMonth}
        googlePlacesMonthlyBudget={stats.googlePlacesMonthlyBudget}
        cachedPlacesCount={stats.cachedPlacesCount}
        cachedAiPlansCount={stats.cachedAiPlansCount}
        cacheSavingsUsd30d={stats.cacheSavingsUsd30d}
        placesCacheHits30d={stats.placesCacheHits30d}
        placesPaidCalls30d={stats.placesPaidCalls30d}
        cacheHitRatioPct={stats.cacheHitRatioPct}
        unpricedEvents30d={stats.unpricedEvents30d}
      />

      {/* Top Power Users Leaderboard */}
      <AdminTopCreatorsCard topTripCreators={stats.topTripCreators} />

      {/* API Chart (14 Days) */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">API Çağrı Hacmi — Son 14 Gün</CardTitle>
          <CardDescription className="text-xs text-slate-500">Tüm uç noktalardan geçen günlük toplam istek sayısı.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminApiChart data={chartData} />
        </CardContent>
      </Card>

      {/* Endpoints + Platform breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900">En Çok Kullanılan Uç Noktalar (14g)</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Endpoint başına istek dağılımı ve oranları.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {endpoints.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">Henüz kaydedilmiş endpoint çağrısı yok.</p>
            ) : (
              endpoints.map((e) => {
                const pct = Math.round((e.count / totalEndpointCalls) * 100);
                return (
                  <div key={e.endpoint} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-mono text-xs font-semibold text-slate-800">{e.endpoint}</span>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <span className="text-xs text-slate-500 font-medium">%{pct}</span>
                        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-mono text-xs">
                          {e.count}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Platform breakdown */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Platform Dağılımı (7g)</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              İsteklerin iOS, Android ve Web cihaz dağılımı.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.apiByPlatform.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">Henüz platform verisi bulunmuyor.</p>
            ) : (
              stats.apiByPlatform.map((p) => {
                const total = stats.apiByPlatform.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((p.count / total) * 100);
                const platformColors: Record<string, string> = {
                  ios: 'bg-blue-600',
                  android: 'bg-emerald-600',
                  web: 'bg-purple-600',
                  unknown: 'bg-slate-500',
                };
                return (
                  <div key={p.platform}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize font-semibold text-slate-800 flex items-center gap-1.5">
                        {p.platform === 'ios' ? (
                          <>
                            <AppleIcon className="h-3.5 w-3.5 fill-current text-slate-900 shrink-0" />
                            <span>iOS</span>
                          </>
                        ) : p.platform === 'android' ? (
                          <>
                            <AndroidIcon className="h-3.5 w-3.5 fill-current text-emerald-600 shrink-0" />
                            <span>Android</span>
                          </>
                        ) : (
                          <span>🌐 Web</span>
                        )}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        {p.count} çağrı · %{pct}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                      <div
                        className={`h-full rounded-full transition-all ${platformColors[p.platform] ?? 'bg-slate-500'}`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent requests */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Son Gelen İstekler</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            En güncel 50 API çağrısı, durum kodları ve yanıt süreleri.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-semibold">Uç Nokta (Endpoint)</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Metot</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Durum</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Platform</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Süre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(recent ?? []).length === 0 && (
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center text-xs text-slate-400 py-6 italic">
                      Henüz API isteği kaydedilmedi.
                    </TableCell>
                  </TableRow>
                )}
                {(recent ?? []).map((r) => (
                  <TableRow key={r.id} className="border-slate-100 hover:bg-slate-50/70">
                    <TableCell className="font-mono text-xs font-semibold text-slate-800">
                      {r.endpoint}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-700"
                      >
                        {r.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.status_code < 400
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold'
                            : r.status_code < 500
                            ? 'border-amber-200 bg-amber-50 text-amber-700 font-semibold'
                            : 'border-rose-200 bg-rose-50 text-rose-700 font-semibold'
                        }
                      >
                        {r.status_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">{r.platform ?? '—'}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-600">
                      {r.duration_ms !== null ? `${r.duration_ms}ms` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}