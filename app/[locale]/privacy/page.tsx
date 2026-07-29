import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { generateMetadata as genMeta } from '@/lib/seo';
import { LegalLayout } from '@/components/legal-layout';
import { LegalMarkdown } from '@/components/legal-markdown';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return genMeta({
    title: locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
    description: locale === 'tr'
      ? 'Journeo gizlilik politikası ve veri koruması'
      : 'Journeo privacy policy and data protection',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    path: '/privacy',
  });
}

async function loadMarkdown(locale: string): Promise<string | null> {
  // EN is the legal SSOT (docs/legal → content/legal). TR falls back to EN
  // until a dedicated translation ships — never serve the outdated i18n stub.
  const candidates =
    locale === 'tr'
      ? ['privacy.tr.md', 'privacy.en.md']
      : ['privacy.en.md'];
  for (const name of candidates) {
    try {
      const file = path.join(process.cwd(), 'content', 'legal', name);
      return await readFile(file, 'utf8');
    } catch {
      /* try next */
    }
  }
  return null;
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  // 1. Check CMS override from DB (site_settings)
  let dbContent: string | null = null;
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (settings) {
      dbContent =
        (settings[`privacy_policy_text_${locale}` as keyof typeof settings] as string | undefined)?.trim() ||
        settings.privacy_policy_text_en?.trim() ||
        null;
    }
  } catch (err) {
    console.error('Failed to fetch privacy policy from DB:', err);
  }

  if (dbContent) {
    return (
      <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
        <LegalMarkdown source={dbContent} />
      </LegalLayout>
    );
  }

  // 2. Fall back to repo markdown
  const md = await loadMarkdown(locale);
  if (md) {
    return (
      <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
        {locale === 'tr' && !md.includes('Gizlilik Politikası') ? (
          <p className="text-sm text-slate-400 mb-4">
            Bu sayfanın yasal metni şu an İngilizce sunulmaktadır. Türkçe çeviri
            yakında eklenecektir.
          </p>
        ) : null}
        <LegalMarkdown source={md} />
      </LegalLayout>
    );
  }

  // Last-resort stub — should not ship; content/legal/*.md is required.
  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <p>{t('intro')}</p>
    </LegalLayout>
  );
}
