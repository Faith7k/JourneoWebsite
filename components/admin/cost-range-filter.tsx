'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { COST_RANGES, type CostRange } from '@/lib/costs';
import { cn } from '@/lib/utils';

/**
 * Range switcher. Writes to the URL rather than local state so the server
 * component re-queries — the numbers are computed in Postgres, not here.
 */
export function AdminCostRangeFilter({ active }: { active: CostRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const select = (range: CostRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', range);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  };

  return (
    <div
      className={cn(
        'inline-flex rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs',
        isPending && 'opacity-60'
      )}
    >
      {COST_RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => select(range.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
            active === range.value
              ? 'bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200/60'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
