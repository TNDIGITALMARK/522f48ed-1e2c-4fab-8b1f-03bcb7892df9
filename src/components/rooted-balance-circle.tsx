"use client";

import React from 'react';

/**
 * Rooted Balance Circle Component
 *
 * A circular diagram showing the "smart cycle" phases with a full-screen
 * rectangle background and "Rooted Balance" title in the left corner.
 *
 * Design features:
 * - Circular diagram divided into colored sections (sage green, navy, brown, beige, dark green)
 * - "smart cycle" text in center (replacing "circle" with "cycle")
 * - Full-screen rectangle background with reduced opacity
 * - Small "Rooted Balance" title in left corner
 * - Uses exact colors from the rooted color palette
 */

export function RootedBalanceCircle() {
  // Color palette from globals.css
  const colors = {
    sage: 'hsl(100 15% 67%)',      // #A8B8A5 - Light sage green
    navy: 'hsl(215 43% 21%)',      // #1E2F4D - Deep navy
    brown: 'hsl(25 11% 21%)',      // #3E3530 - Dark brown
    beige: 'hsl(35 32% 88%)',      // Light beige
    darkGreen: 'hsl(140 25% 25%)', // Dark green
  };

  const sections = [
    { label: 'Cycle Phase 1', color: colors.sage, startAngle: 0, endAngle: 72 },
    { label: 'Cycle Phase 2', color: colors.navy, startAngle: 72, endAngle: 144 },
    { label: 'Cycle Phase 3', color: colors.brown, startAngle: 144, endAngle: 216 },
    { label: 'Cycle Phase 4', color: colors.beige, startAngle: 216, endAngle: 288 },
    { label: 'Cycle Phase 5', color: colors.darkGreen, startAngle: 288, endAngle: 360 },
  ];

  // SVG circle parameters
  const centerX = 200;
  const centerY = 200;
  const radius = 150;
  const innerRadius = 50;

  // Helper function to convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Helper function to create arc path
  const createArcPath = (startAngle: number, endAngle: number) => {
    const startRad = toRadians(startAngle - 90); // -90 to start from top
    const endRad = toRadians(endAngle - 90);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen rectangle background with reduced opacity */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: colors.sage,
          opacity: 0.15, // Reduced opacity
        }}
      />

      {/* Rooted Balance title in small font in left corner */}
      <div className="absolute top-8 left-8 z-20">
        <h2
          className="text-sm font-light tracking-widest uppercase"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: colors.brown,
            letterSpacing: '0.15em'
          }}
        >
          Rooted Balance
        </h2>
      </div>

      {/* Center the circle */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="drop-shadow-lg"
          >
            {/* Draw each section */}
            {sections.map((section, index) => (
              <path
                key={index}
                d={createArcPath(section.startAngle, section.endAngle)}
                fill={section.color}
                stroke="hsl(38 50% 94%)" // Cream border between sections
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-90"
              />
            ))}

            {/* Center circle - white background */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="hsl(0 0% 100%)"
              stroke={colors.brown}
              strokeWidth="2"
            />

            {/* "smart cycle" text in center */}
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '16px',
                fontWeight: 600,
                fill: colors.brown,
                letterSpacing: '0.05em'
              }}
            >
              smart
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                fontWeight: 700,
                fill: colors.brown,
                letterSpacing: '0.05em'
              }}
            >
              cycle
            </text>
          </svg>

          {/* Phase labels around the circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            {sections.map((section, index) => {
              const angle = toRadians(((section.startAngle + section.endAngle) / 2) - 90);
              const labelRadius = radius + 40;
              const x = centerX + labelRadius * Math.cos(angle);
              const y = centerY + labelRadius * Math.sin(angle);

              return (
                <div
                  key={index}
                  className="absolute text-xs font-medium"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    color: section.color,
                    fontFamily: "'DM Sans', sans-serif",
                    textAlign: 'center',
                    width: '80px'
                  }}
                >
                  {section.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
