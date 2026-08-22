import { generateMetadata as genMeta } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return genMeta({
    title: locale === 'tr' ? 'Hesap ve Veri Silme' : 'Account and Data Deletion',
    description: locale === 'tr'
      ? 'Journeo hesabınızı ve verilerinizi nasıl silebilirsiniz'
      : 'How to delete your Journeo account and data',
    locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    path: '/support/data-deletion',
  });
}

export default async function DataDeletionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isTurkish = locale === 'tr';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2] py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      <div className="absolute inset-0 bg-map-grid opacity-100" />
      
      {/* Topographic Contours SVGs */}
      <svg className="absolute -left-10 top-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
        <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
      </svg>
      <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
        <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
      </svg>

      <div className="container relative z-10 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="heading-modern text-gradient mb-4">
            {isTurkish ? 'Hesap ve Veri Silme' : 'Account and Data Deletion'}
          </h1>
          <p className="text-xl text-stone-600">
            {isTurkish
              ? 'Hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz'
              : 'You can permanently delete your account and all your data'}
          </p>
        </div>

        <Alert className="mb-8 border-rose-300 bg-rose-50/80 text-rose-900">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <AlertDescription>
            {isTurkish
              ? 'Bu işlem geri alınamaz! Tüm verileriniz kalıcı olarak silinecektir.'
              : 'This action cannot be undone! All your data will be permanently deleted.'}
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {isTurkish ? '1. Mobil Uygulama Üzerinden' : '1. Through Mobile App'}
              </CardTitle>
              <CardDescription>
                {isTurkish
                  ? 'En hızlı yöntem (Önerilen)'
                  : 'Fastest method (Recommended)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>{isTurkish ? 'Journeo uygulamasını açın' : 'Open the Journeo app'}</li>
                <li>{isTurkish ? 'Profil sekmesine gidin' : 'Go to Profile tab'}</li>
                <li>{isTurkish ? 'Ayarlar → Hesap ayarlarını seçin' : 'Select Settings → Account settings'}</li>
                <li>{isTurkish ? '"Hesabı Sil" butonuna tıklayın' : 'Click "Delete Account" button'}</li>
                <li>{isTurkish ? 'Onay kodunuzu girin ve onaylayın' : 'Enter your confirmation code and confirm'}</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {isTurkish ? '2. E-posta ile Talep' : '2. Request via Email'}
              </CardTitle>
              <CardDescription>
                {isTurkish
                  ? 'Uygulamaya erişiminiz yoksa'
                  : 'If you don\'t have access to the app'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {isTurkish
                  ? 'Aşağıdaki bilgileri içeren bir e-posta gönderin:'
                  : 'Send an email with the following information:'}
              </p>
              <div className="bg-[#FAF7F2] border border-amber-900/10 p-4 rounded-lg space-y-2">
                <p><strong>{isTurkish ? 'Kime:' : 'To:'}</strong> privacy@journeo.ai</p>
                <p><strong>{isTurkish ? 'Konu:' : 'Subject:'}</strong> Account Deletion Request</p>
                <p><strong>{isTurkish ? 'İçerik:' : 'Content:'}</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm space-y-1 text-muted-foreground">
                  <li>{isTurkish ? 'Kayıtlı e-posta adresiniz' : 'Your registered email address'}</li>
                  <li>{isTurkish ? 'Kullanıcı adınız (varsa)' : 'Your username (if applicable)'}</li>
                  <li>{isTurkish ? 'Hesap silme talebiniz' : 'Your account deletion request'}</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                {isTurkish
                  ? 'Talebiniz 30 gün içinde işleme alınacaktır.'
                  : 'Your request will be processed within 30 days.'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {isTurkish ? 'Silinecek Veriler' : 'Data That Will Be Deleted'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ {isTurkish ? 'Hesap bilgileriniz' : 'Your account information'}</li>
                <li>✓ {isTurkish ? 'Profil bilgileriniz' : 'Your profile information'}</li>
                <li>✓ {isTurkish ? 'Seyahat geçmişiniz' : 'Your travel history'}</li>
                <li>✓ {isTurkish ? 'Kaydedilmiş rotalarınız' : 'Your saved routes'}</li>
                <li>✓ {isTurkish ? 'Harcama kayıtlarınız' : 'Your expense records'}</li>
                <li>✓ {isTurkish ? 'Paylaşımlarınız' : 'Your shared content'}</li>
                <li>✓ {isTurkish ? 'Tercihleriniz ve ayarlarınız' : 'Your preferences and settings'}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {isTurkish ? 'Önemli Notlar' : 'Important Notes'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• {isTurkish
                ? 'Aktif aboneliğiniz varsa, önce iptal etmeniz önerilir'
                : 'If you have an active subscription, we recommend canceling it first'
              }</p>
              <p>• {isTurkish
                ? 'Silinen veriler geri getirilemez'
                : 'Deleted data cannot be recovered'
              }</p>
              <p>• {isTurkish
                ? 'Yasal yükümlülükler için bazı veriler 90 gün süreyle saklanabilir'
                : 'Some data may be retained for 90 days for legal obligations'
              }</p>
              <p>• {isTurkish
                ? 'Yeni hesap oluşturmak için aynı e-posta adresini kullanabilirsiniz'
                : 'You can use the same email address to create a new account'
              }</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {isTurkish
              ? 'Sorularınız için: privacy@journeo.ai'
              : 'For questions: privacy@journeo.ai'}
          </p>
        </div>
      </div>
    </div>
  );
}

