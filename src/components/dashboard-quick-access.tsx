"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Plus,
  Scale,
  Target,
  TrendingDown,
  Coffee,
  Salad,
  Moon as DinnerIcon,
  Clock,
  Flame
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuickAccessProps {
  userId?: string;
}

export function DashboardQuickAccess({ userId }: QuickAccessProps) {
  // Get current time to determine which meal to show
  const getCurrentMealPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    return 'dinner';
  };

  const [currentMeal, setCurrentMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  useEffect(() => {
    setCurrentMeal(getCurrentMealPeriod());
  }, []);

  // Mock data - would come from database in production
  const [todos, setTodos] = useState([
    { id: 1, text: 'Morning yoga session', completed: true },
    { id: 2, text: 'Log breakfast calories', completed: true },
    { id: 3, text: 'Drink 8 glasses of water', completed: false },
    { id: 4, text: 'Evening walk', completed: false },
  ]);

  const weightData = {
    current: 152.4,
    goal: 145.0,
    change: -3.2,
    progress: 43,
    weeklyTarget: 1.5,
  };

  const mealData = {
    breakfast: {
      name: 'Avocado Toast & Smoothie',
      calories: 420,
      logged: true,
      icon: Coffee,
      time: '7:30 AM',
    },
    lunch: {
      name: 'Greek Salad with Chicken',
      calories: 480,
      logged: false,
      icon: Salad,
      time: '12:30 PM',
    },
    dinner: {
      name: 'Grilled Salmon & Veggies',
      calories: 520,
      logged: false,
      icon: DinnerIcon,
      time: '7:00 PM',
    },
  };

  const dailyCalorieTarget = 1600;
  const caloriesConsumed = mealData.breakfast.logged ? mealData.breakfast.calories : 0;

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const activeMeal = mealData[currentMeal];
  const MealIcon = activeMeal.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
      {/* To-Do List Section */}
      <Card className="magazine-feature-card p-6 hover:shadow-bloom-lg transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Today's Tasks</h3>
          <Badge variant="secondary" className="text-xs">
            {todos.filter(t => t.completed).length}/{todos.length}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          {todos.slice(0, 3).map(todo => (
            <button
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
            >
              {todo.completed ? (
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              )}
              <span className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {todo.text}
              </span>
            </button>
          ))}
        </div>

        <Link href="/rituals">
          <Button variant="outline" size="sm" className="w-full rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </Link>
      </Card>

      {/* Weight & Goals Section */}
      <Card className="magazine-feature-card p-6 hover:shadow-bloom-lg transition-all duration-300" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Weight & Goals</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-primary">{weightData.current}</span>
              <span className="text-sm text-muted-foreground">lbs</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                {Math.abs(weightData.change)} lbs lost
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goal: {weightData.goal} lbs</span>
              <span className="font-medium text-primary">{weightData.progress}%</span>
            </div>
            <Progress value={weightData.progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2 p-3 bg-card/60 rounded-lg border border-primary/10">
            <Target className="w-4 h-4 text-secondary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Target:</strong> {weightData.weeklyTarget} lbs/week
            </p>
          </div>
        </div>

        <Link href="/weight">
          <Button variant="outline" size="sm" className="w-full mt-4 rounded-full">
            View Progress
          </Button>
        </Link>
      </Card>

      {/* Quick Meal Access Section */}
      <Card className="magazine-feature-card p-6 hover:shadow-bloom-lg transition-all duration-300" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)' }}>
        <div className="flex items-center gap-2 mb-4">
          <MealIcon className="w-5 h-5 text-accent-foreground" />
          <h3 className="text-lg font-semibold capitalize">{currentMeal}</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{activeMeal.time}</span>
            </div>
            <p className="font-medium text-foreground mb-1">{activeMeal.name}</p>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent-foreground" />
              <span className="text-2xl font-bold text-accent-foreground">{activeMeal.calories}</span>
              <span className="text-sm text-muted-foreground">kcal</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Target</span>
              <span className="font-medium">{caloriesConsumed}/{dailyCalorieTarget} kcal</span>
            </div>
            <Progress value={(caloriesConsumed / dailyCalorieTarget) * 100} className="h-2" />
          </div>

          {activeMeal.logged ? (
            <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
              <p className="text-xs text-foreground">Logged successfully</p>
            </div>
          ) : (
            <Link href="/calorie-tracking">
              <Button size="sm" className="w-full rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Log {currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1)}
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
