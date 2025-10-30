"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronDown,
  Flame,
  Trophy,
  Heart,
  Sparkles,
  Dumbbell,
  Apple,
  Moon
} from 'lucide-react';
import type { GoalType } from '@/lib/weight-tracking';

export interface Goal {
  id: string;
  type: 'preset' | 'custom';
  title: string;
  description?: string;
  category?: 'fitness' | 'nutrition' | 'wellness' | 'mindfulness';
  icon?: string;
  completed: boolean;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}

const PRESET_GOALS: Omit<Goal, 'id' | 'completed' | 'currentValue'>[] = [
  {
    type: 'preset',
    title: 'Drink 8 glasses of water daily',
    description: 'Stay hydrated throughout the day',
    category: 'wellness',
    icon: '💧',
    targetValue: 8,
    unit: 'glasses'
  },
  {
    type: 'preset',
    title: 'Walk 10,000 steps daily',
    description: 'Maintain an active lifestyle',
    category: 'fitness',
    icon: '👣',
    targetValue: 10000,
    unit: 'steps'
  },
  {
    type: 'preset',
    title: 'Sleep 7-8 hours per night',
    description: 'Prioritize quality rest',
    category: 'wellness',
    icon: '😴',
    targetValue: 7.5,
    unit: 'hours'
  },
  {
    type: 'preset',
    title: 'Exercise 3x per week',
    description: 'Regular physical activity',
    category: 'fitness',
    icon: '💪',
    targetValue: 3,
    unit: 'sessions/week'
  },
  {
    type: 'preset',
    title: 'Meditate 10 minutes daily',
    description: 'Practice mindfulness and stress reduction',
    category: 'mindfulness',
    icon: '🧘',
    targetValue: 10,
    unit: 'minutes'
  },
  {
    type: 'preset',
    title: 'Eat 5 servings of fruits/vegetables',
    description: 'Nourish your body with whole foods',
    category: 'nutrition',
    icon: '🥗',
    targetValue: 5,
    unit: 'servings'
  },
  {
    type: 'preset',
    title: 'Track meals consistently',
    description: 'Build awareness of eating patterns',
    category: 'nutrition',
    icon: '📝',
    targetValue: 7,
    unit: 'days/week'
  },
  {
    type: 'preset',
    title: 'Practice gratitude journaling',
    description: 'Reflect on positive moments',
    category: 'mindfulness',
    icon: '📖',
    targetValue: 1,
    unit: 'entry/day'
  },
  {
    type: 'preset',
    title: 'Strength train 2x per week',
    description: 'Build and maintain muscle',
    category: 'fitness',
    icon: '🏋️',
    targetValue: 2,
    unit: 'sessions/week'
  },
  {
    type: 'preset',
    title: 'Limit screen time before bed',
    description: 'Improve sleep quality',
    category: 'wellness',
    icon: '📱',
    targetValue: 1,
    unit: 'hour before bed'
  }
];

const CATEGORY_ICONS = {
  fitness: Dumbbell,
  nutrition: Apple,
  wellness: Heart,
  mindfulness: Moon
};

interface GoalsManagerProps {
  activeGoals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
  className?: string;
}

export function GoalsManager({ activeGoals, onGoalsChange, className = "" }: GoalsManagerProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [customGoalDescription, setCustomGoalDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Goal['category']>('wellness');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const addPresetGoal = (preset: typeof PRESET_GOALS[0]) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      ...preset,
      completed: false,
      currentValue: 0
    };

    onGoalsChange([...activeGoals, newGoal]);
  };

  const addCustomGoal = () => {
    if (!customGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      type: 'custom',
      title: customGoalTitle.trim(),
      description: customGoalDescription.trim() || undefined,
      category: selectedCategory,
      completed: false
    };

    onGoalsChange([...activeGoals, newGoal]);

    // Reset form
    setCustomGoalTitle('');
    setCustomGoalDescription('');
    setShowAddCustom(false);
  };

  const toggleGoalCompletion = (goalId: string) => {
    onGoalsChange(
      activeGoals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const removeGoal = (goalId: string) => {
    onGoalsChange(activeGoals.filter(goal => goal.id !== goalId));
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    onGoalsChange(
      activeGoals.map(goal =>
        goal.id === goalId ? { ...goal, currentValue: newValue } : goal
      )
    );
  };

  const getCompletionStats = () => {
    const completed = activeGoals.filter(g => g.completed).length;
    const total = activeGoals.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const stats = getCompletionStats();

  return (
    <Card className={`bloom-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Goals
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.completed} of {stats.total} completed ({stats.percentage}%)
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Goal</DialogTitle>
              <DialogDescription>
                Choose from preset goals or create your own custom goal
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Custom Goal Section */}
              <Collapsible open={showAddCustom} onOpenChange={setShowAddCustom}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl p-4 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Create Custom Goal</p>
                        <p className="text-sm text-muted-foreground">Design your own unique goal</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showAddCustom ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4 border rounded-xl p-4 bg-muted/30">
                  <div className="space-y-2">
                    <Label>Goal Title *</Label>
                    <Input
                      value={customGoalTitle}
                      onChange={(e) => setCustomGoalTitle(e.target.value)}
                      placeholder="e.g., Practice yoga 3 times per week"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input
                      value={customGoalDescription}
                      onChange={(e) => setCustomGoalDescription(e.target.value)}
                      placeholder="Why is this goal important to you?"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Goal['category'])}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">🏋️ Fitness</SelectItem>
                        <SelectItem value="nutrition">🍎 Nutrition</SelectItem>
                        <SelectItem value="wellness">❤️ Wellness</SelectItem>
                        <SelectItem value="mindfulness">🧘 Mindfulness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={addCustomGoal}
                    disabled={!customGoalTitle.trim()}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Goal
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              {/* Preset Goals */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Preset Goals
                </h3>
                <div className="grid gap-3">
                  {PRESET_GOALS.map((preset, index) => {
                    const isAdded = activeGoals.some(g => g.title === preset.title);
                    const CategoryIcon = preset.category ? CATEGORY_ICONS[preset.category] : Target;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all ${
                          isAdded
                            ? 'bg-primary/5 border-primary/30 opacity-60'
                            : 'bg-background border-border hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-2xl">{preset.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium mb-1">{preset.title}</p>
                              {preset.description && (
                                <p className="text-sm text-muted-foreground">{preset.description}</p>
                              )}
                              {preset.category && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  <CategoryIcon className="w-3 h-3 mr-1" />
                                  {preset.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {!isAdded ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addPresetGoal(preset)}
                              className="rounded-full"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Badge variant="default" className="bg-primary/20 text-primary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Added
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeGoals.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground mb-4">No goals set yet</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Goal</DialogTitle>
                <DialogDescription>
                  Choose from preset goals or create your own custom goal
                </DialogDescription>
              </DialogHeader>
              {/* Same content as above dialog */}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-3">
          {activeGoals.map((goal) => {
            const CategoryIcon = goal.category ? CATEGORY_ICONS[goal.category] : Target;

            return (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border transition-all ${
                  goal.completed
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-background border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className="mt-0.5 flex-shrink-0 transition-colors"
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {goal.icon && <span className="text-xl">{goal.icon}</span>}
                        <p className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </p>
                      </div>

                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      {goal.category && (
                        <Badge variant="secondary" className="text-xs">
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {goal.category}
                        </Badge>
                      )}
                      {goal.type === 'custom' && (
                        <Badge variant="outline" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
