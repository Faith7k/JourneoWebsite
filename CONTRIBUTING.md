# Katkıda Bulunma Rehberi

Journeo web sitesine katkıda bulunmak istediğiniz için teşekkürler!

## Geliştirme Akışı

1. **Fork & Clone**
```bash
git clone https://github.com/your-username/journeo-website.git
cd journeo-website
```

2. **Bağımlılıkları Yükle**
```bash
pnpm install
```

3. **Branch Oluştur**
```bash
git checkout -b feature/your-feature-name
```

4. **Değişiklikleri Yap**
- Kod yazın
- Test edin
- Commit edin

5. **Push & Pull Request**
```bash
git push origin feature/your-feature-name
```

## Kod Standartları

### TypeScript
- Strict mode kullanın
- Tip tanımları ekleyin
- Any kullanmaktan kaçının

### React
- Functional components kullanın
- Hooks kullanın
- Props için interface tanımlayın

### Styling
- Tailwind CSS utility sınıfları kullanın
- Custom CSS'den kaçının
- Responsive tasarım yapın

### Commit Messages
```
feat: Yeni özellik ekleme
fix: Bug düzeltme
docs: Dokümantasyon
style: Stil değişiklikleri
refactor: Kod refaktörü
test: Test ekleme
chore: Genel işler
```

## İçerik Ekleme

### Yeni Sayfa
```tsx
// app/[locale]/your-page/page.tsx
import { generateMetadata as genMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return genMeta({
    title: 'Your Page Title',
    description: 'Description',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default function YourPage() {
  return <div>Content</div>;
}
```

### Çeviri Ekleme
```json
// messages/tr.json
{
  "yourPage": {
    "title": "Başlık",
    "description": "Açıklama"
  }
}
```

### MDX İçerik
```mdx
---
title: Page Title
description: Description
locale: tr
lastUpdated: 2025-01-10
---

# Content here
```

## Test

```bash
# Build kontrolü
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Pull Request Checklist

- [ ] Kod standartlarına uygun
- [ ] TypeScript hataları yok
- [ ] Build başarılı
- [ ] Responsive tasarım
- [ ] TR/EN çeviriler tamamlanmış
- [ ] SEO metadata eklenmiş
- [ ] Accessibility kontrolleri
- [ ] README güncellenmiş (gerekirse)

## Sorular?

Sorularınız için:
- Email: dev@journeo.ai
- GitHub Issues

Teşekkürler! 🎉

