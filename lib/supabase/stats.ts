import { createAdminClient } from './server';

export type AdminStats = {
  totalAppUsers: number;
  activeAppUsers30d: number;
  activeAppUsers7d: number;
  iosUsers: number;
  androidUsers: number;
  premiumUsers: number;
  freeUsers: number;
  apiCallsToday: number;
  apiCalls7d: number;
  apiCalls30d: number;
  screenshotsCount: number;
  contactMessagesTotal: number;
  contactMessagesUnread: number;
  platformBreakdown: { platform: string; count: number }[];
  apiCallsByDay: { date: string; count: number }[];
  apiCallsByEndpoint: { endpoint: string; count: number }[];
  userGrowthByDay: { date: string; count: number }[];
  apiErrorRate: number; // percentage of 4xx/5xx in last 7d
  avgResponseMs: number | null;
  apiByPlatform: { platform: string; count: number }[];
  appVersions: { version: string; count: number }[];
  usersByCountry: { country: string; count: number }[];
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createAdminClient();

  const [
    appUsers,
    active30d,
    active7d,
    ios,
    android,
    premium,
    free,
    apiToday,
    api7d,
    api30d,
    screenshots,
    messagesTotal,
    messagesUnread,
  ] = await Promise.all([
    supabase.from('app_users').select('*', { count: 'exact', head: true }),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active_at', new Date(Date.now() - 30 * 86400_000).toISOString()),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active_at', new Date(Date.now() - 7 * 86400_000).toISOString()),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .eq('platform', 'ios'),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .eq('platform', 'android'),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription', 'premium'),
    supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription', 'free'),
    supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString()),
    supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 86400_000).toISOString()),
    supabase.from('screenshots').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false),
  ]);

  // 14-day API call series for the chart
  const since14d = new Date(Date.now() - 13 * 86400_000);
  since14d.setHours(0, 0, 0, 0);
  const { data: apiSeries } = await supabase
    .from('api_usage')
    .select('created_at')
    .gte('created_at', since14d.toISOString())
    .order('created_at', { ascending: true });

  const byDay: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.now() - (13 - i) * 86400_000);
    d.setHours(0, 0, 0, 0);
    byDay[d.toISOString().slice(0, 10)] = 0;
  }
  (apiSeries ?? []).forEach((row: { created_at: string }) => {
    const key = row.created_at.slice(0, 10);
    if (key in byDay) byDay[key] += 1;
  });
  const apiCallsByDay = Object.entries(byDay).map(([date, count]) => ({ date, count }));

  // Top endpoints (7d)
  const { data: endpointRows } = await supabase
    .from('api_usage')
    .select('endpoint')
    .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString());

  const endpointCounts: Record<string, number> = {};
  (endpointRows ?? []).forEach((row: { endpoint: string }) => {
    endpointCounts[row.endpoint] = (endpointCounts[row.endpoint] ?? 0) + 1;
  });
  const apiCallsByEndpoint = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const since30d = new Date(Date.now() - 29 * 86400_000);
  since30d.setHours(0, 0, 0, 0);
  const { data: userGrowthRows } = await supabase
    .from('app_users')
    .select('created_at')
    .gte('created_at', since30d.toISOString())
    .order('created_at', { ascending: true });

  const growthByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - (29 - i) * 86400_000);
    d.setHours(0, 0, 0, 0);
    growthByDay[d.toISOString().slice(0, 10)] = 0;
  }
  (userGrowthRows ?? []).forEach((row: { created_at: string }) => {
    const key = row.created_at.slice(0, 10);
    if (key in growthByDay) growthByDay[key] += 1;
  });
  const userGrowthByDay = Object.entries(growthByDay).map(([date, count]) => ({ date, count }));

  // API error rate (7d)
  const { data: apiLogs7d } = await supabase
    .from('api_usage')
    .select('status_code, duration_ms, platform')
    .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString());

  const logs = apiLogs7d ?? [];
  const errorCount = logs.filter((r) => r.status_code >= 400).length;
  const apiErrorRate = logs.length > 0 ? Math.round((errorCount / logs.length) * 100) : 0;

  const durationsMs = logs.map((r) => r.duration_ms).filter((d): d is number => d !== null);
  const avgResponseMs =
    durationsMs.length > 0
      ? Math.round(durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length)
      : null;

  const platformApiCounts: Record<string, number> = {};
  logs.forEach((r) => {
    const p = r.platform ?? 'unknown';
    platformApiCounts[p] = (platformApiCounts[p] ?? 0) + 1;
  });
  const apiByPlatform = Object.entries(platformApiCounts).map(([platform, count]) => ({ platform, count }));

  // App version distribution
  const { data: versionRows } = await supabase
    .from('app_users')
    .select('app_version')
    .not('app_version', 'is', null);

  const versionCounts: Record<string, number> = {};
  (versionRows ?? []).forEach((r: { app_version: string | null }) => {
    if (r.app_version) versionCounts[r.app_version] = (versionCounts[r.app_version] ?? 0) + 1;
  });
  const appVersions = Object.entries(versionCounts)
    .map(([version, count]) => ({ version, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Country breakdown
  const { data: countryRows } = await supabase
    .from('app_users')
    .select('country')
    .not('country', 'is', null);

  const countryCounts: Record<string, number> = {};
  (countryRows ?? []).forEach((r: { country: string | null }) => {
    if (r.country) countryCounts[r.country] = (countryCounts[r.country] ?? 0) + 1;
  });
  const usersByCountry = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalAppUsers: appUsers.count ?? 0,
    activeAppUsers30d: active30d.count ?? 0,
    activeAppUsers7d: active7d.count ?? 0,
    iosUsers: ios.count ?? 0,
    androidUsers: android.count ?? 0,
    premiumUsers: premium.count ?? 0,
    freeUsers: free.count ?? 0,
    apiCallsToday: apiToday.count ?? 0,
    apiCalls7d: api7d.count ?? 0,
    apiCalls30d: api30d.count ?? 0,
    screenshotsCount: screenshots.count ?? 0,
    contactMessagesTotal: messagesTotal.count ?? 0,
    contactMessagesUnread: messagesUnread.count ?? 0,
    platformBreakdown: [
      { platform: 'iOS', count: ios.count ?? 0 },
      { platform: 'Android', count: android.count ?? 0 },
    ],
    apiCallsByDay,
    apiCallsByEndpoint,
    userGrowthByDay,
    apiErrorRate,
    avgResponseMs,
    apiByPlatform,
    appVersions,
    usersByCountry,
  };
}