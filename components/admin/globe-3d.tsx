'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Users, Crown, Filter, RotateCw, Sparkles, MapPin } from 'lucide-react';
import { CountrySubscriberStat } from '@/lib/supabase/stats';

type Globe3DProps = {
  stats: CountrySubscriberStat[];
};

type TimeFilter = 'all' | 'month' | 'quarter';

export function Admin3DGlobeCard({ stats }: Globe3DProps) {
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [hoveredCountry, setHoveredCountry] = useState<CountrySubscriberStat | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ rotX: 0.3, rotY: -0.5 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Get count per country based on active filter
  const getDisplayCount = React.useCallback(
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

  // 3D Canvas Rendering & Rotation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.rotY += 0.004;
      }

      const rotX = rotationRef.current.rotX;
      const rotY = rotationRef.current.rotY;

      // 1. Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.85, centerX, centerY, radius * 1.25);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Body
      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, '#1e293b');
      globeGrad.addColorStop(0.7, '#0f172a');
      globeGrad.addColorStop(1, '#020617');

      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Grid Lines (Graticules)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';

      // Latitudes
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const rad = (lat * Math.PI) / 180;
        const rLat = radius * Math.cos(rad);
        const yLat = centerY - radius * Math.sin(rad);

        ctx.ellipse(centerX, yLat, rLat, rLat * Math.sin(rotX), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Project & Draw Country Markers
      sortedStats.forEach((stat) => {
        const count = getDisplayCount(stat);
        if (count === 0) return;

        const phi = ((90 - stat.lat) * Math.PI) / 180;
        const theta = ((stat.lng + 180) * Math.PI) / 180;

        // 3D Spherical coordinates
        const x3d = -radius * Math.sin(phi) * Math.cos(theta);
        const y3d = radius * Math.cos(phi);
        const z3d = radius * Math.sin(phi) * Math.sin(theta);

        // Rotate around Y axis
        const xRotY = x3d * Math.cos(rotY) + z3d * Math.sin(rotY);
        const zRotY = -x3d * Math.sin(rotY) + z3d * Math.cos(rotY);

        // Rotate around X axis
        const yRotX = y3d * Math.cos(rotX) - zRotY * Math.sin(rotX);
        const zRotX = y3d * Math.sin(rotX) + zRotY * Math.cos(rotX);

        // Only draw if marker is on front hemisphere (zRotX > -radius * 0.1)
        if (zRotX > -radius * 0.25) {
          const screenX = centerX + xRotY;
          const screenY = centerY - yRotX;

          // Scale marker size by subscriber volume
          const nodeRadius = Math.max(4, Math.min(14, 4 + Math.log2(count + 1) * 1.5));
          const opacity = Math.max(0.2, (zRotX + radius) / (radius * 2));

          // Pulsing Glow Ring
          ctx.beginPath();
          ctx.arc(screenX, screenY, nodeRadius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 0.35})`;
          ctx.fill();

          // Core Pin Dot
          ctx.beginPath();
          ctx.arc(screenX, screenY, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = stat.premiumSubscribers > 20 ? '#f59e0b' : '#38bdf8';
          ctx.globalAlpha = opacity;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Country Flag & Count Tag
          ctx.font = '10px sans-serif';
          ctx.fillStyle = `rgba(241, 245, 249, ${opacity})`;
          ctx.fillText(`${stat.flag} ${count}`, screenX + nodeRadius + 3, screenY + 3);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sortedStats, autoRotate, filter]);

  // Mouse Interaction handlers for drag-to-rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;

    rotationRef.current.rotY += dx * 0.005;
    rotationRef.current.rotX = Math.max(-1.2, Math.min(1.2, rotationRef.current.rotX + dy * 0.005));

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Globe className="h-5 w-5 text-cyan-400" />
              İnteraktif 3D Küre — Ülkelere Göre Abone Dağılımı
            </CardTitle>
            <CardDescription className="text-slate-400">
              Dünyanın dört bir yanındaki mobil abonelerin canlı konum haritası ve zaman bazlı analizi.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as TimeFilter)}>
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="all" className="text-xs">
                  Tüm Zamanlar
                </TabsTrigger>
                <TabsTrigger value="month" className="text-xs">
                  Bu Ay
                </TabsTrigger>
                <TabsTrigger value="quarter" className="text-xs">
                  Son 3 Ay
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs transition-colors ${
                autoRotate ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              Dönüş
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 lg:grid-cols-12 items-center">
          {/* 3D Canvas Viewport */}
          <div className="lg:col-span-7 relative flex items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={420}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-grab active:cursor-grabbing touch-none max-w-full"
            />

            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Filtre Toplamı:{' '}
                <strong className="text-cyan-300 font-mono">{totalFilteredSubscribers}</strong> Abone
              </span>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
              💡 Haritayı 360° döndürmek için sürükleyin
            </div>
          </div>

          {/* Country Subscriber Leaderboard Side Panel */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ülke Sıralaması ({filter === 'all' ? 'Tüm Zamanlar' : filter === 'month' ? 'Bu Ay' : 'Son 3 Ay'})
              </h4>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                {sortedStats.length} Ülke
              </Badge>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {sortedStats.map((item) => {
                const count = getDisplayCount(item);
                const maxCount = getDisplayCount(sortedStats[0]) || 1;
                const pct = Math.round((count / maxCount) * 100);
                const premiumPct = count > 0 ? Math.round((item.premiumSubscribers / count) * 100) : 0;

                return (
                  <div
                    key={item.country}
                    onMouseEnter={() => setHoveredCountry(item)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className={`rounded-lg border p-2.5 transition-colors ${
                      hoveredCountry?.country === item.country
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-slate-800/80 bg-slate-800/30 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-2 font-medium text-slate-200">
                        <span className="text-base">{item.flag}</span>
                        {item.country}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.premiumSubscribers > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Crown className="h-3 w-3" />
                            {item.premiumSubscribers} Prem
                          </span>
                        )}
                        <span className="font-mono text-sm font-bold text-cyan-300">{count}</span>
                      </div>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
