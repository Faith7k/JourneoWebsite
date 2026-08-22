import { requireAdmin } from '@/lib/supabase/admin';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminStatCard } from '@/components/admin/stat-card';
import { UserGrowthChart } from '@/components/admin/user-growth-chart';
import { AdminTopCreatorsCard } from '@/components/admin/top-creators-card';
import { Admin3DGlobeCard } from '@/components/admin/globe-3d';
import { Users, UserCheck, Smartphone, Crown, Globe, Layers } from 'lucide-react';

export default async function AdminUsersPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const stats = await getAdminStats();

  const premiumRate =
    stats.totalAppUsers > 0
      ? Math.round((stats.premiumUsers / stats.totalAppUsers) * 100)
      : 0;

  const active7dRate =
    stats.totalAppUsers > 0
      ? Math.round((stats.activeAppUsers7d / stats.totalAppUsers) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Uygulama Kullanıcıları</h2>
        <p className="text-sm text-slate-500 mt-1">
          Mobil uygulamaya kayıtlı kullanıcılar, abonelik durumları, aktiflik oranları ve cihaz analizleri.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Toplam Kullanıcı"
          value={stats.totalAppUsers}
          subtitle="Mobil uygulamaya kayıtlı"
          icon={Users}
          accent="bg-blue-50 text-blue-600 border border-blue-100"
        />
        <AdminStatCard
          title="Aktif (7g)"
          value={stats.activeAppUsers7d}
          subtitle={`Toplamın %${active7dRate}'i`}
          icon={UserCheck}
          accent="bg-emerald-50 text-emerald-600 border border-emerald-100"
          trend={`${stats.activeAppUsers30d} aktif (30g)`}
        />
        <AdminStatCard
          title="Premium Üye"
          value={stats.premiumUsers}
          subtitle={`%${premiumRate} ödeme dönüşümü`}
          icon={Crown}
          accent="bg-amber-50 text-amber-600 border border-amber-100"
        />
        <AdminStatCard
          title="iOS / Android"
          value={stats.iosUsers}
          subtitle={`${stats.androidUsers} Android kullanıcısı`}
          icon={Smartphone}
          accent="bg-purple-50 text-purple-600 border border-purple-100"
        />
      </div>

      {/* 3D Interactive World Globe */}
      <Admin3DGlobeCard stats={stats.countrySubscriberStats} />

      {/* Growth Chart */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">Kullanıcı Büyümesi — Son 30 Gün</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Günlük yeni organik mobil kullanıcı kayıtları.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGrowthChart data={stats.userGrowthByDay} />
        </CardContent>
      </Card>

      {/* Platform + Premium breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Platform breakdown */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Smartphone className="h-4 w-4 text-slate-500" />
              Platform Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.platformBreakdown.map((p) => {
              const total = stats.platformBreakdown.reduce((s, x) => s + x.count, 0) || 1;
              const pct = Math.round((p.count / total) * 100);
              return (
                <div key={p.platform}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">{p.platform === 'iOS' ? '🍎 iOS' : '🤖 Android'}</span>
                    <span className="text-slate-500 font-mono text-xs">
                      {p.count} · %{pct}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all ${p.platform === 'iOS' ? 'bg-blue-600' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.totalAppUsers === 0 && (
              <p className="text-xs text-slate-400 italic py-3">Henüz kullanıcı verisi bulunmuyor.</p>
            )}
          </CardContent>
        </Card>

        {/* Premium vs Free & Paywall Breakdown */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Crown className="h-4 w-4 text-amber-500" />
              Abonelik & Paywall Dağılımı
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Yıllık planlar ($49.99/yıl) ve Trip Pass ($7.99) satışları.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {/* Annual Subscriptions */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold">👑 Yıllık Plan</span>
                  <span className="text-[10px] text-slate-500 font-mono">(${stats.annualPrice}/yıl)</span>
                </p>
                <p className="text-xs text-slate-500">Sınırsız AI ve tüm özellikler</p>
              </div>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-semibold">
                {stats.annualSubscribers} Abone
              </Badge>
            </div>

            {/* Trip Pass Credits */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="text-cyan-700 font-bold">🎫 Trip Pass</span>
                  <span className="text-[10px] text-slate-500 font-mono">(${stats.tripPassPrice}/adet)</span>
                </p>
                <p className="text-xs text-slate-500">Tek seferlik sınırsız gezi hakkı</p>
              </div>
              <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-700 font-semibold">
                {stats.tripPassCreditsCount} Satış
              </Badge>
            </div>

            {/* Trial / Free */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Ücretsiz (Free) Kâşif:</span>
              <span className="text-slate-800 font-mono font-semibold">{stats.freeUsers} üye</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${Math.max(5, premiumRate)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Toplam %{premiumRate} ödeme dönüşüm oranı</p>
          </CardContent>
        </Card>

        {/* App Version Distribution */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Layers className="h-4 w-4 text-slate-500" />
              App Versiyonları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.appVersions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3">Henüz versiyon verisi bulunmuyor.</p>
            ) : (
              stats.appVersions.map((v) => {
                const total = stats.appVersions.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((v.count / total) * 100);
                return (
                  <div key={v.version} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs font-semibold text-slate-800">{v.version}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full rounded-full bg-purple-600 transition-all"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-mono font-medium text-slate-600">{v.count}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Country Breakdown */}
      {stats.usersByCountry.length > 0 && (
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Globe className="h-4 w-4 text-blue-600" />
              Ülkelere Göre Kullanıcılar
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">En aktif ilk 10 ülke.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {stats.usersByCountry.map((c) => {
                const total = stats.usersByCountry.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((c.count / total) * 100);
                return (
                  <div key={c.country} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <span className="w-28 truncate text-xs font-semibold text-slate-800">{c.country}</span>
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-mono font-semibold text-slate-700">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Power Users Leaderboard */}
      <AdminTopCreatorsCard topTripCreators={stats.topTripCreators} />

      {/* Raw User Table */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Kayıtlı Mobil Kullanıcılar</CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Mobil uygulamaya kayıtlı kullanıcılar, abonelik planları, arama ve detay görünümü.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RawUsersTableData />
        </CardContent>
      </Card>
    </div>
  );
}

async function RawUsersTableData() {
  const { createAdminClient } = await import('@/lib/supabase/server');
  const { AdminUsersTable } = await import('@/components/admin/users-table');
  const supabase = await createAdminClient();

  const [authUsersRes, profilesRes, subsRes, passesRes, tokensRes, tripsRes, aiLogsRes] =
    await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 100 }),
      supabase.from('profiles').select('*'),
      supabase.from('user_subscriptions').select('*'),
      supabase.from('trip_pass_credits').select('*'),
      supabase.from('fcm_tokens').select('*'),
      supabase.from('trips').select('id, owner_id, destination_country, is_deleted'),
      supabase.from('ai_generation_log').select('id, user_id'),
    ]);

  const authUsers = authUsersRes.data?.users ?? [];
  const profiles = profilesRes.data ?? [];
  const subs = subsRes.data ?? [];
  const passes = passesRes.data ?? [];
  const tokens = tokensRes.data ?? [];
  const trips = (tripsRes.data ?? []).filter((t: any) => !t.is_deleted);
  const aiLogs = aiLogsRes.data ?? [];

  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
  const subMap = new Map(
    subs
      .filter((s: any) => s.status === 'active' || s.status === 'trial')
      .map((s: any) => [s.user_id, s])
  );

  const passMap = new Map<string, any[]>();
  passes.forEach((pass: any) => {
    if (!passMap.has(pass.user_id)) passMap.set(pass.user_id, []);
    passMap.get(pass.user_id)!.push(pass);
  });

  const tokenMap = new Map<string, any[]>();
  tokens.forEach((t: any) => {
    if (!tokenMap.has(t.user_id)) tokenMap.set(t.user_id, []);
    tokenMap.get(t.user_id)!.push(t);
  });

  const tripMap = new Map<string, any[]>();
  trips.forEach((t: any) => {
    if (!tripMap.has(t.owner_id)) tripMap.set(t.owner_id, []);
    tripMap.get(t.owner_id)!.push(t);
  });

  const aiMap = new Map<string, number>();
  aiLogs.forEach((a: any) => {
    if (a.user_id) aiMap.set(a.user_id, (aiMap.get(a.user_id) ?? 0) + 1);
  });

  const usersList = authUsers.map((u) => {
    const p = profileMap.get(u.id);
    const s = subMap.get(u.id);
    const userPasses = passMap.get(u.id) ?? [];
    const userTokens = tokenMap.get(u.id) ?? [];
    const userTrips = tripMap.get(u.id) ?? [];
    const aiCount = aiMap.get(u.id) ?? 0;

    const platforms = Array.from(new Set(userTokens.map((t: any) => t.platform).filter(Boolean)));
    const countries = Array.from(
      new Set(userTrips.map((t: any) => t.destination_country).filter(Boolean))
    );

    const isAnnual = !!s;
    const hasTripPass = userPasses.length > 0;
    const isPremium = isAnnual || hasTripPass;

    let planBadge = { label: 'Free', style: 'border-slate-200 bg-slate-50 text-slate-700 font-semibold' };
    if (isAnnual) {
      const pId = s?.product_id || 'yearly';
      if (pId.includes('annual') || pId.includes('yearly')) {
        planBadge = { label: '👑 Yıllık Plan ($49.99)', style: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' };
      } else {
        planBadge = { label: `👑 ${pId}`, style: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' };
      }
    } else if (hasTripPass) {
      planBadge = { label: `🎫 Trip Pass (${userPasses.length} adet)`, style: 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold' };
    }

    const name =
      p?.full_name ||
      (u.user_metadata?.full_name as string) ||
      (u.user_metadata?.name as string) ||
      'Journeo Traveler';

    const username =
      p?.username ||
      (u.user_metadata?.username as string) ||
      `@user_${u.id.slice(0, 6)}`;

    return {
      id: u.id,
      email: u.email || p?.email || '—',
      name,
      username,
      platforms: platforms.length > 0 ? platforms : ['ios'],
      subscription: (isPremium ? 'premium' : 'free') as 'premium' | 'free',
      planBadge,
      tripCount: userTrips.length,
      aiCount,
      countries,
      createdAt: u.created_at,
      lastActiveAt: u.last_sign_in_at || u.created_at,
    };
  });

  return <AdminUsersTable users={usersList} />;
}