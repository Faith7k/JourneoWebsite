import { generateMetadata as genMeta } from '@/lib/seo';
import { ProseWrapper } from '@/components/prose-wrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Son Kullanıcı Lisans Sözleşmesi' : 'End User License Agreement',
    description: params.locale === 'tr'
      ? 'Journeo EULA'
      : 'Journeo EULA',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default async function EulaPage({ params }: { params: { locale: string } }) {
  const Content = (await import(`@/content/${params.locale}/eula.mdx`)).default;

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
