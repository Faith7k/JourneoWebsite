'use client';

import { useMemo } from 'react';

interface DataPoint {
  date: string;
  count: number;
}

export function UserGrowthChart({ data }: { data: DataPoint[] }) {
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
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} Z`
      : '';

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400 italic">
        Henüz kullanıcı kayıt verisi bulunmuyor.
      </div>
    );
  }

  // Show every ~5th label to avoid crowding
  const labelStep = Math.ceil(data.length / 6);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[480px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
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
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        {/* Area */}
        {areaPath && <path d={areaPath} fill="url(#growth-area)" />}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#growth-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points + Labels */}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ffffff"
              stroke="#059669"
              strokeWidth="2"
            />
            {i % labelStep === 0 && (
              <text
                x={p.x}
                y={padding.top + innerH + 18}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="#64748b"
              >
                {p.date.slice(5)}
              </text>
            )}
          </g>
        ))}

        {/* Y labels */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + innerH - t * innerH;
          const val = Math.round(t * max);
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
              {val}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
