import Link from 'next/link';

export function Footer() {
  const footerLinks = {
    product: {
      name: 'Ürün',
      items: [
        { label: 'Özellikler', href: '/features' },
        { label: 'Fiyatlandırma', href: '/pricing' },
        { label: 'Ekran Görüntüleri', href: '/screenshots' },
      ]
    },
    company: {
      name: 'Şirket',
      items: [
        { label: 'İletişim', href: '/contact' },
        { label: 'Basın Kiti', href: '/press-kit' },
        { label: 'Değişiklik Günlüğü', href: '/changelog' },
      ]
    },
    legal: {
      name: 'Yasal',
      items: [
        { label: 'Gizlilik Politikası', href: '/privacy' },
        { label: 'Kullanım Koşulları', href: '/terms' },
        { label: 'EULA', href: '/eula' },
      ]
    },
    support: {
      name: 'Destek',
      items: [
        { label: 'Destek Merkezi', href: '/support' },
        { label: 'Veri Silme', href: '/support/data-deletion' },
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
          <p>© 2025 Journeo. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

