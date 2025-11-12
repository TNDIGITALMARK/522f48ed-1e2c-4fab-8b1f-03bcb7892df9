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
      label: 'Circle',
      href: '/cycle',
      color: 'hsl(250 25% 60%)', // Purple/lavender
      startAngle: 225,
      endAngle: 315,
    },
  ];

  const handleSegmentClick = (href: string) => {
    router.push(href);
  };

  // SVG dimensions
  const size = 320;
  const center = size / 2;
  const radius = 140;
  const strokeWidth = 36;

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

  // Calculate text position and rotation for curved labels
  const getTextPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius + strokeWidth / 2 + 30;
    const x = center + textRadius * Math.cos((midAngle * Math.PI) / 180);
    const y = center + textRadius * Math.sin((midAngle * Math.PI) / 180);

    // Adjust rotation so text is always readable
    let rotation = midAngle;
    if (rotation > 90 && rotation < 270) {
      rotation += 180;
    }

    return { x, y, rotation };
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="relative" style={{ width: size + 120, height: size + 120 }}>
        <svg
          width={size + 120}
          height={size + 120}
          viewBox={`0 0 ${size + 120} ${size + 120}`}
          className="mx-auto"
        >
          <g transform={`translate(60, 60)`}>
            {segments.map((segment) => {
              const isHovered = hoveredSegment === segment.label;
              const textPos = getTextPosition(segment.startAngle, segment.endAngle);

              return (
                <g key={segment.label}>
                  {/* Clickable segment */}
                  <path
                    d={createArcPath(segment.startAngle, segment.endAngle)}
                    fill={segment.color}
                    stroke="transparent"
                    strokeWidth={0}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isHovered ? 'brightness(1.1)' : 'none',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                      transformOrigin: 'center',
                    }}
                    onMouseEnter={() => setHoveredSegment(segment.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => handleSegmentClick(segment.href)}
                  />

                  {/* Curved text label */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                    className="font-['Cormorant_Garamond'] text-xl font-semibold pointer-events-none select-none"
                    style={{
                      fill: 'hsl(var(--foreground))',
                      fontStyle: 'italic',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}

            {/* Center circle (optional - for visual balance) */}
            <circle
              cx={center}
              cy={center}
              r={radius - strokeWidth / 2 - 2}
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth={1}
              opacity={0.5}
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
  );
}
