import { createAdminClient, fetchAllRows, listAllAuthUsers } from './server';
import { getCostSummary, LLM_ROW_FILTER } from './costs';

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

export type TripDestinationStat = {
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  totalTrips: number;
  tripsThisMonth: number;
  tripsLast3Months: number;
  cities: string[];
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
  tripDestinationStats: TripDestinationStat[];
  aiCallsToday: number;
  aiCalls7d: number;
  aiCalls30d: number;
  aiByKind: { kind: string; count: number }[];
  googlePlacesCallsMonth: number;
  cachedPlacesCount: number;
  cachedAiPlansCount: number;
  /** Geocoding + Directions rows this calendar month (dashboard counter). */
  mapboxCallsMonth: number;
  /** Split out because each Mapbox API has its own 100k/month free tier. */
  mapboxGeocodingCallsMonth: number;
  mapboxDirectionsCallsMonth: number;
  /** Backend's GOOGLE_PLACES_MONTHLY_BUDGET, mirrored via env (default 2000). */
  googlePlacesMonthlyBudget: number;
  affiliateClicksTotal: number;
  affiliateConvertedTotal: number;
  affiliateCommissionTotal: number;
  /** Last 30 days — the only affiliate figure that belongs in monthly revenue. */
  affiliateCommission30d: number;
  /** Active (non-refunded) Trip Pass sales in the last 30 days. */
  tripPassSales30d: number;
  tripPassRevenue30d: number;
  /** Monthly price per paying subscriber (annualPrice / 12). */
  monthlyPricePerSubscriber: number;
  estimatedTotalApiCost: number;
  costPerTrip: number;
  /** Measured by cost_summary(): plan-cache hits × cold avg + POI cache hits × Text Search price. */
  cacheSavingsUsd30d: number;
  /** Events cost_summary() could not price in the last 30 days (>0 = bill understated). */
  unpricedEvents30d: number;
  placesCacheHits30d: number;
  placesPaidCalls30d: number;
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
  'Amerika Birleşik Devletleri': { code: 'US', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
  USA: { code: 'US', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
  US: { code: 'US', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
  Germany: { code: 'DE', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
  Almanya: { code: 'DE', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { code: 'GB', flag: '🇬🇧', lat: 55.3781, lng: -3.436 },
  'Birleşik Krallık': { code: 'GB', flag: '🇬🇧', lat: 55.3781, lng: -3.436 },
  UK: { code: 'GB', flag: '🇬🇧', lat: 55.3781, lng: -3.436 },
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
  'South Korea': { code: 'KR', flag: '🇰🇷', lat: 35.9078, lng: 127.7669 },
  'Güney Kore': { code: 'KR', flag: '🇰🇷', lat: 35.9078, lng: 127.7669 },
};

function normalizeCountryName(raw: string): string {
  const trimmed = raw.trim();
  if (['Türkiye', 'Turkey', 'TR'].includes(trimmed)) return 'Türkiye';
  if (['United States', 'USA', 'US', 'Amerika Birleşik Devletleri'].includes(trimmed)) return 'Amerika Birleşik Devletleri';
  if (['United Kingdom', 'UK', 'GB', 'Birleşik Krallık'].includes(trimmed)) return 'Birleşik Krallık';
  if (['Germany', 'Almanya', 'DE'].includes(trimmed)) return 'Almanya';
  if (['France', 'Fransa', 'FR'].includes(trimmed)) return 'Fransa';
  if (['Italy', 'İtalya', 'IT'].includes(trimmed)) return 'İtalya';
  if (['Spain', 'İspanya', 'ES'].includes(trimmed)) return 'İspanya';
  if (['Japan', 'Japonya', 'JP'].includes(trimmed)) return 'Japonya';
  if (['Portugal', 'Portekiz', 'PT'].includes(trimmed)) return 'Portekiz';
  if (['Netherlands', 'Hollanda', 'NL'].includes(trimmed)) return 'Hollanda';
  if (['Mısır', 'Egypt', 'EG'].includes(trimmed)) return 'Mısır';
  if (['Avusturya', 'Austria', 'AT'].includes(trimmed)) return 'Avusturya';
  if (['South Korea', 'Güney Kore', 'KR', 'Korea'].includes(trimmed)) return 'Güney Kore';
  return trimmed;
}

/**
 * Best-effort classification of a user's country for admin analytics.
 *
 * Store review / QA tester accounts (Google Play & App Store reviewers) are
 * reclassified as US so they don't skew the "real" country breakdown. Everyone
 * else defaults to Türkiye, which is intentionally the safe fallback: an
 * Apple private-relay email only flips to US when the profile *positively*
 * confirms a non-Turkish timezone/currency/locale, never on missing data.
 */
export function resolveUserCountry(params: {
  email?: string | null;
  timezone?: string | null;
  currency?: string | null;
  locale?: string | null;
}): { country: string; flag: string; countryCode: string } {
  const email = (params.email || '').toLowerCase();
  const tz = params.timezone || '';
  const currency = params.currency || '';
  const locale = params.locale || '';

  const isKnownReviewerEmail =
    email.includes('playreview') ||
    email.includes('playconsole') ||
    email.includes('googletester') ||
    email.includes('conarhenry') ||
    email.includes('mikeshaun');

  const isAppleReviewCandidate =
    email.includes('appreview') || email.endsWith('@privaterelay.appleid.com');

  let country = 'Türkiye';

  if (isKnownReviewerEmail) {
    country = 'Amerika Birleşik Devletleri';
  } else if (
    isAppleReviewCandidate &&
    tz !== '' &&
    tz !== '+03:00' &&
    currency !== '' &&
    currency !== 'TRY' &&
    locale !== '' &&
    locale !== 'tr'
  ) {
    // Only flip to US once the profile *positively* confirms a non-Turkish
    // timezone/currency/locale — missing profile data must never do it.
    country = 'Amerika Birleşik Devletleri';
  }

  const meta = countryDict[country] ?? {
    code: 'TR',
    flag: '🇹🇷',
    lat: 38.9637,
    lng: 35.2433,
  };

  return { country, flag: meta.flag, countryCode: meta.code };
}

/**
 * Mirror of the backend's GOOGLE_PLACES_MONTHLY_BUDGET (Journeo-App
 * config.py, default 2000). The budget gate lives in the backend; this only
 * draws the bar. Set GOOGLE_PLACES_MONTHLY_BUDGET in the web env whenever the
 * backend value changes, or the gauge lies.
 */
const googlePlacesMonthlyBudget = (() => {
  const raw = Number(process.env.GOOGLE_PLACES_MONTHLY_BUDGET);
  return Number.isFinite(raw) && raw > 0 ? raw : 2000;
})();

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createAdminClient();

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const startOf7d = new Date(Date.now() - 7 * 86400_000).toISOString();
  const startOf30d = new Date(Date.now() - 30 * 86400_000).toISOString();
  const startOf30dTime = Date.now() - 30 * 86400_000;
  const startOf7dTime = Date.now() - 7 * 86400_000;
  const startOfMonthTime = new Date(new Date().setDate(1)).getTime();
  const startOf3MonthsAgoTime = Date.now() - 90 * 86400_000;
  // Provider usage logs are metered per calendar month (Google Places budget,
  // Mapbox free tiers), so those windows start at the 1st, not 30 days ago.
  const startOfMonth = new Date(startOfMonthTime).toISOString();

  // 1. Parallel fetch from all authentic database tables.
  // Row-returning queries go through fetchAllRows — see its docstring.
  const [
    authUsersList,
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
    mapboxGeocodingRes,
    mapboxDirectionsRes,
    affiliateClicksRes,
    sharedTripsRes,
    meetupsRes,
    notifRes,
    weatherCacheRes,
  ] = await Promise.all([
    listAllAuthUsers(supabase),
    fetchAllRows<any>(() => supabase.from('profiles').select('*'), 'id'),
    fetchAllRows<any>(() => supabase.from('user_subscriptions').select('*'), 'user_id'),
    fetchAllRows<any>(() => supabase.from('trip_pass_credits').select('*'), 'id'),
    fetchAllRows<any>(() => supabase.from('fcm_tokens').select('*'), 'id'),
    fetchAllRows<any>(
      () =>
        supabase
          .from('trips')
          .select('id, owner_id, destination_country, destination_city, city_lat, city_lng, created_at, ai_generated_at, is_deleted'),
      'id'
    ),
    fetchAllRows<any>(() => supabase.from('trip_expenses').select('id, amount, is_deleted'), 'id'),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOf7d),
    supabase.from('api_usage').select('*', { count: 'exact', head: true }).gte('created_at', startOf30d),
    fetchAllRows<{ status_code: number; duration_ms: number | null; platform: string | null; app_version: string | null }>(
      () =>
        supabase
          .from('api_usage')
          .select('id, status_code, duration_ms, platform, app_version')
          .gte('created_at', startOf7d),
      'id'
    ),
    supabase.from('screenshots').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    // LLM rows only — see LLM_ROW_FILTER. Without it every friend request
    // and profile search shows up as a "Gemini call".
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday).or(LLM_ROW_FILTER),
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOf7d).or(LLM_ROW_FILTER),
    supabase.from('ai_generation_log').select('*', { count: 'exact', head: true }).gte('created_at', startOf30d).or(LLM_ROW_FILTER),
    fetchAllRows<any>(
      () =>
        supabase
          .from('ai_generation_log')
          .select('id, user_id, kind, cache_hit, places_cache_hits, places_paid_calls')
          .gte('created_at', startOf30d)
          .or(LLM_ROW_FILTER),
      'id'
    ),
    supabase.from('google_places_usage_log').select('*', { count: 'exact', head: true }).gte('called_at', startOfMonth),
    supabase.from('global_places_cache').select('*', { count: 'exact', head: true }),
    supabase.from('ai_plan_cache').select('*', { count: 'exact', head: true }),
    // Geocoding and Directions have separate 100k/month free tiers, so they
    // are metered separately — a combined count against one quota is wrong.
    supabase.from('mapbox_usage_log').select('*', { count: 'exact', head: true }).gte('called_at', startOfMonth).eq('service_type', 'geocoding'),
    supabase.from('mapbox_usage_log').select('*', { count: 'exact', head: true }).gte('called_at', startOfMonth).eq('service_type', 'directions'),
    fetchAllRows<{ clicked_at: string; converted: boolean | null; commission_amount: number | null }>(
      () => supabase.from('affiliate_clicks').select('id, clicked_at, converted, commission_amount'),
      'id'
    ),
    supabase.from('trip_share_log').select('*', { count: 'exact', head: true }),
    supabase.from('trip_meetups').select('*', { count: 'exact', head: true }),
    supabase.from('notification_log').select('*', { count: 'exact', head: true }),
    supabase.from('weather_cache').select('*', { count: 'exact', head: true }),
  ]);

  // Build lookup maps
  const authUsers = authUsersList;
  const profiles = profilesRes.data ?? [];
  const subscriptions = subscriptionsRes.data ?? [];
  const tripPassCredits = tripPassesRes.data ?? [];
  const fcmTokens = fcmTokensRes.data ?? [];
  const trips = (tripsRes.data ?? []).filter((t: any) => !t.is_deleted);
  const expenses = (expensesRes.data ?? []).filter((e: any) => !e.is_deleted);

  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

  // Entitlement vs. revenue are different questions.
  // `subscription_status` is active | expired | in_grace | refunded — there is
  // no 'trial' status. A trial is `status='active', period_type='trial'`
  // (RevenueCat webhook), so it is *entitled* but pays nothing; counting it
  // as a paying subscriber inflates MRR by $4.17 per trial.
  // period_type: normal | intro (discounted, still paid) | trial | promotional
  // (granted by us for free) | NULL (pre-trial rows → treat as normal, never
  // downgrade a payer over a missing field).
  const FREE_PERIOD_TYPES = new Set(['trial', 'promotional']);
  const isEntitledSub = (s: any) => s.status === 'active' || s.status === 'in_grace';
  const isPayingSub = (s: any) => s.status === 'active' && !FREE_PERIOD_TYPES.has(s.period_type);

  const subMap = new Map(subscriptions.filter(isEntitledSub).map((s: any) => [s.user_id, s]));

  // A refund flips is_active to false (audit trail kept) — not revenue.
  const activeTripPasses = tripPassCredits.filter((p: any) => p.is_active !== false);
  const tripPassHolders = new Set(activeTripPasses.map((p: any) => p.user_id));
  const tripPassCreditsCount = activeTripPasses.length;
  const tripPassHoldersCount = tripPassHolders.size;
  // Only this month's sales belong in a monthly revenue figure; the lifetime
  // count above is a sales counter, not income.
  const tripPassSales30d = activeTripPasses.filter(
    (p: any) => new Date(p.purchased_at ?? p.created_at).getTime() >= startOf30dTime
  ).length;

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

  const annualSubscribers = subscriptions.filter(isPayingSub).length;
  const trialUsers = subscriptions.filter(
    (s: any) => s.status === 'active' && s.period_type === 'trial'
  ).length;

  // Distinct users with any paid entitlement — someone who bought a Trip Pass
  // and later subscribed is one premium user, not two.
  const premiumUserIds = new Set<string>([...subMap.keys(), ...tripPassHolders]);
  const premiumUsers = premiumUserIds.size;
  const freeUsers = Math.max(0, totalAppUsers - premiumUsers);

  // ⚠️ USD list prices. Turkish subscribers pay ₺699/yr (~$17) but the
  // webhook does not store price/currency, so every subscriber is valued at
  // the US price — an upper bound until the webhook records what was paid.
  const annualPrice = 49.99; // $49.99 / year
  const tripPassPrice = 7.99; // $7.99 / one-time pass
  const monthlyPricePerSubscriber = annualPrice / 12;

  // 14-day API call series for the chart.
  // Day keys are UTC on purpose: rows are bucketed by `created_at.slice(0, 10)`
  // (a UTC date), so the slots must be UTC too. Local-midnight slots on a
  // TZ≠UTC host shift every label a day and drop today's rows entirely.
  const todayUtc = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  );
  const since14d = new Date(todayUtc - 13 * 86400_000);
  const { data: apiSeries } = await fetchAllRows<{ id: string; created_at: string; endpoint: string }>(
    () =>
      supabase
        .from('api_usage')
        .select('id, created_at, endpoint')
        .gte('created_at', since14d.toISOString()),
    'id'
  );

  const byDay: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    byDay[new Date(todayUtc - (13 - i) * 86400_000).toISOString().slice(0, 10)] = 0;
  }
  apiSeries.forEach((row) => {
    const key = row.created_at.slice(0, 10);
    if (key in byDay) byDay[key] += 1;
  });
  const apiCallsByDay = Object.entries(byDay).map(([date, count]) => ({ date, count }));

  // Top endpoints (14d) — same rows as the chart, one query instead of two.
  const endpointCounts: Record<string, number> = {};
  apiSeries.forEach((row) => {
    endpointCounts[row.endpoint] = (endpointCounts[row.endpoint] ?? 0) + 1;
  });
  const apiCallsByEndpoint = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count);

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

  // Affiliate conversions & commission sum. Lifetime totals are counters;
  // only the last 30 days go into the monthly revenue figure below.
  let affiliateClicksTotal = 0;
  let affiliateConvertedTotal = 0;
  let affiliateCommissionTotal = 0;
  let affiliateCommission30d = 0;
  affiliateClicksRes.data.forEach((row) => {
    affiliateClicksTotal += 1;
    if (row.converted) affiliateConvertedTotal += 1;
    if (row.commission_amount) {
      const amount = Number(row.commission_amount);
      affiliateCommissionTotal += amount;
      if (new Date(row.clicked_at).getTime() >= startOf30dTime) affiliateCommission30d += amount;
    }
  });

  // Cost summary from cost engine. Every figure below is a 30-day window so
  // that revenue and cost are subtracted over the SAME period — mixing a
  // lifetime Trip Pass total with a 30-day API bill made "net profit" drift
  // upward forever.
  const costs = await getCostSummary('30d');
  const estimatedTotalApiCost = Number((costs?.total_cost_usd ?? 0).toFixed(2));
  const costPerTrip = Number((costs?.average_cost_per_trip ?? 0).toFixed(4));
  const cacheSavingsUsd30d = Number((costs?.cache_savings_usd ?? 0).toFixed(4));
  const unpricedEvents30d = costs?.unpriced_events ?? 0;
  // Breakeven against what a subscriber actually pays per month (annual /
  // 12). There is no $9.99 monthly plan.
  const breakevenTripsPerUser =
    costPerTrip > 0 ? Math.round(monthlyPricePerSubscriber / costPerTrip) : 0;

  // SaaS Financial & Executive Metrics (Annual Plan $49.99/yr, Trip Pass $7.99/pass)
  const mrr = Number((annualSubscribers * monthlyPricePerSubscriber).toFixed(2));
  const arr = Number((annualSubscribers * annualPrice).toFixed(2));
  const tripPassRevenue30d = Number((tripPassSales30d * tripPassPrice).toFixed(2));
  const grossMonthlyRevenue = Number((mrr + tripPassRevenue30d + affiliateCommission30d).toFixed(2));
  const netMonthlyRevenue = Number((grossMonthlyRevenue - estimatedTotalApiCost).toFixed(2));
  const grossMarginPct =
    grossMonthlyRevenue > 0
      ? Math.max(0, Math.round((netMonthlyRevenue / grossMonthlyRevenue) * 100))
      : 0;
  // One number, two cards: the unit-economics and MRR cards used to compute
  // "monthly revenue" independently and disagree on the same page.
  const estimatedMonthlyRevenue = grossMonthlyRevenue;
  const estimatedNetProfit = netMonthlyRevenue;

  // Top Trip Creators & Active AI Users Leaderboard.
  // aiTrips30d = trips this user had AI-generated in the window — the same
  // denominator cost_summary() uses for average_cost_per_trip, so
  // aiTrips30d × costPerTrip is that user's share of the measured bill
  // rather than a made-up per-call constant.
  const userActivityMap = new Map<string, { tripCount: number; aiCount: number; aiTrips30d: number }>();
  trips.forEach((t: any) => {
    if (t.owner_id) {
      const prev = userActivityMap.get(t.owner_id) ?? { tripCount: 0, aiCount: 0, aiTrips30d: 0 };
      const aiInWindow =
        t.ai_generated_at && new Date(t.ai_generated_at).getTime() >= startOf30dTime ? 1 : 0;
      userActivityMap.set(t.owner_id, {
        ...prev,
        tripCount: prev.tripCount + 1,
        aiTrips30d: prev.aiTrips30d + aiInWindow,
      });
    }
  });

  (aiRowsRes.data ?? []).forEach((row: any) => {
    if (row.user_id) {
      const prev = userActivityMap.get(row.user_id) ?? { tripCount: 0, aiCount: 0, aiTrips30d: 0 };
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
    const isPremium = premiumUserIds.has(userId);

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
      estimatedCost: Number((act.aiTrips30d * costPerTrip).toFixed(2)),
    });
  });

  // 1. Country statistics of REAL REGISTERED USERS (from authentic user profiles & auth metadata)
  const userCountryStatsMap = new Map<string, CountrySubscriberStat>();

  authUsers.forEach((u) => {
    const prof = profileMap.get(u.id);
    const isPremium = subMap.has(u.id) || tripPassHolders.has(u.id);
    const createdAt = u.created_at ? new Date(u.created_at).getTime() : 0;

    // Resolve user's actual country
    const { country: userCountry } = resolveUserCountry({
      email: u.email,
      timezone: prof?.timezone,
      currency: prof?.preferred_currency,
      locale: prof?.preferred_locale,
    });

    const meta = countryDict[userCountry] ?? {
      code: 'TR',
      flag: '🇹🇷',
      lat: 38.9637,
      lng: 35.2433,
    };

    if (!userCountryStatsMap.has(userCountry)) {
      userCountryStatsMap.set(userCountry, {
        country: userCountry,
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

    const stat = userCountryStatsMap.get(userCountry)!;
    stat.totalSubscribers += 1;
    if (isPremium) stat.premiumSubscribers += 1;
    if (createdAt >= startOfMonthTime) stat.subscribersThisMonth += 1;
    if (createdAt >= startOf3MonthsAgoTime) stat.subscribersLast3Months += 1;
  });

  const countrySubscriberStats = Array.from(userCountryStatsMap.values()).sort(
    (a, b) => b.totalSubscribers - a.totalSubscribers
  );

  const usersByCountry = countrySubscriberStats.map((c) => ({
    country: c.country,
    count: c.totalSubscribers,
  }));

  // 2. Real Trip Destinations Distribution (from authentic user-planned trips)
  const tripDestinationMap = new Map<string, TripDestinationStat>();

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

    if (!tripDestinationMap.has(countryName)) {
      tripDestinationMap.set(countryName, {
        country: countryName,
        countryCode: meta.code,
        flag: meta.flag,
        lat: meta.lat,
        lng: meta.lng,
        totalTrips: 0,
        tripsThisMonth: 0,
        tripsLast3Months: 0,
        cities: [],
      });
    }

    const stat = tripDestinationMap.get(countryName)!;
    stat.totalTrips += 1;
    if (t.destination_city && !stat.cities.includes(t.destination_city)) {
      stat.cities.push(t.destination_city);
    }

    if (t.created_at) {
      const createdTime = new Date(t.created_at).getTime();
      if (createdTime >= startOfMonthTime) stat.tripsThisMonth += 1;
      if (createdTime >= startOf3MonthsAgoTime) stat.tripsLast3Months += 1;
    }
  });

  const tripDestinationStats = Array.from(tripDestinationMap.values()).sort(
    (a, b) => b.totalTrips - a.totalTrips
  );

  const placesMonthCount = placesLogRes.count ?? 0;
  const cachedPlaces = globalPlacesRes.count ?? 0;

  // Real hit ratio: POIs served from global_places_cache vs. POIs that
  // triggered a paid Google call, both measured per generation by the
  // backend (ai_generation_log.places_cache_hits / places_paid_calls).
  // Cache row count ÷ (row count + paid calls) was a stock/flow mix that
  // trended to 100% as the cache grew regardless of actual hit rate.
  let placesCacheHits30d = 0;
  let placesPaidCalls30d = 0;
  (aiRowsRes.data ?? []).forEach((row: any) => {
    placesCacheHits30d += Number(row.places_cache_hits ?? 0);
    placesPaidCalls30d += Number(row.places_paid_calls ?? 0);
  });
  const cacheHitRatioPct =
    placesCacheHits30d + placesPaidCalls30d > 0
      ? Math.round((placesCacheHits30d / (placesCacheHits30d + placesPaidCalls30d)) * 100)
      : 0;

  const sharedTripsCount = sharedTripsRes.count ?? 0;
  const activeMeetupsCount = meetupsRes.count ?? 0;
  const fcmTokensCount = fcmTokens.length;
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
    tripDestinationStats,
    aiCallsToday: aiTodayRes.count ?? 0,
    aiCalls7d: ai7dRes.count ?? 0,
    aiCalls30d: ai30dRes.count ?? 0,
    aiByKind,
    googlePlacesCallsMonth: placesMonthCount,
    cachedPlacesCount: cachedPlaces,
    cachedAiPlansCount: aiPlanCacheRes.count ?? 0,
    mapboxCallsMonth: (mapboxGeocodingRes.count ?? 0) + (mapboxDirectionsRes.count ?? 0),
    mapboxGeocodingCallsMonth: mapboxGeocodingRes.count ?? 0,
    mapboxDirectionsCallsMonth: mapboxDirectionsRes.count ?? 0,
    googlePlacesMonthlyBudget,
    affiliateClicksTotal,
    affiliateConvertedTotal,
    affiliateCommissionTotal,
    affiliateCommission30d: Number(affiliateCommission30d.toFixed(2)),
    tripPassSales30d,
    tripPassRevenue30d,
    monthlyPricePerSubscriber: Number(monthlyPricePerSubscriber.toFixed(2)),
    estimatedTotalApiCost,
    costPerTrip,
    cacheSavingsUsd30d,
    unpricedEvents30d,
    placesCacheHits30d,
    placesPaidCalls30d,
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