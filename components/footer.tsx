import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  
  const footerLinks = {
    product: {
      name: t('footer.product'),
      items: [
        { label: t('footer.features'), href: '/features' },
        { label: t('footer.pricing'), href: '/pricing' },
        { label: t('footer.screenshots'), href: '/screenshots' },
      ]
    },
    company: {
      name: t('footer.company'),
      items: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.pressKit'), href: '/press-kit' },
        { label: t('footer.changelog'), href: '/changelog' },
      ]
    },
    legal: {
      name: t('footer.legal'),
      items: [
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.eula'), href: '/eula' },
      ]
    },
    support: {
      name: t('footer.support'),
      items: [
        { label: t('footer.supportCenter'), href: '/support' },
        { label: t('footer.dataDeletion'), href: '/support/data-deletion' },
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
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

