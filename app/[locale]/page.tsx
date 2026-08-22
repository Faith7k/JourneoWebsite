import { createClient } from '@/lib/supabase/server';
import { HomePageClient } from './home-client';
import type { StoryScreen } from '@/components/scroll-story';

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: screenshots }] = await Promise.all([
    supabase
      .from('site_settings')
      .select('app_store_url, play_store_url')
      .limit(1)
      .single(),
    supabase
      .from('screenshots')
      .select('id, title, description, image_url, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ]);

  const storyScreens: StoryScreen[] = (screenshots ?? [])
    .filter((s) => Boolean(s.image_url) && Boolean(s.title))
    .map((s) => ({
      id: String(s.id),
      title: s.title as string,
      description: (s.description as string | null) ?? null,
      imageUrl: s.image_url as string,
    }));

  return (
    <HomePageClient
      appStoreUrl={settings?.app_store_url ?? undefined}
      playStoreUrl={settings?.play_store_url ?? undefined}
      storyScreens={storyScreens}
    />
  );
}
