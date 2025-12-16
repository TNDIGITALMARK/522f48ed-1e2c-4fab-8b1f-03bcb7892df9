"use client";

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealLoggingCarouselProps {
  date: string;
  meals: LoggedFood[];
  onAddFood: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  onRemoveFood: (foodId: string) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MEAL_CONFIG = {
  breakfast: { icon: '', label: 'Breakfast', color: 'bg-amber-500/10 border-amber-500/20' },
  lunch: { icon: '', label: 'Lunch', color: 'bg-emerald-500/10 border-emerald-500/20' },
  dinner: { icon: '', label: 'Dinner', color: 'bg-blue-500/10 border-blue-500/20' },
  snack: { icon: '', label: 'Snacks', color: 'bg-purple-500/10 border-purple-500/20' },
} as const;

export function MealLoggingCarousel({ date, meals, onAddFood, onRemoveFood }: MealLoggingCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Set up event listener
  if (emblaApi) {
    emblaApi.on('select', onSelect);
  }

  // Group meals by type
  const mealsByType = {
    breakfast: meals.filter(m => m.mealType === 'breakfast'),
    lunch: meals.filter(m => m.mealType === 'lunch'),
    dinner: meals.filter(m => m.mealType === 'dinner'),
    snack: meals.filter(m => m.mealType === 'snack'),
  };

  // Calculate totals for each meal type
  const calculateTotals = (mealList: LoggedFood[]) => {
    return mealList.reduce(
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
  };

  // Calculate overall totals
  const overallTotals = calculateTotals(meals);
  const averageScore = meals.length > 0 ? Math.round(overallTotals.avgScore / meals.length) : 0;

  const renderMealSection = (mealType: MealType) => {
    const config = MEAL_CONFIG[mealType];
    const mealList = mealsByType[mealType];
    const totals = calculateTotals(mealList);
    const mealAvgScore = mealList.length > 0 ? Math.round(totals.avgScore / mealList.length) : 0;

    return (
      <div className="embla__slide" style={{ flex: '0 0 100%', minWidth: 0 }}>
        <div className="p-1">
          <Card className={`magazine-feature-card bg-white border-2 ${config.color} rounded-2xl min-h-[500px]`}>
            {/* Meal Type Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-2xl font-semibold">{config.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mealList.length} {mealList.length === 1 ? 'item' : 'items'} logged
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onAddFood(mealType)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Meal Totals */}
            {mealList.length > 0 && (
              <div className="mb-6 p-4 bg-muted/20 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {config.label} Totals
                  </p>
                  {mealAvgScore > 0 && (
                    <Badge
                      variant={mealAvgScore >= 80 ? 'default' : 'secondary'}
                      className="text-xs font-bold"
                    >
                      Score: {mealAvgScore}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Cal</p>
                    <p className="text-lg font-bold">{totals.calories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold">{Math.round(totals.protein)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="text-lg font-bold">{Math.round(totals.carbs)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="text-lg font-bold">{Math.round(totals.fat)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Fiber</p>
                    <p className="text-lg font-bold">{Math.round(totals.fiber)}g</p>
                  </div>
                </div>
              </div>
            )}

            {/* Food Items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
              {mealList.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/10">
                  <p className="text-lg font-semibold text-muted-foreground mb-1">
                    No {config.label.toLowerCase()} logged
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start tracking your {config.label.toLowerCase()}
                  </p>
                  <Button
                    onClick={() => onAddFood(mealType)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Food
                  </Button>
                </div>
              ) : (
                mealList.map((meal) => (
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
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Overall Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">Today's Food Log</h2>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        {meals.length > 0 && (
          <div
            className={`px-5 py-2 rounded-full font-bold ${
              averageScore >= 80
                ? 'bg-primary text-primary-foreground'
                : averageScore >= 60
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Score: {averageScore}
          </div>
        )}
      </div>

      {/* Overall Daily Totals */}
      {meals.length > 0 && (
        <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Daily Totals
          </h4>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Calories
              </p>
              <p className="text-xl font-bold text-foreground">{overallTotals.calories}</p>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Protein
              </p>
              <p className="text-xl font-bold text-foreground">{Math.round(overallTotals.protein)}g</p>
            </div>
            <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Carbs
              </p>
              <p className="text-xl font-bold text-foreground">{Math.round(overallTotals.carbs)}g</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Fat
              </p>
              <p className="text-xl font-bold text-foreground">{Math.round(overallTotals.fat)}g</p>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Fiber
              </p>
              <p className="text-xl font-bold text-foreground">{Math.round(overallTotals.fiber)}g</p>
            </div>
          </div>
        </Card>
      )}

      {/* Swipe Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          ← Swipe to view meal sections →
        </Badge>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollPrev}
          disabled={selectedIndex === 0}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg hover:shadow-xl disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={scrollNext}
          disabled={selectedIndex === 3}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg hover:shadow-xl disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Embla Carousel */}
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {renderMealSection('breakfast')}
            {renderMealSection('lunch')}
            {renderMealSection('dinner')}
            {renderMealSection('snack')}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {['breakfast', 'lunch', 'dinner', 'snack'].map((meal, index) => {
            const config = MEAL_CONFIG[meal as MealType];
            return (
              <button
                key={meal}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedIndex === index
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-xs font-semibold">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
