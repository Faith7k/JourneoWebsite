ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS privacy_policy_text_es TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_text_fr TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_text_de TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_text_ja TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_text_ar TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_text_zh TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_es TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_fr TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_de TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_ja TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_ar TEXT,
  ADD COLUMN IF NOT EXISTS terms_of_service_text_zh TEXT;
