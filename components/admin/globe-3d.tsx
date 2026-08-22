'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Map as MapIcon, RotateCw, Sparkles, Compass, Crown } from 'lucide-react';
import { CountrySubscriberStat } from '@/lib/supabase/stats';
import { geoOrthographic, geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';

type Globe3DProps = {
  stats: CountrySubscriberStat[];
};

type TimeFilter = 'all' | 'month' | 'quarter';
type ViewMode = '3d' | '2d';

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
  'United States': '840', 'USA': '840', 'US': '840',
  'Germany': '276', 'Almanya': '276', 'DE': '276',
  'United Kingdom': '826', 'UK': '826', 'GB': '826',
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
};

export function Admin3DGlobeCard({ stats }: Globe3DProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [hoveredCountry, setHoveredCountry] = useState<CountrySubscriberStat | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ yaw: -30, pitch: -20 }); // in degrees
  const targetRotationRef = useRef<{ yaw: number; pitch: number } | null>(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Get count per country based on active filter
  const getDisplayCount = useCallback(
    (item: CountrySubscriberStat) => {
      if (filter === 'month') return item.subscribersThisMonth;
      if (filter === 'quarter') return item.subscribersLast3Months;
      return item.totalSubscribers;
    },
    [filter]
  );

  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => getDisplayCount(b) - getDisplayCount(a));
  }, [stats, getDisplayCount]);

  const totalFilteredSubscribers = useMemo(() => {
    return sortedStats.reduce((sum, item) => sum + getDisplayCount(item), 0);
  }, [sortedStats, getDisplayCount]);

  // Lookup map from country numeric ID to CountrySubscriberStat
  const statsByIdMap = useMemo(() => {
    const map = new Map<string, CountrySubscriberStat>();
    sortedStats.forEach((s) => {
      const id = nameToIdMap[s.country] || nameToIdMap[s.countryCode];
      if (id) map.set(id, s);
    });
    return map;
  }, [sortedStats]);

  // Smoothly rotate globe to a country when hovered in the leaderboard
  const focusOnCountry = useCallback((country: CountrySubscriberStat) => {
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
        // Outer Atmosphere Halo
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.85,
          centerX,
          centerY,
          radius * 1.3
        );
        glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
        glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Ocean Sphere Body
        const oceanGrad = ctx.createRadialGradient(
          centerX - radius * 0.3,
          centerY - radius * 0.3,
          radius * 0.1,
          centerX,
          centerY,
          radius
        );
        oceanGrad.addColorStop(0, '#0f172a');
        oceanGrad.addColorStop(0.7, '#070b13');
        oceanGrad.addColorStop(1, '#02040a');

        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sphere Rim
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Graticules (Latitude & Longitude Grid)
      ctx.beginPath();
      geoPathGenerator(graticuleGenerator());
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.12)';
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
          ctx.fillStyle = 'rgba(236, 72, 153, 0.45)';
          ctx.fill();
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else if (activeStat && getDisplayCount(activeStat) > 0) {
          // Country with active members / subscribers
          const count = getDisplayCount(activeStat);
          ctx.fillStyle =
            activeStat.premiumSubscribers > 0
              ? 'rgba(245, 158, 11, 0.35)'
              : 'rgba(56, 189, 248, 0.35)';
          ctx.fill();
          ctx.strokeStyle =
            activeStat.premiumSubscribers > 0
              ? 'rgba(245, 158, 11, 0.9)'
              : 'rgba(56, 189, 248, 0.9)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          // Standard Country Landmass
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // 4. Draw Pin Markers on Top of Active Countries
      sortedStats.forEach((stat) => {
        const count = getDisplayCount(stat);
        if (count === 0) return;

        const coords = projection([stat.lng, stat.lat]);
        if (!coords) return; // Clipped on back of 3D globe

        const [screenX, screenY] = coords;
        const isHovered = hoveredCountry?.country === stat.country;

        // Base Pulse Ring
        ctx.beginPath();
        ctx.arc(screenX, screenY, isHovered ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? 'rgba(244, 63, 94, 0.4)'
          : stat.premiumSubscribers > 0
          ? 'rgba(245, 158, 11, 0.35)'
          : 'rgba(56, 189, 248, 0.35)';
        ctx.fill();

        // Pin Beacon Dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, isHovered ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? '#f43f5e'
          : stat.premiumSubscribers > 0
          ? '#fbbf24'
          : '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Badge Label (Flag + Country Name + Count)
        const labelText = `${stat.flag} ${stat.country}: ${count}`;
        ctx.font = isHovered ? 'bold 11px system-ui, sans-serif' : '500 10px system-ui, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const paddingX = 6;
        const paddingY = 3;
        const boxWidth = textMetrics.width + paddingX * 2;
        const boxHeight = 18;
        const boxX = screenX - boxWidth / 2;
        const boxY = screenY - boxHeight - 7;

        // Badge Box
        ctx.fillStyle = isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();

        ctx.strokeStyle = isHovered
          ? '#f43f5e'
          : stat.premiumSubscribers > 0
          ? 'rgba(245, 158, 11, 0.8)'
          : 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Badge Text
        ctx.fillStyle = isHovered ? '#ffffff' : '#f8fafc';
        ctx.fillText(labelText, boxX + paddingX, boxY + 13);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sortedStats, autoRotate, filter, hoveredCountry, viewMode, statsByIdMap, getDisplayCount]);

  // Drag to rotate handlers (for 3D mode)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

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

  return (
    <Card className="border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900 text-base font-bold">
              <Globe className="h-4 w-4 text-blue-600" />
              Dünya Haritası & Ülke Sınırları — Canlı Üye Dağılımı
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Gerçek ülke sınırları ve coğrafi koordinatlarla kullanıcı ve abone lokasyonları.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle (3D Globe vs 2D Vector Map) */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
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
          <div className="lg:col-span-7 relative flex items-center justify-center rounded-xl border border-slate-900/10 bg-slate-950 p-4 shadow-inner">
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
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Toplam:{' '}
                <strong className="text-cyan-300 font-mono text-sm">{totalFilteredSubscribers}</strong> Kayıtlı Üye
              </span>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              {viewMode === '3d'
                ? '💡 Haritayı döndürmek için sürükleyin · Ülkelere tıklayarak odaklanın'
                : '💡 Gerçek ülke sınırları ve canlı üye lokasyonları'}
            </div>
          </div>

          {/* Country Subscriber Leaderboard Side Panel */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-blue-600" />
                Ülke Dağılımı ({filter === 'all' ? 'Tüm Zamanlar' : filter === 'month' ? 'Bu Ay' : 'Son 3 Ay'})
              </h4>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 text-[10px] font-semibold">
                {sortedStats.length} Ülke
              </Badge>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {sortedStats.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  Henüz konum veya seyahat verisi bulunmuyor.
                </div>
              ) : (
                sortedStats.map((item, index) => {
                  const count = getDisplayCount(item);
                  const maxCount = getDisplayCount(sortedStats[0]) || 1;
                  const pct = Math.round((count / maxCount) * 100);
                  const isHovered = hoveredCountry?.country === item.country;

                  return (
                    <div
                      key={item.country}
                      onMouseEnter={() => focusOnCountry(item)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => focusOnCountry(item)}
                      className={`cursor-pointer rounded-xl border p-2.5 transition-all ${
                        isHovered
                          ? 'border-blue-300 bg-blue-50/60 shadow-xs scale-[1.01]'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-800">
                          <span className="font-mono text-[10px] text-slate-400 w-4">#{index + 1}</span>
                          <span className="text-base">{item.flag}</span>
                          {item.country}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.premiumSubscribers > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                              <Crown className="h-3 w-3 text-amber-500" />
                              {item.premiumSubscribers} Prem
                            </span>
                          )}
                          <span className="font-mono text-xs font-bold text-blue-600">
                            {count} <span className="text-[10px] font-normal text-slate-400">üye</span>
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
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
