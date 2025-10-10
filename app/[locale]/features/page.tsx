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
      title: 'AI Route Planning',
      description: 'Use your time most efficiently with AI-powered smart route suggestions.',
      iconName: 'Brain',
    },
    {
      title: 'Interactive Map',
      description: 'Discover places to visit on a real-time map and plan your route.',
      iconName: 'MapPin',
    },
    {
      title: 'Voice Guide (TTS)',
      description: 'Find your way with voice guidance while keeping your hands free.',
      iconName: 'Volume2',
    },
    {
      title: 'Smart Suitcase',
      description: 'Organize what you need for your trip with artificial intelligence.',
      iconName: 'Briefcase',
    },
    {
      title: 'Weather Forecast',
      description: 'Learn the current weather at your destination and be prepared.',
      iconName: 'Cloud',
    },
    {
      title: 'Sharing',
      description: 'Share your travel experiences with friends and family.',
      iconName: 'Share2',
    },
    {
      title: 'Expense Tracking',
      description: 'Easily track and report your travel budget.',
      iconName: 'Wallet',
    },
    {
      title: 'Trip Management',
      description: 'Manage your past and future trips from one place.',
      iconName: 'Calendar',
    },
    {
      title: 'Offline Mode',
      description: 'Access your travel information without internet connection.',
      iconName: 'Globe',
    },
    {
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security.',
      iconName: 'Shield',
    },
    {
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with reliable navigation and guidance.',
      iconName: 'Zap',
    },
    {
      title: 'User Friendly',
      description: 'Intuitive interface designed for travelers of all experience levels.',
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
          <h1 className="heading-modern text-gradient">Features</h1>
          <p className="text-modern text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover your travel with Journeo's powerful features
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
