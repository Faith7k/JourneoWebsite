import { createAdminClient } from './server';
import { resolveRange, type CostRange, type CostSummary, type RecentCostEvent } from '@/lib/costs';

/**
 * Cost monitoring data access.
 *
 * Every figure here comes from `public.cost_summary()`, which applies unit
 * prices from the `cost_price_book` table to the raw usage logs. Prices are
 * deliberately NOT duplicated in this file: they change, and a second copy in
 * TypeScript is how this dashboard ended up billing every Google Places call
 * at $0.017 when the SKU we actually call costs $0.032.
 *
 * See docs/UygulamaMaliyetleri.md §7 in the Journeo-App repo.
 */

export async function getCostSummary(range: CostRange): Promise<CostSummary | null> {
  const { start, end, interval } = resolveRange(range);
  const supabase = await createAdminClient();

  const { data, error } = await supabase.rpc('cost_summary', {
    p_start: start.toISOString(),
    p_end: end.toISOString(),
    p_interval: interval,
  });

  if (error) {
    console.error('cost_summary failed', error);
    return null;
  }
  return data as CostSummary;
}

/**
 * The most recent billable events, newest first, for the live table.
 *
 * Three separate logs rather than one: they are the same tables the cost
 * report reads, so the table can never disagree with the totals above it.
 */
export async function getRecentCostEvents(limit = 50): Promise<RecentCostEvent[]> {
  const supabase = await createAdminClient();

  const [gemini, places, mapbox] = await Promise.all([
    supabase
      .from('ai_generation_log')
      .select('id, created_at, kind, model, prompt_tokens, output_tokens, cache_hit')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('google_places_usage_log')
      .select('id, called_at, sku, feature')
      .order('called_at', { ascending: false })
      .limit(limit),
    supabase
      .from('mapbox_usage_log')
      .select('id, called_at, service_type')
      .order('called_at', { ascending: false })
      .limit(limit),
  ]);

  const events: RecentCostEvent[] = [
    ...(gemini.data ?? []).map((r) => ({
      id: `gemini-${r.id}`,
      occurred_at: r.created_at as string,
      provider: 'gemini',
      feature: r.kind as string,
      detail: r.cache_hit
        ? 'cache hit — no LLM call'
        : `${r.model ?? 'unknown model'} · ${r.prompt_tokens ?? 0} in / ${
            r.output_tokens ?? 0
          } out`,
    })),
    ...(places.data ?? []).map((r) => ({
      id: `places-${r.id}`,
      occurred_at: r.called_at as string,
      provider: 'google_places',
      feature: (r.feature as string) ?? 'unknown',
      detail: (r.sku as string) ?? 'unknown SKU',
    })),
    ...(mapbox.data ?? []).map((r) => ({
      id: `mapbox-${r.id}`,
      occurred_at: r.called_at as string,
      provider: 'mapbox',
      feature: `map_${r.service_type ?? 'unknown'}`,
      detail: (r.service_type as string) ?? null,
    })),
  ];

  return events
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))
    .slice(0, limit);
}
