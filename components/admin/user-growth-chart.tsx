'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { ChartOptions, ChartData } from 'chart.js';
import { UserGrowthPoint } from '@/lib/supabase/stats';
import { TrendingUp, UserPlus, Users, Sparkles } from 'lucide-react';

interface UserGrowthChartProps {
  data: UserGrowthPoint[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'daily' | 'cumulative'>('both');

  const total30d = data.reduce((acc, d) => acc + d.count, 0);
  const maxDay = data.reduce((max, d) => Math.max(max, d.count), 0);
  const lastCumulative = data.length > 0 ? data[data.length - 1].cumulative ?? total30d : total30d;

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Format date labels: '09-04' -> '4 Eyl' or '09-04'
    const monthMap: Record<string, string> = {
      '01': 'Oca',
      '02': 'Şub',
      '03': 'Mar',
      '04': 'Nis',
      '05': 'May',
      '06': 'Haz',
      '07': 'Tem',
      '08': 'Ağu',
      '09': 'Eyl',
      '10': 'Eki',
      '11': 'Kas',
      '12': 'Ara',
    };

    const labels = data.map((d) => {
      const parts = d.date.split('-');
      if (parts.length === 3) {
        const m = monthMap[parts[1]] || parts[1];
        const day = parseInt(parts[2], 10);
        return `${day} ${m}`;
      }
      return d.date.slice(5);
    });

    // Gradients for line area fills
    const emeraldGradient = ctx.createLinearGradient(0, 0, 0, 300);
    emeraldGradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    emeraldGradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
    blueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

    const datasets = [];

    // Daily New Users dataset
    if (viewMode === 'both' || viewMode === 'daily') {
      datasets.push({
        label: 'Günlük Yeni Kayıt',
        data: data.map((d) => d.count),
        borderColor: '#059669', // Emerald-600
        backgroundColor: emeraldGradient,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#059669',
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6.5,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2.5,
      });
    }

    // Cumulative Total Users dataset
    if (viewMode === 'both' || viewMode === 'cumulative') {
      datasets.push({
        label: 'Kümülatif Toplam Kayıt',
        data: data.map((d) => d.cumulative ?? d.count),
        borderColor: '#2563eb', // Blue-600
        backgroundColor: blueGradient,
        fill: viewMode === 'cumulative',
        borderDash: viewMode === 'both' ? [5, 5] : undefined,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2563eb',
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6.5,
        pointHoverBackgroundColor: '#2563eb',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2.5,
      });
    }

    const chartData: ChartData<'line'> = {
      labels,
      datasets,
    };

    // Chart.js Line Chart Options matching https://www.chartjs.org/docs/latest/samples/line/line.html
    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            font: {
              size: 12,
              weight: 'bold',
              family: 'inherit',
            },
            color: '#334155',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          titleFont: {
            size: 13,
            weight: 'bold',
            family: 'inherit',
          },
          bodyColor: '#e2e8f0',
          bodyFont: {
            size: 12,
            family: 'inherit',
          },
          padding: 12,
          cornerRadius: 10,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            title: function (contexts) {
              if (contexts.length > 0) {
                const idx = contexts[0].dataIndex;
                const rawDate = data[idx]?.date;
                return `📅 Tarih: ${rawDate}`;
              }
              return '';
            },
            label: function (context) {
              const val = context.parsed.y ?? 0;
              return ` ${context.dataset.label}: ${val} kişi`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Tarih (Son 30 Gün)',
            color: '#64748b',
            font: {
              size: 11,
              weight: 'bold',
              family: 'inherit',
            },
            padding: { top: 10, bottom: 0 },
          },
          grid: {
            color: 'rgba(241, 245, 249, 0.9)',
            tickLength: 6,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 10,
              weight: 500,
              family: 'inherit',
            },
            maxTicksLimit: 12,
            padding: 6,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: viewMode === 'cumulative' ? 'Kümülatif Kayıt (Kişi)' : 'Kullanıcı Kaydı (Kişi)',
            color: '#64748b',
            font: {
              size: 11,
              weight: 'bold',
              family: 'inherit',
            },
            padding: { top: 0, bottom: 8 },
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(241, 245, 249, 0.9)',
            tickLength: 6,
          },
          ticks: {
            color: '#64748b',
            stepSize: 1,
            precision: 0,
            font: {
              size: 10,
              weight: 500,
              family: 'inherit',
            },
            padding: 8,
          },
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, viewMode]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400 italic">
        Henüz kullanıcı kayıt verisi bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Metrics and Mode Selectors Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-xs font-semibold text-emerald-700">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Son 30 Günde Yeni:</span>
            <span className="font-extrabold tabular-nums">{total30d} kullanıcı</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-xs font-semibold text-blue-700">
            <Users className="h-3.5 w-3.5" />
            <span>Kümülatif Toplam:</span>
            <span className="font-extrabold tabular-nums">{lastCumulative} üye</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200/70 text-xs font-semibold text-purple-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zirve Gün:</span>
            <span className="font-extrabold tabular-nums">{maxDay} kayıt/gün</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'both'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Günlük & Kümülatif
          </button>
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sadece Günlük
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cumulative')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'cumulative'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sadece Kümülatif
          </button>
        </div>
      </div>

      {/* Chart.js Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <canvas ref={canvasRef} id="userGrowthChartCanvas" />
      </div>
    </div>
  );
}
