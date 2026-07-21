import { createClient } from '@/lib/supabase/server';
import { Hero } from './hero';

export async function HeroWrapper() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('app_store_url, play_store_url')
    .limit(1)
    .single();

  return (
    <Hero
      appStoreUrl={settings?.app_store_url ?? undefined}
      playStoreUrl={settings?.play_store_url ?? undefined}
    />
  );
}
