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
    title: locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Service',
    description: locale === 'tr' ? 'Journeo kullanım koşulları' : 'Journeo terms of service',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    path: '/terms',
  });
}

async function loadMarkdown(locale: string): Promise<string | null> {
  const candidates =
    locale === 'tr' ? ['terms.tr.md', 'terms.en.md'] : ['terms.en.md'];
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });

  let dbContent: string | null = null;
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('terms_of_service_text_tr, terms_of_service_text_en')
      .limit(1)
      .single();

    if (settings) {
      dbContent =
        locale === 'tr'
          ? settings.terms_of_service_text_tr?.trim() || null
          : settings.terms_of_service_text_en?.trim() || null;
    }
  } catch (err) {
    console.error('Failed to fetch terms of service from DB:', err);
  }

  if (dbContent) {
    return (
      <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
        <LegalMarkdown source={dbContent} />
      </LegalLayout>
    );
  }

  const md = await loadMarkdown(locale);
  if (md) {
    return (
      <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
        {locale === 'tr' && !md.includes('Kullanım Koşulları') ? (
          <p className="text-sm text-slate-400 mb-4">
            Bu sayfanın yasal metni şu an İngilizce sunulmaktadır. Türkçe çeviri
            yakında eklenecektir.
          </p>
        ) : null}
        <LegalMarkdown source={md} />
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <p>{t('intro')}</p>
    </LegalLayout>
  );
}
