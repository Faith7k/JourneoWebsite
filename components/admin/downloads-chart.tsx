'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { ChartOptions, ChartData } from 'chart.js';
import { MonthlyDownloadStat } from '@/lib/supabase/stats';
import { Apple, Play, TrendingUp, Layers } from 'lucide-react';

interface DownloadsChartProps {
  data: MonthlyDownloadStat[];
  totalDownloads: number;
  appStoreDownloads: number;
  playStoreDownloads: number;
}

export function AdminDownloadsChart({
  data,
  totalDownloads,
  appStoreDownloads,
  playStoreDownloads,
}: DownloadsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'cumulative'>('monthly');

  const iosRatio = totalDownloads > 0 ? Math.round((appStoreDownloads / totalDownloads) * 100) : 0;
  const androidRatio = totalDownloads > 0 ? Math.round((playStoreDownloads / totalDownloads) * 100) : 0;

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map((d) => d.month);

    // Gradients for area fill
    const iosGradient = ctx.createLinearGradient(0, 0, 0, 300);
    iosGradient.addColorStop(0, 'rgba(59, 130, 246, 0.28)');
    iosGradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

    const androidGradient = ctx.createLinearGradient(0, 0, 0, 300);
    androidGradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    androidGradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    const totalGradient = ctx.createLinearGradient(0, 0, 0, 300);
    totalGradient.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
    totalGradient.addColorStop(1, 'rgba(139, 92, 246, 0.01)');

    const chartData: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: 'App Store (iOS)',
          data: data.map((d) => (viewMode === 'monthly' ? d.ios : d.cumulativeIos)),
          borderColor: '#2563eb', // Blue-600
          backgroundColor: iosGradient,
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#2563eb',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6.5,
          pointHoverBackgroundColor: '#2563eb',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5,
        },
        {
          label: playStoreDownloads === 0 ? 'Google Play Store (İncelemede)' : 'Google Play Store (Android)',
          data: data.map((d) => (viewMode === 'monthly' ? d.android : d.cumulativeAndroid)),
          borderColor: '#059669', // Emerald-600
          backgroundColor: androidGradient,
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#059669',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6.5,
          pointHoverBackgroundColor: '#059669',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5,
        },
        {
          label: 'Toplam Organik Kayıt',
          data: data.map((d) => (viewMode === 'monthly' ? d.total : d.cumulativeTotal)),
          borderColor: '#8b5cf6', // Violet-500
          backgroundColor: totalGradient,
          fill: false,
          borderDash: [5, 5],
          tension: 0.38,
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#8b5cf6',
          pointBorderWidth: 2,
          pointRadius: 4.5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#8b5cf6',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5,
        },
      ],
    };

    // Scale options with titles configured according to Chart.js sample:
    // https://www.chartjs.org/docs/latest/samples/scale-options/titles.html
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
            label: function (context) {
              const val = context.parsed.y ?? 0;
              const formattedVal = val.toLocaleString('tr-TR');
              return ` ${context.dataset.label}: ${formattedVal} kullanıcı`;
            },
            afterBody: function (contexts) {
              if (contexts.length >= 2) {
                const totalItem = contexts.find((c) => c.dataset.label?.includes('Toplam'));
                const totalVal = totalItem?.parsed.y ?? 1;
                return [
                  '───────────────────────',
                  `📊 Toplam: ${totalVal.toLocaleString('tr-TR')} kayıt`,
                ];
              }
              return [];
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Aylar (2026)',
            color: '#475569',
            font: {
              size: 12,
              weight: 'bold',
              lineHeight: 1.3,
              family: 'inherit',
            },
            padding: { top: 12, bottom: 0 },
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.7)',
            tickLength: 6,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
              weight: 600,
              family: 'inherit',
            },
            padding: 6,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: viewMode === 'monthly' ? 'Aylık Kayıt Sayısı (Kişi)' : 'Kümülatif Toplam Kayıt (Kişi)',
            color: '#475569',
            font: {
              size: 12,
              weight: 'bold',
              lineHeight: 1.3,
              family: 'inherit',
            },
            padding: { top: 0, bottom: 10 },
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(226, 232, 240, 0.7)',
            tickLength: 6,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
              weight: 600,
              family: 'inherit',
            },
            padding: 8,
            callback: function (value) {
              return Number(value).toLocaleString('tr-TR');
            },
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
  }, [data, viewMode, playStoreDownloads]);

  return (
    <div className="w-full space-y-4">
      {/* ── Sub-header with Quick Pills & Switcher ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-xs font-semibold text-blue-700">
            <Apple className="h-3.5 w-3.5 fill-current" />
            <span>App Store:</span>
            <span className="font-extrabold tabular-nums">
              {appStoreDownloads.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] text-blue-500 font-bold">({iosRatio}%)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-xs font-semibold text-emerald-700">
            <Play className="h-3 w-3 fill-current" />
            <span>Play Store:</span>
            <span className="font-extrabold tabular-nums">
              {playStoreDownloads.toLocaleString('tr-TR')}
            </span>
            {playStoreDownloads === 0 ? (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                İncelemede
              </span>
            ) : (
              <span className="text-[10px] text-emerald-500 font-bold">({androidRatio}%)</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200/70 text-xs font-semibold text-purple-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Toplam:</span>
            <span className="font-extrabold tabular-nums">
              {totalDownloads.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Aylık Dağılım
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
            Kümülatif Toplam
          </button>
        </div>
      </div>

      {/* ── Chart Container ───────────────────────────────────── */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <canvas ref={canvasRef} id="journeoDownloadsChart" />
      </div>
    </div>
  );
}
