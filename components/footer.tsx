import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
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
    company: {
      name: t('company'),
      items: [
        { label: t('contact'), href: '/contact' },
        { label: t('pressKit'), href: '/press-kit' },
        { label: t('changelog'), href: '/changelog' },
      ]
    },
    legal: {
      name: t('legal'),
      items: [
        { label: t('privacy'), href: '/privacy' },
        { label: t('terms'), href: '/terms' },
        { label: t('eula'), href: '/eula' },
      ]
    },
    support: {
      name: t('support'),
      items: [
        { label: t('supportCenter'), href: '/support' },
        { label: t('dataDeletion'), href: '/support/data-deletion' },
      ]
    },
  };

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.values(footerLinks).map((section) => (
            <div key={section.name}>
              <h3 className="mb-4 text-sm font-semibold">{section.name}</h3>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
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

