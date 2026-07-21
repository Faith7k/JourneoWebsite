import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session on every request and forwards
 * the updated cookies to the response.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Admin route protection
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (user.email && !adminEmails.includes(user.email.toLowerCase())) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  // Avoid infinite redirect loop on login page when already signed in
  if (isLoginRoute && user) {
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (user.email && adminEmails.includes(user.email.toLowerCase())) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}
