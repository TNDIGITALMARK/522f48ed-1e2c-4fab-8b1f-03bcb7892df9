"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Heart, Activity, Apple, Brain, Moon, Sparkles, TrendingUp, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export interface WellnessGoal {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const WELLNESS_GOALS: WellnessGoal[] = [
  {
    id: 'fitness',
    name: 'Fitness & Movement',
    description: 'Focus on workouts, activity tracking, and physical strength',
    icon: Activity,
    color: 'hsl(var(--icon-workout))',
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    description: 'Track meals, calories, and nutritional goals',
    icon: Apple,
    color: 'hsl(var(--icon-nutrition))',
  },
  {
    id: 'mental',
    name: 'Mental Wellness',
    description: 'Meditation, mindfulness, and emotional health',
    icon: Brain,
    color: 'hsl(var(--accent))',
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    description: 'Optimize rest, sleep patterns, and recovery',
    icon: Moon,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'cycle',
    name: 'Cycle Tracking',
    description: 'Hormone health and menstrual cycle awareness',
    icon: Heart,
    color: 'hsl(var(--icon-cycle))',
  },
  {
    id: 'holistic',
    name: 'Holistic Balance',
    description: 'Balanced approach across all wellness areas',
    icon: Sparkles,
    color: 'hsl(var(--secondary))',
  },
];

interface DashboardSettingsProps {
  trigger?: React.ReactNode;
}

export function DashboardSettings({ trigger }: DashboardSettingsProps) {
  const [open, setOpen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { toast } = useToast();

  // Load saved goals from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellness-goals');
    if (saved) {
      try {
        setSelectedGoals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wellness goals:', e);
      }
    } else {
      // Default to holistic balance
      setSelectedGoals(['holistic']);
    }
  }, []);

  // Save goals to localStorage and trigger custom event
  const saveGoals = (goals: string[]) => {
    setSelectedGoals(goals);
    localStorage.setItem('wellness-goals', JSON.stringify(goals));

    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('wellness-goals-changed', {
      detail: { goals }
    }));
  };

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      // Remove goal
      const newGoals = selectedGoals.filter(id => id !== goalId);
      saveGoals(newGoals.length > 0 ? newGoals : ['holistic']);
    } else {
      // Add goal
      saveGoals([...selectedGoals, goalId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Customize Dashboard
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-['Cormorant_Garamond']">
            Customize Your Dashboard
          </DialogTitle>
          <DialogDescription className="text-base">
            Select your wellness goals to personalize your dashboard experience.
            Your dashboard will prioritize content and widgets that align with your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Wellness Goals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WELLNESS_GOALS.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoals.includes(goal.id);

              return (
                <Card
                  key={goal.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? 'border-2 border-primary bg-primary/5 shadow-md'
                      : 'border border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                      style={!isSelected ? { backgroundColor: goal.color + '20' } : {}}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={!isSelected ? { color: goal.color } : {}}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {goal.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  You can select multiple goals! Your dashboard will adapt to show relevant
                  widgets, insights, and recommendations based on your selections.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {selectedGoals.length} {selectedGoals.length === 1 ? 'goal' : 'goals'} selected
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                toast({
                  title: "Dashboard customized!",
                  description: "Your wellness goals have been updated. Your dashboard will now show personalized content.",
                  duration: 3000,
                });
              }}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
