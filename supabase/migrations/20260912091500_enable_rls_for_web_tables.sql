-- Migration: 20260912091500_enable_rls_for_web_tables.sql
-- Description: Enable Row Level Security (RLS) and define secure access policies for
--              contact_messages, screenshots, and site_settings tables + screenshots storage bucket.

-- ============================================================================
-- 1. Helper function: is_admin()
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'email') = 'admin@journeo.ai'
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND (role = 'admin' OR email = 'admin@journeo.ai')
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Ensure admin user profile has role = 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@journeo.ai';

-- ============================================================================
-- 2. CONTACT MESSAGES (RLS & Policies)
-- ============================================================================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_insert_public" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_select_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_admin" ON public.contact_messages;

-- Anyone (visitors and signed-in users) can submit a message
CREATE POLICY "contact_messages_insert_public"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0
    AND length(trim(email)) > 0
    AND length(trim(message)) > 0
  );

-- Only admins can read contact messages (regular users & anon CANNOT read any messages)
CREATE POLICY "contact_messages_select_admin"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only admins can update contact messages (e.g., mark as read)
CREATE POLICY "contact_messages_update_admin"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete contact messages
CREATE POLICY "contact_messages_delete_admin"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 3. SCREENSHOTS (RLS & Policies)
-- ============================================================================
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published screenshots are publicly readable" ON public.screenshots;
DROP POLICY IF EXISTS "Admins can manage screenshots" ON public.screenshots;
DROP POLICY IF EXISTS "screenshots_select_public" ON public.screenshots;
DROP POLICY IF EXISTS "screenshots_insert_admin" ON public.screenshots;
DROP POLICY IF EXISTS "screenshots_update_admin" ON public.screenshots;
DROP POLICY IF EXISTS "screenshots_delete_admin" ON public.screenshots;

-- Public can read published screenshots; admins can read all
CREATE POLICY "screenshots_select_public"
  ON public.screenshots
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

-- Only admins can insert new screenshots
CREATE POLICY "screenshots_insert_admin"
  ON public.screenshots
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update screenshots
CREATE POLICY "screenshots_update_admin"
  ON public.screenshots
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete screenshots
CREATE POLICY "screenshots_delete_admin"
  ON public.screenshots
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 4. SITE SETTINGS (RLS & Policies)
-- ============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_insert_admin" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_update_admin" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_delete_admin" ON public.site_settings;

-- Site settings are publicly readable
CREATE POLICY "site_settings_select_public"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can insert site settings
CREATE POLICY "site_settings_insert_admin"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update site settings
CREATE POLICY "site_settings_update_admin"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete site settings
CREATE POLICY "site_settings_delete_admin"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 5. STORAGE BUCKET & POLICIES (screenshots)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'screenshots',
  'screenshots',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop the original policy names from 0001_init.sql as well as this
-- migration's own names, so re-running it stays idempotent and no stale
-- duplicate policies are left behind on storage.objects.
DROP POLICY IF EXISTS "Public can read screenshots bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access for screenshots" ON storage.objects;
CREATE POLICY "Allow public read access for screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'screenshots');

DROP POLICY IF EXISTS "Admins can upload to screenshots bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to upload screenshots" ON storage.objects;
CREATE POLICY "Allow admin to upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'screenshots' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update screenshots bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to update screenshots" ON storage.objects;
CREATE POLICY "Allow admin to update screenshots"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'screenshots' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete from screenshots bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to delete screenshots" ON storage.objects;
CREATE POLICY "Allow admin to delete screenshots"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'screenshots' AND public.is_admin());
