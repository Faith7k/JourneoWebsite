'use client';

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
  Globe,
  Shield,
  Zap,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const allFeatures = [
    {
      title: 'AI Rota Planlama',
      description: 'Yapay zeka destekli akıllı rota önerileri ile zamanınızı en verimli şekilde kullanın.',
      iconName: 'Brain',
    },
    {
      title: 'İnteraktif Harita',
      description: 'Gerçek zamanlı harita üzerinde gezilecek yerleri keşfedin ve rotanızı planlayın.',
      iconName: 'MapPin',
    },
    {
      title: 'Sesli Rehber (TTS)',
      description: 'Elleriniz serbest kalırken sesli rehberlik ile yolunuzu bulun.',
      iconName: 'Volume2',
    },
    {
      title: 'Akıllı Bavul',
      description: 'Seyahatiniz için neye ihtiyacınız olduğunu yapay zeka ile organize edin.',
      iconName: 'Briefcase',
    },
    {
      title: 'Hava Durumu',
      description: 'Hedef noktanızın anlık hava durumunu öğrenin ve hazırlıklı olun.',
      iconName: 'Cloud',
    },
    {
      title: 'Paylaşım',
      description: 'Seyahat deneyimlerinizi arkadaşlarınız ve ailenizle paylaşın.',
      iconName: 'Share2',
    },
    {
      title: 'Harcama Takibi',
      description: 'Seyahat bütçenizi kolayca takip edin ve raporlayın.',
      iconName: 'Wallet',
    },
    {
      title: 'Seyahat Yönetimi',
      description: 'Geçmiş ve gelecek seyahatlerinizi tek yerden yönetin.',
      iconName: 'Calendar',
    },
    {
      title: 'Offline Mod',
      description: 'İnternet bağlantısı olmadan seyahat bilgilerinize erişin.',
      iconName: 'Globe',
    },
    {
      title: 'Güvenli & Özel',
      description: 'Verileriniz endüstri standardı güvenlik ile şifrelenir ve korunur.',
      iconName: 'Shield',
    },
    {
      title: 'Hızlı & Güvenilir',
      description: 'Güvenilir navigasyon ve yönlendirme ile yıldırım hızında performans.',
      iconName: 'Zap',
    },
    {
      title: 'Kullanıcı Dostu',
      description: 'Her deneyim seviyesindeki gezginler için tasarlanmış sezgisel arayüz.',
      iconName: 'Heart',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="container relative z-10 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <h1 className="heading-modern text-gradient">Özellikler</h1>
          <p className="text-modern text-white/90 max-w-3xl mx-auto leading-relaxed">
            Journeo'nun güçlü özellikleri ile seyahatinizi keşfedin
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
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <FeatureCard
                {...feature}
                delay={index * 0.05}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
