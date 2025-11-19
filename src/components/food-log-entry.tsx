"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface LoggedFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  rootedScore: number;
  servingSize: string;
  time?: string;
}

interface FoodLogEntryProps {
  date: string;
  meals: LoggedFood[];
  onAddFood: () => void;
  onRemoveFood: (foodId: string) => void;
}

export function FoodLogEntry({ date, meals, onAddFood, onRemoveFood }: FoodLogEntryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
      fiber: acc.fiber + meal.fiber,
      avgScore: acc.avgScore + meal.rootedScore,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, avgScore: 0 }
  );

  const averageScore = meals.length > 0 ? Math.round(totals.avgScore / meals.length) : 0;

  return (
    <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold">What I Ate Today</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          {meals.length > 0 && (
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm ${
                averageScore >= 80
                  ? 'bg-primary text-primary-foreground'
                  : averageScore >= 60
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              rooted Score: {averageScore}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddFood}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Food
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {meals.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Calories
            </p>
            <p className="text-lg font-bold text-foreground">{totals.calories}</p>
          </div>
          <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Protein
            </p>
            <p className="text-lg font-bold text-foreground">{Math.round(totals.protein)}g</p>
          </div>
          <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Carbs
            </p>
            <p className="text-lg font-bold text-foreground">{Math.round(totals.carbs)}g</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Fat
            </p>
            <p className="text-lg font-bold text-foreground">{Math.round(totals.fat)}g</p>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Fiber
            </p>
            <p className="text-lg font-bold text-foreground">{Math.round(totals.fiber)}g</p>
          </div>
        </div>
      )}

      {/* Food List */}
      {isExpanded && (
        <div className="space-y-3">
          {meals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/10">
              <p className="text-lg font-semibold text-muted-foreground mb-1">
                No foods logged yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start tracking by adding what you've eaten today
              </p>
              <Button
                onClick={onAddFood}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Food
              </Button>
            </div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-border hover:shadow-sm transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.servingSize}</p>
                      {meal.time && (
                        <p className="text-xs text-muted-foreground mt-1">{meal.time}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={meal.rootedScore >= 80 ? 'default' : 'secondary'}
                        className="text-xs font-bold"
                      >
                        {meal.rootedScore}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFood(meal.id)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="font-medium">{meal.calories} cal</span>
                    <span>•</span>
                    <span>P: {Math.round(meal.protein)}g</span>
                    <span>•</span>
                    <span>C: {Math.round(meal.carbs)}g</span>
                    <span>•</span>
                    <span>F: {Math.round(meal.fat)}g</span>
                    <span>•</span>
                    <span>Fiber: {Math.round(meal.fiber)}g</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
