"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeightInput } from '@/components/height-input';
import { Target, TrendingDown, TrendingUp, Activity, Save, CheckCircle2 } from 'lucide-react';
import { type HeightValue } from '@/lib/height-conversions';

export interface FitnessGoals {
  heightGoal?: HeightValue;
  weightGoal?: number;
  weightGoalUnit: 'lbs' | 'kg';
  goalType: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'gain_muscle' | 'improve_fitness';
  targetDate?: string;
  notes?: string;
}

interface FitnessGoalsProps {
  userId: string;
  currentHeight?: HeightValue;
  currentWeight?: number;
  currentWeightUnit?: 'lbs' | 'kg';
  onGoalsChange?: (goals: FitnessGoals) => void;
}

const GOAL_TYPES = [
  { value: 'lose_weight', label: 'Lose Weight', icon: TrendingDown, color: 'text-secondary' },
  { value: 'gain_weight', label: 'Gain Weight', icon: TrendingUp, color: 'text-accent' },
  { value: 'maintain_weight', label: 'Maintain Weight', icon: Target, color: 'text-primary' },
  { value: 'gain_muscle', label: 'Gain Muscle', icon: Activity, color: 'text-accent' },
  { value: 'improve_fitness', label: 'Improve Fitness', icon: Activity, color: 'text-primary' },
] as const;

export function FitnessGoals({
  userId,
  currentHeight,
  currentWeight,
  currentWeightUnit = 'lbs',
  onGoalsChange,
}: FitnessGoalsProps) {
  const [goals, setGoals] = useState<FitnessGoals>({
    weightGoalUnit: currentWeightUnit,
    goalType: 'maintain_weight',
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load goals from localStorage on mount
  useEffect(() => {
    const storageKey = `fitness_goals_${userId}`;
    const savedGoals = localStorage.getItem(storageKey);

    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals(parsed);
      } catch (error) {
        console.error('Failed to parse saved goals:', error);
      }
    }
  }, [userId]);

  // Auto-save to localStorage whenever goals change
  useEffect(() => {
    const storageKey = `fitness_goals_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(goals));

    // Notify parent component
    if (onGoalsChange) {
      onGoalsChange(goals);
    }

    // Show saved indicator briefly
    if (goals.weightGoal || goals.heightGoal) {
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [goals, userId, onGoalsChange]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const selectedGoalType = GOAL_TYPES.find(g => g.value === goals.goalType);
  const GoalIcon = selectedGoalType?.icon || Target;

  // Calculate progress if we have current values
  const calculateWeightProgress = () => {
    if (!currentWeight || !goals.weightGoal) return null;

    const current = currentWeight;
    const target = goals.weightGoal;
    const diff = Math.abs(current - target);
    const progress = current > target
      ? Math.max(0, 100 - (diff / current) * 100)
      : Math.min(100, (current / target) * 100);

    return {
      current,
      target,
      diff: diff.toFixed(1),
      progress: progress.toFixed(0),
      isCloser: diff < 5,
    };
  };

  const weightProgress = calculateWeightProgress();

  return (
    <Card className="bloom-card relative">
      {isSaved && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-accent text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          Saved
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <GoalIcon className={`w-6 h-6 ${selectedGoalType?.color || 'text-primary'}`} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Fitness Goals</h2>
          <p className="text-sm text-muted-foreground">Set and track your health targets</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Goal Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Primary Goal</Label>
          <Select
            value={goals.goalType}
            onValueChange={(v: FitnessGoals['goalType']) =>
              setGoals({ ...goals, goalType: v })
            }
          >
            <SelectTrigger className="text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOAL_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${type.color}`} />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Height Goal */}
        {currentHeight && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Height Goal (Optional)</Label>
              {currentHeight && (
                <span className="text-sm text-muted-foreground">
                  Current: {currentHeight.unit === 'ft' && currentHeight.feet !== undefined
                    ? `${currentHeight.feet}' ${(currentHeight.inches || 0).toFixed(1)}"`
                    : `${currentHeight.value.toFixed(1)} ${currentHeight.unit}`}
                </span>
              )}
            </div>
            <HeightInput
              value={goals.heightGoal}
              onChange={(h) => setGoals({ ...goals, heightGoal: h })}
              label=""
            />
          </div>
        )}

        {/* Weight Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Weight Goal</Label>
            <div className="flex items-center gap-2">
              {currentWeight && (
                <span className="text-sm text-muted-foreground">
                  Current: {currentWeight.toFixed(1)} {goals.weightGoalUnit}
                </span>
              )}
              <Select
                value={goals.weightGoalUnit}
                onValueChange={(v: 'lbs' | 'kg') =>
                  setGoals({ ...goals, weightGoalUnit: v })
                }
              >
                <SelectTrigger className="w-24 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={goals.weightGoal || ''}
            onChange={(e) =>
              setGoals({ ...goals, weightGoal: parseFloat(e.target.value) || undefined })
            }
            placeholder={`Enter target weight in ${goals.weightGoalUnit}`}
            className="text-lg"
          />

          {/* Weight Progress Indicator */}
          {weightProgress && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress to Goal</span>
                <span className={`text-sm font-bold ${weightProgress.isCloser ? 'text-accent' : 'text-primary'}`}>
                  {weightProgress.diff} {goals.weightGoalUnit} to go
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${weightProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Target Date */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Target Date (Optional)</Label>
          <Input
            type="date"
            value={goals.targetDate || ''}
            onChange={(e) =>
              setGoals({ ...goals, targetDate: e.target.value })
            }
            className="text-base"
          />
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Notes (Optional)</Label>
          <Input
            value={goals.notes || ''}
            onChange={(e) =>
              setGoals({ ...goals, notes: e.target.value })
            }
            placeholder="Why is this goal important to you?"
            className="text-base"
          />
        </div>

        {/* Save Button (mainly for visual feedback) */}
        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          size="lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaved ? 'Saved!' : 'Save Goals'}
        </Button>
      </div>
    </Card>
  );
}
