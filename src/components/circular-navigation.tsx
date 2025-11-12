"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CircleSegment {
  label: string;
  href: string;
  color: string;
  startAngle: number;
  endAngle: number;
}

export function CircularNavigation() {
  const router = useRouter();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Define the four segments matching the reference image
  const segments: CircleSegment[] = [
    {
      label: 'Hydration',
      href: '/nutrition',
      color: 'hsl(38 50% 92%)', // Light beige/cream
      startAngle: 135,
      endAngle: 225,
    },
    {
      label: 'Nutrition',
      href: '/nutrition',
      color: 'hsl(100 15% 82%)', // Light sage gray
      startAngle: 45,
      endAngle: 135,
    },
    {
      label: 'Activity',
      href: '/workout',
      color: 'hsl(80 12% 50%)', // Gray/olive
      startAngle: 315,
      endAngle: 45,
    },
    {
      label: 'Cycle Activity',
      href: '/cycle',
      color: 'hsl(100 18% 65%)', // Sage green for cycle (matching icon-cycle color)
      startAngle: 225,
      endAngle: 315,
    },
  ];

  const handleSegmentClick = (href: string) => {
    router.push(href);
  };

  // SVG dimensions
  const size = 380;
  const center = size / 2;
  const radius = 150;
  const strokeWidth = 42;

  // Create SVG path for each segment
  const createArcPath = (startAngle: number, endAngle: number): string => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const innerRadius = radius - strokeWidth / 2;
    const outerRadius = radius + strokeWidth / 2;

    const x1 = center + innerRadius * Math.cos(startRad);
    const y1 = center + innerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(startRad);
    const y2 = center + outerRadius * Math.sin(startRad);
    const x3 = center + outerRadius * Math.cos(endRad);
    const y3 = center + outerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(endRad);
    const y4 = center + innerRadius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
      Z
    `;
  };

  // Create a circular path for curved text - all text facing the same direction (horizontal/upright)
  const createTextPath = (startAngle: number, endAngle: number, id: string) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius + strokeWidth / 2 + 45; // Distance from circle center

    // All text will read left-to-right in a horizontal orientation
    // Create path from left to right for all segments
    const pathStartAngle = startAngle + (endAngle - startAngle) * 0.1;
    const pathEndAngle = startAngle + (endAngle - startAngle) * 0.9;

    const startRad = (pathStartAngle * Math.PI) / 180;
    const endRad = (pathEndAngle * Math.PI) / 180;

    const x1 = center + textRadius * Math.cos(startRad);
    const y1 = center + textRadius * Math.sin(startRad);
    const x2 = center + textRadius * Math.cos(endRad);
    const y2 = center + textRadius * Math.sin(endRad);

    // Calculate if we need a large arc
    const angleDiff = pathEndAngle - pathStartAngle;
    const largeArc = Math.abs(angleDiff) > 180 ? 1 : 0;
    const sweepFlag = 1; // Always sweep clockwise for consistent text direction

    return {
      path: `M ${x1} ${y1} A ${textRadius} ${textRadius} 0 ${largeArc} ${sweepFlag} ${x2} ${y2}`,
      id: `text-path-${id}`,
    };
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      {/* Cream white shadowed container box */}
      <div className="bg-[hsl(38,65%,96%)] rounded-3xl shadow-[0_8px_24px_rgba(62,53,48,0.18),0_2px_6px_rgba(62,53,48,0.08)] p-8 border border-border/30">
        <div className="relative" style={{ width: size + 180, height: size + 180 }}>
        <svg
          width={size + 180}
          height={size + 180}
          viewBox={`0 0 ${size + 180} ${size + 180}`}
          className="mx-auto"
        >
          {/* Define 3D shadow gradient filters */}
          <defs>
            <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="0" dy="3" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="drop-shadow-3d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
              <feOffset dx="0" dy="8" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="segment-gradient-1" cx="50%" cy="40%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
            </radialGradient>

            <radialGradient id="segment-gradient-2" cx="50%" cy="40%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </radialGradient>
          </defs>

          {/* Define text paths for curved labels */}
          <defs>
            {segments.map((segment) => {
              const textPathData = createTextPath(segment.startAngle, segment.endAngle, segment.label);
              return (
                <path
                  key={textPathData.id}
                  id={textPathData.id}
                  d={textPathData.path}
                  fill="none"
                />
              );
            })}
          </defs>

          <g transform={`translate(90, 90)`}>
            {/* Shadow layer for depth - multiple shadows for 3D effect */}
            {segments.map((segment) => (
              <path
                key={`shadow-${segment.label}`}
                d={createArcPath(segment.startAngle, segment.endAngle)}
                fill="rgba(0,0,0,0.12)"
                stroke="transparent"
                strokeWidth={0}
                style={{
                  transform: 'translate(0, 6px)',
                  transformOrigin: 'center',
                }}
              />
            ))}

            {segments.map((segment) => {
              const isHovered = hoveredSegment === segment.label;
              const textPathData = createTextPath(segment.startAngle, segment.endAngle, segment.label);

              return (
                <g key={segment.label}>
                  {/* Clickable segment with 3D effect */}
                  <path
                    d={createArcPath(segment.startAngle, segment.endAngle)}
                    fill={segment.color}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={1}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isHovered
                        ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.25)) brightness(1.08)'
                        : 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      transformOrigin: 'center',
                    }}
                    onMouseEnter={() => setHoveredSegment(segment.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => handleSegmentClick(segment.href)}
                  />

                  {/* Inner highlight for 3D effect */}
                  <path
                    d={createArcPath(segment.startAngle, segment.endAngle)}
                    fill="url(#segment-gradient-1)"
                    stroke="transparent"
                    strokeWidth={0}
                    className="pointer-events-none"
                    style={{
                      opacity: 0.4,
                      mixBlendMode: 'overlay',
                    }}
                  />

                  {/* Curved text label using textPath */}
                  <text
                    className="font-['Cormorant_Garamond'] font-bold pointer-events-none select-none"
                    style={{
                      fill: 'hsl(25, 11%, 21%)', // Dark brown for high contrast
                      fontSize: '22px',
                      fontStyle: 'normal',
                      letterSpacing: '0.08em',
                      paintOrder: 'stroke fill',
                      stroke: 'hsl(38, 50%, 94%)', // Light cream stroke for visibility
                      strokeWidth: '3px',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                    }}
                  >
                    <textPath
                      href={`#${textPathData.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {segment.label}
                    </textPath>
                  </text>
                </g>
              );
            })}

            {/* Center circle with 3D depth effect */}
            <circle
              cx={center}
              cy={center}
              r={radius - strokeWidth / 2 - 3}
              fill="hsl(var(--background))"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={2}
              style={{
                filter: 'drop-shadow(inset 0 4px 12px rgba(0,0,0,0.1))',
              }}
            />

            {/* Inner shadow ring for depth */}
            <circle
              cx={center}
              cy={center}
              r={radius - strokeWidth / 2 - 5}
              fill="transparent"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={8}
              style={{
                filter: 'blur(4px)',
              }}
            />
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredSegment && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-bloom">
              <p className="text-sm font-medium text-center whitespace-nowrap">
                View {hoveredSegment}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
