"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NutritionStep {
  id: string;
  title: string;
  type: string;
  calories: number;
  protein: number;
  fiber: number;
  bloomScore: number;
  tags: string[];
  description?: string;
  image?: string;
}

interface SwipeableNutritionCarouselProps {
  steps: NutritionStep[];
  className?: string;
}

export function SwipeableNutritionCarousel({ steps, className = '' }: SwipeableNutritionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Threshold for swipe (100px)
    if (Math.abs(translateX) > 100) {
      if (translateX > 0 && currentIndex > 0) {
        // Swipe right - previous
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < steps.length - 1) {
        // Swipe left - next
        setCurrentIndex(currentIndex + 1);
      }
    }

    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (Math.abs(translateX) > 100) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < steps.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setTranslateX(0);
  };

  const goToNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentStep = steps[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Magazine-style header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Today's Nutrition Plan</h3>
          <p className="text-sm text-muted-foreground">Swipe to explore your meals</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {currentIndex + 1} / {steps.length}
          </span>
          <button
            onClick={goToNext}
            disabled={currentIndex === steps.length - 1}
            className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Swipeable carousel container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) handleMouseUp();
        }}
      >
        {/* Cards container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.id}
              className="min-w-full px-2"
              style={{ userSelect: isDragging ? 'none' : 'auto' }}
            >
              <Card className="magazine-feature-card texture-fabric overflow-hidden">
                {/* Magazine-style header badge */}
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="text-sm font-semibold">
                    {step.type}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        step.bloomScore >= 90
                          ? 'bg-primary text-primary-foreground'
                          : step.bloomScore >= 80
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-accent/50 text-accent-foreground'
                      }`}
                    >
                      {step.bloomScore}
                    </div>
                    <span className="text-xs text-muted-foreground">Bloom Score</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-2xl font-bold mb-3 leading-tight">{step.title}</h4>

                {/* Description if available */}
                {step.description && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                )}

                {/* Nutrition stats grid - magazine style */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                      Calories
                    </p>
                    <p className="text-2xl font-bold text-foreground">{step.calories}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">kcal</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                      Protein
                    </p>
                    <p className="text-2xl font-bold text-foreground">{step.protein}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">grams</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                      Fiber
                    </p>
                    <p className="text-2xl font-bold text-foreground">{step.fiber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">grams</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {step.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Swipe indicator */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-center gap-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>← Swipe to explore →</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Page indicators (dots) */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
