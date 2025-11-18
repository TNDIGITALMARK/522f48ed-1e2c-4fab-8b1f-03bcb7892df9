"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Rooted Balance Rectangle Carousel Component
 *
 * A swipeable horizontal carousel showing cycle phases in small rectangles
 * that move left when swiped. Replaces the circular diagram with an
 * interactive rectangular card carousel.
 *
 * Design features:
 * - Small rectangles arranged horizontally in a carousel
 * - Smooth swipe/drag interaction for horizontal scrolling
 * - Auto-scroll animation on left swipe
 * - Colored rectangles (sage green, navy, brown, beige, dark green)
 * - Responsive touch and mouse events
 * - Small "Rooted Balance" title in left corner
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

  const phases = [
    { label: 'Cycle Phase 1', color: colors.sage, description: 'Renewal & Rest' },
    { label: 'Cycle Phase 2', color: colors.navy, description: 'Energy Rising' },
    { label: 'Cycle Phase 3', color: colors.brown, description: 'Peak Power' },
    { label: 'Cycle Phase 4', color: colors.beige, description: 'Gentle Transition' },
    { label: 'Cycle Phase 5', color: colors.darkGreen, description: 'Grounding' },
  ];

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle mouse down (start drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  // Handle mouse move (dragging)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Multiply by 2 for faster scroll
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Handle mouse up (stop drag)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Scroll left button handler
  const scrollLeftButton = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  // Scroll right button handler
  const scrollRightButton = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // Track scroll position for button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const position = carouselRef.current.scrollLeft;
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

        setScrollPosition(position);
        setIsAtStart(position <= 10);
        setIsAtEnd(position >= maxScroll - 10);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <Card className="bloom-card relative overflow-hidden max-w-4xl mx-auto">
      {/* Subtle background tint */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: colors.sage,
          opacity: 0.05,
        }}
      />

      {/* Rooted Balance title in left corner */}
      <div className="absolute top-4 left-4 z-20">
        <h2
          className="text-xs font-light tracking-widest uppercase"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: colors.brown,
            letterSpacing: '0.15em'
          }}
        >
          Rooted Balance
        </h2>
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={scrollLeftButton}
          disabled={isAtStart}
          className={`p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md ${
            isAtStart ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: colors.brown }} />
        </button>
        <button
          onClick={scrollRightButton}
          disabled={isAtEnd}
          className={`p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md ${
            isAtEnd ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" style={{ color: colors.brown }} />
        </button>
      </div>

      {/* Scrollable carousel container */}
      <div className="relative z-10 pt-16 pb-8 px-6">
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {phases.map((phase, index) => (
            <div
              key={index}
              className="flex-shrink-0 interactive-card"
              style={{
                scrollSnapAlign: 'start',
                width: '200px',
              }}
            >
              <div
                className="rounded-2xl p-6 h-full shadow-bloom-sm hover:shadow-bloom transition-all duration-300"
                style={{
                  backgroundColor: phase.color,
                  minHeight: '180px',
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: index === 3 ? colors.brown : 'white', // Beige needs dark text
                      }}
                    >
                      {phase.label}
                    </h3>
                    <p
                      className="text-sm opacity-90"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: index === 3 ? colors.brown : 'white',
                      }}
                    >
                      {phase.description}
                    </p>
                  </div>
                  <div
                    className="text-3xl font-bold opacity-20"
                    style={{
                      color: index === 3 ? colors.brown : 'white',
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe hint indicator */}
        <div className="mt-4 text-center">
          <p
            className="text-xs opacity-60 swipe-indicator"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: colors.brown,
            }}
          >
            ← Swipe to explore →
          </p>
        </div>
      </div>
    </Card>
  );
}
