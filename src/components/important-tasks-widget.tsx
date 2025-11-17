"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Circle, ChevronRight, Sparkles } from 'lucide-react';
import { getMonthlyGoals, updateMonthlyGoal, type MonthlyGoal, getWeeklyGoals, type WeeklyGoal } from '@/lib/supabase/goals';
import { format, parseISO, isValid, startOfWeek, startOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

interface ImportantTasksWidgetProps {
  onOpenSidebar?: () => void;
  className?: string;
}

interface WellnessBarProps {
  label: string;
  completed: number;
  total: number;
  color: string;
}

function WellnessBar({ label, completed, total, color }: WellnessBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-[9px] text-muted-foreground">
          {completed}/{total}
        </span>
      </div>
      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ImportantTasksWidget({ onOpenSidebar, className }: ImportantTasksWidgetProps) {
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wellness stats
  const [weeklyStats, setWeeklyStats] = useState({ completed: 0, total: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ completed: 0, total: 0 });
  const [quarterlyStats, setQuarterlyStats] = useState({ completed: 0, total: 0 });
  const [yearlyStats, setYearlyStats] = useState({ completed: 0, total: 0 });

  const currentMonth = new Date();
  const startOfMonthStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
  const now = new Date();

  useEffect(() => {
    loadMonthlyGoals();
    loadWellnessData();

    // Listen for wellness update events from task completions
    const handleWellnessUpdate = () => {
      loadMonthlyGoals();
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

  async function loadMonthlyGoals() {
    setIsLoading(true);
    try {
      const goals = await getMonthlyGoals(startOfMonthStr);
      // Filter for important tasks (priority 1 or 2) and not completed
      const importantGoals = goals
        .filter(goal => !goal.completed && (goal.priority === 1 || goal.priority === 2))
        .slice(0, 5); // Show top 5
      setMonthlyGoals(importantGoals);
    } catch (error) {
      console.error('Error loading monthly goals:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadWellnessData() {
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
    }
  }

  async function handleToggleGoal(goalId: string, completed: boolean) {
    try {
      await updateMonthlyGoal(goalId, {
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : undefined
      });
      loadMonthlyGoals();
      loadWellnessData();

      // Trigger a custom event to notify wellness bars of the change
      window.dispatchEvent(new CustomEvent('wellness-update'));
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  }

  function formatDueDate(goal: MonthlyGoal): string {
    // Check if goal has a due_date field
    const dueDate = (goal as any).due_date;
    if (dueDate) {
      try {
        const date = parseISO(dueDate);
        if (isValid(date)) {
          return format(date, 'MMM d');
        }
      } catch (e) {
        // Fallback
      }
    }

    // Default to month_end if no due_date
    try {
      const date = parseISO(goal.month_end);
      if (isValid(date)) {
        return format(date, 'MMM d');
      }
    } catch (e) {
      return 'No date';
    }
    return 'No date';
  }

  const monthName = format(currentMonth, 'MMMM');

  return (
    <Card className={`p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
          <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">
            Important Tasks for {monthName}
          </h2>
        </div>
        <Button
          onClick={onOpenSidebar}
          variant="ghost"
          size="sm"
          className="gap-1.5 hover:bg-accent/20 text-xs"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="text-center py-6 text-muted-foreground">
          <Calendar className="w-6 h-6 mx-auto mb-2 animate-pulse" />
          <p className="text-xs">Loading tasks...</p>
        </div>
      ) : monthlyGoals.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50 text-secondary" />
          <p className="text-xs font-medium">All caught up!</p>
          <p className="text-[10px] mt-1">No important tasks for this month yet</p>
          <Button
            onClick={onOpenSidebar}
            size="sm"
            variant="outline"
            className="mt-3 text-xs"
          >
            Add Tasks
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {monthlyGoals.map((goal) => {
            // Calculate progress (0-100%)
            // For this demo, we'll use completion status
            // You can extend this to track subtasks or actual progress
            const progress = goal.completed ? 100 : 0;

            return (
              <div
                key={goal.id}
                className="p-3 rounded-lg border border-border bg-background/60 hover:bg-background/80 hover:border-accent/40 transition-all"
              >
                <div className="flex gap-3 items-center">
                  {/* Left side - Task content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Task Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-1">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{formatDueDate(goal)}</span>
                      </div>
                    </div>

                    {/* Progress Bar with Tasks Completed Label */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          Tasks Completed
                        </span>
                        <span className="text-[10px] font-semibold text-foreground">
                          {progress}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <button
                        onClick={() => handleToggleGoal(goal.id, goal.completed)}
                        className="w-full cursor-pointer"
                      >
                        <div className="progress-copper h-1.5 w-full">
                          <div
                            className="progress-copper-fill transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {goal.priority === 1 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                          High Priority
                        </span>
                      )}
                      {goal.priority === 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent-foreground font-medium">
                          Important
                        </span>
                      )}
                      {goal.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary capitalize">
                          {goal.category}
                        </span>
                      )}
                      {goal.completed && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Complete
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side - Wellness Bars */}
                  <div className="w-32 shrink-0 space-y-1.5">
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer with action button */}
      {monthlyGoals.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <Button
            onClick={onOpenSidebar}
            variant="outline"
            size="sm"
            className="w-full gap-1.5 hover:bg-accent/10 hover:border-accent/40 text-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            View Full Schedule
          </Button>
        </div>
      )}
    </Card>
  );
}
