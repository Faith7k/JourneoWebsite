'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { ChartOptions, ChartData } from 'chart.js';
import { DollarSign, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { formatUsd } from '@/lib/costs';

type CostPoint = { bucket: string; cost_usd: number; request_count: number };

interface AdminCostTrendChartProps {
  data: CostPoint[];
  interval: 'hour' | 'day' | 'month';
}

function formatBucketLabel(bucket: string, interval: 'hour' | 'day' | 'month'): string {
  try {
    const d = new Date(bucket);
    if (!isNaN(d.getTime())) {
      if (interval === 'hour') {
        return new Intl.DateTimeFormat('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(d);
      } else if (interval === 'month') {
        return new Intl.DateTimeFormat('tr-TR', {
          month: 'short',
          year: 'numeric',
        }).format(d);
      } else {
        return new Intl.DateTimeFormat('tr-TR', {
          day: 'numeric',
          month: 'short',
        }).format(d);
      }
    }
  } catch {
    // fallback
  }
  return interval === 'hour' ? bucket.slice(11, 16) : bucket.slice(5, 10);
}

function formatBucketTooltip(bucket: string, interval: 'hour' | 'day' | 'month'): string {
  try {
    const d = new Date(bucket);
    if (!isNaN(d.getTime())) {
      if (interval === 'hour') {
        return `📅 ${new Intl.DateTimeFormat('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(d)}`;
      } else {
        return `📅 ${new Intl.DateTimeFormat('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(d)}`;
      }
    }
  } catch {
    // fallback
  }
  return `📅 ${bucket}`;
}

export function AdminCostTrendChart({ data, interval }: AdminCostTrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'cost' | 'requests'>('both');

  const totalCost = data.reduce((acc, d) => acc + d.cost_usd, 0);
  const totalRequests = data.reduce((acc, d) => acc + d.request_count, 0);
  const peakCost = data.reduce((max, d) => Math.max(max, d.cost_usd), 0);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map((d) => formatBucketLabel(d.bucket, interval));

    // Gradients for area fills
    const emeraldGradient = ctx.createLinearGradient(0, 0, 0, 320);
    emeraldGradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    emeraldGradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    const blueGradient = ctx.createLinearGradient(0, 0, 0, 320);
    blueGradient.addColorStop(0, 'rgba(37, 99, 235, 0.20)');
    blueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

    const datasets = [];

    // Harcama Tutarı ($) Dataset
    if (viewMode === 'both' || viewMode === 'cost') {
      datasets.push({
        label: 'Harcama Tutarı ($)',
        data: data.map((d) => d.cost_usd),
        borderColor: '#059669', // Emerald-600
        backgroundColor: emeraldGradient,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        yAxisID: 'y',
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

    // İstek / Çağrı Sayısı Dataset
    if (viewMode === 'both' || viewMode === 'requests') {
      datasets.push({
        label: 'İstek Sayısı (Çağrı)',
        data: data.map((d) => d.request_count),
        borderColor: '#2563eb', // Blue-600
        backgroundColor: blueGradient,
        fill: viewMode === 'requests',
        borderDash: viewMode === 'both' ? [5, 5] : undefined,
        tension: 0.35,
        borderWidth: 2.5,
        yAxisID: viewMode === 'both' ? 'y1' : 'y',
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
                const rawBucket = data[idx]?.bucket;
                return formatBucketTooltip(rawBucket, interval);
              }
              return '';
            },
            label: function (context) {
              const rawVal = context.parsed.y ?? 0;
              if (context.dataset.label?.includes('Harcama')) {
                return ` 💵 Harcama: ${formatUsd(rawVal, 4)}`;
              }
              return ` ⚡ Çağrı Adedi: ${rawVal.toLocaleString('tr-TR')} istek`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: interval === 'hour' ? 'Zaman (Saat)' : 'Tarih',
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
            maxTicksLimit: interval === 'hour' ? 12 : 14,
            padding: 6,
          },
        },
        y: {
          display: true,
          position: 'left',
          title: {
            display: true,
            text: viewMode === 'requests' ? 'İstek Sayısı (Çağrı)' : 'Harcama Tutarı (USD)',
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
            font: {
              size: 10,
              weight: 500,
              family: 'inherit',
            },
            padding: 8,
            callback: function (val) {
              const num = Number(val);
              if (viewMode === 'requests') {
                return num.toLocaleString('tr-TR');
              }
              if (num === 0) return '$0';
              if (num < 0.01) return `$${num.toFixed(4)}`;
              if (num < 1) return `$${num.toFixed(3)}`;
              return `$${num.toFixed(2)}`;
            },
          },
        },
        ...(viewMode === 'both'
          ? {
              y1: {
                display: true,
                position: 'right' as const,
                title: {
                  display: true,
                  text: 'İstek Sayısı (Çağrı)',
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
                  drawOnChartArea: false, // Don't draw conflicting gridlines over y
                },
                ticks: {
                  color: '#2563eb',
                  font: {
                    size: 10,
                    weight: 500,
                    family: 'inherit',
                  },
                  padding: 8,
                  precision: 0,
                  callback: function (val: number | string) {
                    return Number(val).toLocaleString('tr-TR');
                  },
                },
              },
            }
          : {}),
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
  }, [data, interval, viewMode]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-400 italic">
        Bu zaman aralığında harcama kaydı bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Metric Badges & View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-xs font-semibold text-emerald-700">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Toplam Harcama:</span>
            <span className="font-extrabold tabular-nums">{formatUsd(totalCost, 4)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-xs font-semibold text-blue-700">
            <Activity className="h-3.5 w-3.5" />
            <span>Toplam Çağrı:</span>
            <span className="font-extrabold tabular-nums">
              {totalRequests.toLocaleString('tr-TR')} istek
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200/70 text-xs font-semibold text-purple-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zirve Periyot:</span>
            <span className="font-extrabold tabular-nums">{formatUsd(peakCost, 4)}</span>
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
            Harcama & İstek
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cost')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'cost'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sadece Harcama
          </button>
          <button
            type="button"
            onClick={() => setViewMode('requests')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'requests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sadece İstek Sayısı
          </button>
        </div>
      </div>

      {/* Chart.js Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <canvas ref={canvasRef} id="costTrendChartCanvas" />
      </div>
    </div>
  );
}
