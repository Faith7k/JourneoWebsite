'use client';

import { Hero } from '@/components/hero';
import { FeatureCard } from '@/components/feature-card';
import {
  MapPin,
  Brain,
  Volume2,
  Briefcase,
  Cloud,
  Share2,
  Wallet,
  Calendar,
  Apple,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const [isExploding, setIsExploding] = useState(false);
  const t = useTranslations();
  
  // Planning.png resmi patlaması için
  const explosionImages = Array.from({ length: 8 }, () => '/images/planning.png');
  
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
      <Hero />

        {/* Features Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container-modern relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20 space-y-6"
            >
              <h2 className="heading-modern text-gradient">{t('features.title')}</h2>
              <p className="text-modern text-muted-foreground max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={index * 0.1}
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

        {/* How it Works */}
        <section className="section-padding relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 via-blue-50 to-cyan-50" />
          
          <div className="container-modern relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="heading-modern text-gradient mb-6">
                {t('howItWorks.title')}
              </h2>
              <p className="text-modern text-muted-foreground max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: 1, title: t('howItWorks.plan.title'), desc: t('howItWorks.plan.desc'), icon: '/images/planning.png', isImage: true },
                { step: 2, title: t('howItWorks.explore.title'), desc: t('howItWorks.explore.desc'), icon: '🗺️' },
                { step: 3, title: t('howItWorks.travel.title'), desc: t('howItWorks.travel.desc'), icon: '🚀' }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="text-center space-y-6 group relative overflow-visible"
                >
                  <motion.div 
                    className="mx-auto h-24 w-24 rounded-3xl gradient-primary shadow-glow flex items-center justify-center text-3xl font-bold text-white relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onHoverStart={() => {
                      if (item.isImage) {
                        setIsExploding(true);
                        setTimeout(() => setIsExploding(false), 2000);
                      }
                    }}
                  >
                    {item.isImage ? (
                      <img 
                        src={item.icon} 
                        alt={item.title}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <span className="text-4xl">{item.icon}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Planning.png Patlaması Animasyonu - Sadece Plan adımı için */}
                    {item.isImage && (
                      <AnimatePresence>
                        {isExploding && (
                          <div className="absolute inset-0 pointer-events-none overflow-visible">
                            {explosionImages.map((image, imageIndex) => (
                              <motion.div
                                key={imageIndex}
                                initial={{ 
                                  scale: 0,
                                  x: 0,
                                  y: 0,
                                  opacity: 1,
                                  rotate: 0
                                }}
                                animate={{
                                  scale: [0, 0.8, 0.6],
                                  x: Math.cos((imageIndex * 45) * Math.PI / 180) * (120 + Math.random() * 60),
                                  y: Math.sin((imageIndex * 45) * Math.PI / 180) * (120 + Math.random() * 60),
                                  opacity: [1, 1, 0],
                                  rotate: [0, 180, 360]
                                }}
                                transition={{
                                  duration: 2.5,
                                  delay: imageIndex * 0.1,
                                  ease: "easeOut"
                                }}
                                className="absolute"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 1000
                                }}
                              >
                                <img 
                                  src={image} 
                                  alt="Planning explosion"
                                  className="w-12 h-12 object-contain"
                                />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gradient group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-modern text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Modern Background */}
          <div className="absolute inset-0 gradient-primary" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          
          <div className="container-modern relative z-10 text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="heading-modern text-white">
                {t('hero.subtitle')}
              </h2>
              <p className="text-modern text-white/90 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="glass-card text-white border-white/30 hover:bg-white/10 text-lg px-10 py-6">
                <Apple className="h-6 w-6 mr-3" />
                {t('hero.cta.appStore')}
              </Button>
              <Button size="lg" className="glass-card text-white border-white/30 hover:bg-white/10 text-lg px-10 py-6">
                <Smartphone className="h-6 w-6 mr-3" />
                {t('hero.cta.playStore')}
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-12 flex flex-wrap justify-center gap-8 text-white/80"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium">100K+ Downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-medium">AI-Powered</span>
              </div>
            </motion.div>
          </div>
        </section>
    </>
  );
}

