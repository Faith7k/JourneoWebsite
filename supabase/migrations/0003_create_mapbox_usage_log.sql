-- Migration: Create mapbox_usage_log table for tracking Mapbox requests
CREATE TABLE IF NOT EXISTS public.mapbox_usage_log (
    id BIGSERIAL PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL DEFAULT 'geocoding',
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    called_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mapbox_usage_log_called_at ON public.mapbox_usage_log(called_at);

ALTER TABLE public.mapbox_usage_log ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.mapbox_usage_log TO postgres, service_role;
