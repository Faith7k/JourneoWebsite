import { generateMetadata as genMeta } from '@/lib/seo';
import { ProseWrapper } from '@/components/prose-wrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Service',
    description: params.locale === 'tr'
      ? 'Journeo kullanım koşulları'
      : 'Journeo terms of service',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const Content = (await import(`@/content/${params.locale}/terms.mdx`)).default;

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
