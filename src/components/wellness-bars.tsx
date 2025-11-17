"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Calendar } from 'lucide-react';
import { getWeeklyGoals, getMonthlyGoals, type WeeklyGoal, type MonthlyGoal } from '@/lib/supabase/goals';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

interface WellnessBarProps {
  label: string;
  completed: number;
  total: number;
  color: string;
}

function WellnessBar({ label, completed, total, color }: WellnessBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function WellnessBars() {
  const [weeklyStats, setWeeklyStats] = useState({ completed: 0, total: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ completed: 0, total: 0 });
  const [quarterlyStats, setQuarterlyStats] = useState({ completed: 0, total: 0 });
  const [yearlyStats, setYearlyStats] = useState({ completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();

  useEffect(() => {
    loadWellnessData();

    // Listen for wellness update events from task completions
    const handleWellnessUpdate = () => {
      loadWellnessData();
    };
    window.addEventListener('wellness-update', handleWellnessUpdate);

    // Refresh wellness data every 30 seconds to catch task completions
    const interval = setInterval(() => {
      loadWellnessData();
    }, 30000);

    return () => {
      window.removeEventListener('wellness-update', handleWellnessUpdate);
      clearInterval(interval);
    };
  }, []);

  async function loadWellnessData() {
    setIsLoading(true);
    try {
      // Weekly goals
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weeklyGoals = await getWeeklyGoals(weekStartStr);
      setWeeklyStats({
        completed: weeklyGoals.filter(g => g.completed).length,
        total: weeklyGoals.length
      });

      // Monthly goals
      const monthStart = startOfMonth(now);
      const monthStartStr = format(monthStart, 'yyyy-MM-dd');
      const monthlyGoals = await getMonthlyGoals(monthStartStr);
      setMonthlyStats({
        completed: monthlyGoals.filter(g => g.completed).length,
        total: monthlyGoals.length
      });

      // Quarterly goals - aggregate from monthly goals in the quarter
      const quarterStart = startOfQuarter(now);
      const quarterEnd = endOfQuarter(now);
      const quarterMonths: Date[] = [];
      let currentMonth = quarterStart;
      while (currentMonth <= quarterEnd) {
        quarterMonths.push(currentMonth);
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      }

      const quarterlyGoalsData = await Promise.all(
        quarterMonths.map(month => getMonthlyGoals(format(month, 'yyyy-MM-dd')))
      );
      const allQuarterlyGoals = quarterlyGoalsData.flat();
      setQuarterlyStats({
        completed: allQuarterlyGoals.filter(g => g.completed).length,
        total: allQuarterlyGoals.length
      });

      // Yearly goals - aggregate from monthly goals in the year
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      const yearMonths: Date[] = [];
      let currentYearMonth = yearStart;
      while (currentYearMonth <= yearEnd) {
        if (currentYearMonth <= now) { // Only include months up to current month
          yearMonths.push(currentYearMonth);
        }
        currentYearMonth = new Date(currentYearMonth.getFullYear(), currentYearMonth.getMonth() + 1, 1);
      }

      const yearlyGoalsData = await Promise.all(
        yearMonths.map(month => getMonthlyGoals(format(month, 'yyyy-MM-dd')))
      );
      const allYearlyGoals = yearlyGoalsData.flat();
      setYearlyStats({
        completed: allYearlyGoals.filter(g => g.completed).length,
        total: allYearlyGoals.length
      });
    } catch (error) {
      console.error('Error loading wellness data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-secondary animate-pulse" />
          <h3 className="text-xl font-semibold font-['Cormorant_Garamond']">
            Wellness Progress
          </h3>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-secondary" />
        <h3 className="text-xl font-semibold font-['Cormorant_Garamond']">
          Wellness Progress
        </h3>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <WellnessBar
          label="Weekly"
          completed={weeklyStats.completed}
          total={weeklyStats.total}
          color="bg-gradient-to-r from-primary to-primary/80"
        />
        <WellnessBar
          label="Monthly"
          completed={monthlyStats.completed}
          total={monthlyStats.total}
          color="bg-gradient-to-r from-secondary to-secondary/80"
        />
        <WellnessBar
          label="Quarterly"
          completed={quarterlyStats.completed}
          total={quarterlyStats.total}
          color="bg-gradient-to-r from-accent to-accent/80"
        />
        <WellnessBar
          label="Yearly"
          completed={yearlyStats.completed}
          total={yearlyStats.total}
          color="bg-gradient-to-r from-primary/70 to-secondary/70"
        />
      </div>

      {/* Footer Insight */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your wellness bars grow as you complete tasks. Stay consistent to reach your goals!
          </p>
        </div>
      </div>
    </Card>
  );
}

export function AllInOneWellness() {
  const [overallStats, setOverallStats] = useState({ completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();

  useEffect(() => {
    loadOverallWellness();

    // Listen for wellness update events from task completions
    const handleWellnessUpdate = () => {
      loadOverallWellness();
    };
    window.addEventListener('wellness-update', handleWellnessUpdate);

    // Refresh overall wellness data every 30 seconds
    const interval = setInterval(() => {
      loadOverallWellness();
    }, 30000);

    return () => {
      window.removeEventListener('wellness-update', handleWellnessUpdate);
      clearInterval(interval);
    };
  }, []);

  async function loadOverallWellness() {
    setIsLoading(true);
    try {
      // Get all monthly goals for the current year
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      const yearMonths: Date[] = [];
      let currentMonth = yearStart;

      while (currentMonth <= yearEnd && currentMonth <= now) {
        yearMonths.push(currentMonth);
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      }

      const yearlyGoalsData = await Promise.all(
        yearMonths.map(month => getMonthlyGoals(format(month, 'yyyy-MM-dd')))
      );
      const allGoals = yearlyGoalsData.flat();

      setOverallStats({
        completed: allGoals.filter(g => g.completed).length,
        total: allGoals.length
      });
    } catch (error) {
      console.error('Error loading overall wellness:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const percentage = overallStats.total > 0
    ? Math.round((overallStats.completed / overallStats.total) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/12 to-accent/8 border-primary/30">
        <div className="text-center">
          <div className="h-32 w-32 mx-auto mb-4 rounded-full bg-muted/30 animate-pulse" />
          <div className="h-6 w-32 mx-auto bg-muted/30 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/12 to-accent/8 border-primary/30">
      <div className="text-center">
        {/* Circular Progress */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/30"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <h3 className="text-lg font-semibold font-['Cormorant_Garamond'] mb-2">
          All in One Wellness
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {overallStats.completed} of {overallStats.total} tasks completed
        </p>

        {/* Motivational Message */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">
            {percentage >= 80
              ? "Outstanding progress! You're thriving! 🌟"
              : percentage >= 60
              ? "Great work! Keep building momentum! 💪"
              : percentage >= 40
              ? "You're making steady progress! 🌱"
              : "Every journey starts with a single step! 🌿"}
          </p>
        </div>
      </div>
    </Card>
  );
}
