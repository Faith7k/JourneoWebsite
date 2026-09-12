'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Map as MapIcon, RotateCw, Sparkles, Compass, Crown, Users } from 'lucide-react';
import { CountrySubscriberStat, TripDestinationStat } from '@/lib/supabase/stats';
import { geoOrthographic, geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';

type Globe3DProps = {
  stats: CountrySubscriberStat[];
  tripStats?: TripDestinationStat[];
};

type TimeFilter = 'all' | 'month' | 'quarter';
type ViewMode = '3d' | '2d';
type DataMode = 'users' | 'trips';

// Extract country features from world-atlas
const countriesGeo = (feature(
  worldData as any,
  (worldData as any).objects.countries
) as any).features as any[];

const graticuleGenerator = geoGraticule();

// ISO Country ID to Name / Code mapping
const countryIdMap: Record<string, string> = {
  '792': 'Türkiye',
  '840': 'United States',
  '276': 'Germany',
  '826': 'United Kingdom',
  '250': 'France',
  '380': 'Italy',
  '724': 'Spain',
  '392': 'Japan',
  '620': 'Portugal',
  '528': 'Netherlands',
  '124': 'Canada',
  '036': 'Australia',
  '076': 'Brazil',
  '784': 'United Arab Emirates',
  '300': 'Greece',
  '756': 'Switzerland',
  '040': 'Austria',
  '752': 'Sweden',
  '578': 'Norway',
  '208': 'Denmark',
  '246': 'Finland',
  '616': 'Poland',
  '056': 'Belgium',
  '372': 'Ireland',
  '643': 'Russia',
  '156': 'China',
  '356': 'India',
  '410': 'South Korea',
  '682': 'Saudi Arabia',
  '818': 'Egypt',
  '710': 'South Africa',
  '484': 'Mexico',
  '032': 'Argentina',
  '152': 'Chile',
  '170': 'Colombia',
  '702': 'Singapore',
  '458': 'Malaysia',
  '764': 'Thailand',
  '360': 'Indonesia',
  '554': 'New Zealand',
};

const nameToIdMap: Record<string, string> = {
  'Türkiye': '792', 'Turkey': '792', 'TR': '792',
  'United States': '840', 'USA': '840', 'US': '840', 'Amerika Birleşik Devletleri': '840',
  'Germany': '276', 'Almanya': '276', 'DE': '276',
  'United Kingdom': '826', 'UK': '826', 'GB': '826', 'Birleşik Krallık': '826',
  'France': '250', 'Fransa': '250', 'FR': '250',
  'Italy': '380', 'İtalya': '380', 'IT': '380',
  'Spain': '724', 'İspanya': '724', 'ES': '724',
  'Japan': '392', 'Japonya': '392', 'JP': '392',
  'Portugal': '620', 'Portekiz': '620', 'PT': '620',
  'Netherlands': '528', 'Hollanda': '528', 'NL': '528',
  'Canada': '124', 'Kanada': '124', 'CA': '124',
  'Australia': '036', 'Avustralya': '036', 'AU': '036',
  'Brazil': '076', 'Brezilya': '076', 'BR': '076',
  'United Arab Emirates': '784', 'Birleşik Arap Emirlikleri': '784', 'AE': '784',
  'Greece': '300', 'Yunanistan': '300', 'GR': '300',
  'Switzerland': '756', 'İsviçre': '756', 'CH': '756',
  'Austria': '040', 'Avusturya': '040', 'AT': '040',
  'Egypt': '818', 'Mısır': '818', 'EG': '818',
  'South Korea': '410', 'Güney Kore': '410', 'KR': '410',
};

type UnifiedMapStat = {
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  count: number;
  premiumCount?: number;
  subLabel?: string;
};

export function Admin3DGlobeCard({ stats, tripStats = [] }: Globe3DProps) {
  const [dataMode, setDataMode] = useState<DataMode>('users');
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [hoveredCountry, setHoveredCountry] = useState<UnifiedMapStat | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ yaw: -30, pitch: -20 }); // in degrees
  const targetRotationRef = useRef<{ yaw: number; pitch: number } | null>(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Compute unified active dataset based on dataMode ('users' vs 'trips') and filter
  const unifiedStats: UnifiedMapStat[] = useMemo(() => {
    if (dataMode === 'trips') {
      return (tripStats ?? [])
        .map((s) => {
          let count = s.totalTrips;
          if (filter === 'month') count = s.tripsThisMonth;
          if (filter === 'quarter') count = s.tripsLast3Months;
          return {
            country: s.country,
            countryCode: s.countryCode,
            flag: s.flag,
            lat: s.lat,
            lng: s.lng,
            count,
            subLabel: s.cities && s.cities.length > 0 ? s.cities.slice(0, 3).join(', ') : undefined,
          };
        })
        .filter((s) => s.count > 0)
        .sort((a, b) => b.count - a.count);
    }

    return (stats ?? [])
      .map((s) => {
        let count = s.totalSubscribers;
        if (filter === 'month') count = s.subscribersThisMonth;
        if (filter === 'quarter') count = s.subscribersLast3Months;
        return {
          country: s.country,
          countryCode: s.countryCode,
          flag: s.flag,
          lat: s.lat,
          lng: s.lng,
          count,
          premiumCount: s.premiumSubscribers,
        };
      })
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [stats, tripStats, dataMode, filter]);

  const totalFilteredCount = useMemo(() => {
    return unifiedStats.reduce((sum, item) => sum + item.count, 0);
  }, [unifiedStats]);

  // Lookup map from country numeric ID to UnifiedMapStat
  const statsByIdMap = useMemo(() => {
    const map = new Map<string, UnifiedMapStat>();
    unifiedStats.forEach((s) => {
      const id = nameToIdMap[s.country] || nameToIdMap[s.countryCode];
      if (id) map.set(id, s);
    });
    return map;
  }, [unifiedStats]);

  // Smoothly rotate globe to a country when hovered in the leaderboard
  const focusOnCountry = useCallback((country: UnifiedMapStat) => {
    setAutoRotate(false);
    targetRotationRef.current = {
      yaw: -country.lng,
      pitch: -country.lat * 0.5,
    };
    setHoveredCountry(country);
  }, []);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Camera auto-rotation or interpolation
      if (viewMode === '3d') {
        if (targetRotationRef.current) {
          const dyaw = targetRotationRef.current.yaw - rotationRef.current.yaw;
          const dpitch = targetRotationRef.current.pitch - rotationRef.current.pitch;
          rotationRef.current.yaw += dyaw * 0.08;
          rotationRef.current.pitch += dpitch * 0.08;
          if (Math.abs(dyaw) < 0.1 && Math.abs(dpitch) < 0.1) {
            targetRotationRef.current = null;
          }
        } else if (autoRotate && !isDraggingRef.current) {
          rotationRef.current.yaw += 0.25;
        }
      }

      // Initialize Projection
      const radius = Math.min(width, height) * 0.4;
      const projection =
        viewMode === '3d'
          ? geoOrthographic()
              .scale(radius)
              .translate([centerX, centerY])
              .rotate([rotationRef.current.yaw, rotationRef.current.pitch])
              .clipAngle(90)
          : geoNaturalEarth1()
              .scale(width / 5.8)
              .translate([centerX, centerY + 10]);

      const geoPathGenerator = geoPath(projection, ctx);

      // 1. Atmosphere / Ocean Background
      if (viewMode === '3d') {
        // Outer Atmosphere Halo (Light soft blue ambient)
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.85,
          centerX,
          centerY,
          radius * 1.25
        );
        glowGrad.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
        glowGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // Ocean Sphere Body (Crisp, clean light water)
        const oceanGrad = ctx.createRadialGradient(
          centerX - radius * 0.25,
          centerY - radius * 0.25,
          radius * 0.05,
          centerX,
          centerY,
          radius
        );
        oceanGrad.addColorStop(0, '#ffffff');
        oceanGrad.addColorStop(0.5, '#f0f9ff');
        oceanGrad.addColorStop(0.85, '#e0f2fe');
        oceanGrad.addColorStop(1, '#bae6fd');

        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sphere Rim
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Graticules (Latitude & Longitude Grid)
      ctx.beginPath();
      geoPathGenerator(graticuleGenerator());
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 3. Render Real World Country Polygons & Boundaries
      countriesGeo.forEach((feature) => {
        const countryId = String(feature.id).padStart(3, '0');
        const activeStat = statsByIdMap.get(countryId);
        const isHovered =
          hoveredCountry &&
          (hoveredCountry.country === activeStat?.country ||
            nameToIdMap[hoveredCountry.country] === countryId);

        ctx.beginPath();
        geoPathGenerator(feature);

        if (isHovered) {
          // Highlighted Country Fill
          ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
          ctx.fill();
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else if (activeStat && activeStat.count > 0) {
          const isPremium = (activeStat.premiumCount ?? 0) > 0;
          ctx.fillStyle = isPremium
            ? 'rgba(245, 158, 11, 0.4)'
            : dataMode === 'trips'
            ? 'rgba(99, 102, 241, 0.35)'
            : 'rgba(37, 99, 235, 0.32)';
          ctx.fill();
          ctx.strokeStyle = isPremium
            ? '#d97706'
            : dataMode === 'trips'
            ? '#6366f1'
            : '#2563eb';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          // Standard Country Landmass (Soft, elegant light slate)
          ctx.fillStyle = '#e2e8f0';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      });

      // 4. Draw Pin Markers on Top of Active Countries
      unifiedStats.forEach((stat) => {
        const count = stat.count;
        if (count === 0) return;

        const coords = projection([stat.lng, stat.lat]);
        if (!coords) return; // Clipped on back of 3D globe

        const [screenX, screenY] = coords;
        const isHovered = hoveredCountry?.country === stat.country;
        const isPremium = (stat.premiumCount ?? 0) > 0;

        // Base Pulse Ring
        ctx.beginPath();
        ctx.arc(screenX, screenY, isHovered ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? 'rgba(244, 63, 94, 0.25)'
          : isPremium
          ? 'rgba(245, 158, 11, 0.25)'
          : dataMode === 'trips'
          ? 'rgba(99, 102, 241, 0.25)'
          : 'rgba(37, 99, 235, 0.25)';
        ctx.fill();

        // Pin Beacon Dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, isHovered ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? '#f43f5e'
          : isPremium
          ? '#d97706'
          : dataMode === 'trips'
          ? '#6366f1'
          : '#2563eb';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Badge Label (Flag + Country Name + Count)
        const unit = dataMode === 'trips' ? 'gezi' : 'üye';
        const labelText = `${stat.flag} ${stat.country}: ${count} ${unit}`;
        ctx.font = isHovered ? 'bold 11px system-ui, sans-serif' : '600 10px system-ui, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const paddingX = 6;
        const boxWidth = textMetrics.width + paddingX * 2;
        const boxHeight = 18;
        const boxX = screenX - boxWidth / 2;
        const boxY = screenY - boxHeight - 7;

        // Badge Box (Clean white card pill)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();

        ctx.strokeStyle = isHovered
          ? '#f43f5e'
          : isPremium
          ? 'rgba(245, 158, 11, 0.85)'
          : dataMode === 'trips'
          ? 'rgba(99, 102, 241, 0.85)'
          : 'rgba(37, 99, 235, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Badge Text (Dark slate, crisp and clear)
        ctx.fillStyle = '#0f172a';
        ctx.fillText(labelText, boxX + paddingX, boxY + 13);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [unifiedStats, autoRotate, filter, hoveredCountry, viewMode, statsByIdMap, dataMode]);

  // Drag to rotate handlers (for 3D mode)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    if (isDraggingRef.current && viewMode === '3d') {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;

      rotationRef.current.yaw += dx * 0.4;
      rotationRef.current.pitch = Math.max(
        -60,
        Math.min(60, rotationRef.current.pitch - dy * 0.4)
      );
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const filterLabel = filter === 'all' ? 'Tüm Zamanlar' : filter === 'month' ? 'Bu Ay' : 'Son 3 Ay';

  return (
    <Card className="border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900 text-base font-bold">
              {dataMode === 'trips' ? (
                <>
                  <Compass className="h-4 w-4 text-indigo-600" />
                  Dünya Haritası — Planlanan Gezi Rotaları
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 text-blue-600" />
                  Dünya Haritası — Kayıtlı Kullanıcı Dağılımı
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              {dataMode === 'trips'
                ? 'Kullanıcıların oluşturduğu gezi planları, rota hedefleri ve seyahat destinasyonları.'
                : 'Hesap verilerinden tahmini olarak sınıflandırılmış kayıtlı kullanıcı ve abone dağılımı.'}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Mode Switcher: Users vs Trips */}
            {tripStats && tripStats.length > 0 && (
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setDataMode('users');
                    setHoveredCountry(null);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    dataMode === 'users'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Kayıtlı Kullanıcılar ({stats.reduce((s, x) => s + x.totalSubscribers, 0)})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDataMode('trips');
                    setHoveredCountry(null);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    dataMode === 'trips'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  Gezi Rotaları ({tripStats.reduce((s, x) => s + x.totalTrips, 0)})
                </button>
              </div>
            )}

            {/* View Mode Toggle (3D Küre vs 2D Harita) */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === '3d'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                3D Küre
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === '2d'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" />
                2D Harita
              </button>
            </div>

            {/* Time Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as TimeFilter)}>
              <TabsList className="bg-slate-50 border border-slate-200">
                <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs">
                  Tüm Zamanlar
                </TabsTrigger>
                <TabsTrigger value="month" className="text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs">
                  Bu Ay
                </TabsTrigger>
                <TabsTrigger value="quarter" className="text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs">
                  Son 3 Ay
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {viewMode === '3d' && (
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium transition-all ${
                  autoRotate
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                Dönüş
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 lg:grid-cols-12 items-center">
          {/* Real Country Boundaries Canvas Viewport */}
          <div className="lg:col-span-7 relative flex items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50/60 via-white to-sky-50/30 p-4 shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              width={560}
              height={440}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`touch-none max-w-full ${
                viewMode === '3d' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
            />

            {/* Top Metric Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/95 px-3 py-1.5 text-xs text-slate-700 shadow-2xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>
                Toplam:{' '}
                <strong className={`font-mono text-sm ${dataMode === 'trips' ? 'text-indigo-600' : 'text-blue-600'}`}>
                  {totalFilteredCount}
                </strong>{' '}
                {dataMode === 'trips' ? 'Planlanan Gezi' : 'Kayıtlı Üye'}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 bg-white/95 px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs backdrop-blur">
              {viewMode === '3d'
                ? '💡 Haritayı döndürmek için sürükleyin · Ülkelere tıklayarak odaklanın'
                : '💡 Gerçek ülke sınırları ve dağılım lokasyonları'}
            </div>
          </div>

          {/* Country Leaderboard Side Panel */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-blue-600" />
                {dataMode === 'trips' ? 'Destinasyon Dağılımı' : 'Ülke Dağılımı'} ({filterLabel})
              </h4>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 text-[10px] font-semibold">
                {unifiedStats.length} Ülke
              </Badge>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {unifiedStats.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  Henüz konum veya seyahat verisi bulunmuyor.
                </div>
              ) : (
                unifiedStats.map((item, index) => {
                  const maxCount = unifiedStats[0]?.count || 1;
                  const pct = Math.round((item.count / maxCount) * 100);
                  const isHovered = hoveredCountry?.country === item.country;

                  return (
                    <div
                      key={item.country}
                      onMouseEnter={() => focusOnCountry(item)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => focusOnCountry(item)}
                      className={`cursor-pointer rounded-xl border p-2.5 transition-all ${
                        isHovered
                          ? dataMode === 'trips'
                            ? 'border-indigo-300 bg-indigo-50/60 shadow-xs scale-[1.01]'
                            : 'border-blue-300 bg-blue-50/60 shadow-xs scale-[1.01]'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-800 truncate">
                          <span className="font-mono text-[10px] text-slate-400 w-4">#{index + 1}</span>
                          <span className="text-base">{item.flag}</span>
                          <span className="truncate">{item.country}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.premiumCount !== undefined && item.premiumCount > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                              <Crown className="h-3 w-3 text-amber-500" />
                              {item.premiumCount} Prem
                            </span>
                          )}
                          <span
                            className={`font-mono text-xs font-bold ${
                              dataMode === 'trips' ? 'text-indigo-600' : 'text-blue-600'
                            }`}
                          >
                            {item.count}{' '}
                            <span className="text-[10px] font-normal text-slate-400">
                              {dataMode === 'trips' ? 'gezi' : 'üye'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {item.subLabel && (
                        <p className="text-[10px] text-slate-500 truncate mb-1.5 pl-6">
                          📍 {item.subLabel}
                        </p>
                      )}

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            dataMode === 'trips' ? 'bg-indigo-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
