import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Can be imported from a shared config
export const locales = ['tr', 'en', 'es', 'fr', 'de', 'ja', 'ar', 'zh'];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = 'tr'; // Default to Turkish
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});