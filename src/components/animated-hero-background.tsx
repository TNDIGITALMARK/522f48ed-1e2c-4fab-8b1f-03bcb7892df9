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

      {/* REALISTIC ROOT SYSTEM - Growing from trunk, spreading horizontally across screen */}

      {/* MAJOR ROOT BRANCHES - Thick, gnarled roots spreading horizontally */}

      {/* Left major root - spreading to far left */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-200 ${
          mounted ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <path
          d="M 35% 15% Q 30% 25%, 25% 35% Q 18% 45%, 10% 50% Q 5% 52%, 0% 55%"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary branch from major root */}
        <path
          d="M 25% 35% Q 22% 50%, 18% 60% Q 15% 68%, 12% 75%"
          fill="none"
          stroke="hsl(80 12% 42%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Center-left major root */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-300 ${
          mounted ? 'opacity-28' : 'opacity-0'
        }`}
      >
        <path
          d="M 35% 15% Q 32% 30%, 28% 42% Q 22% 52%, 15% 58% Q 10% 62%, 5% 68%"
          fill="none"
          stroke="hsl(80 12% 35%)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Center major root - spreading left */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-400 ${
          mounted ? 'opacity-25' : 'opacity-0'
        }`}
      >
        <path
          d="M 50% 15% Q 42% 30%, 35% 42% Q 28% 52%, 20% 60% Q 15% 65%, 8% 72%"
          fill="none"
          stroke="hsl(80 12% 38%)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary branch */}
        <path
          d="M 35% 42% Q 30% 55%, 25% 65% Q 22% 72%, 18% 80%"
          fill="none"
          stroke="hsl(80 12% 40%)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Center major root - spreading right */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-500 ${
          mounted ? 'opacity-25' : 'opacity-0'
        }`}
      >
        <path
          d="M 50% 15% Q 58% 30%, 65% 42% Q 72% 52%, 80% 60% Q 85% 65%, 92% 72%"
          fill="none"
          stroke="hsl(80 12% 38%)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary branch */}
        <path
          d="M 65% 42% Q 70% 55%, 75% 65% Q 78% 72%, 82% 80%"
          fill="none"
          stroke="hsl(80 12% 40%)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Right major root - spreading to far right */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-600 ${
          mounted ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <path
          d="M 65% 15% Q 70% 25%, 75% 35% Q 82% 45%, 90% 50% Q 95% 52%, 100% 55%"
          fill="none"
          stroke="hsl(80 12% 37%)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary branch */}
        <path
          d="M 75% 35% Q 78% 50%, 82% 60% Q 85% 68%, 88% 75%"
          fill="none"
          stroke="hsl(80 12% 42%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Center-right major root */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-700 ${
          mounted ? 'opacity-28' : 'opacity-0'
        }`}
      >
        <path
          d="M 65% 15% Q 68% 30%, 72% 42% Q 78% 52%, 85% 58% Q 90% 62%, 95% 68%"
          fill="none"
          stroke="hsl(80 12% 35%)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* TERTIARY ROOTS - Thinner roots filling the space */}

      {/* Left tertiary roots */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-800 ${
          mounted ? 'opacity-18' : 'opacity-0'
        }`}
      >
        <path
          d="M 25% 40% Q 20% 48%, 15% 55% Q 12% 60%, 8% 68%"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 30% 45% Q 25% 58%, 20% 70% Q 16% 78%, 12% 85%"
          fill="none"
          stroke="hsl(100 15% 65%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 20% 50% Q 15% 62%, 12% 72% Q 8% 80%, 5% 88%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Right tertiary roots */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-900 ${
          mounted ? 'opacity-18' : 'opacity-0'
        }`}
      >
        <path
          d="M 75% 40% Q 80% 48%, 85% 55% Q 88% 60%, 92% 68%"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 70% 45% Q 75% 58%, 80% 70% Q 84% 78%, 88% 85%"
          fill="none"
          stroke="hsl(100 15% 65%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 80% 50% Q 85% 62%, 88% 72% Q 92% 80%, 95% 88%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* FINE ROOT TENDRILS - Hair-like roots across the screen */}

      {/* Fine tendrils - left side */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-1000 ${
          mounted ? 'opacity-12' : 'opacity-0'
        }`}
      >
        <path
          d="M 18% 60% Q 15% 70%, 12% 80% Q 10% 88%, 7% 95%"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 22% 65% Q 18% 75%, 14% 85% Q 11% 92%, 8% 98%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M 10% 55% Q 7% 68%, 5% 80% Q 3% 88%, 1% 95%"
          fill="none"
          stroke="hsl(100 15% 72%)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>

      {/* Fine tendrils - right side */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-1100 ${
          mounted ? 'opacity-12' : 'opacity-0'
        }`}
      >
        <path
          d="M 82% 60% Q 85% 70%, 88% 80% Q 90% 88%, 93% 95%"
          fill="none"
          stroke="hsl(100 15% 67%)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 78% 65% Q 82% 75%, 86% 85% Q 89% 92%, 92% 98%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M 90% 55% Q 93% 68%, 95% 80% Q 97% 88%, 99% 95%"
          fill="none"
          stroke="hsl(100 15% 72%)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>

      {/* Fine tendrils - center spreading */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] delay-1200 ${
          mounted ? 'opacity-15' : 'opacity-0'
        }`}
      >
        <path
          d="M 45% 55% Q 38% 68%, 30% 80% Q 25% 88%, 20% 95%"
          fill="none"
          stroke="hsl(100 15% 68%)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 55% 55% Q 62% 68%, 70% 80% Q 75% 88%, 80% 95%"
          fill="none"
          stroke="hsl(100 15% 68%)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 50% 50% Q 45% 65%, 40% 78% Q 36% 88%, 32% 96%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M 50% 50% Q 55% 65%, 60% 78% Q 64% 88%, 68% 96%"
          fill="none"
          stroke="hsl(100 15% 70%)"
          strokeWidth="0.9"
          strokeLinecap="round"
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
