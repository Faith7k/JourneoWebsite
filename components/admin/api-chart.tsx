'use client';

import { useMemo, useState } from 'react';

type DataPoint = { date: string; count: number };

export function AdminApiChart({ data }: { data: DataPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.count)), [data]);
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 32, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding.top + innerH - (d.count / max) * innerH;
    return { x, y, index: i, ...d };
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
    <div className="w-full relative group">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[480px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="api-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="api-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
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
              stroke="#e2e8f0"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.7"
            />
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#api-area)" />}

        {/* Line stroke */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#api-line)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}

        {/* Points & X-Labels */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={p.date}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {isHovered && (
                <line
                  x1={p.x}
                  y1={padding.top}
                  x2={p.x}
                  y2={padding.top + innerH}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? '6' : '4'}
                fill="#ffffff"
                stroke={isHovered ? '#4f46e5' : '#2563eb'}
                strokeWidth={isHovered ? '3' : '2'}
                className="transition-all duration-150"
              />
              <text
                x={p.x}
                y={padding.top + innerH + 20}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isHovered ? '700' : '500'}
                fill={isHovered ? '#1e293b' : '#64748b'}
              >
                {p.date.slice(5)}
              </text>

              {/* Tooltip callout */}
              {isHovered && (
                <g transform={`translate(${p.x}, ${p.y - 28})`}>
                  <rect
                    x="-32"
                    y="-14"
                    width="64"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {p.count} istek
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Y labels */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + innerH - t * innerH;
          const value = Math.round(t * max);
          return (
            <text
              key={t}
              x={padding.left - 10}
              y={y + 3.5}
              textAnchor="end"
              fontSize="10"
              fontWeight="600"
              fill="#64748b"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}