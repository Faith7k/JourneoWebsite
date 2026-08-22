'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';

export const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-amber-900/10 hover:border-amber-900/20 px-3 py-1.5 rounded-lg text-sm font-medium"
      >
        <Globe className="h-4 w-4 text-amber-700" />
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="uppercase font-semibold text-stone-800">{locale}</span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 max-h-72 overflow-y-auto bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl z-50 py-1 scrollbar-thin">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-muted/80 transition-colors ${
                locale === lang.code ? 'bg-muted font-semibold text-primary' : 'text-stone-700'
              }`}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <span className="truncate">{lang.name}</span>
              {locale === lang.code && <span className="ml-auto text-primary font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
