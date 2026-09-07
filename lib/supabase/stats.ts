import { createAdminClient } from './server';
import { getCostSummary } from './costs';

export type TopTripCreator = {
  userId: string;
  name: string;
  username: string;
  email: string;
  tripCount: number;
  aiGenerationsCount: number;
  subscription: 'premium' | 'free';
  estimatedCost: number;
};

export type CountrySubscriberStat = {
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  totalSubscribers: number;
  premiumSubscribers: number;
  subscribersThisMonth: number;
  subscribersLast3Months: number;
};

export type MonthlyDownloadStat = {
  month: string;
  shortMonth: string;
  year: number;
  ios: number;
  android: number;
  total: number;
  cumulativeIos: number;
  cumulativeAndroid: number;
  cumulativeTotal: number;
};

export type UserGrowthPoint = {
  date: string;
  count: number;
  cumulative?: number;
  ios?: number;
  android?: number;
};

export type AdminStats = {
  totalAppUsers: number;
  activeAppUsers30d: number;
  activeAppUsers7d: number;
  iosUsers: number;
  androidUsers: number;
  premiumUsers: number;
  annualSubscribers: number;
  tripPassCreditsCount: number;
  tripPassHoldersCount: number;
  trialUsers: number;
  freeUsers: number;
  annualPrice: number;
  tripPassPrice: number;
  apiCallsToday: number;
  apiCalls7d: number;
  apiCalls30d: number;
  screenshotsCount: number;
  contactMessagesTotal: number;
  contactMessagesUnread: number;
  platformBreakdown: { platform: string; count: number }[];
  apiCallsByDay: { date: string; count: number }[];
  apiCallsByEndpoint: { endpoint: string; count: number }[];
  userGrowthByDay: UserGrowthPoint[];
  monthlyDownloads: MonthlyDownloadStat[];
  totalDownloadsCount: number;
  appStoreDownloadsCount: number;
  playStoreDownloadsCount: number;
  apiErrorRate: number; // percentage of 4xx/5xx in last 7d
  avgResponseMs: number | null;
  apiByPlatform: { platform: string; count: number }[];
  appVersions: { version: string; count: number }[];
  usersByCountry: { country: string; count: number }[];
  countrySubscriberStats: CountrySubscriberStat[];
  aiCallsToday: number;
  aiCalls7d: number;
  aiCalls30d: number;
  aiByKind: { kind: string; count: number }[];
  googlePlacesCallsMonth: number;
  cachedPlacesCount: number;
  cachedAiPlansCount: number;
  mapboxCallsMonth: number;
  affiliateClicksTotal: number;
  affiliateConvertedTotal: number;
  affiliateCommissionTotal: number;
  estimatedTotalApiCost: number;
  costPerTrip: number;
  breakevenTripsPerUser: number;
  estimatedMonthlyRevenue: number;
  estimatedNetProfit: number;
  topTripCreators: TopTripCreator[];
  mrr: number;
  arr: number;
  grossMonthlyRevenue: number;
  netMonthlyRevenue: number;
  grossMarginPct: number;
  cacheHitRatioPct: number;
  sharedTripsCount: number;
  activeMeetupsCount: number;
  fcmTokensCount: number;
  notificationsDeliveredCount: number;
  dataExportRequestsCount: number;
  totalTripExpensesLogged: number;
  supportedLocalesCount: number;
  weatherCacheHitCount: number;
};

// Known country coordinates and flag dictionary
const countryDict: Record<string, { code: string; flag: string; lat: number; lng: number }> = {
  Turkey: { code: 'TR', flag: '🇹🇷', lat: 38.9637, lng: 35.2433 },
  Türkiye: { code: 'TR', flag: '🇹🇷', lat: 38.9637, lng: 35.2433 },
  'United States': { code: 'US', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
  Germany: { code: 'DE', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { code: 'GB', flag: '🇬🇧', lat: 55.3781, lng: -3.436 },
  France: { code: 'FR', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
  Fransa: { code: 'FR', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
  Japan: { code: 'JP', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
  Japonya: { code: 'JP', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
  Italy: { code: 'IT', flag: '🇮🇹', lat: 41.8719, lng: 12.5674 },
  İtalya: { code: 'IT', flag: '🇮🇹', lat: 41.8719, lng: 12.5674 },
  Spain: { code: 'ES', flag: '🇪🇸', lat: 40.4637, lng: -3.7492 },
  İspanya: { code: 'ES', flag: '🇪🇸', lat: 40.4637, lng: -3.7492 },
  Portugal: { code: 'PT', flag: '🇵🇹', lat: 39.3999, lng: -8.2245 },
  Portekiz: { code: 'PT', flag: '🇵🇹', lat: 39.3999, lng: -8.2245 },
  Netherlands: { code: 'NL', flag: '🇳🇱', lat: 52.1326, lng: 5.2913 },
  Hollanda: { code: 'NL', flag: '🇳🇱', lat: 52.1326, lng: 5.2913 },
  Canada: { code: 'CA', flag: '🇨🇦', lat: 56.1304, lng: -106.3468 },
  Kanada: { code: 'CA', flag: '🇨🇦', lat: 56.1304, lng: -106.3468 },
  Australia: { code: 'AU', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 },
  Avustralya: { code: 'AU', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 },
  Brazil: { code: 'BR', flag: '🇧🇷', lat: -14.235, lng: -51.9253 },
  Brezilya: { code: 'BR', flag: '🇧🇷', lat: -14.235, lng: -51.9253 },
  'United Arab Emirates': { code: 'AE', flag: '🇦🇪', lat: 23.4241, lng: 53.8478 },
  'Birleşik Arap Emirlikleri': { code: 'AE', flag: '🇦🇪', lat: 23.4241, lng: 53.8478 },
  Greece: { code: 'GR', flag: '🇬🇷', lat: 39.0742, lng: 21.8243 },
  Yunanistan: { code: 'GR', flag: '🇬🇷', lat: 39.0742, lng: 21.8243 },
  Switzerland: { code: 'CH', flag: '🇨🇭', lat: 46.8182, lng: 8.2275 },
  İsviçre: { code: 'CH', flag: '🇨🇭', lat: 46.8182, lng: 8.2275 },
  Austria: { code: 'AT', flag: '🇦🇹', lat: 47.5162, lng: 14.5501 },
  Avusturya: { code: 'AT', flag: '🇦🇹', lat: 47.5162, lng: 14.5501 },
  Egypt: { code: 'EG', flag: '🇪🇬', lat: 26.8206, lng: 30.8025 },
  Mısır: { code: 'EG', flag: '🇪🇬', lat: 27.9158, lng: 34.3299 },
};

function normalizeCountryName(raw: string): string {
  const trimmed = raw.trim();
  if (['Türkiye', 'Turkey', 'TR'].includes(trimmed)) return 'Türkiye';
  if (['United States', 'USA', 'US'].includes(trimmed)) return 'United States';
  if (['United Kingdom', 'UK', 'GB'].includes(trimmed)) return 'United Kingdom';
  if (['Germany', 'Almanya', 'DE'].includes(trimmed)) return 'Germany';
  if (['France', 'Fransa', 'FR'].includes(trimmed)) return 'France';
  if (['Italy', 'İtalya', 'IT'].includes(trimmed)) return 'Italy';
  if (['Spain', 'İspanya', 'ES'].includes(trimmed)) return 'Spain';
  if (['Japan', 'Japonya', 'JP'].includes(trimmed)) return 'Japan';
  if (['Portugal', 'Portekiz', 'PT'].includes(trimmed)) return 'Portugal';
  if (['Netherlands', 'Hollanda', 'NL'].includes(trimmed)) return 'Netherlands';
  if (['Mısır', 'Egypt', 'EG'].includes(trimmed)) return 'Mısır';
  if (['Avusturya', 'Austria', 'AT'].includes(trimmed)) return 'Avusturya';
  return trimmed;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createAdminClient();

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const startOf7d = new Date(Date.now() - 7 * 86400_000).toISOString();
  const startOf30d = new Date(Date.now() - 30 * 86400_000).toISOString();
  const startOf30dTime = Date.now() - 30 * 86400_000;
  const startOf7dTime = Date.now() - 7 * 86400_000;
  const startOfMonthTime = new Date(new Date().setDate(1)).getTime();
  const startOf3MonthsAgoTime = Date.now() - 90 * 86400_000;

  // 1. Parallel fetch from all authentic database tables
  const [
    authUsersRes,
    profilesRes,
    subscriptionsRes,
    tripPassesRes,
    fcmTokensRes,
    tripsRes,
    expensesRes,
    apiTodayRes,
    api7dRes,
    api30dRes,
    apiLogs7dRes,
    screenshotsRes,
    messagesTotalRes,
    messagesUnreadRes,
    aiTodayRes,
    ai7dRes,
    ai30dRes,
    aiRowsRes,
    placesLogRes,
    globalPlacesRes,
    aiPlanCacheRes,
    mapboxLogRes,
    affiliateClicksRes,
    sharedTripsRes,
    meetupsRes,
    notifRes,
    weatherCacheRes,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from('profiles').select('*'),
    supabase.from('user_subscriptions').select('*'),
    supabase.from('trip_pass_credits').select('*'),
    supabase.from('fcm_tokens').select('*'),
    supabase.from('trips').select('id, owner_id, destination_country, destination_city, city_lat, city_lng, created_at, is_deleted'),
    supabase.from('trip_expenses').select('amount, is_deleted'),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOf7d),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOf30d),
    supabase.from('api_usage').select('status_code, duration_ms, platform, app_version').gte('created_at', startOf7d),
    supabase.from('screenshots').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOf7d),
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOf30d),
    supabase.from('ai_generation_log').select('user_id, kind').gte('created_at', startOf30d),
    supabase.from('google_places_usage_log').select('*', { count: 'exact', head: true }).gte('called_at', new Date(new Date().setDate(1)).toISOString()),
    supabase.from('global_places_cache').select('*', { count: 'exact', head: true }),
    supabase.from('ai_plan_cache').select('*', { count: 'exact', head: true }),
    supabase.from('mapbox_usage_log').select('*', { count: 'exact', head: true }).gte('called_at', new Date(new Date().setDate(1)).toISOString()),
    supabase.from('affiliate_clicks').select('converted, commission_amount'),
    supabase.from('trip_share_log').select('*', { count: 'exact', head: true }),
    supabase.from('trip_meetups').select('*', { count: 'exact', head: true }),
    supabase.from('notification_log').select('*', { count: 'exact', head: true }),
    supabase.from('weather_cache').select('*', { count: 'exact', head: true }),
  ]);

  // Build lookup maps
  const authUsers = authUsersRes.data?.users ?? [];
  const profiles = profilesRes.data ?? [];
  const subscriptions = subscriptionsRes.data ?? [];
  const tripPassCredits = tripPassesRes.data ?? [];
  const fcmTokens = fcmTokensRes.data ?? [];
  const trips = (tripsRes.data ?? []).filter((t: any) => !t.is_deleted);
  const expenses = (expensesRes.data ?? []).filter((e: any) => !e.is_deleted);

  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
  const subMap = new Map(
    subscriptions
      .filter((s: any) => s.status === 'active' || s.status === 'trial')
      .map((s: any) => [s.user_id, s])
  );

  const tripPassHolders = new Set(tripPassCredits.map((p: any) => p.user_id));
  const tripPassCreditsCount = tripPassCredits.length;
  const tripPassHoldersCount = tripPassHolders.size;

  // Group FCM tokens and trips by user
  const tokenMap = new Map<string, any[]>();
  fcmTokens.forEach((t: any) => {
    if (!tokenMap.has(t.user_id)) tokenMap.set(t.user_id, []);
    tokenMap.get(t.user_id)!.push(t);
  });

  const tripMap = new Map<string, any[]>();
  trips.forEach((t: any) => {
    if (!tripMap.has(t.owner_id)) tripMap.set(t.owner_id, []);
    tripMap.get(t.owner_id)!.push(t);
  });

  const aiLogMap = new Map<string, number>();
  (aiRowsRes.data ?? []).forEach((row: any) => {
    if (row.user_id) {
      aiLogMap.set(row.user_id, (aiLogMap.get(row.user_id) ?? 0) + 1);
    }
  });

  // Calculate real user metrics
  const totalAppUsers = Math.max(authUsers.length, profiles.length);

  let active30dCount = 0;
  let active7dCount = 0;

  // Track platform distribution per unique registered user
  let iosCount = 0;
  let androidCount = 0;

  authUsers.forEach((u) => {
    const userTokens = (tokenMap.get(u.id) ?? []).filter((t: any) => t.is_active !== false);
    const hasAndroidToken = userTokens.some((t: any) => t.platform === 'android');
    const hasIosToken = userTokens.some((t: any) => t.platform === 'ios');
    const sub = subMap.get(u.id);

    if (hasAndroidToken || sub?.store === 'play_store') {
      androidCount += 1;
    } else if (hasIosToken || sub?.store === 'app_store' || u.app_metadata?.provider === 'apple' || u.email?.endsWith('@privaterelay.appleid.com')) {
      iosCount += 1;
    } else {
      // Default to iOS for mobile app users because app is only live on Apple App Store
      iosCount += 1;
    }
  });

  authUsers.forEach((u) => {
    const lastSeenTime = u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : new Date(u.created_at).getTime();
    if (lastSeenTime >= startOf30dTime) active30dCount += 1;
    if (lastSeenTime >= startOf7dTime) active7dCount += 1;
  });

  const annualSubscribers = subscriptions.filter(
    (s: any) => s.status === 'active' || s.status === 'trial'
  ).length;
  const trialUsers = subscriptions.filter(
    (s: any) => s.status === 'trial' || s.period_type === 'trial'
  ).length;

  const premiumUsers = Math.max(annualSubscribers, annualSubscribers + tripPassHoldersCount);
  const freeUsers = Math.max(0, totalAppUsers - premiumUsers);

  const annualPrice = 49.99; // $49.99 / year
  const tripPassPrice = 7.99; // $7.99 / one-time pass

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
    .gte('created_at', startOf7d);

  const endpointCounts: Record<string, number> = {};
  (endpointRows ?? []).forEach((row: { endpoint: string }) => {
    endpointCounts[row.endpoint] = (endpointCounts[row.endpoint] ?? 0) + 1;
  });
  const apiCallsByEndpoint = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // User growth (30d) based on authentic signup dates
  const daysRange = 30;
  const startOfRangeTime = Date.now() - (daysRange - 1) * 86400_000;
  let runningCumulative = authUsers.filter(
    (u) => new Date(u.created_at).getTime() < startOfRangeTime
  ).length;

  const growthByDayMap: Record<
    string,
    { count: number; ios: number; android: number; cumulative: number }
  > = {};
  for (let i = 0; i < daysRange; i++) {
    const d = new Date(Date.now() - (daysRange - 1 - i) * 86400_000);
    d.setHours(0, 0, 0, 0);
    growthByDayMap[d.toISOString().slice(0, 10)] = { count: 0, ios: 0, android: 0, cumulative: 0 };
  }

  authUsers.forEach((u) => {
    const key = u.created_at.slice(0, 10);
    if (key in growthByDayMap) {
      growthByDayMap[key].count += 1;
      const userTokens = (tokenMap.get(u.id) ?? []).filter((t: any) => t.is_active !== false);
      const isAndroid =
        userTokens.some((t: any) => t.platform === 'android') ||
        subMap.get(u.id)?.store === 'play_store';
      if (isAndroid) {
        growthByDayMap[key].android += 1;
      } else {
        growthByDayMap[key].ios += 1;
      }
    }
  });

  const sortedDays = Object.keys(growthByDayMap).sort();
  const userGrowthByDay: UserGrowthPoint[] = sortedDays.map((date) => {
    const dayData = growthByDayMap[date];
    runningCumulative += dayData.count;
    return {
      date,
      count: dayData.count,
      ios: dayData.ios,
      android: dayData.android,
      cumulative: runningCumulative,
    };
  });

  // API error rate & duration (7d)
  const logs = apiLogs7dRes.data ?? [];
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

  // App version distribution from API logs & profiles
  const versionCounts: Record<string, number> = {};
  logs.forEach((r: { app_version?: string | null }) => {
    if (r.app_version) versionCounts[r.app_version] = (versionCounts[r.app_version] ?? 0) + 1;
  });
  const appVersions = Object.entries(versionCounts)
    .map(([version, count]) => ({ version, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // AI & Provider Usage Logs
  const aiKindCounts: Record<string, number> = {};
  (aiRowsRes.data ?? []).forEach((row: { kind?: string }) => {
    const k = row.kind ?? 'itinerary';
    aiKindCounts[k] = (aiKindCounts[k] ?? 0) + 1;
  });
  const aiByKind = Object.entries(aiKindCounts)
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);

  // Affiliate conversions & commission sum
  let affiliateClicksTotal = 0;
  let affiliateConvertedTotal = 0;
  let affiliateCommissionTotal = 0;
  if (affiliateClicksRes.data) {
    affiliateClicksTotal = affiliateClicksRes.data.length;
    affiliateClicksRes.data.forEach((row: { converted?: boolean; commission_amount?: number | null }) => {
      if (row.converted) affiliateConvertedTotal += 1;
      if (row.commission_amount) affiliateCommissionTotal += Number(row.commission_amount);
    });
  }

  // Cost summary from cost engine
  const costs = await getCostSummary('30d');
  const estimatedTotalApiCost = Number((costs?.total_cost_usd ?? 0).toFixed(2));
  const costPerTrip = Number((costs?.average_cost_per_trip ?? 0).toFixed(4));
  const subscriptionPrice = 9.99; // $9.99 / month premium MRR per member
  const breakevenTripsPerUser =
    costPerTrip > 0 ? Math.round(subscriptionPrice / costPerTrip) : 0;

  const estimatedMonthlyRevenue = Number((annualSubscribers * (annualPrice / 12) + tripPassCreditsCount * tripPassPrice + affiliateCommissionTotal).toFixed(2));
  const estimatedNetProfit = Number((estimatedMonthlyRevenue - estimatedTotalApiCost).toFixed(2));

  // Top Trip Creators & Active AI Users Leaderboard
  const userActivityMap = new Map<string, { tripCount: number; aiCount: number }>();
  trips.forEach((t: any) => {
    if (t.owner_id) {
      const prev = userActivityMap.get(t.owner_id) ?? { tripCount: 0, aiCount: 0 };
      userActivityMap.set(t.owner_id, { ...prev, tripCount: prev.tripCount + 1 });
    }
  });

  (aiRowsRes.data ?? []).forEach((row: any) => {
    if (row.user_id) {
      const prev = userActivityMap.get(row.user_id) ?? { tripCount: 0, aiCount: 0 };
      userActivityMap.set(row.user_id, { ...prev, aiCount: prev.aiCount + 1 });
    }
  });

  const sortedActiveUsers = Array.from(userActivityMap.entries())
    .sort((a, b) => b[1].tripCount * 10 + b[1].aiCount - (a[1].tripCount * 10 + a[1].aiCount))
    .slice(0, 10);

  const topTripCreators: TopTripCreator[] = [];
  sortedActiveUsers.forEach(([userId, act]) => {
    const profile = profileMap.get(userId);
    const authUser = authUsers.find((u) => u.id === userId);
    const isPremium = subMap.has(userId);

    const name =
      profile?.full_name ||
      authUser?.user_metadata?.full_name ||
      authUser?.user_metadata?.name ||
      (authUser?.email ? authUser.email.split('@')[0] : 'Journeo Traveler');

    const username =
      profile?.username ||
      authUser?.user_metadata?.username ||
      (authUser?.email ? `@${authUser.email.split('@')[0]}` : `@user_${userId.slice(0, 6)}`);

    const email = authUser?.email || profile?.email || '—';

    topTripCreators.push({
      userId,
      name,
      username,
      email,
      tripCount: act.tripCount,
      aiGenerationsCount: act.aiCount,
      subscription: isPremium ? 'premium' : 'free',
      estimatedCost: Number((act.tripCount * (costPerTrip || 0.05) + act.aiCount * 0.005).toFixed(2)),
    });
  });

  // Country and 3D Globe statistics from real trips and user profiles
  const countryStatsMap = new Map<string, CountrySubscriberStat>();

  // Aggregate from real trips
  trips.forEach((t: any) => {
    const rawCountry = t.destination_country;
    if (!rawCountry) return;
    const countryName = normalizeCountryName(rawCountry);
    const meta = countryDict[countryName] ?? {
      code: countryName.slice(0, 2).toUpperCase(),
      flag: '📍',
      lat: t.city_lat ?? 41.0,
      lng: t.city_lng ?? 29.0,
    };

    if (!countryStatsMap.has(countryName)) {
      countryStatsMap.set(countryName, {
        country: countryName,
        countryCode: meta.code,
        flag: meta.flag,
        lat: meta.lat,
        lng: meta.lng,
        totalSubscribers: 0,
        premiumSubscribers: 0,
        subscribersThisMonth: 0,
        subscribersLast3Months: 0,
      });
    }

    const stat = countryStatsMap.get(countryName)!;
    stat.totalSubscribers += 1;

    const isOwnerPremium = subMap.has(t.owner_id);
    if (isOwnerPremium) {
      stat.premiumSubscribers += 1;
    }

    if (t.created_at) {
      const createdTime = new Date(t.created_at).getTime();
      if (createdTime >= startOfMonthTime) stat.subscribersThisMonth += 1;
      if (createdTime >= startOf3MonthsAgoTime) stat.subscribersLast3Months += 1;
    }
  });


  const countrySubscriberStats = Array.from(countryStatsMap.values()).sort(
    (a, b) => b.totalSubscribers - a.totalSubscribers
  );

  const usersByCountry = countrySubscriberStats.map((c) => ({
    country: c.country,
    count: c.totalSubscribers,
  }));

  // SaaS Financial & Executive Metrics (Annual Plan $49.99/yr, Trip Pass $7.99/pass)
  const mrr = Number((annualSubscribers * (annualPrice / 12)).toFixed(2));
  const arr = Number((annualSubscribers * annualPrice).toFixed(2));
  const grossMonthlyRevenue = Number(
    (mrr + tripPassCreditsCount * tripPassPrice + affiliateCommissionTotal).toFixed(2)
  );
  const netMonthlyRevenue = Number((grossMonthlyRevenue - estimatedTotalApiCost).toFixed(2));
  const grossMarginPct =
    grossMonthlyRevenue > 0
      ? Math.max(0, Math.round((netMonthlyRevenue / grossMonthlyRevenue) * 100))
      : 100;

  const placesMonthCount = placesLogRes.count ?? 0;
  const cachedPlaces = globalPlacesRes.count ?? 0;
  const cacheHitRatioPct =
    cachedPlaces + placesMonthCount > 0
      ? Math.round((cachedPlaces / (cachedPlaces + placesMonthCount)) * 100)
      : 0;

  const sharedTripsCount = sharedTripsRes.count ?? 0;
  const activeMeetupsCount = meetupsRes.count ?? 0;
  const fcmTokensCount = fcmTokensRes.data?.length ?? fcmTokensRes.count ?? 0;
  const notificationsDeliveredCount = notifRes.count ?? 0;
  const dataExportRequestsCount = 0;

  // Real sum of all logged trip expenses
  const totalTripExpensesLogged = expenses.reduce(
    (sum: number, item: any) => sum + Number(item.amount || 0),
    0
  );
  const supportedLocalesCount = 8; // 8 supported languages
  const weatherCacheHitCount = weatherCacheRes.count ?? 0;

  // Dynamic Monthly User Registrations from authentic auth.users data
  const monthNamesTr = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const shortMonthNamesTr = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];

  // Build rolling monthly timeline slots for the last 6 months up to now
  const now = new Date();
  const monthlyMap: Record<string, { year: number; monthIdx: number; ios: number; android: number }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    monthlyMap[key] = { year: d.getFullYear(), monthIdx: d.getMonth(), ios: 0, android: 0 };
  }

  // Count real users by registration month and platform
  authUsers.forEach((u) => {
    const d = new Date(u.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = { year: d.getFullYear(), monthIdx: d.getMonth(), ios: 0, android: 0 };
    }

    const userTokens = (tokenMap.get(u.id) ?? []).filter((t: any) => t.is_active !== false);
    const isAndroid = userTokens.some((t: any) => t.platform === 'android');
    if (isAndroid) {
      monthlyMap[key].android += 1;
    } else {
      monthlyMap[key].ios += 1;
    }
  });

  const sortedMonthKeys = Object.keys(monthlyMap).sort();
  let runIos = 0;
  let runAndroid = 0;
  let runTotal = 0;

  const monthlyDownloads: MonthlyDownloadStat[] = sortedMonthKeys.map((key) => {
    const item = monthlyMap[key];
    const total = item.ios + item.android;
    runIos += item.ios;
    runAndroid += item.android;
    runTotal += total;

    return {
      month: monthNamesTr[item.monthIdx],
      shortMonth: shortMonthNamesTr[item.monthIdx],
      year: item.year,
      ios: item.ios,
      android: item.android,
      total,
      cumulativeIos: runIos,
      cumulativeAndroid: runAndroid,
      cumulativeTotal: runTotal,
    };
  });

  const totalDownloadsCount = runTotal;
  const appStoreDownloadsCount = runIos;
  const playStoreDownloadsCount = runAndroid;

  return {
    totalAppUsers,
    activeAppUsers30d: active30dCount,
    activeAppUsers7d: active7dCount,
    iosUsers: iosCount,
    androidUsers: androidCount,
    premiumUsers,
    annualSubscribers,
    tripPassCreditsCount,
    tripPassHoldersCount,
    trialUsers,
    freeUsers,
    annualPrice,
    tripPassPrice,
    apiCallsToday: apiTodayRes.count ?? 0,
    apiCalls7d: api7dRes.count ?? 0,
    apiCalls30d: api30dRes.count ?? 0,
    screenshotsCount: screenshotsRes.count ?? 0,
    contactMessagesTotal: messagesTotalRes.count ?? 0,
    contactMessagesUnread: messagesUnreadRes.count ?? 0,
    platformBreakdown: [
      { platform: 'iOS', count: iosCount },
      { platform: 'Android', count: androidCount },
    ],
    apiCallsByDay,
    apiCallsByEndpoint,
    userGrowthByDay,
    monthlyDownloads,
    totalDownloadsCount,
    appStoreDownloadsCount,
    playStoreDownloadsCount,
    apiErrorRate,
    avgResponseMs,
    apiByPlatform,
    appVersions,
    usersByCountry,
    countrySubscriberStats,
    aiCallsToday: aiTodayRes.count ?? 0,
    aiCalls7d: ai7dRes.count ?? 0,
    aiCalls30d: ai30dRes.count ?? 0,
    aiByKind,
    googlePlacesCallsMonth: placesMonthCount,
    cachedPlacesCount: cachedPlaces,
    cachedAiPlansCount: aiPlanCacheRes.count ?? 0,
    mapboxCallsMonth: mapboxLogRes.count ?? 0,
    affiliateClicksTotal,
    affiliateConvertedTotal,
    affiliateCommissionTotal,
    estimatedTotalApiCost,
    costPerTrip,
    breakevenTripsPerUser,
    estimatedMonthlyRevenue,
    estimatedNetProfit,
    topTripCreators,
    mrr,
    arr,
    grossMonthlyRevenue,
    netMonthlyRevenue,
    grossMarginPct,
    cacheHitRatioPct,
    sharedTripsCount,
    activeMeetupsCount,
    fcmTokensCount,
    notificationsDeliveredCount,
    dataExportRequestsCount,
    totalTripExpensesLogged: Math.round(totalTripExpensesLogged),
    supportedLocalesCount,
    weatherCacheHitCount,
  };
}