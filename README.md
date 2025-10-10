# Journeo Website

Journeo mobil uygulamasının resmi web sitesi. App Store ve Play Store gereksinimlerini karşılayan, modern ve güvenli bir Next.js 15 uygulaması.

## 🚀 Özellikler

- ✅ **Next.js 15** App Router ile modern mimari
- ✅ **TypeScript** tip güvenliği
- ✅ **Tailwind CSS** + shadcn/ui modern tasarım
- ✅ **Framer Motion** animasyonlar
- ✅ **Firebase** Auth + Storage + Firestore
- ✅ **next-intl** çok dilli destek (TR/EN)
- ✅ **MDX** içerik yönetimi
- ✅ **Admin Panel** korumalı yönetim arayüzü
- ✅ **SEO** optimize edilmiş (sitemap, robots.txt, OG images)
- ✅ **Responsive** mobil-first tasarım
- ✅ **Accessibility** WCAG AA uyumlu
- ✅ **Security** HTTP headers, rate limiting

## 📋 Gereksinimler

- Node.js 18+
- pnpm 8+
- Firebase projesi (Auth, Storage, Firestore)

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükle

```bash
pnpm install
```

### 2. Ortam Değişkenlerini Ayarla

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SITE_URL=https://journeo.ai
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
ADMIN_EMAILS=admin@journeo.ai,founder@journeo.ai
```

### 3. Geliştirme Sunucusunu Başlat

```bash
pnpm dev
```

Site http://localhost:3000 adresinde çalışacaktır.

## 🔐 Admin Panel

Admin paneline erişim için:

1. `/admin/login` adresine gidin
2. Firebase Authentication ile giriş yapın (Email/Password veya Google)
3. Admin e-postanızın `ADMIN_EMAILS` içinde olduğundan emin olun

### Admin Özellikleri

- 📝 İçerik yönetimi (hero, features, pricing, FAQ)
- 🖼️ Medya yükleme (screenshots, images)
- 🌍 Çok dilli içerik düzenleme
- 📊 Basit istatistikler
- 🔄 Versiyon geçmişi

## 📁 Proje Yapısı

```
journeo-website/
├── app/
│   ├── [locale]/          # Çok dilli sayfalar
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── screenshots/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── eula/
│   │   ├── support/
│   │   ├── contact/
│   │   ├── press-kit/
│   │   └── changelog/
│   ├── admin/             # Admin panel
│   │   ├── login/
│   │   ├── media/
│   │   └── page.tsx
│   ├── api/               # API routes
│   │   ├── contact/
│   │   └── og/
│   ├── layout.tsx
│   └── globals.css
├── components/            # React componentleri
│   ├── ui/               # shadcn/ui componentleri
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── content/              # MDX içerikler
│   ├── tr/
│   ├── en/
│   └── history.json
├── lib/                  # Utility fonksiyonları
│   ├── firebase.ts
│   ├── auth.ts
│   ├── seo.ts
│   └── utils.ts
├── messages/             # i18n çeviriler
│   ├── tr.json
│   └── en.json
├── public/
│   ├── icons/
│   ├── images/
│   └── robots.txt
└── package.json
```

## 🌍 Çok Dilli İçerik

İçerik iki dilde yönetilir:
- **Türkçe (TR)**: `/tr/*`
- **İngilizce (EN)**: `/en/*`

Yeni çeviri eklemek için:
1. `messages/tr.json` ve `messages/en.json` dosyalarını güncelleyin
2. MDX dosyalarını `content/tr/` ve `content/en/` altında oluşturun

## 📱 App/Play Store Uyumu

Web sitesi aşağıdaki gereksinimleri karşılar:

- ✅ **Marketing URL**: `/`
- ✅ **Support URL**: `/support`
- ✅ **Privacy Policy**: `/privacy`
- ✅ **Terms of Service**: `/terms`
- ✅ **EULA**: `/eula`
- ✅ **Data Deletion**: `/support/data-deletion`
- ✅ **Contact**: `/contact`
- ✅ **Subscription Info**: `/pricing`

## 🔒 Güvenlik

- HTTP security headers (CSP, X-Frame-Options, etc.)
- Rate limiting (contact form)
- Firebase Auth ile korumalı admin paneli
- XSS/CSRF korumaları
- Güvenli ortam değişkenleri

## 🚢 Deployment

### Vercel (Önerilen)

1. Vercel hesabınıza bağlayın
2. Ortam değişkenlerini ekleyin
3. Deploy edin

```bash
vercel deploy
```

### Build

```bash
pnpm build
pnpm start
```

## 📊 SEO

- Dinamik sitemap (`/sitemap.xml`)
- Robots.txt
- Open Graph images (`/api/og`)
- Meta tags
- Structured data (JSON-LD)

## 🎨 Özelleştirme

### Renkler

`tailwind.config.ts` dosyasında CSS değişkenlerini düzenleyin.

### İçerik

MDX dosyalarını `content/` klasöründe düzenleyin.

### Stiller

`app/globals.css` dosyasında global stilleri düzenleyin.

## 📝 Lisans

© 2025 Journeo. Tüm hakları saklıdır.

## 🤝 Destek

Sorularınız için:
- 📧 Email: support@journeo.ai
- 🌐 Website: https://journeo.ai/contact

---

**Not:** Bu proje Next.js 15, React 19 ve modern web teknolojileri ile geliştirilmiştir.

