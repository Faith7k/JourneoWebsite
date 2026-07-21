import { generateMetadata as genMeta } from '@/lib/seo';
import { LegalLayout } from '@/components/legal-layout';
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
      dbContent = locale === 'tr' ? settings.terms_of_service_text_tr : settings.terms_of_service_text_en;
    }
  } catch (err) {
    console.error('Failed to fetch terms of service from DB:', err);
  }

  if (dbContent) {
    return (
      <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
        <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
          {dbContent}
        </div>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <p>{t('intro')}</p>

      <h2>{t('acceptance.title')}</h2>
      <p>{t('acceptance.body')}</p>

      <h2>{t('license.title')}</h2>
      <p>{t('license.body')}</p>

      <h2>{t('use.title')}</h2>
      <p>{t('use.body')}</p>
      <ul>
        <li>{t('use.legal')}</li>
        <li>{t('use.account')}</li>
        <li>{t('use.responsibility')}</li>
      </ul>

      <h2>{t('payments.title')}</h2>
      <p>{t('payments.body')}</p>

      <h2>{t('termination.title')}</h2>
      <p>{t('termination.body')}</p>

      <h2>{t('disclaimer.title')}</h2>
      <p>{t('disclaimer.body')}</p>

      <h2>{t('liability.title')}</h2>
      <p>{t('liability.body')}</p>

      <h2>{t('changes.title')}</h2>
      <p>{t('changes.body')}</p>

      <h2>{t('contact.title')}</h2>
      <p>{t('contact.body')}</p>
    </LegalLayout>
  );
}