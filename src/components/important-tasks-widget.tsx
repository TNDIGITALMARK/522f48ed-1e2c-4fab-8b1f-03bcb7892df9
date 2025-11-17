"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Circle, ChevronRight, Sparkles } from 'lucide-react';
import { getMonthlyGoals, updateMonthlyGoal, type MonthlyGoal } from '@/lib/supabase/goals';
import { format, parseISO, isValid } from 'date-fns';

interface ImportantTasksWidgetProps {
  onOpenSidebar?: () => void;
  className?: string;
}

export function ImportantTasksWidget({ onOpenSidebar, className }: ImportantTasksWidgetProps) {
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentMonth = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];

  useEffect(() => {
    loadMonthlyGoals();
  }, []);

  async function loadMonthlyGoals() {
    setIsLoading(true);
    try {
      const goals = await getMonthlyGoals(startOfMonth);
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

  async function handleToggleGoal(goalId: string, completed: boolean) {
    try {
      await updateMonthlyGoal(goalId, {
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : undefined
      });
      loadMonthlyGoals();

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
    <Card className={`p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent-foreground" />
          <h2 className="text-2xl font-semibold font-['Cormorant_Garamond']">
            Important Tasks for {monthName}
          </h2>
        </div>
        <Button
          onClick={onOpenSidebar}
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-accent/20"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 animate-pulse" />
          <p className="text-sm">Loading tasks...</p>
        </div>
      ) : monthlyGoals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-secondary" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs mt-1">No important tasks for this month yet</p>
          <Button
            onClick={onOpenSidebar}
            size="sm"
            variant="outline"
            className="mt-4"
          >
            Add Tasks
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {monthlyGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-lg border border-border bg-background/60 hover:bg-background/80 hover:border-accent/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleGoal(goal.id, goal.completed)}
                  className="mt-0.5 shrink-0"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-accent-foreground transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground leading-snug">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">{formatDueDate(goal)}</span>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {goal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {goal.priority === 1 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                        High Priority
                      </span>
                    )}
                    {goal.priority === 2 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground font-medium">
                        Important
                      </span>
                    )}
                    {goal.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary capitalize">
                        {goal.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with action button */}
      {monthlyGoals.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/50">
          <Button
            onClick={onOpenSidebar}
            variant="outline"
            className="w-full gap-2 hover:bg-accent/10 hover:border-accent/40"
          >
            <Calendar className="w-4 h-4" />
            View Full Schedule
          </Button>
        </div>
      )}
    </Card>
  );
}
