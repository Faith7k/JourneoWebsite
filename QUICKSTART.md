# 🚀 Hızlı Başlangıç

## 5 Dakikada Çalıştırın!

### 1️⃣ Projeyi İndirin

```bash
cd /Users/fatih/Desktop/Journeo-Website
```

### 2️⃣ Bağımlılıkları Yükleyin

```bash
pnpm install
```

Eğer pnpm yüklü değilse:
```bash
npm install -g pnpm
pnpm install
```

### 3️⃣ Ortam Değişkenleri

`.env.local` dosyası oluşturun ve Firebase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
ADMIN_EMAILS=admin@journeo.ai
```

### 4️⃣ Geliştirme Sunucusu

```bash
pnpm dev
```

🎉 Tarayıcınızda açın: http://localhost:3000

## 🔥 Firebase Kurulumu (Opsiyonel)

Firebase olmadan da siteyi görüntüleyebilirsiniz. Ancak admin paneli için Firebase gereklidir.

### Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/)
2. "Add Project" → Proje adı girin
3. Authentication → Email/Password ve Google'ı aktif edin
4. Project Settings → Config bilgilerini kopyalayın
5. `.env.local` dosyasına yapıştırın

## 📱 Sayfalar

- **Ana Sayfa:** http://localhost:3000/tr
- **Özellikler:** http://localhost:3000/tr/features
- **Fiyatlandırma:** http://localhost:3000/tr/pricing
- **Destek:** http://localhost:3000/tr/support
- **Admin:** http://localhost:3000/admin/login

## 🌍 Dil Değiştirme

- Türkçe: `/tr/*`
- İngilizce: `/en/*`

## ⚡ Hızlı Komutlar

```bash
# Geliştirme
pnpm dev

# Build
pnpm build

# Üretim
pnpm start

# Lint
pnpm lint
```

## 🐛 Sorun mu var?

### Port zaten kullanımda
```bash
# Farklı port kullan
pnpm dev -p 3001
```

### Module bulunamadı hatası
```bash
# Cache temizle ve yeniden yükle
rm -rf node_modules .next
pnpm install
```

### Firebase hatası
- `.env.local` dosyasını kontrol edin
- Firebase config değerlerini doğrulayın

## 📚 Daha Fazla Bilgi

- **Detaylı Kurulum:** README.md
- **Deployment:** DEPLOYMENT.md
- **Katkıda Bulunma:** CONTRIBUTING.md

---

**Yardıma mı ihtiyacınız var?** support@journeo.ai

