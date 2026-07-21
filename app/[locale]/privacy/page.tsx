import { generateMetadata as genMeta } from '@/lib/seo';
import { LegalLayout } from '@/components/legal-layout';
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  let dbContent: string | null = null;
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('privacy_policy_text_tr, privacy_policy_text_en')
      .limit(1)
      .single();

    if (settings) {
      dbContent = locale === 'tr' ? settings.privacy_policy_text_tr : settings.privacy_policy_text_en;
    }
  } catch (err) {
    console.error('Failed to fetch privacy policy from DB:', err);
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

      <h2>{t('informationWeCollect')}</h2>
      <h3>{t('locationInfo.title')}</h3>
      <p>{t('locationInfo.body')}</p>

      <h3>{t('accountInfo.title')}</h3>
      <ul>
        <li>{t('accountInfo.email')}</li>
        <li>{t('accountInfo.name')}</li>
        <li>{t('accountInfo.photo')}</li>
      </ul>

      <h3>{t('usageData.title')}</h3>
      <ul>
        <li>{t('usageData.statistics')}</li>
        <li>{t('usageData.preferences')}</li>
        <li>{t('usageData.history')}</li>
      </ul>

      <h2>{t('howWeUse.title')}</h2>
      <ul>
        <li>{t('howWeUse.functionality')}</li>
        <li>{t('howWeUse.recommendations')}</li>
        <li>{t('howWeUse.experience')}</li>
        <li>{t('howWeUse.support')}</li>
      </ul>

      <h2>{t('dataSecurity.title')}</h2>
      <ul>
        <li>{t('dataSecurity.encrypted')}</li>
        <li>{t('dataSecurity.tls')}</li>
        <li>{t('dataSecurity.audits')}</li>
        <li>{t('dataSecurity.measures')}</li>
      </ul>

      <h2>{t('thirdParty.title')}</h2>
      <p>{t('thirdParty.intro')}</p>
      <ul>
        <li><strong>Supabase:</strong> {t('thirdParty.supabase')}</li>
        <li><strong>Google Maps:</strong> {t('thirdParty.maps')}</li>
        <li><strong>OpenAI:</strong> {t('thirdParty.openai')}</li>
      </ul>
      <p>{t('thirdParty.note')}</p>

      <h2>{t('dataRetention.title')}</h2>
      <ul>
        <li>{t('dataRetention.active')}</li>
        <li>{t('dataRetention.deletion')}</li>
        <li>{t('dataRetention.legal')}</li>
      </ul>

      <h2>{t('yourRights.title')}</h2>
      <p>{t('yourRights.intro')}</p>
      <ul>
        <li>{t('yourRights.access')}</li>
        <li>{t('yourRights.rectification')}</li>
        <li>{t('yourRights.erasure')}</li>
        <li>{t('yourRights.object')}</li>
        <li>{t('yourRights.portability')}</li>
      </ul>

      <h2>{t('children.title')}</h2>
      <p>{t('children.body')}</p>

      <h2>{t('changes.title')}</h2>
      <p>{t('changes.body')}</p>

      <h2>{t('contact.title')}</h2>
      <p>{t('contact.body')}</p>
      <ul>
        <li>{t('contact.email')}</li>
        <li>{t('contact.web')}</li>
      </ul>
    </LegalLayout>
  );
}