"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function AnimatedHeroBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* EMBODY image as full background */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${
          mounted ? 'opacity-25 scale-100' : 'opacity-0 scale-105'
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

      {/* Gradient overlay for text readability and depth */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 transition-opacity duration-[3000ms] ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle animated circles for visual interest - responsive sizing */}
      <div
        className={`absolute top-1/4 left-1/3
          w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64
          bg-accent/5 rounded-full blur-2xl md:blur-3xl
          transition-all duration-[2500ms] ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          animation: mounted ? 'pulse-slow 6s ease-in-out infinite' : 'none'
        }}
      />

      <div
        className={`absolute bottom-1/3 right-1/4
          w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80
          bg-primary/5 rounded-full blur-2xl md:blur-3xl
          transition-all duration-[2500ms] delay-500 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          animation: mounted ? 'pulse-slow 7s ease-in-out infinite 1s' : 'none'
        }}
      />
    </div>
  );
}
