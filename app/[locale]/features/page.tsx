'use client';

import { FeatureCard } from '@/components/feature-card';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const t = useTranslations('features');

  const allFeatures = [
    {
      title: t('aiRoute.title'),
      description: t('aiRoute.description'),
      iconName: 'Brain',
    },
    {
      title: t('interactiveMap.title'),
      description: t('interactiveMap.description'),
      iconName: 'MapPin',
    },
    {
      title: t('ttsGuide.title'),
      description: t('ttsGuide.description'),
      iconName: 'Volume2',
    },
    {
      title: t('smartSuitcase.title'),
      description: t('smartSuitcase.description'),
      iconName: 'Briefcase',
    },
    {
      title: t('weather.title'),
      description: t('weather.description'),
      iconName: 'Cloud',
    },
    {
      title: t('sharing.title'),
      description: t('sharing.description'),
      iconName: 'Share2',
    },
    {
      title: t('expenses.title'),
      description: t('expenses.description'),
      iconName: 'Wallet',
    },
    {
      title: t('trips.title'),
      description: t('trips.description'),
      iconName: 'Calendar',
    },
    {
      title: t('offlineMode.title'),
      description: t('offlineMode.description'),
      iconName: 'Globe',
    },
    {
      title: t('securePrivate.title'),
      description: t('securePrivate.description'),
      iconName: 'Shield',
    },
    {
      title: t('fastReliable.title'),
      description: t('fastReliable.description'),
      iconName: 'Zap',
    },
    {
      title: t('userFriendly.title'),
      description: t('userFriendly.description'),
      iconName: 'Heart',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2]">
      {/* Modern Background Effects */}
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
      <svg className="absolute inset-0 w-full h-full text-amber-800/[0.06] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5">
        <path d="M 8% 25% Q 30% 15% 55% 30% T 90% 60%" />
      </svg>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="container relative z-10 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <h1 className="heading-modern text-gradient">{t('title')}</h1>
          <p className="text-modern text-stone-600 max-w-3xl mx-auto leading-relaxed">
            {t('pageDescription')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <FeatureCard
                {...feature}
                delay={index * 0.04}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
