import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateMetadata as genMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return genMeta({
    title: params.locale === 'tr' ? 'Değişiklik Günlüğü' : 'Changelog',
    description: params.locale === 'tr'
      ? 'Journeo sürüm notları ve güncellemeler'
      : 'Journeo release notes and updates',
    locale: params.locale === 'tr' ? 'tr_TR' : 'en_US',
  });
}

export default function ChangelogPage({ params }: { params: { locale: string } }) {
  const isTurkish = params.locale === 'tr';

  const versions = [
    {
      version: '1.0.0',
      date: '2025-01-10',
      type: 'major',
      changes: {
        added: [
          'AI-powered route planning',
          'Interactive map with real-time navigation',
          'Voice-guided navigation (TTS)',
          'Smart suitcase packing assistant',
          'Weather forecast integration',
          'Expense tracking',
          'Social sharing features',
          'Trip management',
        ],
        improved: [],
        fixed: [],
      },
    },
  ];

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            {isTurkish ? 'Değişiklik Günlüğü' : 'Changelog'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isTurkish
              ? 'Journeo\'daki tüm önemli değişiklikler'
              : 'All notable changes to Journeo'}
          </p>
        </div>

        <div className="space-y-8">
          {versions.map((version) => (
            <Card key={version.version}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">v{version.version}</CardTitle>
                  <Badge variant={version.type === 'major' ? 'default' : 'secondary'}>
                    {version.type}
                  </Badge>
                </div>
                <CardDescription>{version.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {version.changes.added.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600">
                      ✨ {isTurkish ? 'Eklenenler' : 'Added'}
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {version.changes.added.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {version.changes.improved.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600">
                      🚀 {isTurkish ? 'İyileştirmeler' : 'Improved'}
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {version.changes.improved.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {version.changes.fixed.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-600">
                      🐛 {isTurkish ? 'Düzeltmeler' : 'Fixed'}
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {version.changes.fixed.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

