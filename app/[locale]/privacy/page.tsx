import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { generateMetadata as genMeta } from '@/lib/seo';
import { LegalLayout } from '@/components/legal-layout';
import { LegalMarkdown } from '@/components/legal-markdown';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return genMeta({
    title: t('title'),
    description: t('intro'),
    locale: locale === 'tr' ? 'tr_TR' : `${locale}_${locale.toUpperCase()}`,
    path: '/privacy',
  });
}

async function loadMarkdown(locale: string): Promise<string | null> {
  const candidates = [
    `privacy.${locale}.md`,
    'privacy.en.md',
    'privacy.tr.md',
  ];
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
