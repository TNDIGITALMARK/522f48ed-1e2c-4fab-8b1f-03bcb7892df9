"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sprout, Flame, TrendingUp, Calendar } from 'lucide-react';
import { format, startOfDay, differenceInDays } from 'date-fns';

interface DailyRootsData {
  dates: string[]; // ISO date strings of days app was used
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

const STORAGE_KEY = 'bloom_daily_roots_tracker';

// Helper function to calculate streak from dates
function calculateStreaks(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = dates
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  const today = startOfDay(new Date());

  // Check if today or yesterday was visited (current streak is active)
  const mostRecent = startOfDay(sortedDates[0]);
  const daysSinceLastVisit = differenceInDays(today, mostRecent);

  if (daysSinceLastVisit <= 1) {
    currentStreak = 1;

    // Calculate current streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDay = startOfDay(sortedDates[i - 1]);
      const currentDay = startOfDay(sortedDates[i]);
      const dayDiff = differenceInDays(prevDay, currentDay);

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDay = startOfDay(sortedDates[i - 1]);
    const currentDay = startOfDay(sortedDates[i]);
    const dayDiff = differenceInDays(prevDay, currentDay);

    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}

// Load daily roots data from localStorage
function loadDailyRoots(): DailyRootsData {
  if (typeof window === 'undefined') {
    return { dates: [], currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as { dates: string[] };
      const { current, longest } = calculateStreaks(data.dates);
      return {
        dates: data.dates,
        currentStreak: current,
        longestStreak: longest,
        totalDays: data.dates.length,
      };
    }
  } catch (error) {
    console.error('Failed to load daily roots data:', error);
  }

  return { dates: [], currentStreak: 0, longestStreak: 0, totalDays: 0 };
}

// Save today's visit
function recordTodayVisit(): DailyRootsData {
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const data = loadDailyRoots();

  // Don't add duplicate entries for today
  if (!data.dates.includes(today)) {
    data.dates.push(today);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dates: data.dates }));

    // Recalculate streaks
    const { current, longest } = calculateStreaks(data.dates);
    data.currentStreak = current;
    data.longestStreak = longest;
    data.totalDays = data.dates.length;
  }

  return data;
}

export function DailyRootsWidget() {
  const [rootsData, setRootsData] = useState<DailyRootsData>({
    dates: [],
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
  });

  useEffect(() => {
    // Record today's visit and load data
    const data = recordTodayVisit();
    setRootsData(data);
  }, []);

  return (
    <Card className="p-4 widget-card">
      <div className="flex items-center gap-2 mb-3">
        <Sprout className="w-4 h-4 text-primary" />
        <h2 className="text-base font-semibold font-['Cormorant_Garamond']">Daily Roots</h2>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Your consistency creates lasting growth.
      </p>

      {/* Streak Stats - Compact Version */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Flame className="w-3 h-3 text-primary" />
            <span className="text-xl font-bold text-primary">{rootsData.currentStreak}</span>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-medium">Current</p>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <TrendingUp className="w-3 h-3 text-accent" />
            <span className="text-xl font-bold text-accent-foreground">{rootsData.longestStreak}</span>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-medium">Longest</p>
        </div>

        <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Calendar className="w-3 h-3 text-primary" />
            <span className="text-xl font-bold text-foreground">{rootsData.totalDays}</span>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-medium">Total</p>
        </div>
      </div>

      {/* Encouragement Message - Compact */}
      {rootsData.currentStreak > 0 && (
        <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-foreground/90 font-medium text-center">
            {rootsData.currentStreak === 1 && "🌱 Seeds of consistency!"}
            {rootsData.currentStreak >= 2 && rootsData.currentStreak <= 6 &&
              `🌿 ${rootsData.currentStreak} days strong!`}
            {rootsData.currentStreak >= 7 && rootsData.currentStreak <= 13 &&
              `🌳 ${rootsData.currentStreak} day streak!`}
            {rootsData.currentStreak >= 14 && rootsData.currentStreak <= 29 &&
              `🌲 ${rootsData.currentStreak} days!`}
            {rootsData.currentStreak >= 30 &&
              `🌳✨ ${rootsData.currentStreak} days!`}
          </p>
        </div>
      )}

      {rootsData.currentStreak === 0 && rootsData.totalDays > 0 && (
        <div className="mt-3 p-2 bg-muted/30 rounded-lg border border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            Welcome back! Start a new streak today.
          </p>
        </div>
      )}

      {rootsData.totalDays === 0 && (
        <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-foreground/90 text-center">
            🌱 Welcome! Your journey starts today.
          </p>
        </div>
      )}
    </Card>
  );
}
