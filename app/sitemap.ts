import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  
  const routes = [
    '',
    '/features',
    // '/pricing',
    '/screenshots',
    '/privacy',
    '/terms',
    '/eula',
    '/support',
    '/support/data-deletion',
    '/contact',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}

