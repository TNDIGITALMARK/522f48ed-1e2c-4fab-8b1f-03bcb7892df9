"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Apple, Flame, Droplets, TrendingUp, ScanLine, ChefHat, Calendar } from 'lucide-react';
import { useState } from 'react';

const mealSuggestions = [
  {
    title: 'Overnight Oats with Berries',
    type: 'Breakfast',
    calories: 320,
    protein: 12,
    fiber: 8,
    bloomScore: 92,
    tags: ['High Fiber', 'Follicular Phase'],
  },
  {
    title: 'Grilled Salmon with Sweet Potato',
    type: 'Lunch',
    calories: 450,
    protein: 35,
    fiber: 6,
    bloomScore: 95,
    tags: ['High Protein', 'Magnesium Rich'],
  },
  {
    title: 'Chickpea Buddha Bowl',
    type: 'Dinner',
    calories: 420,
    protein: 18,
    fiber: 12,
    bloomScore: 88,
    tags: ['High Fiber', 'Plant-Based'],
  },
];

const weeklyProgress = {
  currentCalories: 8400,
  targetCalories: 9800,
  protein: { current: 520, target: 600 },
  fiber: { current: 180, target: 210 },
};

export default function NutritionPage() {
  const [selectedDay, setSelectedDay] = useState('today');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const caloriesRemaining = weeklyProgress.targetCalories - weeklyProgress.currentCalories;
  const weekProgress = (weeklyProgress.currentCalories / weeklyProgress.targetCalories) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Smart Nutrition</h1>
          <p className="text-muted-foreground text-lg">
            Your personalized meal planner synced to your cycle
          </p>
        </div>

        {/* Weekly Calorie Balance */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">Weekly Balance</h3>
              <p className="text-muted-foreground">Flexible tracking that adapts to you</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{caloriesRemaining}</div>
              <p className="text-sm text-muted-foreground">kcal remaining</p>
            </div>
          </div>

          <Progress value={weekProgress} className="h-3 mb-2" />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{weeklyProgress.currentCalories.toLocaleString()} kcal</span>
            <span>{weeklyProgress.targetCalories.toLocaleString()} kcal goal</span>
          </div>

          {/* Daily Distribution */}
          <div className="mt-6 grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const isToday = index === 3; // Thursday for example
              const calories = 1200 + Math.random() * 400;
              const height = (calories / 2000) * 100;

              return (
                <div key={day} className="text-center">
                  <div className="h-20 flex items-end justify-center mb-2">
                    <div
                      className={`w-full rounded-t-lg ${
                        isToday ? 'bg-secondary' : 'bg-primary/30'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <p className={`text-xs font-medium ${
                    isToday ? 'text-secondary' : 'text-muted-foreground'
                  }`}>
                    {day}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Macros Today */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold">Protein</h4>
                <p className="text-sm text-muted-foreground">
                  {weeklyProgress.protein.current}g / {weeklyProgress.protein.target}g
                </p>
              </div>
            </div>
            <Progress
              value={(weeklyProgress.protein.current / weeklyProgress.protein.target) * 100}
              className="h-2"
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Apple className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Fiber</h4>
                <p className="text-sm text-muted-foreground">
                  {weeklyProgress.fiber.current}g / {weeklyProgress.fiber.target}g
                </p>
              </div>
            </div>
            <Progress
              value={(weeklyProgress.fiber.current / weeklyProgress.fiber.target) * 100}
              className="h-2"
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Hydration</h4>
                <p className="text-sm text-muted-foreground">
                  6 / 8 glasses
                </p>
              </div>
            </div>
            <Progress value={75} className="h-2" />
          </Card>
        </div>

        {/* Bloom Score Scanner CTA */}
        <Card className="bloom-card bg-gradient-to-br from-secondary/10 to-accent/10 border-none mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <ScanLine className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Bloom Score Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Scan food labels to get instant nutrition scores (0-100) for protein, fiber, sugar, and ingredients
              </p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6">
              Scan Now
            </Button>
          </div>
        </Card>

        {/* AI Meal Suggestions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Today's Meal Suggestions
            </h3>
            <Badge variant="secondary" className="text-xs">
              Follicular Phase
            </Badge>
          </div>

          <div className="space-y-4">
            {mealSuggestions.map((meal, index) => (
              <Card key={index} className="bloom-card hover:shadow-bloom-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">{meal.type}</Badge>
                    <h4 className="text-lg font-semibold">{meal.title}</h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        meal.bloomScore >= 90 ? 'bg-primary text-primary-foreground' :
                        meal.bloomScore >= 80 ? 'bg-secondary text-secondary-foreground' :
                        'bg-accent/50 text-accent-foreground'
                      }`}>
                        {meal.bloomScore}
                      </div>
                      <span className="text-xs text-muted-foreground">Bloom Score</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Calories</p>
                    <p className="font-semibold">{meal.calories}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Protein</p>
                    <p className="font-semibold">{meal.protein}g</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Fiber</p>
                    <p className="font-semibold">{meal.fiber}g</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Phase-Based Nutrition Tip */}
        <Card className="bloom-card bg-gradient-to-br from-accent/10 to-primary/5 border-none">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follicular Phase Nutrition Tip</h3>
              <p className="text-muted-foreground leading-relaxed">
                You're entering your follicular phase — higher carb meals and lean proteins will fuel your rising energy best!
                Focus on whole grains, lean meats, and plenty of colorful vegetables. This is also a great time to try new recipes and meal prep for the week ahead.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
