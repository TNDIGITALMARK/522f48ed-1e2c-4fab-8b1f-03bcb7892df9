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
          className="fixed left-0 top-1/2 -translate-y-1/2 rounded-r-full rounded-l-none bg-white hover:bg-gray-50 border border-gray-200 shadow-bloom z-50 px-2 py-6"
          size="sm"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </Button>
      )}

      {/* Expandable Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-40 overflow-y-auto",
          isExpanded ? "w-80" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="p-5 space-y-3">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 font-['Cormorant_Garamond']">My Daily Life</h2>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4 rotate-180 text-black" />
              </Button>
            </div>

            {/* Morning Routine Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setMorningExpanded(!morningExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Morning Routines</h3>
                </div>
                {morningExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {morningExpanded && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-gray-500 mb-2">📅 Today</div>
                  {morningRoutine.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(morningRoutine, setMorningRoutine, item.id)}
                        className="w-4 h-4 rounded border border-gray-300 text-gray-800 focus:ring-1 focus:ring-gray-400"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-gray-400" : "text-gray-700"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Night Routine Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setNightExpanded(!nightExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌙</span>
                  <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Evening Routines</h3>
                </div>
                {nightExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {nightExpanded && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-gray-500 mb-2">📅 Today</div>
                  {nightRoutine.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(nightRoutine, setNightRoutine, item.id)}
                        className="w-4 h-4 rounded border border-gray-300 text-gray-800 focus:ring-1 focus:ring-gray-400"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-gray-400" : "text-gray-700"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Monthly Goals Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setGoalsExpanded(!goalsExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🖤</span>
                  <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Monthly Goals</h3>
                </div>
                {goalsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {goalsExpanded && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-gray-500 mb-2">⭕ Add goals</div>
                  {monthlyGoals.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm mt-0.5">•</span>
                      <span className={cn(
                        "text-sm flex-1",
                        item.completed ? "line-through text-gray-400" : "text-gray-700"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Life Progress Bars */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🖤</span>
                <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Life Progress Bar</h3>
              </div>
              {progressBars.map((bar) => {
                const Icon = bar.icon;
                const percentage = Math.min((bar.current / bar.target) * 100, 100);

                return (
                  <Card key={bar.id} className="p-3 bg-white border border-gray-200 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">{bar.label}</span>
                        <span className="text-gray-500 font-medium">{percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={percentage} className="h-1.5 bg-gray-100" />
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
