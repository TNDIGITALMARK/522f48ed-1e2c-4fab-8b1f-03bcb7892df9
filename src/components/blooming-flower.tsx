"use client";

import { useEffect, useState } from 'react';

interface BloomingFlowerProps {
  /** Controls whether the flower is bloomed (default: auto-bloom on mount) */
  bloomed?: boolean;
  /** Size of the flower in pixels (default: 200) */
  size?: number;
  /** Animation duration in milliseconds (default: 2000) */
  duration?: number;
  /** Delay before bloom starts in milliseconds (default: 500) */
  delay?: number;
  /** Whether to loop the bloom animation (default: false) */
  loop?: boolean;
  /** Custom className for styling container */
  className?: string;
}

export function BloomingFlower({
  bloomed: controlledrooteded,
  size = 200,
  duration = 2000,
  delay = 500,
  loop = false,
  className = ''
}: BloomingFlowerProps) {
  const [isrooteded, setIsrooteded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Auto-bloom after delay if not controlled
    if (controlledrooteded === undefined) {
      const timer = setTimeout(() => {
        setIsrooteded(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [controlledrooteded, delay]);

  // Use controlled state if provided
  const bloomState = controlledrooteded !== undefined ? controlledrooteded : isrooteded;

  // Loop animation if enabled
  useEffect(() => {
    if (loop && bloomState) {
      const loopInterval = setInterval(() => {
        setIsrooteded(false);
        setTimeout(() => setIsrooteded(true), 100);
      }, duration + 2000);
      return () => clearInterval(loopInterval);
    }
  }, [loop, bloomState, duration]);

  return (
    <div
      className={`blooming-flower-container ${bloomState ? 'bloom-ambient' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 4px 16px rgba(185, 196, 178, 0.3))'
        }}
      >
        {/* Center of flower */}
        <circle
          cx="100"
          cy="100"
          r="15"
          fill="hsl(var(--bloom-terra-cotta))"
          style={{
            transform: bloomState ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'center',
            transition: `transform ${duration * 0.6}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${duration * 0.4}ms`,
            opacity: bloomState ? 1 : 0
          }}
        />

        {/* Inner stamens - small dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + Math.cos(rad) * 8;
          const y = 100 + Math.sin(rad) * 8;
          return (
            <circle
              key={`stamen-${i}`}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--bloom-dark-olive))"
              style={{
                transform: bloomState ? 'scale(1)' : 'scale(0)',
                transformOrigin: `${x}px ${y}px`,
                transition: `transform ${duration * 0.5}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${duration * 0.5 + i * 30}ms`,
                opacity: bloomState ? 1 : 0
              }}
            />
          );
        })}

        {/* Outer petals - 8 petals arranged in a circle */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const petalDistance = 50;
          const x = 100 + Math.cos(rad) * petalDistance;
          const y = 100 + Math.sin(rad) * petalDistance;

          // Petal path - elegant elliptical shape
          const petalPath = `
            M ${x} ${y}
            Q ${x + Math.cos(rad - 0.5) * 30} ${y + Math.sin(rad - 0.5) * 30},
              ${x + Math.cos(rad) * 35} ${y + Math.sin(rad) * 35}
            Q ${x + Math.cos(rad + 0.5) * 30} ${y + Math.sin(rad + 0.5) * 30},
              ${x} ${y}
          `;

          return (
            <path
              key={`petal-outer-${i}`}
              d={petalPath}
              fill="hsl(var(--bloom-sage-green))"
              stroke="hsl(var(--bloom-dark-olive))"
              strokeWidth="1"
              style={{
                transform: bloomState
                  ? `scale(1) rotate(${isHovered ? 5 : 0}deg)`
                  : 'scale(0) rotate(-20deg)',
                transformOrigin: `${x}px ${y}px`,
                transition: `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms`,
                opacity: bloomState ? (isHovered ? 1 : 0.95) : 0
              }}
            />
          );
        })}

        {/* Inner petals - smaller, offset */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const petalDistance = 32;
          const x = 100 + Math.cos(rad) * petalDistance;
          const y = 100 + Math.sin(rad) * petalDistance;

          const petalPath = `
            M ${x} ${y}
            Q ${x + Math.cos(rad - 0.6) * 20} ${y + Math.sin(rad - 0.6) * 20},
              ${x + Math.cos(rad) * 25} ${y + Math.sin(rad) * 25}
            Q ${x + Math.cos(rad + 0.6) * 20} ${y + Math.sin(rad + 0.6) * 20},
              ${x} ${y}
          `;

          return (
            <path
              key={`petal-inner-${i}`}
              d={petalPath}
              fill="hsl(var(--bloom-warm-beige))"
              stroke="hsl(var(--bloom-sage-green))"
              strokeWidth="0.5"
              style={{
                transform: bloomState
                  ? `scale(1) rotate(${isHovered ? -3 : 0}deg)`
                  : 'scale(0) rotate(10deg)',
                transformOrigin: `${x}px ${y}px`,
                transition: `transform ${duration * 0.9}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${duration * 0.15 + i * 70}ms`,
                opacity: bloomState ? 1 : 0
              }}
            />
          );
        })}

        {/* Stem - grows from bottom */}
        <path
          d="M 100 100 Q 98 140, 95 180 L 95 200"
          stroke="hsl(var(--bloom-dark-olive))"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: '100',
            strokeDashoffset: bloomState ? '0' : '100',
            transition: `stroke-dashoffset ${duration * 0.7}ms ease-out`,
            opacity: bloomState ? 1 : 0
          }}
        />

        {/* Left leaf */}
        <path
          d="M 95 140 Q 70 145, 60 160 Q 65 150, 95 145"
          fill="hsl(var(--bloom-sage-green))"
          stroke="hsl(var(--bloom-dark-olive))"
          strokeWidth="1"
          style={{
            transform: bloomState ? 'scale(1)' : 'scale(0)',
            transformOrigin: '95px 140px',
            transition: `transform ${duration * 0.6}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${duration * 0.3}ms`,
            opacity: bloomState ? 0.9 : 0
          }}
        />

        {/* Right leaf */}
        <path
          d="M 95 160 Q 120 163, 135 175 Q 125 165, 95 165"
          fill="hsl(var(--bloom-sage-green))"
          stroke="hsl(var(--bloom-dark-olive))"
          strokeWidth="1"
          style={{
            transform: bloomState ? 'scale(1)' : 'scale(0)',
            transformOrigin: '95px 160px',
            transition: `transform ${duration * 0.6}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${duration * 0.35}ms`,
            opacity: bloomState ? 0.9 : 0
          }}
        />

        {/* Sparkle particles on bloom */}
        {bloomState && [
          { x: 70, y: 60, delay: 0 },
          { x: 130, y: 70, delay: 100 },
          { x: 60, y: 120, delay: 200 },
          { x: 140, y: 130, delay: 150 }
        ].map((sparkle, i) => (
          <g
            key={`sparkle-${i}`}
            style={{
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animation: `sparkle-twinkle 1.5s ease-in-out ${sparkle.delay}ms infinite`,
              opacity: 0
            }}
          >
            <circle cx="0" cy="0" r="2" fill="hsl(var(--bloom-warm-beige))" />
            <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="hsl(var(--bloom-warm-beige))" strokeWidth="1" />
          </g>
        ))}
      </svg>

      <style jsx>{`
        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .blooming-flower-container {
          cursor: pointer;
          user-select: none;
        }

        .blooming-flower-container:hover svg {
          filter: drop-shadow(0 8px 24px rgba(185, 196, 178, 0.5));
        }
      `}</style>
    </div>
  );
}

/**
 * Animated blooming flower component inspired by Lively's dashboard
 *
 * Features:
 * - Smooth bloom animation with staggered petal appearance
 * - Organic cubic-bezier easing for natural motion
 * - Interactive hover effects
 * - Customizable size, duration, and delay
 * - Optional looping animation
 * - Sparkle effects on bloom completion
 * - Uses design system colors from globals.css
 *
 * Usage:
 * <BloomingFlower size={200} duration={2000} delay={500} />
 * <BloomingFlower bloomed={isActive} size={150} loop={true} />
 */
