'use client';

import Image from 'next/image';

export default function ScreenshotsPage() {
  // Placeholder screenshots - will be managed via admin panel
  const screenshots = [
    { id: 1, alt: 'Ana Ekran', src: '/images/screenshot-1.png' },
    { id: 2, alt: 'Harita Görünümü', src: '/images/screenshot-2.png' },
    { id: 3, alt: 'Rota Planlama', src: '/images/screenshot-3.png' },
    { id: 4, alt: 'Seyahat Detayları', src: '/images/screenshot-4.png' },
    { id: 5, alt: 'Akıllı Bavul', src: '/images/screenshot-5.png' },
    { id: 6, alt: 'Harcamalar', src: '/images/screenshot-6.png' },
  ];

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            Ekran Görüntüleri
          </h1>
          <p className="text-xl text-muted-foreground">
            Journeo uygulamasını yakından keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="relative aspect-[9/19] rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl bg-muted"
            >
              {/* Placeholder for actual images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">{screenshot.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Ekran görüntüleri gerçek uygulamayı yansıtmaktadır. Arayüz güncellemelerle değişebilir.
          </p>
        </div>
      </div>
    </div>
  );
}
