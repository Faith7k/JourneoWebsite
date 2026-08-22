'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Mevcut dili pathname'den al
  const currentLocale = pathname.split('/')[1] || 'tr';
  
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];
  
  const handleLanguageChange = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setLanguageMenuOpen(false);
  };

  // Dil menüsünü dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuOpen) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [languageMenuOpen]);

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('features'), href: '/features' },
    // { name: t('pricing'), href: '/pricing' },
    { name: t('screenshots'), href: '/screenshots' },
    { name: t('support'), href: '/support' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{currentLocale}</span>
            </Button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      currentLocale === lang.code ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {currentLocale === lang.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile Language Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{currentLocale}</span>
            </Button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      currentLocale === lang.code ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {currentLocale === lang.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Language Options */}
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-3">{t('language')}</div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentLocale === lang.code 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

