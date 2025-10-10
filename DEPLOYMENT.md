# Deployment Rehberi

## Vercel Deployment

### 1. Vercel Projesini Oluştur

```bash
vercel login
vercel
```

### 2. Ortam Değişkenlerini Ayarla

Vercel Dashboard'da Environment Variables bölümünden:

**Production:**
```
NEXT_PUBLIC_SITE_URL=https://journeo.ai
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
ADMIN_EMAILS=admin@journeo.ai
```

### 3. Domain Ayarla

1. Vercel Dashboard → Domains
2. Custom domain ekle: `journeo.ai`
3. DNS kayıtlarını güncelle:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

### 4. Deploy

```bash
vercel --prod
```

## Firebase Setup

### 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/)
2. "Add Project" → Proje adı gir
3. Google Analytics (opsiyonel)

### 2. Authentication Aktifleştir

1. Authentication → Sign-in method
2. Email/Password → Enable
3. Google → Enable (Client ID/Secret ekle)

### 3. Firestore Database

1. Firestore Database → Create database
2. Production mode seç
3. Location seç (europe-west1)

### 4. Storage

1. Storage → Get started
2. Production mode seç
3. Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Admin User Ekle

Firebase Console → Authentication → Add user:
- Email: admin@journeo.ai
- Password: (güvenli bir şifre)

## Post-Deployment Checklist

- [ ] SSL sertifikası aktif
- [ ] Custom domain çalışıyor
- [ ] Admin login çalışıyor
- [ ] Tüm sayfalar erişilebilir
- [ ] i18n çalışıyor (TR/EN)
- [ ] Contact form çalışıyor
- [ ] OG images oluşturuluyor
- [ ] Sitemap.xml erişilebilir
- [ ] Robots.txt erişilebilir
- [ ] Lighthouse score ≥ 95

## Monitoring

### Analytics

Google Analytics veya Vercel Analytics ekleyin:

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

Sentry ekleyin (opsiyonel):

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Backup

### Firebase Backup

1. Firestore → Import/Export
2. Cloud Storage bucket seç
3. Otomatik backup schedule ayarla

### Content Backup

```bash
# content/ klasörünü Git'e commit edin
git add content/
git commit -m "Backup content"
git push
```

## Güncelleme

```bash
# Local'de test et
pnpm dev

# Build et
pnpm build

# Production'a deploy et
vercel --prod
```

## Troubleshooting

### Build Hatası

```bash
# Cache temizle
rm -rf .next
pnpm install --force
pnpm build
```

### Firebase Bağlantı Hatası

- `.env.local` dosyasını kontrol et
- Firebase config değerlerini doğrula
- Firebase Console'da quotaları kontrol et

### 404 Hatası

- `middleware.ts` locale routing'i kontrol et
- `i18n.ts` konfigürasyonunu kontrol et

---

**Not:** Deployment sonrası tüm özellikleri test etmeyi unutmayın!

