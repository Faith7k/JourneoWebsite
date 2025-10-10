import { generateMetadata as genMeta } from '@/lib/seo';
import { ProseWrapper } from '@/components/prose-wrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
    description: params.locale === 'tr'
      ? 'Journeo gizlilik politikası ve veri koruması'
      : 'Journeo privacy policy and data protection',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  // Import MDX content based on locale
  const Content = (await import(`@/content/${params.locale}/privacy.mdx`)).default;

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        <ProseWrapper>
          <Content />
        </ProseWrapper>
      </div>
    </div>
  );
}
