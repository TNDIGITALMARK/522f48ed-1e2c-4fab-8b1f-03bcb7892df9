"use client";

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface MacroData {
  name: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export function MacroTrackerWidget() {
  const macros: MacroData[] = [
    { name: 'Protein', current: 85, goal: 120, unit: 'g', color: 'hsl(var(--primary))' },
    { name: 'Carbs', current: 180, goal: 200, unit: 'g', color: 'hsl(var(--secondary))' },
    { name: 'Fats', current: 55, goal: 65, unit: 'g', color: 'hsl(var(--accent))' },
  ];

  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Macros Today</h3>
          <p className="text-sm text-muted-foreground">Track your daily nutrition</p>
        </div>
      </div>

      <div className="space-y-5">
        {macros.map((macro) => {
          const percentage = (macro.current / macro.goal) * 100;
          return (
            <div key={macro.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{macro.name}</span>
                <span className="text-muted-foreground">
                  {macro.current}/{macro.goal}{macro.unit}
                </span>
              </div>
              <Progress value={percentage} className="h-3" style={{
                ['--progress-color' as string]: macro.color
              }} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(0)}% complete</span>
                <span>{macro.goal - macro.current}{macro.unit} remaining</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium">Insight:</span> You're on track! Add a protein-rich
          snack to hit your goals.
        </p>
      </div>
    </Card>
  );
}
