import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
});

/**
 * Service-role client — bypasses RLS. Server-only, never expose to client.
 * Use for admin operations that need to read/write any row regardless of RLS.
 */
export async function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

/**
 * Fetches every user from Supabase Auth, paging past the 1000-per-page
 * cap on `auth.admin.listUsers` so accounts beyond the first page aren't
 * silently dropped as the user base grows.
 */
export async function listAllAuthUsers(
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  const perPage = 1000;
  let page = 1;
  const allUsers: User[] = [];

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error(`listAllAuthUsers: failed to fetch page ${page}, returning ${allUsers.length} users fetched so far`, error);
      break;
    }

    const users = data?.users ?? [];
    allUsers.push(...users);

    if (users.length < perPage) break;
    page += 1;
  }

  return allUsers;
}


/**
 * Reads every row a PostgREST query matches, paging past the 1000-row
 * `max_rows` cap Supabase applies to any SELECT that has no explicit range.
 * Without this, `api_usage`/`ai_generation_log` aggregates silently stop at
 * the oldest 1000 rows the moment a window grows past that — the count
 * queries keep climbing while error rate, platform split and per-user cost
 * quietly freeze.
 *
 * `build` must return a fresh builder each call (PostgREST builders are
 * single-use); `orderBy` gives paging a stable order — pass a unique column.
 */
export async function fetchAllRows<T>(
  build: () => PromiseLike<{ data: T[] | null; error: unknown }> & {
    order: (col: string, opts?: { ascending?: boolean }) => any;
  },
  orderBy: string,
  pageSize = 1000
): Promise<{ data: T[]; error: unknown }> {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await build()
      .order(orderBy, { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) {
      console.error(`fetchAllRows: page at offset ${from} failed`, error);
      return { data: rows, error };
    }
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < pageSize) break;
    from += pageSize;
  }

  return { data: rows, error: null };
}
