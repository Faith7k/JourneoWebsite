import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  let privacyPolicyUrl: string | undefined = undefined;
  let termsOfServiceUrl: string | undefined = undefined;

  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('privacy_policy_url, terms_of_service_url')
      .limit(1)
      .single();

    if (settings) {
      privacyPolicyUrl = settings.privacy_policy_url ?? undefined;
      termsOfServiceUrl = settings.terms_of_service_url ?? undefined;
    }
  } catch (err) {
    console.error('Failed to load site settings in layout:', err);
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer
          privacyPolicyUrl={privacyPolicyUrl}
          termsOfServiceUrl={termsOfServiceUrl}
        />
      </div>
    </NextIntlClientProvider>
  );
}

