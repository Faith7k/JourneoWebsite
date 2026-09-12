import Link from 'next/link';
import {
  Users,
  Activity,
  Image as ImageIcon,
  Mail,
  TrendingUp,
  Smartphone,
  ArrowUpRight,
  Cpu,
  Globe,
  BarChart3,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  Server,
  Layers,
  Database,
  CloudLightning,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/admin';
import { getAdminStats } from '@/lib/supabase/stats';
import { AppleIcon, AndroidIcon } from '@/components/admin/platform-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminDownloadsChart } from '@/components/admin/downloads-chart';
import { AdminStatCard } from '@/components/admin/stat-card';
export default async function AdminOverviewPage() {

  const user = await requireAdmin();
  if (!user) return null;

  const stats = await getAdminStats();

  const hasUsers = stats.totalAppUsers > 0;
  const hasApi = stats.apiCalls30d > 0;
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Page Header & Ambient Banner ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2.5xl font-extrabold tracking-tight text-slate-900">
              Admin Console — Genel Bakış
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Canlı Takip
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Journeo AI platformunun gerçek zamanlı performansı, kullanıcı trafiği ve sistem indikatörleri.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-2xs text-xs font-bold text-slate-700">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* ── Live System Health Bar (21st.dev Style) ────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database</p>
            </div>
            <p className="text-xs font-semibold text-slate-200">Supabase OK</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Gateway</p>
            </div>
            <p className="text-xs font-semibold text-slate-200">Gemini & Fal AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mapbox / Places</p>
            </div>
            <p className="text-xs font-semibold text-slate-200">{stats.googlePlacesCallsMonth} çağrı</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Güvenlik Durumu</p>
            </div>
            <p className="text-xs font-semibold text-slate-200">RLS & Auth Aktif</p>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Bento Row ─────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Kullanıcı"
          value={stats.totalAppUsers}
          subtitle={hasUsers ? `${stats.activeAppUsers7d} aktif kullanıcı (son 7g)` : 'Henüz kullanıcı kaydı yok'}
          icon={Users}
          badge="Mobil App"
          accent="bg-blue-500/10 text-blue-600 border-blue-200/60"
          trend={stats.totalAppUsers > 0 ? `+${stats.totalAppUsers}` : undefined}
          trendUp={true}
        />
        <AdminStatCard
          title="Ekran Görüntüsü"
          value={stats.screenshotsCount}
          subtitle="Landing sayfasında yayında"
          icon={ImageIcon}
          badge="Galeri"
          accent="bg-amber-500/10 text-amber-600 border-amber-200/60"
        />
        <AdminStatCard
          title="API İsteği (30g)"
          value={stats.apiCalls30d}
          subtitle={hasApi ? `Bugün ${stats.apiCallsToday} istek gerçekleşti` : 'Henüz API aktivitesi yok'}
          icon={Activity}
          badge="Trafik"
          accent="bg-purple-500/10 text-purple-600 border-purple-200/60"
          trend={stats.apiCalls7d > 0 ? `${stats.apiCalls7d} bu hafta` : undefined}
          trendUp={true}
        />
        <AdminStatCard
          title="İletişim Mesajları"
          value={stats.contactMessagesTotal}
          subtitle={
            stats.contactMessagesUnread > 0
              ? `${stats.contactMessagesUnread} yeni okunmamış mesaj var`
              : 'Tüm mesajlar incelendi'
          }
          icon={Mail}
          badge={stats.contactMessagesUnread > 0 ? 'Aksiyon Gerekli' : 'Temiz'}
          accent="bg-rose-500/10 text-rose-600 border-rose-200/60"
        />
      </div>

      {/* ── Main Dashboard Bento Grid ───────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Mobile Downloads Chart - 3/5 width */}
        <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs rounded-2xl lg:col-span-3 flex flex-col justify-between overflow-hidden">
          <CardHeader className="pb-4 border-b border-slate-100/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Mobil Kayıt & Büyüme Analizi
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-0.5">
                    Ay bazında App Store & Google Play Store gerçek kayıt oranları
                  </CardDescription>
                </div>
              </div>
              <div className="text-right bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
                <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                  {stats.totalDownloadsCount.toLocaleString('tr-TR')}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Toplam Kayıt
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <AdminDownloadsChart
              data={stats.monthlyDownloads}
              totalDownloads={stats.totalDownloadsCount}
              appStoreDownloads={stats.appStoreDownloadsCount}
              playStoreDownloads={stats.playStoreDownloadsCount}
            />
          </CardContent>
        </Card>

        {/* Right Sidebar Cards - 2/5 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Distribution */}
          <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-cyan-600" />
                  Platform Dağılımı
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-200">
                  Canlı Cihazlar
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {stats.platformBreakdown.map((p) => {
                const total = stats.totalAppUsers || 1;
                const pct = Math.round((p.count / total) * 100);
                const isIOS = p.platform === 'iOS';
                return (
                  <div key={p.platform} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        {isIOS ? (
                          <>
                            <AppleIcon className="h-3.5 w-3.5 text-slate-900 fill-current shrink-0" />
                            <span>iOS Mobil</span>
                          </>
                        ) : (
                          <>
                            <AndroidIcon className="h-3.5 w-3.5 text-emerald-600 fill-current shrink-0" />
                            <span>Android Mobil</span>
                          </>
                        )}
                        {!isIOS && p.count === 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            İncelemede
                          </span>
                        )}
                      </span>
                      <span className="text-slate-900 font-bold tabular-nums">
                        {p.count} cihaz <span className="text-slate-400 font-medium">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isIOS ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        }`}
                        style={{ width: p.count === 0 ? '0%' : `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {stats.androidUsers === 0 && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Google Play Store sürümü şu anda incelemededir. Canlı mobil kullanıcılar Apple App Store üzerinden gelmektedir.</span>
                </div>
              )}
              {!hasUsers && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 italic">
                  <Server className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Mobil uygulama bağlandığında cihaz verileri burada listelenecektir.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI & Cache Performance */}
          <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100/80">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-600" />
                AI & Önbellek Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-purple-50/70 p-3 border border-purple-100 transition-all hover:bg-purple-50">
                  <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" /> AI Üretimi
                  </div>
                  <p className="text-xl font-extrabold text-purple-900 tabular-nums">
                    {stats.aiCalls30d}
                  </p>
                  <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Son 30 günde</p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100 transition-all hover:bg-emerald-50">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                    <Database className="h-3.5 w-3.5 text-emerald-600" /> Places Cache
                  </div>
                  <p className="text-xl font-extrabold text-emerald-900 tabular-nums">
                    {stats.cachedPlacesCount}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Önbellek mekan</p>
                </div>

                <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-100 transition-all hover:bg-amber-50">
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-1">
                    <Layers className="h-3.5 w-3.5 text-amber-600" /> AI Plan Cache
                  </div>
                  <p className="text-xl font-extrabold text-amber-900 tabular-nums">
                    {stats.cachedAiPlansCount}
                  </p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Hazır plan</p>
                </div>

                <div className="rounded-xl bg-cyan-50/70 p-3 border border-cyan-100 transition-all hover:bg-cyan-50">
                  <div className="flex items-center gap-1.5 text-cyan-700 text-xs font-bold mb-1">
                    <CloudLightning className="h-3.5 w-3.5 text-cyan-600" /> Hava Cache
                  </div>
                  <p className="text-xl font-extrabold text-cyan-900 tabular-nums">
                    {stats.weatherCacheHitCount}
                  </p>
                  <p className="text-[10px] text-cyan-600 font-semibold mt-0.5">Hit sayısı</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── API Performance Metrics Row ──────────────────────────── */}
      {hasApi && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4.5 shadow-xs backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hata Oranı
            </p>
            <p className={`text-2xl font-extrabold tracking-tight mt-1 ${stats.apiErrorRate > 5 ? 'text-rose-600' : 'text-emerald-600'} tabular-nums`}>
              %{stats.apiErrorRate}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Son 7 günlük ortalama</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4.5 shadow-xs backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ort. Yanıt Süresi
            </p>
            <p className="text-2xl font-extrabold tracking-tight mt-1 text-cyan-700 tabular-nums">
              {stats.avgResponseMs ? `${stats.avgResponseMs}ms` : '—'}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Latency süresi</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4.5 shadow-xs backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Google Places API
            </p>
            <p className="text-2xl font-extrabold tracking-tight mt-1 text-blue-600 tabular-nums">
              {stats.googlePlacesCallsMonth.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Bu ayki toplam çağrı</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4.5 shadow-xs backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mapbox API
            </p>
            <p className="text-2xl font-extrabold tracking-tight mt-1 text-indigo-600 tabular-nums">
              {stats.mapboxCallsMonth.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Bu ayki harita çağrısı</p>
          </div>
        </div>
      )}

      {/* ── Top Endpoints + Quick Actions ───────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Top Endpoints */}
        <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100/80">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              Popüler Uç Noktalar
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Son 14 gün içindeki en yoğun endpointler
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {stats.apiCallsByEndpoint.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 font-medium">Henüz API uç nokta verisi yok</p>
              </div>
            ) : (
              stats.apiCallsByEndpoint.slice(0, 6).map((e, i) => (
                <div
                  key={e.endpoint}
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                    #{i + 1}
                  </span>
                  <span className="flex-1 truncate font-mono text-xs font-semibold text-slate-800">
                    {e.endpoint}
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold font-mono">
                    {e.count}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs rounded-2xl lg:col-span-3">
          <CardHeader className="pb-3 border-b border-slate-100/80">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Hızlı Erişim & Yönetim
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickLink
                href="/admingate/screenshots"
                icon={ImageIcon}
                label="Ekran Görüntüleri"
                count={stats.screenshotsCount}
              />
              <QuickLink
                href="/admingate/messages"
                icon={Mail}
                label="İletişim Mesajları"
                count={stats.contactMessagesUnread}
                highlight={stats.contactMessagesUnread > 0}
              />
              <QuickLink
                href="/admingate/api-usage"
                icon={Activity}
                label="API Kullanımı"
              />
              <QuickLink
                href="/admingate/users"
                icon={Users}
                label="Uygulama Kullanıcıları"
                count={stats.totalAppUsers}
              />
              <QuickLink
                href="/admingate/costs"
                icon={TrendingUp}
                label="Maliyet & Finans"
              />
              <QuickLink
                href="/admingate/settings"
                icon={Globe}
                label="Site Ayarları"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Link Component                                               */
/* ------------------------------------------------------------------ */
function QuickLink({
  href,
  icon: Icon,
  label,
  count,
  highlight,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-2xs transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <span className="flex-1 text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <Badge
          className={
            highlight
              ? 'bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-bold shadow-2xs'
              : 'bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-semibold'
          }
        >
          {count}
        </Badge>
      )}
      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}