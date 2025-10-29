"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Apple, Flame, Droplets, TrendingUp, ScanLine, ChefHat, Calendar, ShoppingCart, Plus, X, Check } from 'lucide-react';
import { useState } from 'react';
import { AppleHealthSync } from '@/components/apple-health-sync';
import { useRouter } from 'next/navigation';
import { FoodLookupDialog } from '@/components/food-lookup-dialog';

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
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('today');
  const [groceryItems, setGroceryItems] = useState([
    { id: '1', name: 'Bananas', quantity: '6', category: 'Produce', checked: false },
    { id: '2', name: 'Greek Yogurt', quantity: '2 containers', category: 'Dairy', checked: true },
    { id: '3', name: 'Chicken Breast', quantity: '2 lbs', category: 'Protein', checked: false },
    { id: '4', name: 'Quinoa', quantity: '1 bag', category: 'Grains', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Food lookup state
  const [foodLookupOpen, setFoodLookupOpen] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<{ day: string; mealType: string } | null>(null);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const caloriesRemaining = weeklyProgress.targetCalories - weeklyProgress.currentCalories;
  const weekProgress = (weeklyProgress.currentCalories / weeklyProgress.targetCalories) * 100;

  const [weekMeals, setWeekMeals] = useState<Record<string, Record<string, any>>>({
    Monday: {
      breakfast: { name: 'Overnight Oats', calories: 320, protein: 12 },
      lunch: { name: 'Grilled Chicken Salad', calories: 420, protein: 35 },
      dinner: { name: 'Salmon with Veggies', calories: 480, protein: 38 },
    },
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {},
  });

  const addGroceryItem = () => {
    if (newItem.trim()) {
      setGroceryItems([...groceryItems, {
        id: Date.now().toString(),
        name: newItem,
        quantity: newQuantity,
        category: 'Other',
        checked: false
      }]);
      setNewItem('');
      setNewQuantity('');
      setIsAddingItem(false);
    }
  };

  const toggleItem = (id: string) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setGroceryItems(items => items.filter(item => item.id !== id));
  };

  const handleOpenFoodLookup = (day: string, mealType: string) => {
    setSelectedMealSlot({ day, mealType });
    setFoodLookupOpen(true);
  };

  const handleAddFood = (food: {
    name: string;
    servingSize: any;
    quantity: number;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  }) => {
    if (!selectedMealSlot) return;

    const { day, mealType } = selectedMealSlot;

    setWeekMeals((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          name: `${food.name} (${food.servingSize.label} × ${food.quantity})`,
          calories: food.nutrition.calories,
          protein: food.nutrition.protein,
          carbs: food.nutrition.carbs,
          fat: food.nutrition.fat,
          fiber: food.nutrition.fiber,
        },
      },
    }));

    setSelectedMealSlot(null);
  };

  const handleRemoveMeal = (day: string, mealType: string) => {
    setWeekMeals((prev) => {
      const updatedDay = { ...prev[day] };
      delete updatedDay[mealType];
      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

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

        {/* Food Quiz CTA */}
        <Card className="bloom-card bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🍽️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Personalize Your Meal Plans</h3>
              <p className="text-sm text-muted-foreground">
                Take our quick food quiz to get AI-generated meal plans tailored to your preferences
              </p>
            </div>
            <Button
              onClick={() => router.push('/nutrition/quiz')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Take Quiz
            </Button>
          </div>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Apple Health</TabsTrigger>
            <TabsTrigger value="grocery">Grocery List</TabsTrigger>
            <TabsTrigger value="meals">Meal Planning</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">

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
          </TabsContent>

          {/* APPLE HEALTH TAB */}
          <TabsContent value="health" className="space-y-6">
            <AppleHealthSync />
          </TabsContent>

          {/* GROCERY LIST TAB */}
          <TabsContent value="grocery" className="space-y-6">
            <Card className="bloom-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    My Grocery List
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {groceryItems.filter(item => !item.checked).length} items remaining
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddingItem(!isAddingItem)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {isAddingItem && (
                <div className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Item name"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addGroceryItem()}
                      className="rounded-lg"
                    />
                    <Input
                      placeholder="Quantity"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addGroceryItem()}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addGroceryItem} className="flex-1 rounded-lg">
                      <Check className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingItem(false);
                        setNewItem('');
                        setNewQuantity('');
                      }}
                      variant="outline"
                      className="flex-1 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {groceryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      item.checked
                        ? 'bg-muted/30 border-muted opacity-60'
                        : 'bg-white border-border hover:shadow-sm'
                    }`}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.quantity}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <Button
                      onClick={() => deleteItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {groceryItems.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Your grocery list is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* MEAL PLANNING TAB */}
          <TabsContent value="meals" className="space-y-6">
            <Card className="bloom-card">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Weekly Meal Plan
                </h3>
                <p className="text-muted-foreground">
                  Plan your meals for the week ahead
                </p>
              </div>

              <div className="space-y-6">
                {weekDays.map((day) => (
                  <div key={day} className="border-l-4 border-primary/30 pl-4 py-2">
                    <h4 className="text-lg font-semibold mb-3">{day}</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                        const meal = weekMeals[day]?.[mealType];
                        return (
                          <div
                            key={mealType}
                            onClick={() => !meal && handleOpenFoodLookup(day, mealType)}
                            className="p-4 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {mealType}
                              </Badge>
                              {meal && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveMeal(day, mealType);
                                  }}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            {meal ? (
                              <div>
                                <p className="font-semibold text-sm mb-1">{meal.name}</p>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  <span>{meal.calories} cal</span>
                                  <span>•</span>
                                  <span>{meal.protein}g protein</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <Plus className="w-5 h-5 mx-auto text-muted-foreground/50 mb-1" />
                                <p className="text-xs text-muted-foreground">Add meal</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm text-center text-muted-foreground">
                    <strong>Pro Tip:</strong> Click on any empty meal slot to search and add foods with custom serving sizes (grams, oz, cups, etc.)
                  </p>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    🍔 Popular Restaurant Menus Available
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Browse nutrition info from Tim Hortons, Starbucks, McDonald's, Wendy's, and more!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Community-Powered:</strong> Add your own custom foods and they'll be available for all users. Help us build the most comprehensive food database together!
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />

      {/* Food Lookup Dialog */}
      <FoodLookupDialog
        open={foodLookupOpen}
        onOpenChange={setFoodLookupOpen}
        onSelect={handleAddFood}
      />
    </div>
  );
}
