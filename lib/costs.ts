/**
 * Cost monitoring: shared types, range presets and formatting.
 *
 * Kept separate from `lib/supabase/costs.ts` because that module imports the
 * server-only Supabase client (`next/headers`), which a client component
 * cannot pull in — the range filter is a client component and needs
 * COST_RANGES.
 *
 * No unit prices live here. They belong in the `cost_price_book` table and are
 * applied by `cost_summary()` in SQL; a second copy in TypeScript is exactly
 * how this dashboard drifted to billing Places calls at $0.017 when the SKU we
 * call costs $0.032. See docs/UygulamaMaliyetleri.md §7 in the Journeo-App
 * repo.
 */

export type CostRange = '24h' | '7d' | '30d' | 'mtd';

export const COST_RANGES: { value: CostRange; label: string }[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'mtd', label: 'This month' },
];

export type CostBucket = {
  bucket: string;
  cost_usd: number;
  request_count: number;
};

export type CostSummary = {
  range_start: string;
  range_end: string;
  interval: 'hour' | 'day' | 'month';
  total_cost_usd: number;
  total_requests: number;
  /**
   * Events we could not price — either the SKU is missing from the price book
   * (Gemini Pro today) or the row predates token measurement. They are NOT
   * counted as $0. A non-zero value means this page is understating the bill.
   */
  unpriced_events: number;
  breakdown: CostBucket[];
  by_feature: Record<string, number>;
  by_provider: Record<string, number>;
  ai_trip_count: number;
  average_cost_per_trip: number | null;
  cache_savings_usd: number;
  /**
   * R2 audio storage at this instant. A stock, not a flow — excluded from
   * total_cost_usd on purpose, because adding it would make "we spent X in
   * the last 7 days" false.
   */
  storage_snapshot_usd: number;
};

export type RecentCostEvent = {
  id: string;
  occurred_at: string;
  provider: string;
  feature: string;
  detail: string | null;
};

export function resolveRange(range: CostRange): {
  start: Date;
  end: Date;
  interval: 'hour' | 'day';
} {
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case '24h':
      start.setHours(start.getHours() - 24);
      return { start, end, interval: 'hour' };
    case '7d':
      start.setDate(start.getDate() - 7);
      return { start, end, interval: 'day' };
    case 'mtd':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return { start, end, interval: 'day' };
    case '30d':
    default:
      start.setDate(start.getDate() - 30);
      return { start, end, interval: 'day' };
  }
}

export function parseRange(value: string | undefined): CostRange {
  return COST_RANGES.some((r) => r.value === value)
    ? (value as CostRange)
    : '7d';
}

/**
 * `ai_generation_log` is pruned at 35 days by `prune_operational_logs()`, so
 * anything older than that lives only in `monthly_cost_snapshot`. None of the
 * ranges offered above reach back that far, but the check stays so a future
 * "90 days" option cannot silently render a half-empty chart as if it were
 * the whole truth.
 */
export const RAW_LOG_RETENTION_DAYS = 35;

export function isBeyondRawRetention(start: Date): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RAW_LOG_RETENTION_DAYS);
  return start < cutoff;
}

export function formatUsd(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined) return '—';
  // Sub-cent figures are the norm per trip, so a flat 2 decimals would render
  // most of this dashboard as "$0.00" and hide the number that matters.
  const decimals = value !== 0 && Math.abs(value) < 0.01 ? 5 : digits;
  return `$${value.toFixed(decimals)}`;
}
