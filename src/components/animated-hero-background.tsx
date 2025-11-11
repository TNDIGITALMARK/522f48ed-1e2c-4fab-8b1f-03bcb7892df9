"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function AnimatedHeroBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Magazine-style textile texture background layer */}
      <div
        className={`absolute inset-0 transition-all duration-[2500ms] ease-out ${
          mounted ? 'opacity-25 scale-100' : 'opacity-0 scale-105'
        }`}
        style={{
          backgroundImage: 'url(/textures/fabric-cream.jpg)',
          backgroundSize: '800px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          mixBlendMode: 'soft-light'
        }}
      />

      {/* EMBODY image as full background - Magazine aesthetic */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${
          mounted ? 'opacity-30 scale-100' : 'opacity-0 scale-105'
        }`}
      >
        <Image
          src="/hero-images/embody-hero.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Beige gradient overlay for magazine feel */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-background/90 via-background/75 to-background/90 transition-opacity duration-[3000ms] ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* EXTENSIVE ROOT SYSTEM - Spreading across entire screen */}
      {/* Central root trunk */}
      <svg
        className={`absolute left-1/2 top-0 w-1 h-full -translate-x-1/2 transition-opacity duration-[2500ms] ${
          mounted ? 'opacity-20' : 'opacity-0'
        }`}
        style={{ animation: mounted ? 'root-pulse 4s ease-in-out infinite' : 'none' }}
      >
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="hsl(80 12% 37%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Left branching roots */}
      <svg
        className={`absolute left-1/4 top-0 w-96 h-full transition-opacity duration-[2500ms] delay-200 ${
          mounted ? 'opacity-15' : 'opacity-0'
        }`}
      >
        <path
          d="M 200 0 Q 150 150, 100 300 T 50 600 L 30 1000"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 200 100 Q 160 200, 120 350 T 80 650 L 60 1000"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Right branching roots */}
      <svg
        className={`absolute right-1/4 top-0 w-96 h-full transition-opacity duration-[2500ms] delay-300 ${
          mounted ? 'opacity-15' : 'opacity-0'
        }`}
      >
        <path
          d="M 200 0 Q 250 150, 300 300 T 350 600 L 370 1000"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 200 100 Q 240 200, 280 350 T 320 650 L 340 1000"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Far left spreading roots */}
      <svg
        className={`absolute left-0 top-1/4 w-64 h-3/4 transition-opacity duration-[2500ms] delay-400 ${
          mounted ? 'opacity-12' : 'opacity-0'
        }`}
      >
        <path
          d="M 256 0 Q 200 100, 150 200 T 80 400 L 40 800"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 256 50 Q 210 120, 170 240 T 100 450 L 60 800"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Far right spreading roots */}
      <svg
        className={`absolute right-0 top-1/4 w-64 h-3/4 transition-opacity duration-[2500ms] delay-500 ${
          mounted ? 'opacity-12' : 'opacity-0'
        }`}
      >
        <path
          d="M 0 0 Q 56 100, 106 200 T 176 400 L 216 800"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 0 50 Q 46 120, 86 240 T 156 450 L 196 800"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Additional thin root tendrils - left side */}
      <svg
        className={`absolute left-1/3 top-1/3 w-48 h-2/3 transition-opacity duration-[2500ms] delay-600 ${
          mounted ? 'opacity-10' : 'opacity-0'
        }`}
      >
        <path
          d="M 192 0 Q 150 80, 120 180 T 80 350 L 50 700"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Additional thin root tendrils - right side */}
      <svg
        className={`absolute right-1/3 top-1/3 w-48 h-2/3 transition-opacity duration-[2500ms] delay-700 ${
          mounted ? 'opacity-10' : 'opacity-0'
        }`}
      >
        <path
          d="M 0 0 Q 42 80, 72 180 T 112 350 L 142 700"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Darker sage green accent circle */}
      <div
        className={`absolute top-1/4 left-1/3
          w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64
          rounded-full blur-2xl md:blur-3xl
          transition-all duration-[2500ms] ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, hsl(120 25% 55% / 0.15) 0%, transparent 70%)',
          animation: mounted ? 'pulse-slow 6s ease-in-out infinite' : 'none'
        }}
      />

      {/* Darker olive accent circle */}
      <div
        className={`absolute bottom-1/3 right-1/4
          w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80
          rounded-full blur-2xl md:blur-3xl
          transition-all duration-[2500ms] delay-500 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, hsl(110 30% 28% / 0.12) 0%, transparent 70%)',
          animation: mounted ? 'pulse-slow 7s ease-in-out infinite 1s' : 'none'
        }}
      />
    </div>
  );
}
