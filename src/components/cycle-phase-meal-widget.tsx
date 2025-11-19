"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MealSuggestion {
  id: string;
  title: string;
  type: string;
  calories: number;
  protein: number;
  fiber: number;
  bloomScore: number;
  tags: string[];
  description?: string;
}

interface CyclePhaseMealWidgetProps {
  phase: string;
  meals: MealSuggestion[];
  className?: string;
}

export function CyclePhaseMealWidget({ phase, meals, className = '' }: CyclePhaseMealWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`magazine-feature-card bg-white border border-accent/15 rounded-xl overflow-hidden ${className}`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:bg-muted/20 transition-colors p-4 -m-4 mb-0 rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Foods for Your Cycle Phase
              <Badge variant="secondary" className="text-xs">
                {phase}
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              {isExpanded ? 'Click to collapse' : `${meals.length} personalized meal suggestions`}
            </p>
          </div>
        </div>
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Phase-specific tip */}
        <div className="mb-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-accent">Nutrition Tip:</strong> You're in your {phase.toLowerCase()} —
            higher carb meals and lean proteins will fuel your rising energy best! Focus on whole grains,
            lean meats, and plenty of colorful vegetables.
          </p>
        </div>

        {/* Meal Suggestions Grid */}
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 bg-card/50 rounded-lg border border-border hover:shadow-sm transition-all group"
            >
              {/* Meal Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {meal.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground">{meal.title}</h4>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    meal.bloomScore >= 90
                      ? 'bg-primary text-primary-foreground'
                      : meal.bloomScore >= 80
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-accent/50 text-accent-foreground'
                  }`}
                >
                  {meal.bloomScore}
                </div>
              </div>

              {/* Description */}
              {meal.description && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {meal.description}
                </p>
              )}

              {/* Nutrition Stats */}
              <div className="flex gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Calories:</span>
                  <span className="font-semibold">{meal.calories}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Protein:</span>
                  <span className="font-semibold">{meal.protein}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Fiber:</span>
                  <span className="font-semibold">{meal.fiber}g</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {meal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
