import { generateMetadata as genMeta } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dataDeletionPage' });
  return genMeta({
    title: t('title'),
    description: t('subtitle'),
    locale: locale === 'tr' ? 'tr_TR' : `${locale}_${locale.toUpperCase()}`,
    path: '/support/data-deletion',
  });
}

export default async function DataDeletionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dataDeletionPage' });

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
            {t('title')}
          </h1>
          <p className="text-xl text-stone-600">
            {t('subtitle')}
          </p>
        </div>

        <Alert className="mb-8 border-rose-300 bg-rose-50/80 text-rose-900">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <AlertDescription>
            {t('alert')}
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {t('appMethod.title')}
              </CardTitle>
              <CardDescription>
                {t('appMethod.badge')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>{t('appMethod.step1')}</li>
                <li>{t('appMethod.step2')}</li>
                <li>{t('appMethod.step3')}</li>
                <li>{t('appMethod.step4')}</li>
                <li>{t('appMethod.step5')}</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {t('emailMethod.title')}
              </CardTitle>
              <CardDescription>
                {t('emailMethod.badge')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('emailMethod.instruction')}
              </p>
              <div className="bg-[#FAF7F2] border border-amber-900/10 p-4 rounded-lg space-y-2">
                <p><strong>{t('emailMethod.to')}</strong> privacy@journeo.ai</p>
                <p><strong>{t('emailMethod.subject')}</strong> {t('emailMethod.subjectValue')}</p>
                <p><strong>{t('emailMethod.contentLabel')}</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm space-y-1 text-muted-foreground">
                  <li>{t('emailMethod.item1')}</li>
                  <li>{t('emailMethod.item2')}</li>
                  <li>{t('emailMethod.item3')}</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('emailMethod.note')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {t('deletedData.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ {t('deletedData.item1')}</li>
                <li>✓ {t('deletedData.item2')}</li>
                <li>✓ {t('deletedData.item3')}</li>
                <li>✓ {t('deletedData.item4')}</li>
                <li>✓ {t('deletedData.item5')}</li>
                <li>✓ {t('deletedData.item6')}</li>
                <li>✓ {t('deletedData.item7')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
            <CardHeader>
              <CardTitle>
                {t('importantNotes.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• {t('importantNotes.note1')}</p>
              <p>• {t('importantNotes.note2')}</p>
              <p>• {t('importantNotes.note3')}</p>
              <p>• {t('importantNotes.note4')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t('footerContact')}
          </p>
        </div>
      </div>
    </div>
  );
}
