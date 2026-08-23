'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ChevronDown,
  Plane,
  MapPin,
  Compass,
  Briefcase,
  Camera,
  Palmtree,
  Sun,
  Globe,
  Map as MapIcon,
} from 'lucide-react';
import Link from 'next/link';

export interface StoryScreen {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
}

const SLUG_BY_TITLE: Record<string, string> = {
  login: 'login',
  'sign in': 'login',
  home: 'home',
  trip: 'createTrip',
  'create trip': 'createTrip',
  'ai planner': 'aiPlanner',
  route: 'route',
  maps: 'maps',
  map: 'maps',
  'meeting point': 'meetingPoint',
  'travel detail': 'tripDetail',
  'trip detail': 'tripDetail',
  'expense split': 'expenses',
  expenses: 'expenses',
  trips: 'trips',
  profile: 'profile',
};

const STORY_ORDER = [
  'login',
  'home',
  'createTrip',
  'aiPlanner',
  'route',
  'maps',
  'meetingPoint',
  'tripDetail',
  'expenses',
  'trips',
  'profile',
];

const ACCENTS = [
  '#F5B971',
  '#FF9F6B',
  '#7DD3FC',
  '#A5B4FC',
  '#5EEAD4',
  '#38BDF8',
  '#FCA5A5',
  '#FBBF24',
  '#86EFAC',
  '#F0ABFC',
  '#93C5FD',
];

const DARK_ACCENTS = [
  '#D97706', // amber-600
  '#EA580C', // orange-600
  '#0284C7', // sky-600
  '#4F46E5', // indigo-600
  '#0D9488', // teal-600
  '#0284C7', // sky-600
  '#DC2626', // red-600
  '#D97706', // amber-600
  '#16A34A', // green-600
  '#C084FC', // purple-500
  '#2563EB', // blue-600
];

interface Step extends StoryScreen {
  slug: string | null;
  accent: string;
  darkAccent: string;
  heading: string;
  body: string;
}

export function CanvasScrollStory({ screens }: { screens: StoryScreen[] }) {
  const t = useTranslations('scrollStory');

  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const planeRef = useRef<HTMLDivElement | null>(null);
  const compassRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // State to track preloading
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const TOTAL_FRAMES = 295; // Matching extracted frames count

  // Safe translation helper
  const safeT = useMemo(() => {
    return (key: string, fallback: string) => {
      try {
        const has = (t as any).has;
        if (typeof has === 'function' && !has(key)) return fallback;
        const value = t(key as any);
        if (typeof value !== 'string' || !value.length || value.includes('scrollStory.')) {
          return fallback;
        }
        return value;
      } catch {
        return fallback;
      }
    };
  }, [t]);

  // Steps matching the original layout texts
  const steps: Step[] = useMemo(() => {
    const withSlug = screens.map((screen) => ({
      ...screen,
      slug: SLUG_BY_TITLE[screen.title.trim().toLowerCase()] ?? null,
    }));

    const ordered = [
      ...withSlug
        .filter((s) => s.slug && STORY_ORDER.includes(s.slug))
        .sort((a, b) => STORY_ORDER.indexOf(a.slug!) - STORY_ORDER.indexOf(b.slug!)),
      ...withSlug.filter((s) => !s.slug || !STORY_ORDER.includes(s.slug)),
    ];

    return ordered.map((screen, index) => ({
      ...screen,
      slug: screen.slug,
      accent: ACCENTS[index % ACCENTS.length],
      darkAccent: DARK_ACCENTS[index % DARK_ACCENTS.length],
      heading: screen.slug
        ? safeT(`steps.${screen.slug}.title`, screen.title.trim())
        : screen.title.trim(),
      body: screen.slug
        ? safeT(`steps.${screen.slug}.description`, screen.description ?? '')
        : screen.description ?? '',
    }));
  }, [screens, safeT]);

  const totalSteps = steps.length;

  // Detect reduced motion preference
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Preload Image Sequence
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(progress);

      if (loadedCount === TOTAL_FRAMES) {
        preloadedImagesRef.current = images;
        setIsLoaded(true);
      }
    };

    const handleImageError = () => {
      console.error('Failed to load a video frame');
      handleImageLoad();
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const pad = String(i).padStart(4, '0');
      img.src = `/frames/frame_${pad}.webp`;
      img.onload = handleImageLoad;
      img.onerror = () => handleImageError();
      images.push(img);
    }

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [reducedMotion]);

  // Main Canvas Rendering inside Mockup Bezel & GSAP Timeline
  useEffect(() => {
    if (!isLoaded || reducedMotion || !canvasRef.current || !stageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cover math algorithm for the canvas inside the iPhone
    const drawCoverImage = (img: HTMLImageElement) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imageRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let sx, sy, sw, sh;

      if (canvasRatio > imageRatio) {
        sw = img.width;
        sh = img.width / canvasRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      } else {
        sw = img.height * canvasRatio;
        sh = img.height;
        sx = (img.width - sw) / 2;
        sy = 0;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
    };

    // Resize Handler with Retina support
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const activeFrame = Math.round(frameObj.current);
      const img = preloadedImagesRef.current[activeFrame - 1];
      if (img) {
        drawCoverImage(img);
      }
    };

    // Setup initial frame sizing
    const frameObj = { current: 1 };
    const firstImg = preloadedImagesRef.current[0];
    if (firstImg) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawCoverImage(firstImg);
    }

    window.addEventListener('resize', handleResize);

    const ctxGSAP = gsap.context(() => {
      const copyEls = copyRefs.current.filter(Boolean) as HTMLDivElement[];
      const glowEls = glowRefs.current.filter(Boolean) as HTMLDivElement[];

      // Initial setups
      gsap.set(copyEls, { opacity: 0, y: 28 });
      gsap.set(copyEls[0], { opacity: 1, y: 0 });
      gsap.set(glowEls, { opacity: 0 });
      gsap.set(glowEls[0], { opacity: 1 });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

          const INTRO = 1.0; // Phone entering sequence
          const TRANSITION = 0.65; // Transition step duration
          const OUTRO = 0.6; // Outro hold
          const duration = INTRO + (totalSteps - 1) + OUTRO;
          const perUnit = () => window.innerHeight * (isDesktop ? 1.5 : 1.2);

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: () => `+=${Math.round(duration * perUnit())}`,
              pin: stageRef.current,
              pinSpacing: true,
              scrub: 1.2,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const time = self.progress * duration;
                const raw = time < INTRO ? 0 : Math.floor(time - INTRO);
                const stepIndex = Math.max(0, Math.min(totalSteps - 1, raw));
                setActiveStepIndex(stepIndex);

                // Update counter text
                if (counterRef.current) {
                  counterRef.current.textContent = String(stepIndex + 1).padStart(2, '0');
                }

                // Update side indicators dots
                dotRefs.current.forEach((dot, idx) => {
                  if (!dot) return;
                  const isActive = idx === stepIndex;
                  dot.style.backgroundColor = isActive ? steps[idx].darkAccent : 'rgba(0,0,0,0.15)';
                  dot.style.transform = isActive ? 'scale(1.6)' : 'scale(1)';
                });
              },
            },
          });

          // Background flight path animation
          if (planeRef.current) {
            tl.fromTo(
              planeRef.current,
              { x: 0, y: 0, rotate: 15 },
              {
                x: isDesktop ? 480 : 200,
                y: isDesktop ? 240 : 120,
                rotate: 35,
                duration,
                ease: 'none',
              },
              0
            );
          }

          // Background compass rotation
          if (compassRef.current) {
            tl.to(
              compassRef.current,
              {
                rotate: 360,
                duration,
                ease: 'none',
              },
              0
            );
          }

          // 1) iPhone enters the stage with kavis details
          tl.fromTo(
            phoneRef.current,
            {
              yPercent: 26,
              scale: 0.84,
              rotateX: 20,
              rotateY: -22,
              rotateZ: isDesktop ? -6 : -3,
              opacity: 0,
            },
            {
              yPercent: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              opacity: 1,
              duration: INTRO,
              ease: 'power2.out',
            },
            0
          )
            .fromTo(
              headerRef.current,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: INTRO * 0.6, ease: 'power2.out' },
              0
            )
            .to(hintRef.current, { opacity: 0, y: -12, duration: INTRO * 0.5 }, INTRO * 0.4);

          // 2) Animate Canvas Frame Sequence (spread frames evenly across the duration)
          tl.to(
            frameObj,
            {
              current: TOTAL_FRAMES,
              duration: duration - INTRO,
              ease: 'none',
              onUpdate: () => {
                const currentFrame = Math.min(
                  TOTAL_FRAMES,
                  Math.max(1, Math.round(frameObj.current))
                );
                const img = preloadedImagesRef.current[currentFrame - 1];
                if (img) {
                  drawCoverImage(img);
                }
              },
            },
            INTRO
          );

          // 3) Phone mockup 3D tilting sequences per step
          const stepPoses = [
            { ry: 0, rx: 0, rz: 0, y: 0, scale: 1 },        // 0
            { ry: 12, rx: 4, rz: -2, y: -2, scale: 1.02 },   // 1
            { ry: -13, rx: 5, rz: 3, y: 1, scale: 0.99 },    // 2
            { ry: 0, rx: 2, rz: 0, y: 0, scale: 1.01 },      // 3
            { ry: 14, rx: -3, rz: -3, y: -2, scale: 1.02 },  // 4
            { ry: -10, rx: 4, rz: 2, y: 1, scale: 0.99 },    // 5
            { ry: 0, rx: 1, rz: 0, y: 0, scale: 1.01 },      // 6
            { ry: 10, rx: 3, rz: -2, y: -1, scale: 1.01 },   // 7
            { ry: -12, rx: 4, rz: 2, y: 1, scale: 1.0 },     // 8
            { ry: 0, rx: 2, rz: 0, y: 0, scale: 1.02 },      // 9
            { ry: 8, rx: 2, rz: -1, y: 0, scale: 1.0 },      // 10
          ];

          for (let i = 1; i < totalSteps; i++) {
            const at = INTRO + i;
            const targetPose = stepPoses[i % stepPoses.length];

            tl.to(
              phoneRef.current,
              {
                rotateY: isDesktop ? targetPose.ry : targetPose.ry * 0.6,
                rotateX: targetPose.rx,
                rotateZ: isDesktop ? targetPose.rz : targetPose.rz * 0.5,
                yPercent: targetPose.y,
                scale: targetPose.scale,
                duration: TRANSITION,
                ease: 'power2.out',
              },
              at
            );

            // Ground shadow adjustments
            if (shadowRef.current) {
              tl.to(
                shadowRef.current,
                {
                  x: isDesktop ? -targetPose.ry * 1.5 : 0,
                  scale: 0.94,
                  duration: TRANSITION * 0.5,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power1.inOut',
                },
                at
              );
            }

            // Crossfade side copy texts and glowing effects
            tl.to(glowEls[i - 1], { opacity: 0, duration: TRANSITION }, at)
              .to(glowEls[i], { opacity: 1, duration: TRANSITION }, at)
              .to(copyEls[i - 1], { opacity: 0, y: -18, duration: TRANSITION * 0.6 }, at)
              .to(
                copyEls[i],
                { opacity: 1, y: 0, duration: TRANSITION * 0.8, ease: 'power2.out' },
                at + TRANSITION * 0.15
              );
          }

          // 4) Main bottom progress timeline indicator
          tl.fromTo(
            progressRef.current,
            { scaleX: 1 / totalSteps },
            { scaleX: 1, duration, ease: 'none' },
            0
          );

          // Hold final step a bit
          tl.to({}, { duration: OUTRO }, INTRO + (totalSteps - 1));
        }
      );
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(() => requestAnimationFrame(refresh));
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      ctxGSAP.revert();
    };
  }, [isLoaded, reducedMotion, totalSteps, steps]);

  // Section labels
  const sectionTitle = safeT('title', 'Scroll to see Journeo in action');
  const sectionSubtitle = safeT('subtitle', '');
  const eyebrow = safeT('eyebrow', 'Live Demo');
  const stepLabel = safeT('stepLabel', 'Step');
  const hint = safeT('hint', 'Start scrolling');
  const ctaLabel = safeT('cta', 'See all screens');

  // Fallback for prefers-reduced-motion
  if (reducedMotion) {
    return (
      <section className="relative bg-[#FAF7F2] py-20 text-slate-800 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#FAF7F2]" />
          <div className="absolute inset-0 bg-map-grid opacity-100" />
        </div>
        <div className="container-modern relative z-10">
          <div className="mb-12 space-y-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {eyebrow}
            </span>
            <h2 className="text-3xl font-bold text-slate-800 lg:text-4xl">{sectionTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className="relative aspect-[715/1496] w-[210px] rounded-[15.8%/7.55%] p-[1.1%] shadow-xl"
                  style={{
                    background:
                      'linear-gradient(100deg,#9A9AA2 0%,#43434B 4%,#1D1D21 12%,#33333A 30%,#26262B 50%,#33333A 70%,#1D1D21 88%,#43434B 96%,#9A9AA2 100%)',
                  }}
                >
                  <div className="h-full w-full rounded-[15%/7.1%] bg-[#050506] p-[2.3%]">
                    <div className="relative h-full w-full overflow-hidden rounded-[13.3%/6.15%] bg-black">
                      <img
                        src={step.imageUrl}
                        alt={step.heading}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                <span
                  className="mt-5 text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: step.darkAccent }}
                >
                  {stepLabel} {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-800">{step.heading}</h3>
                {step.body ? (
                  <p className="mt-2 max-w-xs text-sm text-slate-600">{step.body}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative bg-[#FAF7F2] text-slate-800" aria-label={sectionTitle}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2]">
          <div className="space-y-6 text-center max-w-sm px-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                JOURNEO DEMO
              </span>
              <h3 className="text-2xl font-bold text-slate-800">Preloading Interactive Sequence</h3>
            </div>
            
            <div className="relative w-64 h-1 bg-slate-200 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            <span className="text-sm font-mono text-slate-600">
              {loadingProgress}%
            </span>
          </div>
        </div>
      )}

      <div ref={stageRef} className="relative flex h-[100svh] w-full flex-col overflow-hidden pt-16">
        {/* Background Layers */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#FAF7F2]" />
          <div className="absolute inset-0 bg-map-grid opacity-100" />
          
          {/* Topographic Contours SVGs */}
          <svg className="absolute -left-10 -top-10 w-[500px] h-[500px] text-amber-900/[0.04] pointer-events-none" viewBox="0 0 100 100" fill="none">
            <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
            <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
            <path className="map-contour" d="M-20,40 C25,25 35,55 45,80 C55,105 95,115 140,120" />
            <path className="map-contour" d="M-20,55 C30,40 40,70 50,95 C60,120 105,130 150,135" />
          </svg>

          <svg className="absolute -right-20 bottom-10 w-[600px] h-[600px] text-amber-900/[0.04] pointer-events-none" viewBox="0 0 100 100" fill="none">
            <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
            <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
            <path className="map-contour" d="M0,120 C10,70 50,60 65,35 C80,10 60,-10 100,-40" />
          </svg>

          {/* Dotted Route Lines (Flight paths) */}
          <svg className="absolute inset-0 w-full h-full text-amber-800/[0.08] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5">
            <path d="M 12% 28% Q 25% 18% 42% 32% T 68% 48% T 88% 72%" />
            <path d="M 85% 15% Q 70% 38% 52% 38% T 18% 78%" />
          </svg>

          {/* Glowing backlights behind phone */}
          {steps.map((step, index) => (
            <div
              key={`glow-${step.id}`}
              ref={(el) => {
                glowRefs.current[index] = el;
              }}
              className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[100px] lg:left-[72%]"
              style={{
                background: `radial-gradient(circle, ${step.accent}22 0%, ${step.accent}05 50%, transparent 70%)`,
              }}
            />
          ))}

          {/* Floating Travel Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[8%] top-[25%] opacity-15 animate-float" style={{ animationDelay: '0s' }}>
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            
            <div ref={planeRef} className="absolute left-[15%] top-[19%] opacity-25 rotate-[15deg] will-change-transform">
              <Plane className="w-8 h-8 text-sky-600 drop-shadow-sm" />
            </div>

            <div ref={compassRef} className="absolute left-[58%] top-[15%] opacity-20 rotate-[-12deg] will-change-transform">
              <Compass className="w-8 h-8 text-amber-700" />
            </div>

            <div className="absolute right-[8%] top-[20%] opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
              <Sun className="w-9 h-9 text-amber-500" />
            </div>

            <div className="absolute left-[5%] top-[55%] opacity-15 rotate-[8deg] animate-float" style={{ animationDelay: '2.2s' }}>
              <Briefcase className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="absolute right-[28%] top-[45%] opacity-15 rotate-[-8deg] animate-float" style={{ animationDelay: '1.8s' }}>
              <Camera className="w-7 h-7 text-rose-600" />
            </div>

            <div className="absolute left-[15%] top-[82%] opacity-20 animate-float" style={{ animationDelay: '4s' }}>
              <Palmtree className="w-10 h-10 text-teal-700" />
            </div>

            <div className="absolute right-[12%] top-[78%] opacity-15 animate-float" style={{ animationDelay: '2.7s' }}>
              <Globe className="w-9 h-9 text-blue-600" />
            </div>

            <div className="absolute left-[45%] top-[88%] opacity-12 rotate-[12deg] animate-float" style={{ animationDelay: '3.5s' }}>
              <MapIcon className="w-8 h-8 text-amber-800" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
        </div>

        {/* Dynamic Story HUD & Mockup Frame */}
        <div className="container-modern relative z-10 flex h-full flex-col">
          {/* Header Title Section */}
          <div
            ref={headerRef}
            className="flex shrink-0 flex-col gap-2 py-3 sm:py-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
          >
            <div className="space-y-1.5 sm:space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {eyebrow}
              </span>
              <h2 className="text-xl font-bold leading-tight text-slate-800 sm:text-2xl lg:text-4xl">
                {sectionTitle}
              </h2>
            </div>
            {sectionSubtitle ? (
              <p className="hidden max-w-md text-sm leading-relaxed text-slate-600 lg:block">
                {sectionSubtitle}
              </p>
            ) : null}
          </div>

          {/* Interactive Core: Left Text Column / Right 3D Mockup */}
          <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-3 lg:grid-cols-2 lg:gap-12">
            
            {/* 3D iPhone Mockup Container */}
            <div className="order-1 flex min-h-0 items-center justify-center lg:order-2">
              <div className="[perspective:1400px]">
                <div
                  ref={phoneRef}
                  className="relative aspect-[715/1496] h-[46svh] max-h-[660px] min-h-[240px] will-change-transform lg:h-[62svh]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Ground Shadow */}
                  <div
                    ref={shadowRef}
                    className="absolute -bottom-6 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-2xl will-change-transform"
                    style={{ transform: 'translateZ(-16px)' }}
                  />

                  {/* 3D Case Back depth panel */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%]"
                    style={{
                      transform: 'translateZ(-6px)',
                      background: 'linear-gradient(135deg, #2b2b30 0%, #151518 100%)',
                      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)',
                    }}
                  />

                  {/* 3D Side Thickness Edges */}
                  <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] border border-[#3e3e46]" style={{ transform: 'translateZ(-4px)' }} />
                  <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] border border-[#2b2b30]" style={{ transform: 'translateZ(-2px)' }} />
                  <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] border border-[#484852]" style={{ transform: 'translateZ(0px)' }} />
                  <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] border border-[#636370]" style={{ transform: 'translateZ(2px)' }} />
                  <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] border border-[#7d7d8c]" style={{ transform: 'translateZ(4px)' }} />

                  {/* Physical Side Buttons */}
                  <div className="absolute -left-[1.1%] top-[15.5%] h-[4.3%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#8E8E96] via-[#3A3A40] to-[#1A1A1E]" style={{ transform: 'translateZ(2px)' }} />
                  <div className="absolute -left-[1.1%] top-[20.4%] h-[7.3%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#8E8E96] via-[#3A3A40] to-[#1A1A1E]" style={{ transform: 'translateZ(2px)' }} />
                  <div className="absolute -left-[1.1%] top-[29.4%] h-[7.3%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#8E8E96] via-[#3A3A40] to-[#1A1A1E]" style={{ transform: 'translateZ(2px)' }} />
                  <div className="absolute -right-[1.1%] top-[22%] h-[11.4%] w-[1.6%] rounded-r-[2px] bg-gradient-to-l from-[#8E8E96] via-[#3A3A40] to-[#1A1A1E]" style={{ transform: 'translateZ(2px)' }} />
                  <div className="absolute -right-[1.1%] top-[37.4%] h-[6%] w-[1.6%] rounded-r-[2px] bg-gradient-to-l from-[#B9B9C0] via-[#4A4A52] to-[#1A1A1E]" style={{ transform: 'translateZ(2px)' }} />

                  {/* Front Face Titanium Frame */}
                  <div
                    className="absolute inset-0 rounded-[15.8%/7.55%] p-[1.1%] shadow-[0_28px_65px_-15px_rgba(120,110,90,0.28)]"
                    style={{
                      transform: 'translateZ(6px)',
                      transformStyle: 'preserve-3d',
                      background:
                        'linear-gradient(100deg,#9A9AA2 0%,#43434B 4%,#1D1D21 12%,#33333A 30%,#26262B 50%,#33333A 70%,#1D1D21 88%,#43434B 96%,#9A9AA2 100%)',
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-[15.8%/7.55%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_5%,transparent_95%,rgba(255,255,255,0.18)_100%)]" />

                    {/* Black Bezel Ring */}
                    <div className="relative h-full w-full rounded-[15%/7.1%] bg-[#050506] p-[2.3%]">
                      {/* Bezel inner Screen area */}
                      <div className="relative h-full w-full overflow-hidden rounded-[13.3%/6.15%] bg-black">
                        
                        {/* HTML5 Canvas drawing the WebP sequence */}
                        <canvas
                          ref={canvasRef}
                          className="w-full h-full block object-cover"
                        />
                        
                        {/* Glass Glossy reflection overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_18%,transparent_38%,transparent_100%)]" />
                      </div>

                      {/* Screen inner light ring */}
                      <div className="pointer-events-none absolute inset-0 rounded-[15%/7.1%] ring-1 ring-inset ring-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Steps Details Content */}
            <div className="order-2 min-h-0 lg:order-1">
              <div className="relative h-[120px] sm:h-[150px] lg:h-[280px]">
                {steps.map((step, index) => (
                  <div
                    key={`copy-${step.id}`}
                    ref={(el) => {
                      copyRefs.current[index] = el;
                    }}
                    className="absolute inset-0 flex flex-col justify-center gap-1.5 opacity-0 lg:gap-4 pointer-events-none"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
                        style={{ color: step.darkAccent }}
                      >
                        {stepLabel} {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="h-px w-10 rounded-full"
                        style={{ backgroundColor: step.accent }}
                      />
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-5xl">
                      {step.heading}
                    </h3>
                    {step.body ? (
                      <p className="max-w-lg text-xs leading-relaxed text-slate-600 sm:text-base lg:text-lg">
                        {step.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Bar: HUD indicators, dot steps and linear progress */}
          <div className="flex shrink-0 items-center gap-3 py-3 sm:gap-4 sm:py-5 z-10 relative">
            <div className="font-mono text-xs tabular-nums text-slate-600">
              <span>{String(activeStepIndex + 1).padStart(2, '0')}</span>
              <span className="text-slate-400"> / {String(totalSteps).padStart(2, '0')}</span>
            </div>

            <div className="relative h-px flex-1 overflow-hidden bg-slate-200">
              <div
                ref={progressRef}
                className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-amber-500 via-sky-500 to-violet-500"
              />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {steps.map((step, index) => (
                <span
                  key={`dot-${step.id}`}
                  ref={(el) => {
                    dotRefs.current[index] = el;
                  }}
                  className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: index === activeStepIndex ? step.darkAccent : 'rgba(0,0,0,0.15)',
                    transform: index === activeStepIndex ? 'scale(1.6)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            <Link
              href="/screenshots"
              className="group hidden items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-800 lg:flex"
            >
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Scroll down tip */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-[4.5rem] z-10 flex justify-center"
        >
          <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            {hint}
          </span>
        </div>
      </div>
    </section>
  );
}
