import Link from 'next/link';
import {
  Users,
  Activity,
  Image as ImageIcon,
  Mail,
  TrendingUp,
  Smartphone,
  ArrowUpRight,
  Inbox,
  Cpu,
  Globe,
  BarChart3,
} from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/admin';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminApiChart } from '@/components/admin/api-chart';

/* ------------------------------------------------------------------ */
/*  Mini Stat Component (inline, no external dependency)               */
/* ------------------------------------------------------------------ */
function MiniStat({
  label,
  value,
  sub,
  accent = 'text-blue-400',
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-800/20 p-4 transition-colors hover:border-slate-700/60">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${accent}`}>
        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
      </p>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function AdminOverviewPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const stats = await getAdminStats();

  const hasUsers = stats.totalAppUsers > 0;
  const hasApi = stats.apiCalls30d > 0;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Genel Bakış</h2>
        <p className="text-sm text-slate-400 mt-1">
          Journeo platformunun güncel durumu ve temel göstergeleri.
        </p>
      </div>

      {/* ── Key Metrics Row ─────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Kullanıcı"
          value={stats.totalAppUsers}
          sub={hasUsers ? `${stats.activeAppUsers7d} aktif (7g)` : 'Henüz kayıt yok'}
          accent="text-blue-400"
        />
        <MiniStat
          label="Ekran Görüntüsü"
          value={stats.screenshotsCount}
          sub="Galeride yayında"
          accent="text-amber-400"
        />
        <MiniStat
          label="API İsteği (30g)"
          value={stats.apiCalls30d}
          sub={hasApi ? `Bugün ${stats.apiCallsToday}` : 'Henüz istek yok'}
          accent="text-purple-400"
        />
        <MiniStat
          label="Mesaj"
          value={stats.contactMessagesTotal}
          sub={stats.contactMessagesUnread > 0 ? `${stats.contactMessagesUnread} okunmamış` : 'Hepsi okundu'}
          accent="text-rose-400"
        />
      </div>

      {/* ── Two-Column: Chart + Sidebar ─────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* API Chart - 3/5 width */}
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-100 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  API Trafiği
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-0.5">
                  Son 14 günlük istek hacmi
                </CardDescription>
              </div>
              {hasApi && (
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-100">{stats.apiCalls7d.toLocaleString('tr-TR')}</p>
                  <p className="text-[10px] text-slate-500">bu hafta</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <AdminApiChart data={stats.apiCallsByDay} />
          </CardContent>
        </Card>

        {/* Right Sidebar Cards - 2/5 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* Platform Split */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-100 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-cyan-400" />
                Platform Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.platformBreakdown.map((p) => {
                const total = stats.totalAppUsers || 1;
                const pct = Math.round((p.count / total) * 100);
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-300">{p.platform}</span>
                      <span className="text-slate-500 font-mono text-xs">{p.count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          p.platform === 'iOS'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {!hasUsers && (
                <p className="text-xs text-slate-500 italic">
                  Mobil uygulama bağlandığında cihaz verileri burada görünecek.
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI & Cache Stats */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-100 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                AI & Önbellek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-lg font-bold text-purple-400">{stats.aiCalls30d}</p>
                  <p className="text-[10px] text-slate-500">AI üretimi (30g)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{stats.cachedPlacesCount}</p>
                  <p className="text-[10px] text-slate-500">Önbellek mekanı</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-400">{stats.cachedAiPlansCount}</p>
                  <p className="text-[10px] text-slate-500">Önbellek planı</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-400">{stats.weatherCacheHitCount}</p>
                  <p className="text-[10px] text-slate-500">Hava durumu cache</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── API Details Row ─────────────────────────────────────── */}
      {hasApi && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MiniStat
            label="Hata Oranı"
            value={`%${stats.apiErrorRate}`}
            sub="Son 7 gün"
            accent={stats.apiErrorRate > 5 ? 'text-rose-400' : 'text-emerald-400'}
          />
          <MiniStat
            label="Ort. Yanıt Süresi"
            value={stats.avgResponseMs ? `${stats.avgResponseMs}ms` : '—'}
            sub="Son 7 gün"
            accent="text-cyan-400"
          />
          <MiniStat
            label="Google Places"
            value={stats.googlePlacesCallsMonth}
            sub="Bu ay"
            accent="text-blue-400"
          />
          <MiniStat
            label="Mapbox"
            value={stats.mapboxCallsMonth}
            sub="Bu ay"
            accent="text-indigo-400"
          />
        </div>
      )}

      {/* ── Top Endpoints + Quick Actions ───────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Top endpoints */}
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Popüler Uç Noktalar
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">Son 7 gün</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.apiCallsByEndpoint.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                API aktivitesi başladığında uç noktalar burada listelenecek.
              </p>
            ) : (
              stats.apiCallsByEndpoint.slice(0, 6).map((e, i) => (
                <div key={e.endpoint} className="flex items-center gap-2 text-sm">
                  <span className="text-[10px] font-mono text-slate-600 w-4 text-right">{i + 1}</span>
                  <span className="flex-1 truncate font-mono text-xs text-slate-300">{e.endpoint}</span>
                  <span className="text-xs font-mono text-emerald-400">{e.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-100">Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              <QuickLink href="/admingate/screenshots" icon={ImageIcon} label="Ekran Görüntüleri" count={stats.screenshotsCount} />
              <QuickLink href="/admingate/messages" icon={Mail} label="İletişim Mesajları" count={stats.contactMessagesUnread} highlight={stats.contactMessagesUnread > 0} />
              <QuickLink href="/admingate/api-usage" icon={Activity} label="API Kullanımı" />
              <QuickLink href="/admingate/users" icon={Users} label="Uygulama Kullanıcıları" count={stats.totalAppUsers} />
              <QuickLink href="/admingate/settings" icon={Globe} label="Site Ayarları" />
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
      className="group flex items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-800/20 px-4 py-3 transition-all hover:border-slate-700 hover:bg-slate-800/40"
    >
      <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
      <span className="flex-1 text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <Badge
          className={
            highlight
              ? 'bg-rose-500/20 text-rose-300 border-none text-[10px]'
              : 'bg-slate-700/50 text-slate-400 border-none text-[10px]'
          }
        >
          {count}
        </Badge>
      )}
      <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
    </Link>
  );
}