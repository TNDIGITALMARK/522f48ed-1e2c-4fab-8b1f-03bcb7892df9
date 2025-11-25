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
import { Settings, Heart, Activity, Apple, Brain, Moon, Sparkles, TrendingUp, Check, Target, Zap, Clock, Briefcase, BookOpen, Home, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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

export interface ProductivityArea {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  defaultPriority: number;
}

const PRODUCTIVITY_AREAS: ProductivityArea[] = [
  {
    id: 'work',
    name: 'Work & Career',
    description: 'Professional goals, projects, and career development',
    icon: Briefcase,
    color: 'hsl(215, 43%, 21%)',
    defaultPriority: 5,
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    description: 'Education, skills development, and personal growth',
    icon: BookOpen,
    color: 'hsl(100, 15%, 67%)',
    defaultPriority: 4,
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'Physical wellness, exercise, and nutrition routines',
    icon: Zap,
    color: 'hsl(80, 12%, 37%)',
    defaultPriority: 5,
  },
  {
    id: 'relationships',
    name: 'Relationships & Social',
    description: 'Family, friends, and social connections',
    icon: Users,
    color: 'hsl(25, 11%, 21%)',
    defaultPriority: 4,
  },
  {
    id: 'home',
    name: 'Home & Lifestyle',
    description: 'Personal projects, home improvement, and daily routines',
    icon: Home,
    color: 'hsl(140, 12%, 18%)',
    defaultPriority: 3,
  },
  {
    id: 'time',
    name: 'Time Management',
    description: 'Planning, scheduling, and optimizing your daily routine',
    icon: Clock,
    color: 'hsl(var(--accent))',
    defaultPriority: 5,
  },
];

interface DashboardSettingsProps {
  trigger?: React.ReactNode;
}

export function DashboardSettings({ trigger }: DashboardSettingsProps) {
  const [open, setOpen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [productivityPriorities, setProductivityPriorities] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'goals' | 'productivity'>('goals');
  const { toast } = useToast();

  // Load saved goals and productivity priorities from localStorage
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

    // Load productivity priorities
    const savedPriorities = localStorage.getItem('productivity-priorities');
    if (savedPriorities) {
      try {
        setProductivityPriorities(JSON.parse(savedPriorities));
      } catch (e) {
        console.error('Failed to load productivity priorities:', e);
        // Set defaults
        const defaults: Record<string, number> = {};
        PRODUCTIVITY_AREAS.forEach(area => {
          defaults[area.id] = area.defaultPriority;
        });
        setProductivityPriorities(defaults);
      }
    } else {
      // Set defaults
      const defaults: Record<string, number> = {};
      PRODUCTIVITY_AREAS.forEach(area => {
        defaults[area.id] = area.defaultPriority;
      });
      setProductivityPriorities(defaults);
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

  // Save productivity priorities
  const saveProductivityPriorities = (priorities: Record<string, number>) => {
    setProductivityPriorities(priorities);
    localStorage.setItem('productivity-priorities', JSON.stringify(priorities));

    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('productivity-priorities-changed', {
      detail: { priorities }
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

  const updatePriority = (areaId: string, priority: number) => {
    const newPriorities = { ...productivityPriorities, [areaId]: priority };
    saveProductivityPriorities(newPriorities);
  };

  const getPriorityLabel = (priority: number): string => {
    if (priority === 1) return 'Very Low';
    if (priority === 2) return 'Low';
    if (priority === 3) return 'Medium';
    if (priority === 4) return 'High';
    if (priority === 5) return 'Very High';
    return 'Medium';
  };

  const getPriorityColor = (priority: number): string => {
    if (priority === 1) return 'text-muted-foreground';
    if (priority === 2) return 'text-muted-foreground';
    if (priority === 3) return 'text-foreground';
    if (priority === 4) return 'text-primary';
    if (priority === 5) return 'text-accent';
    return 'text-foreground';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-['Cormorant_Garamond']">
            Customize Your Dashboard
          </DialogTitle>
          <DialogDescription className="text-base">
            Personalize your wellness dashboard by selecting goals and prioritizing productivity areas.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border mt-6">
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeTab === 'goals'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Wellness Goals
            </div>
            {activeTab === 'goals' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('productivity')}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeTab === 'productivity'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Productivity Priorities
            </div>
            {activeTab === 'productivity' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Wellness Goals Tab */}
        {activeTab === 'goals' && (
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
            </div>
          </div>
        )}

        {/* Productivity Priorities Tab */}
        {activeTab === 'productivity' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Prioritize Your Productivity</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Set priorities for different areas of your life. Higher priorities will be emphasized in your task management and planning features.
            </p>

            <div className="space-y-6">
              {PRODUCTIVITY_AREAS.map((area) => {
                const Icon = area.icon;
                const priority = productivityPriorities[area.id] || area.defaultPriority;

                return (
                  <div key={area.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: area.color + '20' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: area.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{area.name}</h4>
                          <p className="text-sm text-muted-foreground">{area.description}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${getPriorityColor(priority)} text-right ml-4 min-w-[80px]`}>
                        {getPriorityLabel(priority)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-[52px]">
                      <Label className="text-xs text-muted-foreground min-w-[60px]">
                        Priority:
                      </Label>
                      <Slider
                        value={[priority]}
                        onValueChange={(values) => updatePriority(area.id, values[0])}
                        min={1}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">How This Helps</h4>
                  <p className="text-sm text-muted-foreground">
                    Your priority settings help the dashboard surface the most relevant content, suggest optimal task scheduling, and provide insights aligned with your focus areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Save Button */}
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-border">
          <Button
            onClick={() => {
              setOpen(false);
              toast({
                title: "Dashboard customized!",
                description: activeTab === 'goals'
                  ? "Your wellness goals have been updated."
                  : "Your productivity priorities have been saved.",
                duration: 3000,
              });
            }}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
