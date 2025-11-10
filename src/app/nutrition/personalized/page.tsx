"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  loadFoodPreferences,
  generateMealSuggestions,
  generateGroceryList,
  type FoodPreferences
} from '@/lib/food-preferences';
import { ChefHat, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';

export default function PersonalizedNutritionPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<FoodPreferences | null>(null);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [groceryList, setGroceryList] = useState<any[]>([]);

  useEffect(() => {
    const prefs = loadFoodPreferences();
    if (!prefs) {
      router.push('/nutrition/quiz');
      return;
    }

    setPreferences(prefs);

    // Generate personalized meal suggestions
    const cyclePhase = 'follicular'; // This would come from user's cycle tracking
    const plan = generateMealSuggestions({
      preferences: prefs,
      cyclePhase,
      calorieTarget: 2000
    });
    setMealPlan(plan);

    // Generate grocery list
    const grocery = generateGroceryList(prefs);
    setGroceryList(grocery);
  }, [router]);

  if (!preferences || !mealPlan) {
    return (
      <div className="min-h-screen bg-textile-beige textile-overlay-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textile-beige textile-overlay-cream pb-24">
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Personalized Plan
            </Badge>
          </div>
          <h1 className="text-4xl mb-2">Your AI-Generated Meal Plan</h1>
          <p className="text-muted-foreground text-lg">
            Based on your food preferences and follicular phase
          </p>
        </div>

        {/* Phase-Specific Info */}
        <Card className="magazine-feature-card texture-fabric bg-gradient-to-br from-primary/10 to-secondary/5 border-none mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {mealPlan.phaseInfo.description}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {mealPlan.phaseInfo.focus.map((focus: string) => (
                  <Badge key={focus} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Nutrition Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Calories</p>
            <p className="text-3xl font-bold text-primary">{mealPlan.totalCalories}</p>
            <p className="text-xs text-muted-foreground">kcal/day</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Protein</p>
            <p className="text-3xl font-bold text-secondary">{mealPlan.totalProtein}g</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Fiber</p>
            <p className="text-3xl font-bold text-accent-foreground">{mealPlan.totalFiber}g</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </Card>
        </div>

        {/* Personalized Meals */}
        <div className="mb-8">
          <h3 className="text-2xl mb-4 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            Today's Meal Suggestions
          </h3>
          <div className="space-y-4">
            {mealPlan.meals.map((meal: any, index: number) => (
              <Card key={index} className="bloom-card hover:shadow-bloom-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">{meal.type}</Badge>
                    <h4 className="text-lg font-semibold">{meal.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {meal.ingredients.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      meal.bloomScore >= 90 ? 'bg-primary text-primary-foreground' :
                      meal.bloomScore >= 80 ? 'bg-secondary text-secondary-foreground' :
                      'bg-accent/50 text-accent-foreground'
                    }`}>
                      {meal.bloomScore}
                    </div>
                    <span className="text-xs text-muted-foreground">rooted Score</span>
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
                  {meal.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Generated Grocery List */}
        <Card className="magazine-feature-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Your Grocery List
            </h3>
            <Badge variant="secondary">{groceryList.length} items</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Based on your preferred foods from the quiz
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {groceryList.map((item, index) => (
              <div key={index} className="p-3 bg-muted/20 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => router.push('/nutrition/quiz')}
            variant="outline"
            className="flex-1 rounded-full"
          >
            Retake Quiz
          </Button>
          <Button
            onClick={() => router.push('/nutrition')}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            View Full Nutrition
          </Button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
