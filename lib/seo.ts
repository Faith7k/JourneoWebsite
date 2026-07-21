import { getBaseUrl } from './utils';

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  locale?: string;
  type?: string;
  path?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
}

export function generateMetadata({
  title,
  description,
  canonical,
  locale = 'tr_TR',
  type = 'website',
  path,
  images = [],
}: SEOConfig) {
  const baseUrl = getBaseUrl();
  const url = path ? `${baseUrl}${path}` : canonical || baseUrl;
  const defaultImage = `${baseUrl}/images/og-image.png`;

  return {
    title: `${title} | Journeo`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Journeo`,
      description,
      url,
      siteName: 'Journeo',
      locale,
      type,
      images: images.length > 0 ? images : [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Journeo`,
      description,
      images: images.length > 0 ? images[0].url : defaultImage,
    },
  };
}

export function generateStructuredData(type: string, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

