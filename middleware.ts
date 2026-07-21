import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales } from './i18n';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Refresh Supabase session on every request (sets auth cookies).
  const supabaseResponse = await updateSession(request);

  // 2) Admin routes are not localized — return after auth check.
  if (pathname.startsWith('/admin')) {
    return supabaseResponse;
  }

  // 3) Apply next-intl for everything else.
  const intlResponse = intlMiddleware(request);

  // Merge cookies from Supabase session update into the intl response
  // so the auth cookies survive the intl redirect.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - `/api`, `/_next`, `/_vercel`
    // - paths containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
