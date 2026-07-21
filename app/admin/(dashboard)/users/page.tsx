import { requireAdmin } from '@/lib/supabase/admin';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminStatCard } from '@/components/admin/stat-card';
import { UserGrowthChart } from '@/components/admin/user-growth-chart';
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
        <h2 className="text-2xl font-bold text-slate-100">App Users</h2>
        <p className="text-sm text-slate-400">
          Mobile app user metrics synced from the app.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Users"
          value={stats.totalAppUsers}
          subtitle="Registered in app"
          icon={Users}
          accent="from-blue-500 to-cyan-500"
        />
        <AdminStatCard
          title="Active (7d)"
          value={stats.activeAppUsers7d}
          subtitle={`${active7dRate}% of total`}
          icon={UserCheck}
          accent="from-emerald-500 to-teal-500"
          trend={`${stats.activeAppUsers30d} in 30d`}
        />
        <AdminStatCard
          title="Premium"
          value={stats.premiumUsers}
          subtitle={`${premiumRate}% conversion`}
          icon={Crown}
          accent="from-amber-500 to-orange-500"
        />
        <AdminStatCard
          title="iOS / Android"
          value={stats.iosUsers}
          subtitle={`${stats.androidUsers} Android`}
          icon={Smartphone}
          accent="from-purple-500 to-pink-500"
        />
      </div>

      {/* Growth Chart */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-slate-100">User Growth — Last 30 Days</CardTitle>
          <CardDescription className="text-slate-400">
            New user registrations per day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGrowthChart data={stats.userGrowthByDay} />
        </CardContent>
      </Card>

      {/* Platform + Premium breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Platform breakdown */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Smartphone className="h-4 w-4 text-slate-400" />
              Platform Split
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.platformBreakdown.map((p) => {
              const total = stats.platformBreakdown.reduce((s, x) => s + x.count, 0) || 1;
              const pct = Math.round((p.count / total) * 100);
              return (
                <div key={p.platform}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{p.platform}</span>
                    <span className="text-slate-400">
                      {p.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${p.platform === 'iOS' ? 'from-blue-500 to-cyan-500' : 'from-emerald-500 to-teal-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.totalAppUsers === 0 && (
              <p className="text-xs text-slate-500">No app users yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Premium vs Free */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Crown className="h-4 w-4 text-amber-400" />
              Subscription Split
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Premium</span>
              <Badge className="bg-amber-500/20 text-amber-300">{stats.premiumUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Free</span>
              <Badge variant="outline" className="border-slate-700 text-slate-300">
                {stats.freeUsers}
              </Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${premiumRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{premiumRate}% premium conversion rate</p>
          </CardContent>
        </Card>

        {/* App Version Distribution */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Layers className="h-4 w-4 text-slate-400" />
              App Versions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.appVersions.length === 0 ? (
              <p className="text-xs text-slate-500">No version data yet.</p>
            ) : (
              stats.appVersions.map((v) => {
                const total = stats.appVersions.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((v.count / total) * 100);
                return (
                  <div key={v.version} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-slate-300">{v.version}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs text-slate-500">{v.count}</span>
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
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Globe className="h-4 w-4 text-slate-400" />
              Users by Country
            </CardTitle>
            <CardDescription className="text-slate-400">Top 10 countries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {stats.usersByCountry.map((c) => {
                const total = stats.usersByCountry.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((c.count / total) * 100);
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="w-28 truncate text-sm text-slate-300">{c.country}</span>
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-500">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw User Table */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Users</CardTitle>
          <CardDescription className="text-slate-400">
            Most recent 100 entries from the <code>app_users</code> table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RawUsersTable />
        </CardContent>
      </Card>
    </div>
  );
}

async function RawUsersTable() {
  const { createAdminClient } = await import('@/lib/supabase/server');
  const supabase = await createAdminClient();
  const { data: users } = await supabase
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-slate-800">
          <TableHead className="text-slate-400">Email</TableHead>
          <TableHead className="text-slate-400">Platform</TableHead>
          <TableHead className="text-slate-400">Version</TableHead>
          <TableHead className="text-slate-400">Country</TableHead>
          <TableHead className="text-slate-400">Plan</TableHead>
          <TableHead className="text-slate-400">Active</TableHead>
          <TableHead className="text-slate-400">Last seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(users ?? []).length === 0 && (
          <TableRow className="border-slate-800">
            <TableCell colSpan={7} className="text-slate-500">
              No app users yet. They will appear here once the mobile app starts syncing.
            </TableCell>
          </TableRow>
        )}
        {(users ?? []).map((u) => (
          <TableRow key={u.id} className="border-slate-800">
            <TableCell className="text-slate-200">{u.email ?? '—'}</TableCell>
            <TableCell>
              {u.platform ? (
                <Badge
                  variant="outline"
                  className={
                    u.platform === 'ios'
                      ? 'border-blue-700/50 text-blue-300'
                      : 'border-emerald-700/50 text-emerald-300'
                  }
                >
                  {u.platform === 'ios' ? '🍎 iOS' : '🤖 Android'}
                </Badge>
              ) : (
                <span className="text-slate-500">—</span>
              )}
            </TableCell>
            <TableCell className="font-mono text-xs text-slate-400">{u.app_version ?? '—'}</TableCell>
            <TableCell className="text-slate-400">{u.country ?? '—'}</TableCell>
            <TableCell>
              {u.subscription === 'premium' ? (
                <Badge className="bg-amber-500/20 text-amber-300">Premium</Badge>
              ) : (
                <Badge variant="outline" className="border-slate-700 text-slate-400">
                  Free
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {u.is_active ? (
                <span className="text-emerald-400">●</span>
              ) : (
                <span className="text-slate-600">●</span>
              )}
            </TableCell>
            <TableCell className="text-xs text-slate-500">
              {u.last_active_at
                ? new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  }).format(new Date(u.last_active_at))
                : '—'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}