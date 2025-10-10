'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, MapPin, Route, Calendar, Wallet, Briefcase, Settings, Plus } from 'lucide-react';

export default function ScreenshotsPage() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  
  // Enhanced screenshots with more details
  const screenshots = [
    { 
      id: 1, 
      alt: 'Main Screen', 
      src: '/images/screenshot-1.png',
      title: 'Welcome Dashboard',
      description: 'Your personal travel hub with AI-powered insights',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 2, 
      alt: 'Map View', 
      src: '/images/screenshot-2.png',
      title: 'Interactive Map',
      description: 'Real-time navigation with smart route suggestions',
      icon: MapPin,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 3, 
      alt: 'Route Planning', 
      src: '/images/screenshot-3.png',
      title: 'AI Route Planning',
      description: 'Intelligent route optimization for your journey',
      icon: Route,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 4, 
      alt: 'Travel Details', 
      src: '/images/screenshot-4.png',
      title: 'Trip Management',
      description: 'Organize and track your travel experiences',
      icon: Calendar,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 5, 
      alt: 'Smart Suitcase', 
      src: '/images/screenshot-5.png',
      title: 'Smart Packing',
      description: 'AI-powered packing suggestions for your trip',
      icon: Briefcase,
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 6, 
      alt: 'Expenses', 
      src: '/images/screenshot-6.png',
      title: 'Expense Tracking',
      description: 'Keep track of your travel budget effortlessly',
      icon: Wallet,
      color: 'from-teal-500 to-green-500'
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float">
        <Smartphone className="w-10 h-10 text-white/60 m-5" />
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}>
        <MapPin className="w-12 h-12 text-white/60 m-6" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}>
        <Route className="w-8 h-8 text-white/60 m-4" />
      </div>

      <div className="container relative z-10 py-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
            className="mx-auto w-32 h-32 relative"
          >
            <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Smartphone className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="heading-modern text-white drop-shadow-lg">
              📱 Screenshots 📱
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Explore the Journeo app up close and discover its amazing features! ✨
            </p>
          </motion.div>
        </motion.div>

        {/* Interactive Screenshots Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {screenshots.map((screenshot, index) => {
            const IconComponent = screenshot.icon;
            return (
              <motion.div
                key={screenshot.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedScreenshot(selectedScreenshot === screenshot.id ? null : screenshot.id)}
              >
                <div className="relative aspect-[9/19] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:shadow-3xl">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 flex items-center justify-between px-4 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="absolute inset-0 pt-8 flex flex-col items-center justify-center p-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-gradient-to-br ${screenshot.color} rounded-full flex items-center justify-center mb-4`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="text-white font-bold text-lg mb-2 text-center">
                        {screenshot.title}
                      </h3>
                      
                      <p className="text-white/80 text-sm text-center leading-relaxed">
                        {screenshot.description}
                      </p>
                      
                      {/* App-like UI elements */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      size="sm" 
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Admin Panel Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/20 max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              <div className="text-6xl">⚙️</div>
              <h3 className="text-2xl font-bold text-gray-800">
                Manage Screenshots
              </h3>
              <p className="text-gray-600 text-lg">
                Upload and manage app screenshots from the admin panel
              </p>
              <Link href="/admin">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white/90 text-lg font-medium">
              📱 Screenshots reflect the actual application. Interface may change with updates. 📱
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
