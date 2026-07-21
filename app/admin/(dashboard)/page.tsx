import Link from 'next/link';
import {
  Users,
  Activity,
  Image as ImageIcon,
  Mail,
  TrendingUp,
  Smartphone,
  Crown,
  ArrowUpRight,
  Inbox,
} from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/admin';
import { getAdminStats } from '@/lib/supabase/stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminStatCard } from '@/components/admin/stat-card';
import { AdminApiChart } from '@/components/admin/api-chart';

export default async function AdminOverviewPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const stats = await getAdminStats();
  const activeRate =
    stats.totalAppUsers > 0
      ? Math.round((stats.activeAppUsers30d / stats.totalAppUsers) * 100)
      : 0;
  const premiumRate =
    stats.totalAppUsers > 0
      ? Math.round((stats.premiumUsers / stats.totalAppUsers) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
        <p className="text-sm text-slate-400">
          Site performance, user growth, and API usage at a glance.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <AdminStatCard
          title="Total App Users"
          value={stats.totalAppUsers}
          subtitle={`${stats.activeAppUsers30d} active (30d)`}
          icon={Users}
          accent="from-blue-500 to-cyan-500"
          trend={activeRate > 0 ? `${activeRate}% active` : undefined}
        />
        <AdminStatCard
          title="Active (7d)"
          value={stats.activeAppUsers7d}
          subtitle={`${stats.activeAppUsers30d} in 30 days`}
          icon={TrendingUp}
          accent="from-emerald-500 to-teal-500"
          trend={stats.totalAppUsers > 0 ? `${Math.round((stats.activeAppUsers7d / stats.totalAppUsers) * 100)}% of total` : undefined}
        />
        <AdminStatCard
          title="Screenshots"
          value={stats.screenshotsCount}
          subtitle="Published in gallery"
          icon={ImageIcon}
          accent="from-amber-500 to-orange-500"
        />
        <AdminStatCard
          title="API Calls Today"
          value={stats.apiCallsToday}
          subtitle={`${stats.apiCalls7d} this week · ${stats.apiErrorRate}% err`}
          icon={Activity}
          accent="from-purple-500 to-pink-500"
          trend={stats.apiCalls30d > 0 ? `${stats.apiCalls30d} / 30d` : undefined}
        />
        <AdminStatCard
          title="Unread Messages"
          value={stats.contactMessagesUnread}
          subtitle={`${stats.contactMessagesTotal} total`}
          icon={Inbox}
          accent="from-rose-500 to-orange-500"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-100">API Calls — Last 14 Days</CardTitle>
            <CardDescription className="text-slate-400">
              Daily request volume across all endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminApiChart data={stats.apiCallsByDay} />
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Platform Split</CardTitle>
            <CardDescription className="text-slate-400">
              Active users by platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.platformBreakdown.map((p) => {
              const total = stats.platformBreakdown.reduce((s, x) => s + x.count, 0) || 1;
              const pct = Math.round((p.count / total) * 100);
              return (
                <div key={p.platform}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      {p.platform}
                    </span>
                    <span className="text-slate-400">
                      {p.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.totalAppUsers === 0 && (
              <p className="text-xs text-slate-500">
                No app users yet. They will appear here once the mobile app starts syncing.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription + quick links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Crown className="h-4 w-4 text-amber-400" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <p className="text-xs text-slate-500">{premiumRate}% premium conversion</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Top Endpoints (7d)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.apiCallsByEndpoint.length === 0 && (
              <p className="text-xs text-slate-500">
                No API activity yet. Endpoints will appear once the app logs requests.
              </p>
            )}
            {stats.apiCallsByEndpoint.map((e) => (
              <div key={e.endpoint} className="flex items-center justify-between text-sm">
                <span className="truncate font-mono text-slate-300">{e.endpoint}</span>
                <span className="ml-2 flex items-center gap-1 text-slate-400">
                  <TrendingUp className="h-3 w-3" />
                  {e.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickLink href="/admin/screenshots" label="Manage screenshots" />
            <QuickLink href="/admin/messages" label="Read messages" badge={stats.contactMessagesUnread} />
            <QuickLink href="/admin/api-usage" label="View API usage" />
            <QuickLink href="/admin/users" label="Browse app users" />
            <QuickLink href="/admin/settings" label="Edit site settings" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ href, label, badge }: { href: string; label: string; badge?: number }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-100"
    >
      {label}
      <span className="flex items-center gap-2">
        {badge ? (
          <Badge className="bg-emerald-500/20 text-emerald-300">{badge}</Badge>
        ) : null}
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </Link>
  );
}