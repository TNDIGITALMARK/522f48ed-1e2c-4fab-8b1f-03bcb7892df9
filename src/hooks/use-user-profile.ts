/**
 * React Hooks for User Profile Synchronization
 *
 * These hooks automatically sync data across all pages.
 * When you update data anywhere, all components update automatically.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUserProfile,
  getOrCreateProfile,
  updateUserProfile,
  updatePhysicalAttributes,
  updateFitnessGoals,
  updateWellnessMetrics,
  subscribeToProfile,
  subscribeToNutrition,
  getTodaysNutrition,
  getNutritionData,
  addMealToToday,
  syncWeightDataToProfile,
  getCurrentCalorieRecommendation,
  getWeeklyNutritionSummary,
  type UserProfile,
  type NutritionData,
  type MealEntry
} from '@/lib/user-profile-store';
import { type HeightValue } from '@/lib/height-conversions';
import { type WeightUnit, type ActivityLevel, type GoalType } from '@/lib/weight-tracking';
import { type CalorieRecommendation } from '@/lib/calorie-calculator';

/**
 * Main hook for accessing and updating user profile
 * Automatically syncs across all pages
 */
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial profile
  useEffect(() => {
    const loadedProfile = getOrCreateProfile(userId);
    setProfile(loadedProfile);
    setIsLoading(false);
  }, [userId]);

  // Subscribe to profile updates
  useEffect(() => {
    const unsubscribe = subscribeToProfile(userId, (updatedProfile) => {
      setProfile(updatedProfile);
    });

    return unsubscribe;
  }, [userId]);

  // Update functions
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = updateUserProfile(userId, updates);
    setProfile(updated);
    return updated;
  }, [userId]);

  const updatePhysical = useCallback((updates: {
    height?: HeightValue;
    weight?: number;
    weightUnit?: WeightUnit;
    age?: number;
  }) => {
    const updated = updatePhysicalAttributes(userId, updates);
    setProfile(updated);
    return updated;
  }, [userId]);

  const updateGoals = useCallback((updates: {
    goalType?: GoalType;
    targetWeight?: number;
    weeklyWeightGoal?: number;
    activityLevel?: ActivityLevel;
  }) => {
    const updated = updateFitnessGoals(userId, updates);
    setProfile(updated);
    return updated;
  }, [userId]);

  const updateWellness = useCallback((updates: {
    waterConsumed?: number;
    stepsCompleted?: number;
    meditationCompleted?: number;
    sleepHours?: number;
  }) => {
    const updated = updateWellnessMetrics(userId, updates);
    setProfile(updated);
    return updated;
  }, [userId]);

  const syncFromWeightTracking = useCallback(() => {
    const synced = syncWeightDataToProfile(userId);
    setProfile(synced);
    return synced;
  }, [userId]);

  return {
    profile,
    isLoading,
    updateProfile,
    updatePhysical,
    updateGoals,
    updateWellness,
    syncFromWeightTracking
  };
}

/**
 * Hook for nutrition data (meals, calories, macros)
 * Automatically updates across all pages
 */
export function useNutritionData(userId: string) {
  const [todaysNutrition, setTodaysNutrition] = useState<NutritionData | null>(null);
  const [weeklyData, setWeeklyData] = useState<NutritionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const today = getTodaysNutrition(userId);
    setTodaysNutrition(today);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekly = getNutritionData(userId, weekAgo);
    setWeeklyData(weekly);

    setIsLoading(false);
  }, [userId]);

  // Subscribe to nutrition updates
  useEffect(() => {
    const unsubscribe = subscribeToNutrition(userId, (allData) => {
      const today = new Date().toISOString().split('T')[0];
      const todayData = allData.find(d => d.date === today);
      setTodaysNutrition(todayData || null);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekData = allData.filter(d => new Date(d.date) >= weekAgo);
      setWeeklyData(weekData);
    });

    return unsubscribe;
  }, [userId]);

  // Add meal function
  const addMeal = useCallback((
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    meal: MealEntry
  ) => {
    const updated = addMealToToday(userId, mealType, meal);
    setTodaysNutrition(updated);
    return updated;
  }, [userId]);

  // Get weekly summary
  const getWeeklySummary = useCallback(() => {
    return getWeeklyNutritionSummary(userId);
  }, [userId]);

  return {
    todaysNutrition,
    weeklyData,
    isLoading,
    addMeal,
    getWeeklySummary
  };
}

/**
 * Hook for calorie recommendations
 * Automatically recalculates when profile changes
 */
export function useCalorieRecommendation(userId: string) {
  const { profile } = useUserProfile(userId);
  const [recommendation, setRecommendation] = useState<CalorieRecommendation | null>(null);

  useEffect(() => {
    if (profile) {
      const rec = getCurrentCalorieRecommendation(userId);
      setRecommendation(rec);
    }
  }, [profile, userId]);

  return recommendation;
}

/**
 * Hook for dashboard data (combines profile, nutrition, and recommendations)
 * One hook to rule them all - perfect for dashboard page
 */
export function useDashboardData(userId: string) {
  const profileData = useUserProfile(userId);
  const nutritionData = useNutritionData(userId);
  const calorieRecommendation = useCalorieRecommendation(userId);

  const isLoading = profileData.isLoading || nutritionData.isLoading;

  return {
    // Profile
    profile: profileData.profile,
    updateProfile: profileData.updateProfile,
    updatePhysical: profileData.updatePhysical,
    updateGoals: profileData.updateGoals,
    updateWellness: profileData.updateWellness,
    syncFromWeightTracking: profileData.syncFromWeightTracking,

    // Nutrition
    todaysNutrition: nutritionData.todaysNutrition,
    weeklyNutritionData: nutritionData.weeklyData,
    addMeal: nutritionData.addMeal,
    getWeeklySummary: nutritionData.getWeeklySummary,

    // Recommendations
    calorieRecommendation,

    // Loading state
    isLoading
  };
}

/**
 * Hook for syncing specific metric across pages
 * Example: useMetricSync('waterConsumed') will keep water intake synced everywhere
 */
export function useMetricSync<K extends keyof UserProfile>(
  userId: string,
  metricKey: K
): [UserProfile[K] | undefined, (value: UserProfile[K]) => void] {
  const { profile, updateProfile } = useUserProfile(userId);
  const value = profile?.[metricKey];

  const setValue = useCallback((newValue: UserProfile[K]) => {
    updateProfile({ [metricKey]: newValue } as Partial<UserProfile>);
  }, [metricKey, updateProfile]);

  return [value, setValue];
}
