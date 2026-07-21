import { generateMetadata as genMeta } from '@/lib/seo';
import { LegalLayout } from '@/components/legal-layout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return genMeta({
    title: locale === 'tr' ? 'Son Kullanıcı Lisans Sözleşmesi' : 'End User License Agreement',
    description: locale === 'tr' ? 'Journeo EULA' : 'Journeo End User License Agreement',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    path: '/eula',
  });
}

export default async function EulaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'eula' });

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <p>{t('intro')}</p>

      <h2>{t('license.title')}</h2>
      <p>{t('license.body')}</p>

      <h2>{t('permitted.title')}</h2>
      <p>{t('permitted.body')}</p>

      <h2>{t('restrictions.title')}</h2>
      <ul>
        <li>{t('restrictions.modify')}</li>
        <li>{t('restrictions.distribute')}</li>
        <li>{t('restrictions.reverse')}</li>
        <li>{t('restrictions.transfer')}</li>
      </ul>

      <h2>{t('ownership.title')}</h2>
      <p>{t('ownership.body')}</p>

      <h2>{t('termination.title')}</h2>
      <p>{t('termination.body')}</p>

      <h2>{t('warranty.title')}</h2>
      <p>{t('warranty.body')}</p>

      <h2>{t('liability.title')}</h2>
      <p>{t('liability.body')}</p>

      <h2>{t('governing.title')}</h2>
      <p>{t('governing.body')}</p>

      <h2>{t('contact.title')}</h2>
      <p>{t('contact.body')}</p>
    </LegalLayout>
  );
}