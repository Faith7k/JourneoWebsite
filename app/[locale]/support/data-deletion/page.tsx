import { generateMetadata as genMeta } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Hesap ve Veri Silme' : 'Account and Data Deletion',
    description: params.locale === 'tr'
      ? 'Journeo hesabınızı ve verilerinizi nasıl silebilirsiniz'
      : 'How to delete your Journeo account and data',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default function DataDeletionPage({ params }: { params: { locale: string } }) {
  const isTurkish = params.locale === 'tr';

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <Trash2 className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isTurkish ? 'Hesap ve Veri Silme' : 'Account and Data Deletion'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isTurkish
              ? 'Hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz'
              : 'You can permanently delete your account and all your data'}
          </p>
        </div>

        <Alert className="mb-8 border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isTurkish
              ? 'Bu işlem geri alınamaz! Tüm verileriniz kalıcı olarak silinecektir.'
              : 'This action cannot be undone! All your data will be permanently deleted.'}
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
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

          <Card>
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
              <div className="bg-muted p-4 rounded-lg space-y-2">
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

          <Card>
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

          <Card>
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

