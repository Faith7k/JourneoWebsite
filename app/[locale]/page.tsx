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
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const features = [
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
              <h2 className="heading-modern text-gradient">Powerful Features</h2>
              <p className="text-modern text-muted-foreground max-w-3xl mx-auto">
                Smart tools and AI-powered features to make your travel easier
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
                  All Features →
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
                How It Works?
              </h2>
              <p className="text-modern text-muted-foreground max-w-2xl mx-auto">
                Plan your trips with AI support in just 3 steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: 1, title: 'Plan', desc: 'Set your destination and get AI-powered recommendations', icon: '🎯' },
                { step: 2, title: 'Explore', desc: 'Discover the best routes with interactive maps', icon: '🗺️' },
                { step: 3, title: 'Travel', desc: 'Travel safely with voice guidance', icon: '🚀' }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="text-center space-y-6 group"
                >
                  <motion.div 
                    className="mx-auto h-24 w-24 rounded-3xl gradient-primary shadow-glow flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                Your AI-Powered Personal Travel Guide
              </h2>
              <p className="text-modern text-white/90 max-w-4xl mx-auto leading-relaxed">
                From planning your trips to exploring, your intelligent travel assistant designed with the power of artificial intelligence to make every moment unforgettable.
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
                Download on the App Store
              </Button>
              <Button size="lg" className="glass-card text-white border-white/30 hover:bg-white/10 text-lg px-10 py-6">
                <Smartphone className="h-6 w-6 mr-3" />
                Get it on Google Play
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

