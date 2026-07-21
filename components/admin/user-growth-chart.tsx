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
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        No user registration data yet.
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
            <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(16 185 129)" />
            <stop offset="100%" stopColor="rgb(20 184 166)" />
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
        {areaPath && <path d={areaPath} fill="url(#growth-area)" />}

        {/* Line */}
        {linePath && (
          <path d={linePath} fill="none" stroke="url(#growth-line)" strokeWidth="2" />
        )}

        {/* Points + Labels */}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="rgb(20 184 166)" />
            {i % labelStep === 0 && (
              <text
                x={p.x}
                y={padding.top + innerH + 18}
                textAnchor="middle"
                fontSize="9"
                fill="rgb(100 116 139)"
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
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fill="rgb(100 116 139)"
            >
              {val}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
