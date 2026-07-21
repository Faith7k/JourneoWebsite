import { createClient } from './server';

/**
 * Returns the current Supabase user, or null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns true if the current session's email is in ADMIN_EMAILS.
 * Use this in Server Components / Route Handlers to guard admin-only content.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user?.email) return false;

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(user.email.toLowerCase());
}

/**
 * Returns the current user if they are an admin, otherwise null.
 * Use to gate entire admin pages.
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) return null;
  return await getCurrentUser();
}
