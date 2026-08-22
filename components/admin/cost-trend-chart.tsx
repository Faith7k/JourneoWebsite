'use client';

import { useMemo } from 'react';

type CostPoint = { bucket: string; cost_usd: number; request_count: number };

/**
 * Daily/hourly spend trend. Hand-rolled SVG on purpose — this repo ships no
 * charting library (see api-chart.tsx, user-growth-chart.tsx), and a single
 * line chart is not worth adding one for.
 */
export function AdminCostTrendChart({
  data,
  interval,
}: {
  data: CostPoint[];
  interval: 'hour' | 'day' | 'month';
}) {
  const max = useMemo(
    () => Math.max(0.000001, ...data.map((d) => d.cost_usd)),
    [data]
  );

  const width = 600;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 28, left: 46 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding.top + innerH - (d.cost_usd / max) * innerH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(
          padding.top + innerH
        ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + innerH).toFixed(
          1
        )} Z`
      : '';

  const label = (bucket: string) =>
    interval === 'hour' ? bucket.slice(11, 16) : bucket.slice(5, 10);

  if (data.length === 0) {
    return <p className="text-xs text-slate-400 italic py-6">Bu zaman aralığında harcama kaydı bulunmuyor.</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[480px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cost-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cost-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + t * innerH;
          return (
            <line
              key={t}
              x1={padding.left}
              y1={y}
              x2={padding.left + innerW}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#cost-area)" />}

        {/* Line stroke */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#cost-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {points.map((p) => (
          <g key={p.bucket}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ffffff"
              stroke="#059669"
              strokeWidth="2"
            />
            <title>{`${p.bucket} · $${p.cost_usd.toFixed(4)} · ${p.request_count} çağrı`}</title>
          </g>
        ))}

        {/* X labels */}
        {points
          .filter((_, i) => i % Math.ceil(points.length / 8) === 0)
          .map((p) => (
            <text
              key={`l-${p.bucket}`}
              x={p.x}
              y={padding.top + innerH + 18}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#64748b"
            >
              {label(p.bucket)}
            </text>
          ))}

        {/* Y labels */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + innerH - t * innerH;
          return (
            <text
              key={t}
              x={padding.left - 8}
              y={y + 3.5}
              textAnchor="end"
              fontSize="10"
              fontWeight="500"
              fill="#64748b"
            >
              ${(t * max).toFixed(t === 0 ? 0 : 3)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
