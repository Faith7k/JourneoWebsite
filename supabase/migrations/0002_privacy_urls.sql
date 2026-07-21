-- Migration 0002: Add legal URL columns to site_settings
-- Run this in the Supabase SQL Editor or via supabase db push

alter table public.site_settings
  add column if not exists privacy_policy_url text,
  add column if not exists terms_of_service_url text;
