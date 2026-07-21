-- Journeo schema — tables, RLS policies, storage bucket, and admin seed.
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query).

-- ============================================================================
-- ENUMS
-- ============================================================================
create type user_role as enum ('admin', 'user');
create type platform_type as enum ('ios', 'android', 'web');
create type subscription_type as enum ('free', 'premium');

-- ============================================================================
-- PROFILES (mirrors auth.users; one row per authenticated user)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

-- ============================================================================
-- SCREENSHOTS (admin-managed gallery shown on /screenshots)
-- ============================================================================
create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  alt_text text,
  image_url text not null,
  storage_path text,
  icon text,
  color_theme text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists screenshots_published_sort_idx
  on public.screenshots (is_published, sort_order);

-- ============================================================================
-- CONTACT MESSAGES (from /contact form)
-- ============================================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  locale text,
  user_agent text,
  ip_hash text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- ============================================================================
-- API USAGE (logged by app's API calls — future integration)
-- ============================================================================
create table if not exists public.api_usage (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null,
  method text not null,
  user_id uuid,
  app_version text,
  platform platform_type,
  status_code integer not null,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists api_usage_created_at_idx
  on public.api_usage (created_at desc);
create index if not exists api_usage_endpoint_idx
  on public.api_usage (endpoint);

-- ============================================================================
-- APP USERS (mobile app users — synced from the app, future integration)
-- ============================================================================
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text,
  platform platform_type,
  app_version text,
  locale text,
  country text,
  subscription subscription_type,
  is_active boolean not null default true,
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists app_users_created_at_idx
  on public.app_users (created_at desc);
create index if not exists app_users_platform_idx
  on public.app_users (platform);

-- ============================================================================
-- SITE SETTINGS (single-row table for global site config)
-- ============================================================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  app_store_url text,
  play_store_url text,
  support_email text,
  press_email text,
  phone text,
  address text,
  twitter_url text,
  instagram_url text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);

-- Seed one row of settings
insert into public.site_settings (app_store_url, play_store_url, support_email, press_email, phone, address)
values (
  'https://apps.apple.com/app/journeo',
  'https://play.google.com/store/apps/details?id=com.journeo.app',
  'support@journeo.ai',
  'press@journeo.ai',
  null,
  'Istanbul, Turkey'
)
on conflict do nothing;

-- ============================================================================
-- AUTO-UPDATE updated_at triggers
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists screenshots_updated_at on public.screenshots;
create trigger screenshots_updated_at
  before update on public.screenshots
  for each row execute function public.handle_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.screenshots enable row level security;
alter table public.contact_messages enable row level security;
alter table public.api_usage enable row level security;
alter table public.app_users enable row level security;
alter table public.site_settings enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES: users can read/update their own row; admins can read all
create policy "Profiles are readable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SCREENSHOTS: public can read published; only admins can write
create policy "Published screenshots are publicly readable"
  on public.screenshots for select
  using (is_published = true);

create policy "Admins can manage screenshots"
  on public.screenshots for all
  using (public.is_admin())
  with check (public.is_admin());

-- CONTACT MESSAGES: anyone can insert; only admins can read
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Admins can read contact messages"
  on public.contact_messages for select
  using (public.is_admin());

create policy "Admins can update contact messages"
  on public.contact_messages for update
  using (public.is_admin());

-- API USAGE: anyone with anon key can insert (app logs); only admins read
create policy "Anyone can log API usage"
  on public.api_usage for insert
  with check (true);

create policy "Admins can read API usage"
  on public.api_usage for select
  using (public.is_admin());

-- APP USERS: only admins can read; inserts happen via service role from app
create policy "Admins can read app users"
  on public.app_users for select
  using (public.is_admin());

-- SITE SETTINGS: public can read; only admins can write
create policy "Site settings are publicly readable"
  on public.site_settings for select
  using (true);

create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin());

-- ============================================================================
-- STORAGE BUCKET for screenshots
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do nothing;

-- Public read for screenshots bucket
create policy "Public can read screenshots bucket"
  on storage.objects for select
  using (bucket_id = 'screenshots');

-- Only admins can upload to screenshots bucket
create policy "Admins can upload to screenshots bucket"
  on storage.objects for insert
  with check (bucket_id = 'screenshots' and public.is_admin());

create policy "Admins can update screenshots bucket"
  on storage.objects for update
  using (bucket_id = 'screenshots' and public.is_admin());

create policy "Admins can delete from screenshots bucket"
  on storage.objects for delete
  using (bucket_id = 'screenshots' and public.is_admin());

-- ============================================================================
-- ADMIN USER SEED
-- NOTE: Supabase Auth users cannot be created via SQL directly with a password.
-- After running this migration, create the admin user in:
--   Dashboard > Authentication > Users > Add user
-- Email:    admin@journeo.ai
-- Password: Fy-123456
-- Then run the SQL below (uncomment) to mark the profile as admin:
--
-- update public.profiles set role = 'admin' where email = 'admin@journeo.ai';
-- ============================================================================
