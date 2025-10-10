import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Palette, Image } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Basın Kiti' : 'Press Kit',
    description: params.locale === 'tr'
      ? 'Journeo basın kiti, logo ve marka varlıkları'
      : 'Journeo press kit, logo and brand assets',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default function PressKitPage({ params }: { params: { locale: string } }) {
  const isTurkish = params.locale === 'tr';

  return (
    <div className="py-24">
      <div className="container max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            {isTurkish ? 'Basın Kiti' : 'Press Kit'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isTurkish
              ? 'Journeo marka varlıkları ve medya kaynakları'
              : 'Journeo brand assets and media resources'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Image className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{isTurkish ? 'Logo Dosyaları' : 'Logo Files'}</CardTitle>
              <CardDescription>
                {isTurkish
                  ? 'PNG, SVG ve farklı boyutlarda logolar'
                  : 'PNG, SVG and various sizes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {isTurkish ? 'Logo İndir' : 'Download Logos'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{isTurkish ? 'Renk Paleti' : 'Color Palette'}</CardTitle>
              <CardDescription>
                {isTurkish
                  ? 'Marka renkleri ve kullanım rehberi'
                  : 'Brand colors and usage guide'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {isTurkish ? 'Rehber İndir' : 'Download Guide'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isTurkish ? 'Journeo Hakkında' : 'About Journeo'}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              {isTurkish
                ? 'Journeo, yapay zeka destekli yeni nesil seyahat planlama ve navigasyon uygulamasıdır. Kullanıcılarına kişiselleştirilmiş rota önerileri, gerçek zamanlı navigasyon, akıllı bavul asistanı ve harcama takibi gibi özellikler sunar.'
                : 'Journeo is a next-generation AI-powered travel planning and navigation application. It offers users personalized route suggestions, real-time navigation, smart suitcase assistant, and expense tracking features.'}
            </p>
            <p>
              {isTurkish
                ? 'İleri teknoloji ve kullanıcı dostu tasarımı ile seyahat deneyimini kolaylaştıran Journeo, iOS ve Android platformlarında kullanılabilir.'
                : 'With advanced technology and user-friendly design, Journeo makes the travel experience easier and is available on iOS and Android platforms.'}
            </p>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle>{isTurkish ? 'Marka Renkleri' : 'Brand Colors'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-blue-600" />
                <p className="text-sm font-mono">#2563EB</p>
                <p className="text-xs text-muted-foreground">Primary Blue</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-cyan-600" />
                <p className="text-sm font-mono">#0891B2</p>
                <p className="text-xs text-muted-foreground">Secondary Cyan</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-gray-900" />
                <p className="text-sm font-mono">#111827</p>
                <p className="text-xs text-muted-foreground">Dark Gray</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-white border" />
                <p className="text-sm font-mono">#FFFFFF</p>
                <p className="text-xs text-muted-foreground">White</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Press */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {isTurkish
              ? 'Basın soruları için:'
              : 'For press inquiries:'}
          </p>
          <p className="text-lg font-semibold">press@journeo.ai</p>
        </div>
      </div>
    </div>
  );
}

