'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, MapPin, Route, Calendar, Wallet, Briefcase, Compass, Map, Mic, Plane, Mountain, Globe, X } from 'lucide-react';

interface Screenshot {
  id: number;
  title: string;
  description: string;
  alt: string;
  src: string;
  icon: string;
  color: string;
}

export default function ScreenshotsPage() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const iconMap: Record<string, any> = {
    'smartphone': Smartphone,
    'mappin': MapPin,
    'route': Route,
    'calendar': Calendar,
    'wallet': Wallet,
    'briefcase': Briefcase,
    'compass': Compass,
    'map': Map,
    'mic': Mic,
    'plane': Plane,
    'mountain': Mountain,
    'globe': Globe,
  };

  // Fetch screenshots from API
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch('/api/screenshots');
        if (!response.ok) {
          throw new Error('Failed to fetch screenshots');
        }
        const data = await response.json();
        if (data && Array.isArray(data.screenshots)) {
          const mapped = data.screenshots.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description || '',
            alt: s.alt_text || s.title || '',
            src: s.image_url || '',
            icon: s.icon || 'smartphone',
            color: s.color_theme || 'from-blue-500 to-cyan-500'
          }));
          setScreenshots(mapped);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching screenshots:', error);
        // Fallback to default screenshots
        setScreenshots([
          { 
            id: 1, 
            alt: 'Main Screen', 
            src: '/images/screenshot-1.png',
            title: 'Welcome Dashboard',
            description: 'Your personal travel hub with AI-powered insights',
            icon: 'smartphone',
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            id: 2, 
            alt: 'Map View', 
            src: '/images/screenshot-2.png',
            title: 'Interactive Map',
            description: 'Real-time navigation with smart route suggestions',
            icon: 'mappin',
            color: 'from-green-500 to-emerald-500'
          },
          { 
            id: 3, 
            alt: 'Route Planning', 
            src: '/images/screenshot-3.png',
            title: 'AI Route Planning',
            description: 'Intelligent route optimization for your journey',
            icon: 'route',
            color: 'from-purple-500 to-pink-500'
          },
          { 
            id: 4, 
            alt: 'Travel Details', 
            src: '/images/screenshot-4.png',
            title: 'Trip Management',
            description: 'Organize and track your travel experiences',
            icon: 'calendar',
            color: 'from-orange-500 to-red-500'
          },
          { 
            id: 5, 
            alt: 'Smart Suitcase', 
            src: '/images/screenshot-5.png',
            title: 'Smart Packing',
            description: 'AI-powered packing suggestions for your trip',
            icon: 'briefcase',
            color: 'from-indigo-500 to-blue-500'
          },
          { 
            id: 6, 
            alt: 'Expenses', 
            src: '/images/screenshot-6.png',
            title: 'Expense Tracking',
            description: 'Keep track of your travel budget effortlessly',
            icon: 'wallet',
            color: 'from-teal-500 to-green-500'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);


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


        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/80">Loading screenshots...</p>
          </div>
        )}

        {/* Interactive Screenshots Grid */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 justify-items-center"
          >
            {screenshots.map((screenshot, index) => {
              const iconKey = (screenshot.icon || 'smartphone').toLowerCase();
              const IconComponent = iconMap[iconKey] || Smartphone;
              
              // Check if we should display an actual image or the mock UI
              const isDefaultMock = screenshot.src.startsWith('/images/screenshot-');

              return (
                <motion.div
                  key={screenshot.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer relative"
                  onClick={() => setSelectedScreenshot(screenshot.id)}
                >
                  {/* iPhone Mockup Frame */}
                  <div className="relative mx-auto w-[270px] aspect-[9/19] rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden ring-4 ring-slate-800/20 transition-all duration-300 group-hover:shadow-3xl group-hover:ring-slate-850/40">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-40 flex items-center justify-center">
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-slate-850" />
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-2 left-0 right-0 h-6 flex items-center justify-between px-5 text-white/90 text-[9px] font-semibold select-none z-30 pointer-events-none">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-1.5 bg-white/80 rounded-2xs inline-block"></span>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/45 rounded-full z-30 pointer-events-none" />

                    {/* Content Area */}
                    <div className="absolute inset-0 w-full h-full">
                      {isDefaultMock ? (
                        /* Default Mock UI when no actual image file exists */
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 pt-12">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`w-16 h-16 bg-gradient-to-br ${screenshot.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
                          >
                            <IconComponent className="w-8 h-8 text-white" />
                          </motion.div>
                          
                          <h3 className="text-white font-bold text-base mb-1 text-center">
                            {screenshot.title}
                          </h3>
                          
                          <p className="text-white/80 text-[11px] text-center leading-relaxed mb-6">
                            {screenshot.description}
                          </p>

                          {/* App-like UI elements */}
                          <div className="absolute bottom-8 left-4 right-4">
                            <div className="bg-white/10 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                              <div className="flex items-center justify-between">
                                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Render the uploaded image */
                        <img 
                          src={screenshot.src} 
                          alt={screenshot.alt}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 max-w-[270px] mx-auto rounded-[2.5rem] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-40">
                    <Button 
                      size="sm" 
                      className="bg-white text-black hover:bg-white/95 shadow-md font-semibold rounded-full"
                    >
                      Büyüt
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Lightbox / Detail Modal */}
        {selectedScreenshot !== null && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setSelectedScreenshot(null)}
          >
            <div 
              className="relative max-w-lg w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              {(() => {
                const current = screenshots.find(s => s.id === selectedScreenshot);
                if (!current) return null;
                const isDefaultMock = current.src.startsWith('/images/screenshot-');
                const IconComponent = iconMap[(current.icon || 'smartphone').toLowerCase()] || Smartphone;

                return (
                  <div className="flex flex-col items-center gap-6">
                    {/* iPhone Mockup in Lightbox */}
                    <div className="relative w-[300px] sm:w-[320px] aspect-[9/19] rounded-[3rem] border-[10px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden ring-4 ring-slate-800/40">
                      {/* Dynamic Island / Notch */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40" />

                      {/* Status Bar */}
                      <div className="absolute top-2 left-0 right-0 h-6 flex items-center justify-between px-6 text-white text-[10px] font-semibold select-none z-30 pointer-events-none">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-2 bg-white/80 rounded-2xs inline-block"></span>
                        </div>
                      </div>

                      {/* Home Indicator */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />

                      <div className="absolute inset-0 w-full h-full">
                        {isDefaultMock ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 pt-16">
                            <div className={`w-20 h-20 bg-gradient-to-br ${current.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                              <IconComponent className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-3 text-center">
                              {current.title}
                            </h3>
                            <p className="text-white/80 text-sm text-center leading-relaxed mb-6">
                              {current.description}
                            </p>
                          </div>
                        ) : (
                          <img 
                            src={current.src} 
                            alt={current.alt}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Image Details */}
                    <div className="text-center text-white space-y-2 max-w-sm">
                      <h2 className="text-xl font-bold">{current.title}</h2>
                      {current.description && <p className="text-white/75 text-sm">{current.description}</p>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}


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
