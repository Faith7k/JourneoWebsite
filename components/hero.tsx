'use client';

import { Button } from './ui/button';
import { Apple, Smartphone, Sparkles, Languages, Zap, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Gezi ile alakalı emoji'ler
const travelEmojis = ['✈️', '🗺️', '🧳', '📸', '🏖️', '⛰️', '🏛️', '🎒', '🚂', '🚢', '🏨', '🗼', '🎡', '🎢', '🎪', '🎭', '🎨', '🏰', '⛪', '🕌', '🗿', '🌋', '🏔️', '🏕️', '🏞️', '🌅', '🌄', '🌠', '🎆', '🎇', '🌃', '🌆', '🌉'];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export function Hero({ appStoreUrl, playStoreUrl }: { appStoreUrl?: string; playStoreUrl?: string }) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMouse, setShowMouse] = useState(false);
  const [confettis, setConfettis] = useState<Confetti[]>([]);
  const [isClickable, setIsClickable] = useState(false);
  const [autoClick, setAutoClick] = useState(false);
  const fullText = t('hero.title');

  // Hydration sorununu önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Typewriter effect
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && displayedText.length < fullText.length) {
      // Yazma modu
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 200); // Her harf 200ms'de yazılır
    } else if (!isDeleting && displayedText.length === fullText.length) {
      // Tam yazıldı, mouse göster ve otomatik tıklama başlat
      setShowMouse(true);
      setIsClickable(true);
      // 2 saniye sonra otomatik tıklama
      setTimeout(() => {
        setAutoClick(true);
      }, 2000);
    } else if (isDeleting && displayedText.length > 0) {
      // Silme modu
      timeout = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, 100); // Silme daha hızlı
    } else if (isDeleting && displayedText.length === 0) {
      // Hepsi silindi, tekrar başla
      setIsDeleting(false);
      setShowMouse(false);
      setIsClickable(false);
      setAutoClick(false);
      timeout = setTimeout(() => {
        // Küçük bir bekleme
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, fullText, mounted]);

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const newConfettis: Confetti[] = [];
    
    for (let i = 0; i < 50; i++) {
      newConfettis.push({
        id: i,
        x: 50, // Ekranın ortasından başla
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10 - 5, // Yukarı doğru
        },
      });
    }
    
    setConfettis(newConfettis);
    
    // 3 saniye sonra konfetileri temizle
    setTimeout(() => {
      setConfettis([]);
    }, 3000);
  };

  const handleJourneoClick = () => {
    if (isClickable) {
      createConfetti();
      // 1 saniye sonra silme moduna geç
      setTimeout(() => {
        setIsDeleting(true);
        setShowMouse(false);
        setIsClickable(false);
        setAutoClick(false);
      }, 1000);
    }
  };

  // Otomatik tıklama efekti
  useEffect(() => {
    if (autoClick) {
      handleJourneoClick();
    }
  }, [autoClick]);

  useEffect(() => {
    if (!mounted) return;
    
    // Generate random emojis
    const generateEmojis = () => {
      const newEmojis: FloatingEmoji[] = [];
      for (let i = 0; i < 15; i++) {
        newEmojis.push({
          id: i,
          emoji: travelEmojis[Math.floor(Math.random() * travelEmojis.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: 8 + Math.random() * 12, // Daha hızlı: 8-20 saniye yerine
          delay: Math.random() * 3,
          size: 24 + Math.random() * 32,
        });
      }
      setEmojis(newEmojis);
    };

    generateEmojis();
  }, [mounted]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2]">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-map-grid opacity-100" />

      {/* Topographic Contours SVGs */}
      <svg className="absolute -left-10 -top-10 w-[500px] h-[500px] text-amber-900/[0.04] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
        <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
      </svg>
      <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.04] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
        <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
      </svg>
      <svg className="absolute inset-0 w-full h-full text-amber-800/[0.07] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5">
        <path d="M 8% 35% Q 25% 15% 50% 30% T 92% 65%" />
      </svg>

      {/* Top-Right Corner App Logo Badge */}
      <div className="absolute top-6 right-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="glass-card p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 border border-amber-900/10 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white transition-all group"
        >
          <Image
            src="/logo.png"
            alt="Journeo App Logo"
            width={48}
            height={48}
            priority
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-md group-hover:scale-105 transition-transform object-cover"
          />
          <div className="hidden sm:block text-left pr-1">
            <div className="text-xs font-bold text-stone-900 tracking-wide">Journeo</div>
            <div className="text-[10px] font-medium text-stone-500">AI Travel Guide</div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Emojis */}
      {mounted && emojis.map((emoji) => (
        <motion.div
          key={emoji.id}
          className="absolute pointer-events-none select-none"
          style={{
            fontSize: `${emoji.size}px`,
            left: `${emoji.x}%`,
            top: `${emoji.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [0, 360],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: emoji.duration,
            delay: emoji.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {emoji.emoji}
        </motion.div>
      ))}
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Confetti Animation */}
      {mounted && confettis.map((confetti) => (
        <motion.div
          key={confetti.id}
          className="absolute pointer-events-none"
          style={{
            left: `${confetti.x}%`,
            top: `${confetti.y}%`,
            width: `${confetti.size}px`,
            height: `${confetti.size}px`,
            backgroundColor: confetti.color,
            borderRadius: '50%',
          }}
          animate={{
            x: [0, confetti.velocity.x * 100],
            y: [0, confetti.velocity.y * 100],
            rotate: [0, confetti.rotation + 360],
            opacity: [1, 0],
            scale: [1, 0.5, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="container-modern relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-6xl text-center space-y-10"
        >
          {/* Logo/Title with Typewriter Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.3 }}
            className="relative"
          >
            <h1 
              className="heading-modern text-gradient inline-flex justify-center items-center gap-4 sm:gap-6 min-h-[120px] relative flex-wrap sm:flex-nowrap"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block flex-shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="Journeo App Icon"
                  width={96}
                  height={96}
                  priority
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl shadow-xl shadow-amber-900/10 border-2 border-amber-900/10 object-cover hover:scale-105 transition-transform"
                />
              </motion.div>
              <span className="inline-block">
                {mounted ? displayedText : fullText}
                {mounted && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block ml-1 text-amber-600"
                  >
                    |
                  </motion.span>
                )}
              </span>
              
              {/* Mouse Icon */}
              {mounted && showMouse && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      scale: autoClick ? [1, 0.8, 1] : [1, 1, 1]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      scale: autoClick ? { duration: 0.3, repeat: 1 } : {}
                    }}
                    className="text-2xl"
                  >
                    🖱️
                  </motion.div>
                </motion.div>
              )}
            </h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="subheading-modern text-stone-800"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-modern text-stone-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* Modern CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* App Store Button */}
            {appStoreUrl ? (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="btn-modern w-full sm:w-auto gap-3 text-lg px-10 py-6">
                  <Apple className="h-6 w-6" />
                  {t('hero.cta.appStore')}
                </Button>
              </a>
            ) : (
              <Button size="lg" disabled className="btn-modern w-full sm:w-auto gap-3 text-lg px-10 py-6 opacity-50 cursor-not-allowed">
                <Apple className="h-6 w-6" />
                {t('hero.cta.appStore')}
              </Button>
            )}

            {/* Play Store Button */}
            {playStoreUrl ? (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="glass-card w-full sm:w-auto gap-3 text-lg px-10 py-6 border-amber-900/15 text-stone-800 hover:bg-white bg-white/80 backdrop-blur-sm shadow-md">
                  <Smartphone className="h-6 w-6" />
                  {t('hero.cta.playStore')}
                </Button>
              </a>
            ) : (
              <Button size="lg" variant="outline" disabled className="glass-card w-full sm:w-auto gap-3 text-lg px-10 py-6 border-amber-900/15 text-stone-800 bg-white/80 backdrop-blur-sm opacity-50 cursor-not-allowed shadow-md">
                <Smartphone className="h-6 w-6" />
                {t('hero.cta.playStore')}
              </Button>
            )}
          </motion.div>

          {/* Modern Stats with Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {/* Card 1 - AI-Powered */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden bg-white/80 border border-amber-900/10 shadow-lg">
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('hero.features.ai.title')}</h3>
                <p className="text-stone-600">{t('hero.features.ai.description')}</p>
              </div>
            </div>
            
            {/* Card 2 - Sesli Rehber */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden bg-white/80 border border-amber-900/10 shadow-lg">
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-md">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('hero.features.voice.title')}</h3>
                <p className="text-stone-600">{t('hero.features.voice.description')}</p>
              </div>
            </div>
            
            {/* Card 3 - Çoklu Dil Desteği */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden bg-white/80 border border-amber-900/10 shadow-lg">
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('hero.features.language.title')}</h3>
                <p className="text-stone-600">{t('hero.features.language.description')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

