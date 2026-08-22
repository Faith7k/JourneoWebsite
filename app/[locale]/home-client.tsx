'use client';

import { Hero } from '@/components/hero';
import { FeatureCard } from '@/components/feature-card';
import { ScrollStory, type StoryScreen } from '@/components/scroll-story';
import { StoreButtons } from '@/components/store-buttons';
import {
  MapPin,
  Brain,
  Volume2,
  Briefcase,
  Cloud,
  Share2,
  Wallet,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function HomePageClient({
  appStoreUrl,
  playStoreUrl,
  storyScreens,
}: {
  appStoreUrl?: string;
  playStoreUrl?: string;
  storyScreens: StoryScreen[];
}) {
  const t = useTranslations();

  const features = [
    {
      title: t('features.aiRoute.title'),
      description: t('features.aiRoute.description'),
      iconName: 'Brain',
    },
    {
      title: t('features.interactiveMap.title'),
      description: t('features.interactiveMap.description'),
      iconName: 'MapPin',
    },
    {
      title: t('features.ttsGuide.title'),
      description: t('features.ttsGuide.description'),
      iconName: 'Volume2',
    },
    {
      title: t('features.smartSuitcase.title'),
      description: t('features.smartSuitcase.description'),
      iconName: 'Briefcase',
    },
    {
      title: t('features.weather.title'),
      description: t('features.weather.description'),
      iconName: 'Cloud',
    },
    {
      title: t('features.sharing.title'),
      description: t('features.sharing.description'),
      iconName: 'Share2',
    },
    {
      title: t('features.expenses.title'),
      description: t('features.expenses.description'),
      iconName: 'Wallet',
    },
    {
      title: t('features.trips.title'),
      description: t('features.trips.description'),
      iconName: 'Calendar',
    },
  ];

  return (
    <>
      <Hero appStoreUrl={appStoreUrl} playStoreUrl={playStoreUrl} />

      {/* GSAP + ScrollTrigger anlatısı: kaydırdıkça uygulama adım adım ilerler */}
      <ScrollStory screens={storyScreens} />

        {/* Features Section */}
        <section className="section-padding relative overflow-hidden bg-[#FAF7F2]">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[#FAF7F2]" />
          <div className="absolute inset-0 bg-map-grid opacity-100" />
          
          {/* Topographic Contours SVGs */}
          <svg className="absolute -left-10 top-20 w-[450px] h-[450px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
            <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
            <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
          </svg>
          <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
            <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
            <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
          </svg>
          <svg className="absolute inset-0 w-full h-full text-amber-800/[0.06] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5">
            <path d="M 5% 45% Q 25% 25% 55% 40% T 95% 70%" />
          </svg>
          
          <div className="container-modern relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20 space-y-6"
            >
              <h2 className="heading-modern text-gradient">{t('features.title')}</h2>
              <p className="text-modern text-stone-600 max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={index * 0.08}
                />
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-16 text-center"
            >
              <Link href="/features">
                <Button size="lg" className="btn-modern">
                  {t('features.allFeatures')} →
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden bg-gradient-to-br from-[#26201B] via-[#352B24] to-[#1C1713] text-white">
          {/* Subtle warm glow & grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          {/* Floating Glow Elements */}
          <div className="absolute top-20 left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          
          <div className="container-modern relative z-10 text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="heading-modern text-amber-50">
                {t('hero.subtitle')}
              </h2>
              <p className="text-modern text-amber-100/80 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <StoreButtons appStoreUrl={appStoreUrl} playStoreUrl={playStoreUrl} />
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-12 flex flex-wrap justify-center gap-8 text-amber-100/70"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">{t('hero.trust.downloads')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-medium">{t('hero.trust.rating')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                <span className="font-medium">{t('hero.trust.aiPowered')}</span>
              </div>
            </motion.div>
          </div>
        </section>
    </>
  );
}

