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
    <Card className="p-6 animate-fade-in-up widget-card">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-primary/10 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold font-['Cormorant_Garamond']">Macros Today</h3>
          <p className="text-[0.6875rem] text-muted-foreground leading-tight font-['Cormorant_Garamond']">Track your daily nutrition</p>
        </div>
      </div>

      <div className="space-y-5">
        {macros.map((macro) => {
          const percentage = (macro.current / macro.goal) * 100;
          return (
            <div key={macro.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium font-['Cormorant_Garamond']">{macro.name}</span>
                <span className="text-muted-foreground text-[0.6875rem] font-['Cormorant_Garamond']">
                  {macro.current}/{macro.goal}{macro.unit}
                </span>
              </div>
              <Progress value={percentage} className="h-2" style={{
                ['--progress-color' as string]: macro.color
              }} />
              <div className="flex items-center justify-between text-[0.625rem] text-muted-foreground">
                <span className="font-['Cormorant_Garamond']">{percentage.toFixed(0)}% complete</span>
                <span className="font-['Cormorant_Garamond']">{macro.goal - macro.current}{macro.unit} remaining</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-[0.6875rem] text-muted-foreground leading-snug font-['Cormorant_Garamond']">
          💡 <span className="font-medium">Insight:</span> You're on track! Add a protein-rich
          snack to hit your goals.
        </p>
      </div>
    </Card>
  );
}
