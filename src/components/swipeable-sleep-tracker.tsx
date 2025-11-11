"use client";

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Moon, Sun, CloudMoon, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface SleepStage {
  id: string;
  stage: string;
  duration: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  icon: 'moon' | 'cloud-moon' | 'star' | 'sun';
  tips: string[];
  color: string;
}

const sleepStages: SleepStage[] = [
  {
    id: 'deep',
    stage: 'Deep Sleep',
    duration: 2.3,
    quality: 'good',
    icon: 'moon',
    color: 'from-indigo-500/20 to-purple-500/20',
    tips: [
      'You got 2.3 hours of restorative deep sleep',
      'Deep sleep helps with physical recovery and memory consolidation',
      'Aim for 1.5-2 hours for optimal rest',
    ],
  },
  {
    id: 'rem',
    stage: 'REM Sleep',
    duration: 1.8,
    quality: 'good',
    icon: 'star',
    color: 'from-violet-500/20 to-fuchsia-500/20',
    tips: [
      'REM sleep supports emotional processing and creativity',
      'You had 1.8 hours of REM - right on target!',
      'REM typically occurs in 90-minute cycles',
    ],
  },
  {
    id: 'light',
    stage: 'Light Sleep',
    duration: 3.4,
    quality: 'excellent',
    icon: 'cloud-moon',
    color: 'from-blue-500/20 to-cyan-500/20',
    tips: [
      'Light sleep prepares your body for deeper stages',
      'You spent 3.4 hours in light sleep',
      'This is the most common sleep stage',
    ],
  },
  {
    id: 'awake',
    stage: 'Awake Time',
    duration: 0.2,
    quality: 'excellent',
    icon: 'sun',
    color: 'from-amber-500/20 to-orange-500/20',
    tips: [
      'Brief awakenings are normal during sleep',
      'You woke up only 2-3 times - great consistency!',
      'Try to maintain a cool, dark environment',
    ],
  },
];

export function SwipeableSleepTracker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSleep = sleepStages.reduce((sum, stage) => sum + stage.duration, 0);
  const sleepGoal = 8.0;
  const sleepPercentage = (totalSleep / sleepGoal) * 100;

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

    if (Math.abs(translateX) > 80) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < sleepStages.length - 1) {
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

    if (Math.abs(translateX) > 80) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < sleepStages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setTranslateX(0);
  };

  const goToNext = () => {
    if (currentIndex < sleepStages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getIcon = (iconType: string) => {
    const iconClass = 'w-12 h-12';
    switch (iconType) {
      case 'moon':
        return <Moon className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'cloud-moon':
        return <CloudMoon className={iconClass} />;
      case 'sun':
        return <Sun className={iconClass} />;
      default:
        return <Moon className={iconClass} />;
    }
  };

  const getQualityBadge = (quality: string) => {
    const colors = {
      poor: 'bg-destructive/20 text-destructive border-destructive/30',
      fair: 'bg-accent/20 text-accent-foreground border-accent/30',
      good: 'bg-secondary/20 text-secondary-foreground border-secondary/30',
      excellent: 'bg-primary/20 text-primary border-primary/30',
    };
    return colors[quality as keyof typeof colors] || colors.good;
  };

  const currentStage = sleepStages[currentIndex];

  return (
    <div className="space-y-4">
      {/* Overall sleep summary */}
      <Card className="magazine-feature-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Last Night's Sleep</h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{totalSleep.toFixed(1)}h</p>
            <p className="text-xs text-muted-foreground">of {sleepGoal}h goal</p>
          </div>
        </div>
        <Progress value={sleepPercentage} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground">
          {sleepPercentage >= 90
            ? '🎉 Excellent sleep! You hit your goal!'
            : sleepPercentage >= 75
            ? '✨ Great sleep! Almost at your goal'
            : sleepPercentage >= 60
            ? '💤 Good rest, but could be better'
            : '😴 Try to get more rest tonight'}
        </p>
      </Card>

      {/* Swipeable sleep stages */}
      <div className="relative">
        {/* Header with navigation */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">Sleep Stages Breakdown</h4>
            <p className="text-xs text-muted-foreground">Swipe to explore each stage</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center">
              {currentIndex + 1} / {sleepStages.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === sleepStages.length - 1}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel container */}
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
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`,
            }}
          >
            {sleepStages.map((stage) => (
              <div
                key={stage.id}
                className="min-w-full px-2"
                style={{ userSelect: isDragging ? 'none' : 'auto' }}
              >
                <Card className={`magazine-feature-card bg-gradient-to-br ${stage.color} border-2`}>
                  {/* Stage header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center">
                        {getIcon(stage.icon)}
                      </div>
                      <div>
                        <h5 className="text-xl font-bold mb-1">{stage.stage}</h5>
                        <p className="text-2xl font-bold text-primary">
                          {stage.duration.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getQualityBadge(stage.quality)} border`}>
                      {stage.quality.charAt(0).toUpperCase() + stage.quality.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress bar for this stage */}
                  <div className="mb-4">
                    <Progress
                      value={(stage.duration / totalSleep) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {((stage.duration / totalSleep) * 100).toFixed(0)}% of total sleep
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="space-y-2">
                    {stage.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-card/50 rounded-lg"
                      >
                        <span className="text-primary font-bold text-sm">•</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* Swipe indicator */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">← Swipe to see next stage →</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Page indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {sleepStages.map((_, index) => (
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
    </div>
  );
}
