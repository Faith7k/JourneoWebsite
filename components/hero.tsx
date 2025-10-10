'use client';

import { Button } from './ui/button';
import { Apple, Smartphone, Sparkles, Languages, Zap, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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

export function Hero() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMouse, setShowMouse] = useState(false);
  const [confettis, setConfettis] = useState<Confetti[]>([]);
  const [isClickable, setIsClickable] = useState(false);
  const [autoClick, setAutoClick] = useState(false);
  const fullText = 'JOURNEO';

  useEffect(() => {
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
  }, [displayedText, isDeleting, fullText]);

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
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Emojis */}
      {emojis.map((emoji) => (
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
            opacity: [0.3, 0.7, 0.3],
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
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Confetti Animation */}
      {confettis.map((confetti) => (
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

      <div className="container-modern relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-6xl text-center space-y-12"
        >
          {/* Logo/Title with Typewriter Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.3 }}
            className="relative"
          >
            <h1 
              className="heading-modern text-gradient inline-flex justify-center items-center min-h-[120px] relative"
            >
              <span className="inline-block">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block ml-1 text-blue-500"
                >
                  |
                </motion.span>
              </span>
              
              {/* Mouse Icon */}
              {showMouse && (
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
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Subtitle with Glow Effect */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="subheading-modern text-glow"
          >
            Your AI-Powered Personal Travel Guide
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-modern text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            From planning your trips to exploring, your intelligent travel assistant designed with the power of artificial intelligence to make every moment unforgettable.
          </motion.p>

          {/* Modern CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button size="lg" className="btn-modern w-full sm:w-auto gap-3 text-lg px-10 py-6">
              <Apple className="h-6 w-6" />
              Download on the App Store
            </Button>
            <Button size="lg" variant="outline" className="glass-card w-full sm:w-auto gap-3 text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10 bg-white/10 backdrop-blur-sm">
              <Smartphone className="h-6 w-6" />
              Get it on Google Play
            </Button>
          </motion.div>

          {/* Modern Stats with Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {/* Card 1 - AI-Powered */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
              {/* Floating emojis in card */}
              <motion.div
                className="absolute text-2xl opacity-30"
                animate={{
                  x: [-20, 120],
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                🤖
              </motion.div>
              <motion.div
                className="absolute text-xl opacity-20"
                animate={{
                  x: [100, -20],
                  y: [80, 20],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              >
                🧠
              </motion.div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-white/70">AI-powered smart recommendations</p>
              </div>
            </div>
            
            {/* Card 2 - Sesli Rehber */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
              {/* Floating emojis in card */}
              <motion.div
                className="absolute text-2xl opacity-30"
                animate={{
                  x: [-20, 120],
                  y: [60, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
              >
                🔊
              </motion.div>
              <motion.div
                className="absolute text-xl opacity-20"
                animate={{
                  x: [100, -20],
                  y: [0, 60],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.5,
                }}
              >
                🎙️
              </motion.div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Voice Guide</h3>
                <p className="text-white/70">AI-powered voice narration</p>
              </div>
            </div>
            
            {/* Card 3 - Çoklu Dil Desteği */}
            <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
              {/* Floating emojis in card */}
              <motion.div
                className="absolute text-2xl opacity-30"
                animate={{
                  x: [-20, 120],
                  y: [20, 60, 20],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.25,
                }}
              >
                🌍
              </motion.div>
              <motion.div
                className="absolute text-xl opacity-20"
                animate={{
                  x: [100, -20],
                  y: [40, 0],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
              >
                🗣️
              </motion.div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Multi-Language</h3>
                <p className="text-white/70">Travel guidance in 100+ languages</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

