'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, Calendar, Sparkles } from 'lucide-react';

interface CycleInsightsGraphsProps {
  cycleDay: number;
  cycleLength: number;
  cyclePhase: 'Menstruation' | 'Follicular' | 'Ovulation' | 'Luteal';
}

export function CycleInsightsGraphs({
  cycleDay,
  cycleLength,
  cyclePhase
}: CycleInsightsGraphsProps) {
  // Calculate hormone levels based on cycle day (simplified model)
  const calculateHormoneLevel = (day: number, hormone: 'estrogen' | 'progesterone' | 'testosterone') => {
    const normalizedDay = day / cycleLength;

    switch (hormone) {
      case 'estrogen':
        // Rises during follicular, peaks at ovulation, drops in luteal
        if (normalizedDay < 0.18) return 20; // Menstruation - low
        if (normalizedDay < 0.5) return 70 + (normalizedDay - 0.18) * 100; // Follicular - rising
        if (normalizedDay < 0.57) return 100; // Ovulation - peak
        return 60 - (normalizedDay - 0.57) * 50; // Luteal - moderate

      case 'progesterone':
        // Low until ovulation, rises in luteal phase
        if (normalizedDay < 0.5) return 15; // Before ovulation - low
        if (normalizedDay < 0.57) return 30; // Ovulation - beginning to rise
        return 30 + (normalizedDay - 0.57) * 120; // Luteal - high

      case 'testosterone':
        // Peaks mid-cycle
        if (normalizedDay < 0.18) return 25; // Menstruation - low
        if (normalizedDay < 0.5) return 60; // Follicular - moderate
        if (normalizedDay < 0.57) return 80; // Ovulation - peak
        return 40; // Luteal - moderate

      default:
        return 50;
    }
  };

  const estrogenLevel = calculateHormoneLevel(cycleDay, 'estrogen');
  const progesteroneLevel = calculateHormoneLevel(cycleDay, 'progesterone');
  const testosteroneLevel = calculateHormoneLevel(cycleDay, 'testosterone');

  // Render hormone chart
  const renderHormoneChart = () => {
    const days = Array.from({ length: cycleLength }, (_, i) => i + 1);

    return (
      <div className="relative h-48 bg-gradient-to-b from-white to-muted/20 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
          <span>High</span>
          <span>Med</span>
          <span>Low</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-dashed border-gray-200" />
            ))}
          </div>

          {/* Hormone curves */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Estrogen - Orange/Coral */}
            <path
              d={days
                .map((day, i) => {
                  const x = (i / (cycleLength - 1)) * 100;
                  const level = calculateHormoneLevel(day, 'estrogen');
                  const y = 100 - level;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#F97316"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Progesterone - Blue */}
            <path
              d={days
                .map((day, i) => {
                  const x = (i / (cycleLength - 1)) * 100;
                  const level = calculateHormoneLevel(day, 'progesterone');
                  const y = 100 - level;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Current day indicator */}
            <line
              x1={`${((cycleDay - 1) / (cycleLength - 1)) * 100}`}
              y1="0"
              x2={`${((cycleDay - 1) / (cycleLength - 1)) * 100}`}
              y2="100"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-muted-foreground mt-2">
          <span>Day 1</span>
          <span>Day {Math.floor(cycleLength / 2)}</span>
          <span>Day {cycleLength}</span>
        </div>
      </div>
    );
  };

  // Common symptoms by phase
  const getPhaseSymptoms = () => {
    switch (cyclePhase) {
      case 'Menstruation':
        return [
          { label: 'Sensitive', emoji: '😢', color: 'bg-pink-100' },
          { label: 'Overthinking', emoji: '🤔', color: 'bg-pink-100' },
          { label: 'PMS', emoji: '😰', color: 'bg-pink-100' },
          { label: 'Low', emoji: '🔋', color: 'bg-pink-100' },
          { label: 'Blemishes', emoji: '✨', color: 'bg-pink-100' }
        ];
      case 'Follicular':
        return [
          { label: 'Energized', emoji: '⚡', color: 'bg-yellow-100' },
          { label: 'Confident', emoji: '💪', color: 'bg-yellow-100' },
          { label: 'Clear Skin', emoji: '✨', color: 'bg-yellow-100' },
          { label: 'Motivated', emoji: '🎯', color: 'bg-yellow-100' }
        ];
      case 'Ovulation':
        return [
          { label: 'Peak Energy', emoji: '🔥', color: 'bg-green-100' },
          { label: 'Social', emoji: '💬', color: 'bg-green-100' },
          { label: 'Confident', emoji: '✨', color: 'bg-green-100' },
          { label: 'Glowing', emoji: '🌟', color: 'bg-green-100' }
        ];
      case 'Luteal':
        return [
          { label: 'Tired', emoji: '😴', color: 'bg-purple-100' },
          { label: 'Bloated', emoji: '💧', color: 'bg-purple-100' },
          { label: 'Cravings', emoji: '🍫', color: 'bg-purple-100' },
          { label: 'Emotional', emoji: '💭', color: 'bg-purple-100' }
        ];
    }
  };

  const symptoms = getPhaseSymptoms();

  return (
    <div className="space-y-6">
      {/* Common Patterns Card */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Common Patterns</h3>
            <p className="text-sm text-muted-foreground">
              These symptoms tend to show up around this time
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {symptoms.map((symptom, index) => (
            <div
              key={index}
              className={`${symptom.color} rounded-full px-4 py-2 flex items-center gap-2`}
            >
              <span className="text-xl">{symptom.emoji}</span>
              <span className="font-medium text-sm">{symptom.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Hormone Levels Chart */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Hormone Levels
          </h3>
          <p className="text-sm text-muted-foreground">
            In the {cyclePhase.toLowerCase()} phase, your body waits to see if the egg is fertilized.
            Progesterone increases, estrogen fluctuates, and testosterone decreases.
          </p>
        </div>

        {renderHormoneChart()}

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-orange-500 rounded"></div>
            <span className="text-muted-foreground">Estrogen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-blue-500 rounded"></div>
            <span className="text-muted-foreground">Progesterone</span>
          </div>
        </div>

        {/* Current Levels */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Estrogen</div>
            <div className="text-lg font-bold text-orange-600">
              {estrogenLevel.toFixed(0)}%
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Progesterone</div>
            <div className="text-lg font-bold text-blue-600">
              {progesteroneLevel.toFixed(0)}%
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Testosterone</div>
            <div className="text-lg font-bold text-green-600">
              {testosteroneLevel.toFixed(0)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Cycle Length Over Time */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Cycle Length Over Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Your cycle patterns over the past few months
          </p>
        </div>

        {/* Bar chart visualization */}
        <div className="space-y-3">
          {[
            { month: 'Jan', days: 28, period: 6, color: 'bg-green-400' },
            { month: 'Dec', days: 29, period: 6, color: 'bg-green-400' },
            { month: 'Nov', days: 34, period: 6, color: 'bg-yellow-400' },
            { month: 'Oct', days: 28, period: 6, color: 'bg-green-400' },
            { month: 'Sep', days: 29, period: 5, color: 'bg-green-400' },
            { month: 'Aug', days: 30, period: 6, color: 'bg-green-400' }
          ].map((cycle, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 text-sm font-medium text-muted-foreground">
                {cycle.month}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-muted/30 rounded-full h-8 relative overflow-hidden">
                  {/* Period days - red dots */}
                  <div className="absolute left-0 top-0 bottom-0 flex items-center px-2">
                    {Array.from({ length: cycle.period }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"
                      />
                    ))}
                  </div>
                  {/* Cycle length bar */}
                  <div
                    className={`${cycle.color} h-full rounded-full transition-all`}
                    style={{ width: `${(cycle.days / 35) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-sm font-bold">
                  {cycle.days} <span className="text-xs text-muted-foreground">days</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            </div>
            <span>Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-green-400 rounded"></div>
            <span>Normal cycle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-yellow-400 rounded"></div>
            <span>Irregular</span>
          </div>
        </div>
      </Card>

      {/* Insights Summary */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">Your Cycle Insights</h4>
              <p className="text-sm text-muted-foreground">
                Based on 6 cycles of data
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <p>Your average cycle length is <strong>30 days</strong>, which is within the healthy range</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <p>Your period length is consistent at <strong>6 days</strong></p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">⚠</Badge>
                <p>Cycle length variations of <strong>26-34 days</strong> - consider tracking symptoms</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
