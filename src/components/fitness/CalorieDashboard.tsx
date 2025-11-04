'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalorieStorage, DailyTracking, calculateSmartAdjustment, getWeeklySummary } from '@/lib/ai-calorie-system';
import { PlateScanner } from '@/components/plate-scanner';
import { Camera, Utensils } from 'lucide-react';

export function CalorieDashboard() {
  const [todayTracking, setTodayTracking] = useState<DailyTracking | null>(null);
  const [mealCalories, setMealCalories] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    const profile = CalorieStorage.loadProfile();
    const goal = CalorieStorage.loadGoal();
    
    if (!profile || !goal) {
      return;
    }

    const today = new Date();
    let tracking = CalorieStorage.loadDayTracking(today);

    if (!tracking) {
      // Get recent 7 days for smart adjustment
      const recentDays = CalorieStorage.loadRecentDays(7);
      
      // Calculate base target
      const { calculateDailyCalorieTarget } = await import('@/lib/ai-calorie-system');
      const baseTarget = calculateDailyCalorieTarget(profile, goal);
      
      let dailyTarget = baseTarget.dailyTarget;
      let isAdjusted = false;
      let adjustmentReason: string | undefined;

      // Apply smart adjustment if we have enough history
      if (recentDays.length >= 3) {
        const adjustment = calculateSmartAdjustment(recentDays, dailyTarget, goal);
        if (adjustment.adjustmentReason) {
          dailyTarget = adjustment.dailyTarget;
          isAdjusted = true;
          adjustmentReason = adjustment.adjustmentReason;
        }
      }

      tracking = {
        date: today,
        targetCalories: dailyTarget,
        consumedCalories: 0,
        remainingCalories: dailyTarget,
        isAdjusted,
        adjustmentReason,
        originalTarget: isAdjusted ? baseTarget.dailyTarget : undefined
      };

      CalorieStorage.saveDayTracking(tracking);
    }

    setTodayTracking(tracking);
    setLoading(false);
  };

  const handleLogMeal = () => {
    if (!todayTracking || !mealCalories) return;

    const calories = parseFloat(mealCalories);
    const updated: DailyTracking = {
      ...todayTracking,
      consumedCalories: todayTracking.consumedCalories + calories,
      remainingCalories: todayTracking.targetCalories - (todayTracking.consumedCalories + calories)
    };

    CalorieStorage.saveDayTracking(updated);
    setTodayTracking(updated);
    setMealCalories('');
  };

  if (loading || !todayTracking) {
    return <div>Loading...</div>;
  }

  const percentConsumed = (todayTracking.consumedCalories / todayTracking.targetCalories) * 100;
  const recentDays = CalorieStorage.loadRecentDays(7);
  const weeklySummary = recentDays.length > 0 ? getWeeklySummary(recentDays) : null;

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Calories</h2>
        
        {todayTracking.isAdjusted && (
          <div className="mb-4 p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium">🤖 AI Adjustment Applied</p>
            <p className="text-sm text-muted-foreground">{todayTracking.adjustmentReason}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {todayTracking.consumedCalories.toFixed(0)} / {todayTracking.targetCalories.toFixed(0)} cal
              </span>
            </div>
            <Progress value={Math.min(percentConsumed, 100)} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{todayTracking.targetCalories.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Target</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTracking.consumedCalories.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Consumed</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${todayTracking.remainingCalories < 0 ? 'text-destructive' : 'text-primary'}`}>
                {todayTracking.remainingCalories.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Log Meal - with tabs for manual vs plate scan */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Log Meal</h3>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="scan">
              <Camera className="w-4 h-4 mr-2" />
              Scan Plate
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Utensils className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <PlateScanner />
          </TabsContent>

          <TabsContent value="manual">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  placeholder="Enter calories"
                />
              </div>
              <Button onClick={handleLogMeal} disabled={!mealCalories}>
                Log Meal
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Weekly Summary */}
      {weeklySummary && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Target:</span>
              <span className="font-medium">{weeklySummary.totalTarget.toFixed(0)} cal</span>
            </div>
            <div className="flex justify-between">
              <span>Total Consumed:</span>
              <span className="font-medium">{weeklySummary.totalConsumed.toFixed(0)} cal</span>
            </div>
            <div className="flex justify-between">
              <span>Deviation:</span>
              <span className={`font-medium ${weeklySummary.weeklyDeviation > 0 ? 'text-destructive' : 'text-primary'}`}>
                {weeklySummary.weeklyDeviation > 0 ? '+' : ''}{weeklySummary.weeklyDeviation.toFixed(0)} cal
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-medium ${weeklySummary.onTrack ? 'text-primary' : 'text-yellow-600'}`}>
                {weeklySummary.onTrack ? '✅ On Track' : '⚠️ Adjust Needed'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
