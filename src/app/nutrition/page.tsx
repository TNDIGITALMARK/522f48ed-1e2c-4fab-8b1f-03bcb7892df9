"use client";

import { Navigation } from '@/components/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FoodLookupDialog } from '@/components/food-lookup-dialog';
import { AIMealSuggestions } from '@/components/ai-meal-suggestions';
import { PantryItem } from '@/components/pantry-items-manager';
import { useNutritionData, useCalorieRecommendation } from '@/hooks/use-user-profile';
import { SwipeableNutritionCarousel } from '@/components/swipeable-nutrition-carousel';
import { FoodLogEntry, LoggedFood } from '@/components/food-log-entry';
import { CyclePhaseMealWidget } from '@/components/cycle-phase-meal-widget';

const MOCK_USER_ID = 'demo-user-001';

const mealSuggestions = [
  {
    id: '1',
    title: 'Overnight Oats with Berries',
    type: 'Breakfast',
    calories: 320,
    protein: 12,
    fiber: 8,
    bloomScore: 92,
    tags: ['High Fiber', 'Follicular Phase'],
    description: 'Start your day with nutrient-rich oats, fresh berries, and a drizzle of honey. Packed with antioxidants and slow-release energy to fuel your morning.',
  },
  {
    id: '2',
    title: 'Grilled Salmon with Sweet Potato',
    type: 'Lunch',
    calories: 450,
    protein: 35,
    fiber: 6,
    bloomScore: 95,
    tags: ['High Protein', 'Magnesium Rich'],
    description: 'Wild-caught salmon paired with roasted sweet potato and steamed broccoli. Rich in omega-3s and perfect for sustained afternoon energy.',
  },
  {
    id: '3',
    title: 'Chickpea Buddha Bowl',
    type: 'Dinner',
    calories: 420,
    protein: 18,
    fiber: 12,
    bloomScore: 88,
    tags: ['High Fiber', 'Plant-Based'],
    description: 'Colorful bowl with roasted chickpeas, quinoa, mixed greens, avocado, and tahini dressing. A complete plant-based meal with excellent fiber content.',
  },
  {
    id: '4',
    title: 'Greek Yogurt Parfait',
    type: 'Snack',
    calories: 240,
    protein: 15,
    fiber: 4,
    bloomScore: 90,
    tags: ['High Protein', 'Probiotic'],
    description: 'Layers of creamy Greek yogurt, granola, and mixed berries. Supports gut health and provides a satisfying protein boost.',
  },
];

export default function NutritionPage() {
  const router = useRouter();

  // Use centralized nutrition and calorie data - syncs with dashboard!
  const { todaysNutrition, weeklyData, addMeal, getWeeklySummary } = useNutritionData(MOCK_USER_ID);
  const calorieRecommendation = useCalorieRecommendation(MOCK_USER_ID);

  const [selectedDay, setSelectedDay] = useState('today');

  // Calculate weekly progress from synced data
  const weeklySummary = getWeeklySummary();
  const weeklyProgress = {
    currentCalories: weeklySummary.totalCalories,
    targetCalories: calorieRecommendation ? calorieRecommendation.weeklyCalories : 9800,
    protein: {
      current: weeklySummary.totalProtein,
      target: calorieRecommendation ? calorieRecommendation.proteinGrams * 7 : 600
    },
    fiber: { current: 180, target: 210 },
  };
  const [groceryItems, setGroceryItems] = useState([
    { id: '1', name: 'Bananas', quantity: '6', category: 'Produce', checked: false },
    { id: '2', name: 'Greek Yogurt', quantity: '2 containers', category: 'Dairy', checked: true },
    { id: '3', name: 'Chicken Breast', quantity: '2 lbs', category: 'Protein', checked: false },
    { id: '4', name: 'Quinoa', quantity: '1 bag', category: 'Grains', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Pantry items state
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: '1', name: 'Olive Oil', category: 'Condiments', quantity: '1', unit: 'bottle' },
    { id: '2', name: 'Rice', category: 'Grains', quantity: '2', unit: 'lbs' },
    { id: '3', name: 'Eggs', category: 'Protein', quantity: '12', unit: 'pieces' },
  ]);

  // Food lookup state
  const [foodLookupOpen, setFoodLookupOpen] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<{ day: string; mealType: string } | null>(null);

  // Food log state for today
  const [todaysFoods, setTodaysFoods] = useState<LoggedFood[]>([]);
  const [isFoodLogOpen, setIsFoodLogOpen] = useState(false);

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

  // Open food lookup for today's log
  const handleOpenFoodLog = () => {
    setIsFoodLogOpen(true);
    setFoodLookupOpen(true);
  };

  // Calculate rooted score based on nutrition values
  const calculateRootedScore = (nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }) => {
    // Simple scoring algorithm: higher protein and fiber = better score
    const proteinScore = Math.min((nutrition.protein / nutrition.calories) * 100 * 20, 40);
    const fiberScore = Math.min(nutrition.fiber * 5, 30);
    const balanceScore = 30; // Base score for logging food
    return Math.round(proteinScore + fiberScore + balanceScore);
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
    // Check if we're adding to today's log or to meal planning
    if (isFoodLogOpen) {
      // Add to today's food log
      const rootedScore = calculateRootedScore(food.nutrition);
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const newLoggedFood: LoggedFood = {
        id: Date.now().toString(),
        name: food.name,
        calories: food.nutrition.calories,
        protein: food.nutrition.protein,
        carbs: food.nutrition.carbs,
        fat: food.nutrition.fat,
        fiber: food.nutrition.fiber,
        rootedScore,
        servingSize: `${food.servingSize.label} × ${food.quantity}`,
        time: currentTime,
      };

      setTodaysFoods((prev) => [...prev, newLoggedFood]);
      setIsFoodLogOpen(false);
    } else if (selectedMealSlot) {
      // Add to meal planning
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
    }
  };

  const handleRemoveFood = (foodId: string) => {
    setTodaysFoods((prev) => prev.filter((food) => food.id !== foodId));
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
    <div className="min-h-screen relative pb-24">
      {/* Botanical background with reduced opacity - matching home, cycle, and workout pages */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('/backgrounds/botanical-pattern.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      {/* Pure white background layer - matching home, cycle, and workout pages */}
      <div className="fixed inset-0 -z-20 bg-white" />

      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 px-6 py-5 sticky top-0 z-50 shadow-bloom-sm">
        <div className="max-w-4xl mx-auto">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl mb-2">Smart Nutrition</h1>
          <p className="text-muted-foreground text-lg">
            Your personalized meal planner synced to your cycle
          </p>
        </div>

        {/* Food Quiz CTA */}
        <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl mb-6">
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
            <TabsTrigger value="grocery">Grocery List</TabsTrigger>
            <TabsTrigger value="meals">Meal Planning</TabsTrigger>
            <TabsTrigger value="ai-meals">AI Meal Ideas</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">

        {/* Food Log - What I Ate Today */}
        <FoodLogEntry
          date={new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          meals={todaysFoods}
          onAddFood={handleOpenFoodLog}
          onRemoveFood={handleRemoveFood}
        />

        {/* Weekly Calorie Balance */}
        <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl mb-6">
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
          <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl p-5">
            <div className="mb-3">
              <h4 className="font-semibold text-lg">Protein</h4>
              <p className="text-sm text-muted-foreground">
                {weeklyProgress.protein.current}g / {weeklyProgress.protein.target}g
              </p>
            </div>
            <Progress
              value={(weeklyProgress.protein.current / weeklyProgress.protein.target) * 100}
              className="h-2"
            />
          </Card>

          <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl p-5">
            <div className="mb-3">
              <h4 className="font-semibold text-lg">Fiber</h4>
              <p className="text-sm text-muted-foreground">
                {weeklyProgress.fiber.current}g / {weeklyProgress.fiber.target}g
              </p>
            </div>
            <Progress
              value={(weeklyProgress.fiber.current / weeklyProgress.fiber.target) * 100}
              className="h-2"
            />
          </Card>

          <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl p-5">
            <div className="mb-3">
              <h4 className="font-semibold text-lg">Hydration</h4>
              <p className="text-sm text-muted-foreground">
                6 / 8 glasses
              </p>
            </div>
            <Progress value={75} className="h-2" />
          </Card>
        </div>

        {/* rooted Score Scanner CTA */}
        <Card className="magazine-feature-card bg-white border border-secondary/20 rounded-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">rooted Score Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Scan food labels to get instant nutrition scores (0-100) for protein, fiber, sugar, and ingredients
              </p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6">
              Scan Now
            </Button>
          </div>
        </Card>

        {/* Swipeable Meal Exploration Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Swipe to Explore Meals</h3>
            <Badge variant="secondary" className="text-xs">
              Personalized for You
            </Badge>
          </div>

          <SwipeableNutritionCarousel steps={mealSuggestions} />
        </div>
          </TabsContent>

          {/* GROCERY LIST TAB */}
          <TabsContent value="grocery" className="space-y-6">
            <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">
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
                  <p className="text-muted-foreground text-lg font-semibold">Your grocery list is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* MEAL PLANNING TAB */}
          <TabsContent value="meals" className="space-y-6">
            {/* Cycle Phase Meal Suggestions Widget */}
            <CyclePhaseMealWidget
              phase="Follicular Phase"
              meals={mealSuggestions}
            />

            <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  Weekly Meal Plan
                </h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  Plan your meals for the week ahead
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    ← Scroll →
                  </span>
                </p>
              </div>

              {/* Horizontal scrolling container */}
              <div className="overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 relative">
                {/* Subtle gradient fade indicators for scrolling */}
                <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                <div className="flex gap-4 min-w-max">
                  {weekDays.map((day) => (
                    <div key={day} className="flex-shrink-0 w-80 border-l-4 border-primary/30 pl-4 py-2">
                      <h4 className="text-lg font-semibold mb-3">{day}</h4>
                      <div className="space-y-3">
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

          {/* AI MEAL IDEAS TAB */}
          <TabsContent value="ai-meals" className="space-y-6">
            <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl">
              <Tabs defaultValue="breakfast" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                  <TabsTrigger value="lunch">Lunch</TabsTrigger>
                  <TabsTrigger value="dinner">Dinner</TabsTrigger>
                  <TabsTrigger value="snack">Snacks</TabsTrigger>
                  <TabsTrigger value="dessert">Desserts</TabsTrigger>
                </TabsList>

                <TabsContent value="breakfast">
                  <AIMealSuggestions
                    mealType="breakfast"
                    groceryItems={groceryItems.map(item => item.name)}
                    pantryItems={pantryItems}
                    onPantryItemsChange={setPantryItems}
                    onAddToMeal={(suggestion) => {
                      console.log('Add to meal plan:', suggestion);
                      alert(`Added ${suggestion.meal_name} to your meal plan!`);
                    }}
                  />
                </TabsContent>

                <TabsContent value="lunch">
                  <AIMealSuggestions
                    mealType="lunch"
                    groceryItems={groceryItems.map(item => item.name)}
                    pantryItems={pantryItems}
                    onPantryItemsChange={setPantryItems}
                    onAddToMeal={(suggestion) => {
                      console.log('Add to meal plan:', suggestion);
                      alert(`Added ${suggestion.meal_name} to your meal plan!`);
                    }}
                  />
                </TabsContent>

                <TabsContent value="dinner">
                  <AIMealSuggestions
                    mealType="dinner"
                    groceryItems={groceryItems.map(item => item.name)}
                    pantryItems={pantryItems}
                    onPantryItemsChange={setPantryItems}
                    onAddToMeal={(suggestion) => {
                      console.log('Add to meal plan:', suggestion);
                      alert(`Added ${suggestion.meal_name} to your meal plan!`);
                    }}
                  />
                </TabsContent>

                <TabsContent value="snack">
                  <AIMealSuggestions
                    mealType="snack"
                    groceryItems={groceryItems.map(item => item.name)}
                    pantryItems={pantryItems}
                    onPantryItemsChange={setPantryItems}
                    onAddToMeal={(suggestion) => {
                      console.log('Add to meal plan:', suggestion);
                      alert(`Added ${suggestion.meal_name} to your meal plan!`);
                    }}
                  />
                </TabsContent>

                <TabsContent value="dessert">
                  <AIMealSuggestions
                    mealType="dessert"
                    groceryItems={groceryItems.map(item => item.name)}
                    pantryItems={pantryItems}
                    onPantryItemsChange={setPantryItems}
                    onAddToMeal={(suggestion) => {
                      console.log('Add to meal plan:', suggestion);
                      alert(`Added ${suggestion.meal_name} to your meal plan!`);
                    }}
                  />
                </TabsContent>
              </Tabs>
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
