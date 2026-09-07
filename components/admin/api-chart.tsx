'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { ChartOptions, ChartData } from 'chart.js';
import { Activity, Sparkles } from 'lucide-react';

type DataPoint = { date: string; count: number };

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

function formatApiDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const m = monthMap[parts[1]] || parts[1];
    const day = parseInt(parts[2], 10);
    return `${day} ${m}`;
  }
  return dateStr.slice(5);
}

export function AdminApiChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const totalRequests = data.reduce((acc, d) => acc + d.count, 0);
  const peakDay = data.reduce((max, d) => Math.max(max, d.count), 0);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map((d) => formatApiDate(d.date));

    // Gradient fill
    const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.28)');
    blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

    const chartData: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: 'Günlük İstek Sayısı',
          data: data.map((d) => d.count),
          borderColor: '#2563eb', // Blue-600
          backgroundColor: blueGradient,
          fill: true,
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
        },
      ],
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
              return ` ⚡ ${context.dataset.label}: ${val.toLocaleString('tr-TR')} istek`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Tarih',
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
            maxTicksLimit: 14,
            padding: 6,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'İstek Sayısı',
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
            precision: 0,
            callback: function (val) {
              return Number(val).toLocaleString('tr-TR');
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
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-400 italic">
        Bu zaman aralığında API istek kaydı bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Metric Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-xs font-semibold text-blue-700">
            <Activity className="h-3.5 w-3.5" />
            <span>Toplam Çağrı:</span>
            <span className="font-extrabold tabular-nums">
              {totalRequests.toLocaleString('tr-TR')} istek
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200/70 text-xs font-semibold text-purple-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zirve Gün:</span>
            <span className="font-extrabold tabular-nums">
              {peakDay.toLocaleString('tr-TR')} istek/gün
            </span>
          </div>
        </div>
      </div>

      {/* Chart.js Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <canvas ref={canvasRef} id="apiChartCanvas" />
      </div>
    </div>
  );
}