"use client";

import { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Target, TrendingUp, Dumbbell } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface RoutineItem {
  id: string;
  label: string;
  completed: boolean;
}

interface ProgressBarItem {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ElementType;
}

export function ExpandableSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [morningExpanded, setMorningExpanded] = useState(false);
  const [nightExpanded, setNightExpanded] = useState(false);
  const [goalsExpanded, setGoalsExpanded] = useState(false);

  const [morningRoutine, setMorningRoutine] = useState<RoutineItem[]>([
    { id: '1', label: 'Drink water', completed: false },
    { id: '2', label: 'Meditation', completed: false },
    { id: '3', label: 'Stretch', completed: false },
    { id: '4', label: 'Healthy breakfast', completed: false },
  ]);

  const [nightRoutine, setNightRoutine] = useState<RoutineItem[]>([
    { id: '1', label: 'Skincare routine', completed: false },
    { id: '2', label: 'Journal', completed: false },
    { id: '3', label: 'Read', completed: false },
    { id: '4', label: 'Sleep by 10pm', completed: false },
  ]);

  const [monthlyGoals, setMonthlyGoals] = useState<RoutineItem[]>([
    { id: '1', label: 'Exercise 12 times', completed: false },
    { id: '2', label: 'Meal prep 3 Sundays', completed: false },
    { id: '3', label: 'Read 2 books', completed: false },
    { id: '4', label: 'Drink 8 cups water daily', completed: false },
  ]);

  const progressBars: ProgressBarItem[] = [
    {
      id: 'weight',
      label: 'Weight Goal',
      current: 152,
      target: 145,
      unit: 'lbs',
      icon: TrendingUp
    },
    {
      id: 'workout',
      label: 'Workout Streak',
      current: 5,
      target: 30,
      unit: 'days',
      icon: Dumbbell
    },
  ];

  const toggleItem = (
    items: RoutineItem[],
    setItems: React.Dispatch<React.SetStateAction<RoutineItem[]>>,
    id: string
  ) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <>
      {/* Sidebar Toggle Button - Hidden when expanded */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 rounded-r-full rounded-l-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-bloom z-50 px-2 py-6"
          size="sm"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}

      {/* Expandable Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-md border-r border-border shadow-bloom-lg transition-all duration-300 z-40 overflow-y-auto",
          isExpanded ? "w-80" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="p-6 space-y-4">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground font-['Cormorant_Garamond']">My Daily Life</h2>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            </div>

            {/* Morning Routine Section */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <button
                onClick={() => setMorningExpanded(!morningExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    ☀️
                  </div>
                  <h3 className="font-semibold text-foreground">Morning Routine</h3>
                </div>
                {morningExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {morningExpanded && (
                <div className="space-y-2 mt-3">
                  {morningRoutine.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(morningRoutine, setMorningRoutine, item.id)}
                        className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.completed && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Night Routine Section */}
            <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <button
                onClick={() => setNightExpanded(!nightExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    🌙
                  </div>
                  <h3 className="font-semibold text-foreground">Night Routine</h3>
                </div>
                {nightExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {nightExpanded && (
                <div className="space-y-2 mt-3">
                  {nightRoutine.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(nightRoutine, setNightRoutine, item.id)}
                        className="w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.completed && (
                        <Check className="w-4 h-4 text-secondary" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Monthly Goals Section */}
            <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
              <button
                onClick={() => setGoalsExpanded(!goalsExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-accent-foreground" />
                  <h3 className="font-semibold text-foreground">Monthly Goals</h3>
                </div>
                {goalsExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {goalsExpanded && (
                <div className="space-y-2 mt-3">
                  {monthlyGoals.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(monthlyGoals, setMonthlyGoals, item.id)}
                        className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-2 focus:ring-accent/20"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.completed && (
                        <Check className="w-4 h-4 text-accent-foreground" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Life Progress Bars */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Life Progress</h3>
              {progressBars.map((bar) => {
                const Icon = bar.icon;
                const percentage = Math.min((bar.current / bar.target) * 100, 100);

                return (
                  <Card key={bar.id} className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{bar.label}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{bar.current} {bar.unit}</span>
                        <span>{bar.target} {bar.unit}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-center text-primary font-medium">
                        {percentage.toFixed(0)}% Complete
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop when sidebar is expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
        />
      )}
    </>
  );
}
