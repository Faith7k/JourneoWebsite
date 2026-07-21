import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminApiChart } from '@/components/admin/api-chart';
import { AdminStatCard } from '@/components/admin/stat-card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertCircle, Clock, Smartphone } from 'lucide-react';

export default async function AdminApiUsagePage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const stats = await getAdminStats();

  const since14d = new Date(Date.now() - 13 * 86400_000);
  since14d.setHours(0, 0, 0, 0);

  const [{ data: recent }, { data: byEndpointRaw }] = await Promise.all([
    supabase
      .from('api_usage')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('api_usage')
      .select('endpoint')
      .gte('created_at', since14d.toISOString()),
  ]);

  const byDay: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.now() - (13 - i) * 86400_000);
    d.setHours(0, 0, 0, 0);
    byDay[d.toISOString().slice(0, 10)] = 0;
  }

  const { data: chartRows } = await supabase
    .from('api_usage')
    .select('created_at')
    .gte('created_at', since14d.toISOString())
    .order('created_at', { ascending: true });
  (chartRows ?? []).forEach((row: { created_at: string }) => {
    const key = row.created_at.slice(0, 10);
    if (key in byDay) byDay[key] += 1;
  });
  const chartData = Object.entries(byDay).map(([date, count]) => ({ date, count }));

  const endpointCounts: Record<string, number> = {};
  (byEndpointRaw ?? []).forEach((row: { endpoint: string }) => {
    endpointCounts[row.endpoint] = (endpointCounts[row.endpoint] ?? 0) + 1;
  });
  const endpoints = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count);

  const totalEndpointCalls = endpoints.reduce((s, e) => s + e.count, 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">API Usage</h2>
        <p className="text-sm text-slate-400">
          Request volume, error rates, and performance from the mobile app.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Calls Today"
          value={stats.apiCallsToday}
          subtitle={`${stats.apiCalls7d} this week`}
          icon={Activity}
          accent="from-blue-500 to-cyan-500"
          trend={`${stats.apiCalls30d} / 30d`}
        />
        <AdminStatCard
          title="Error Rate (7d)"
          value={`${stats.apiErrorRate}%`}
          subtitle="4xx / 5xx responses"
          icon={AlertCircle}
          accent={stats.apiErrorRate > 5 ? 'from-red-500 to-rose-500' : 'from-emerald-500 to-teal-500'}
        />
        <AdminStatCard
          title="Avg Response"
          value={stats.avgResponseMs !== null ? `${stats.avgResponseMs}ms` : '—'}
          subtitle="7-day average"
          icon={Clock}
          accent="from-purple-500 to-pink-500"
        />
        <AdminStatCard
          title="Platforms"
          value={stats.apiByPlatform.length}
          subtitle={stats.apiByPlatform.map((p) => p.platform).join(' · ') || 'No data'}
          icon={Smartphone}
          accent="from-amber-500 to-orange-500"
        />
      </div>

      {/* Chart */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-slate-100">API Calls — Last 14 Days</CardTitle>
          <CardDescription className="text-slate-400">Daily request volume across all endpoints.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminApiChart data={chartData} />
        </CardContent>
      </Card>

      {/* Endpoints + Platform breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Endpoints (14d)</CardTitle>
            <CardDescription className="text-slate-400">
              Call volume per endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {endpoints.length === 0 ? (
              <p className="text-xs text-slate-500">No data yet.</p>
            ) : (
              endpoints.map((e) => {
                const pct = Math.round((e.count / totalEndpointCalls) * 100);
                return (
                  <div key={e.endpoint} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-mono text-slate-300">{e.endpoint}</span>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <span className="text-xs text-slate-500">{pct}%</span>
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                          {e.count}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Platform breakdown */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100">API by Platform (7d)</CardTitle>
            <CardDescription className="text-slate-400">
              Request distribution across iOS, Android, and Web.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.apiByPlatform.length === 0 ? (
              <p className="text-xs text-slate-500">No platform data yet.</p>
            ) : (
              stats.apiByPlatform.map((p) => {
                const total = stats.apiByPlatform.reduce((s, x) => s + x.count, 0) || 1;
                const pct = Math.round((p.count / total) * 100);
                const gradientMap: Record<string, string> = {
                  ios: 'from-blue-500 to-cyan-500',
                  android: 'from-emerald-500 to-teal-500',
                  web: 'from-purple-500 to-pink-500',
                  unknown: 'from-slate-500 to-slate-400',
                };
                return (
                  <div key={p.platform}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-300">{p.platform}</span>
                      <span className="text-slate-400">
                        {p.count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradientMap[p.platform] ?? 'from-slate-500 to-slate-400'}`}
                        style={{ width: `${pct}%` }}
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
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Requests</CardTitle>
          <CardDescription className="text-slate-400">
            Latest 50 API calls, most recent first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Endpoint</TableHead>
                <TableHead className="text-slate-400">Method</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Platform</TableHead>
                <TableHead className="text-slate-400">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(recent ?? []).length === 0 && (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={5} className="text-slate-500">
                    No requests yet.
                  </TableCell>
                </TableRow>
              )}
              {(recent ?? []).map((r) => (
                <TableRow key={r.id} className="border-slate-800">
                  <TableCell className="font-mono text-xs text-slate-300">
                    {r.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-slate-700 font-mono text-xs text-slate-400"
                    >
                      {r.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        r.status_code < 400
                          ? 'border-emerald-700/50 text-emerald-300'
                          : r.status_code < 500
                          ? 'border-amber-700/50 text-amber-300'
                          : 'border-red-800/50 text-red-300'
                      }
                    >
                      {r.status_code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">{r.platform ?? '—'}</TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {r.duration_ms !== null ? `${r.duration_ms}ms` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}