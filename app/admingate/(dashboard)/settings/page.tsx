import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from '@/lib/supabase/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/settings-form';
import type { SiteSettings } from '@/lib/supabase/types';

async function loadDefaultLegalText(type: 'privacy' | 'terms', lang: string): Promise<string> {
  const candidates = [
    `${type}.${lang}.md`,
    `${type}.en.md`,
    `${type}.tr.md`,
  ];

  for (const filename of candidates) {
    try {
      const filePath = path.join(process.cwd(), 'content', 'legal', filename);
      const content = await readFile(filePath, 'utf8');
      if (content?.trim()) {
        return content.trim();
      }
    } catch {
      // Try next candidate
    }
  }

  return '';
}

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  if (!user) return null;

  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://journeo.ai';

  // Build merged initial settings: DB values take precedence, otherwise load active default markdown files and URLs
  const initialSettings: SiteSettings = {
    id: data?.id || '',
    app_store_url: data?.app_store_url ?? '',
    play_store_url: data?.play_store_url ?? '',
    support_email: data?.support_email ?? '',
    press_email: data?.press_email ?? '',
    phone: data?.phone ?? '',
    address: data?.address ?? '',
    twitter_url: data?.twitter_url ?? '',
    instagram_url: data?.instagram_url ?? '',
    linkedin_url: data?.linkedin_url ?? '',
    privacy_policy_url: data?.privacy_policy_url || `${siteUrl}/privacy`,
    terms_of_service_url: data?.terms_of_service_url || `${siteUrl}/terms`,
    updated_at: data?.updated_at || new Date().toISOString(),

    // Privacy policy texts (from DB if saved, otherwise load from content/legal/)
    privacy_policy_text_en: data?.privacy_policy_text_en || (await loadDefaultLegalText('privacy', 'en')),
    privacy_policy_text_tr: data?.privacy_policy_text_tr || (await loadDefaultLegalText('privacy', 'tr')),
    privacy_policy_text_es: data?.privacy_policy_text_es || (await loadDefaultLegalText('privacy', 'es')),
    privacy_policy_text_fr: data?.privacy_policy_text_fr || (await loadDefaultLegalText('privacy', 'fr')),
    privacy_policy_text_de: data?.privacy_policy_text_de || (await loadDefaultLegalText('privacy', 'de')),
    privacy_policy_text_ja: data?.privacy_policy_text_ja || (await loadDefaultLegalText('privacy', 'ja')),
    privacy_policy_text_ar: data?.privacy_policy_text_ar || (await loadDefaultLegalText('privacy', 'ar')),
    privacy_policy_text_zh: data?.privacy_policy_text_zh || (await loadDefaultLegalText('privacy', 'zh')),

    // Terms of service texts (from DB if saved, otherwise load from content/legal/)
    terms_of_service_text_en: data?.terms_of_service_text_en || (await loadDefaultLegalText('terms', 'en')),
    terms_of_service_text_tr: data?.terms_of_service_text_tr || (await loadDefaultLegalText('terms', 'tr')),
    terms_of_service_text_es: data?.terms_of_service_text_es || (await loadDefaultLegalText('terms', 'es')),
    terms_of_service_text_fr: data?.terms_of_service_text_fr || (await loadDefaultLegalText('terms', 'fr')),
    terms_of_service_text_de: data?.terms_of_service_text_de || (await loadDefaultLegalText('terms', 'de')),
    terms_of_service_text_ja: data?.terms_of_service_text_ja || (await loadDefaultLegalText('terms', 'ja')),
    terms_of_service_text_ar: data?.terms_of_service_text_ar || (await loadDefaultLegalText('terms', 'ar')),
    terms_of_service_text_zh: data?.terms_of_service_text_zh || (await loadDefaultLegalText('terms', 'zh')),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Site & Platform Ayarları</h2>
        <p className="text-sm text-slate-500 mt-1">
          Web sitesi, yasal metinler, mağaza bağlantıları ve kurumsal iletişim bilgileri.
        </p>
      </div>
      <SettingsForm initial={initialSettings} />
    </div>
  );
}