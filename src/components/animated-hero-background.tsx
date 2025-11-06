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
      {/* Animated EMBODY image - left side - responsive sizing */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2
          w-[300px] h-[200px] sm:w-[400px] sm:h-[267px] md:w-[500px] md:h-[333px] lg:w-[600px] lg:h-[400px]
          transition-all duration-[2000ms] ease-out ${
          mounted ? 'opacity-15 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
        style={{
          animation: mounted ? 'float 8s ease-in-out infinite' : 'none'
        }}
      >
        <Image
          src="/hero-images/embody-hero.png"
          alt=""
          fill
          className="object-cover rounded-2xl md:rounded-3xl"
          priority
        />
      </div>

      {/* Animated BLOOM logo - right side - responsive sizing */}
      <div
        className={`absolute right-0 bottom-1/4
          w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]
          transition-all duration-[2000ms] ease-out delay-300 ${
          mounted ? 'opacity-10 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
        style={{
          animation: mounted ? 'float-delayed 10s ease-in-out infinite' : 'none'
        }}
      >
        <Image
          src="/hero-images/bloom-logo.png"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Animated gradient overlay for depth */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 transition-opacity duration-[3000ms] ${
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
