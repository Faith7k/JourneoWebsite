'use client';

import { useMemo } from 'react';

type DataPoint = { date: string; count: number };

export function AdminApiChart({ data }: { data: DataPoint[] }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.count)), [data]);
  const width = 600;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 28, left: 32 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding.top + innerH - (d.count / max) * innerH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + innerH).toFixed(
          1
        )} L ${points[0].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} Z`
      : '';

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[480px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="api-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="api-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(59 130 246)" />
            <stop offset="100%" stopColor="rgb(34 211 238)" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + t * innerH;
          return (
            <line
              key={t}
              x1={padding.left}
              y1={y}
              x2={padding.left + innerW}
              y2={y}
              stroke="rgb(30 41 59)"
              strokeWidth="1"
            />
          );
        })}

        {/* Area */}
        {areaPath && <path d={areaPath} fill="url(#api-area)" />}

        {/* Line */}
        {linePath && (
          <path d={linePath} fill="none" stroke="url(#api-line)" strokeWidth="2" />
        )}

        {/* Points */}
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="3" fill="rgb(34 211 238)" />
            <text
              x={p.x}
              y={padding.top + innerH + 18}
              textAnchor="middle"
              fontSize="9"
              fill="rgb(100 116 139)"
            >
              {p.date.slice(5)}
            </text>
          </g>
        ))}

        {/* Y labels */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + innerH - t * innerH;
          const value = Math.round(t * max);
          return (
            <text
              key={t}
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fill="rgb(100 116 139)"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}