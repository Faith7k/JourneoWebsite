import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function resolveLegalUrl(url: string | undefined | null, defaultPath: string): string {
  if (!url || !url.trim()) return defaultPath;
  const trimmed = url.trim();
  if (trimmed.startsWith('/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const internalHosts = ['journeo.app', 'journeo.ai', 'localhost', '127.0.0.1'];
    if (internalHosts.some((host) => parsed.hostname.includes(host))) {
      return parsed.pathname || defaultPath;
    }
    return trimmed;
  } catch {
    return defaultPath;
  }
}

export function Footer({
  privacyPolicyUrl,
  termsOfServiceUrl,
}: {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}) {
  const t = useTranslations('footer');
  
  const footerLinks = {
    product: {
      name: t('product'),
      items: [
        { label: t('features'), href: '/features' },
        { label: t('pricing'), href: '/pricing' },
        { label: t('screenshots'), href: '/screenshots' },
      ]
    },
    legal: {
      name: t('legal'),
      items: [
        { label: t('privacy'), href: resolveLegalUrl(privacyPolicyUrl, '/privacy') },
        { label: t('terms'), href: resolveLegalUrl(termsOfServiceUrl, '/terms') },
        { label: t('eula'), href: '/eula' },
      ]
    },
    support: {
      name: t('support'),
      items: [
        { label: t('supportCenter'), href: '/support' },
        { label: t('dataDeletion'), href: '/support/data-deletion' },
        { label: t('contact'), href: '/contact' },
      ]
    },
  };

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="mb-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Journeo Logo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition-transform object-cover"
            />
            <span className="text-2xl font-bold text-gradient">
              Journeo
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {Object.values(footerLinks).map((section) => (
            <div key={section.name}>
              <h3 className="mb-4 text-sm font-semibold">{section.name}</h3>
              <ul className="space-y-3">
                {section.items.map((link) => {
                  const isExternal = link.href.startsWith('http://') || link.href.startsWith('https://');
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}

