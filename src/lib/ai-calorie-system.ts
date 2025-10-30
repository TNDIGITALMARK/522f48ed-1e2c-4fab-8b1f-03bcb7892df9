/**
 * AI Calorie System - Unified calorie tracking and management
 * Combines weight tracking, calorie calculation, and smart adjustments
 */

import { calculateBMR } from './height-conversions';
import type { ActivityLevel, WeightUnit, HeightUnit } from './weight-tracking';

// Re-export types from weight-tracking
export type { ActivityLevel, WeightUnit, HeightUnit };

// Extended GoalType to support both naming conventions
export type GoalType = 'cutting' | 'bulking' | 'maintaining' | 'lose_weight' | 'maintain_weight' | 'gain_weight';

// User Profile
export interface UserProfile {
  userId: string;
  age: number;
  sex: 'male' | 'female';
  heightInches: number;
  heightUnit: HeightUnit;
  weightLbs: number;
  weightUnit: WeightUnit;
  activityLevel: ActivityLevel;
}

// Fitness Goal
export interface FitnessGoal {
  goalType: GoalType;
  targetWeightLbs: number;
  weeklyGoalLbs: number;
  startDate: Date;
}

// Daily Tracking
export interface DailyTracking {
  date: Date;
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  isAdjusted?: boolean;
  adjustmentReason?: string;
  originalTarget?: number;
}

// Weekly Summary
export interface WeeklySummary {
  totalTarget: number;
  totalConsumed: number;
  weeklyDeviation: number;
  onTrack: boolean;
}

// Calorie Target Result
export interface CalorieTarget {
  dailyTarget: number;
  weeklyTarget: number;
  bmr: number;
  tdee: number;
}

// Smart Adjustment Result
export interface SmartAdjustment {
  dailyTarget: number;
  adjustmentReason?: string;
}

// Activity multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

// Calories per pound
const CALORIES_PER_POUND = 3500;

/**
 * Calculate daily calorie target based on profile and goal
 */
export function calculateDailyCalorieTarget(
  profile: UserProfile,
  goal: FitnessGoal
): CalorieTarget {
  // Calculate BMR
  const bmr = calculateBMR(
    profile.weightLbs,
    profile.heightInches,
    profile.age,
    profile.sex
  );

  // Calculate TDEE
  const activityMultiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  const tdee = bmr * activityMultiplier;

  // Calculate calorie adjustment based on goal
  let dailyAdjustment = 0;

  if (goal.goalType === 'cutting' || goal.goalType === 'lose_weight') {
    // Weight loss: subtract calories
    const weeklyCalorieDeficit = goal.weeklyGoalLbs * CALORIES_PER_POUND;
    dailyAdjustment = -(weeklyCalorieDeficit / 7);
  } else if (goal.goalType === 'bulking' || goal.goalType === 'gain_weight') {
    // Weight gain: add calories
    const weeklyCalorieSurplus = goal.weeklyGoalLbs * CALORIES_PER_POUND;
    dailyAdjustment = weeklyCalorieSurplus / 7;
  }

  const dailyTarget = Math.round(tdee + dailyAdjustment);

  // Apply minimum calorie thresholds
  const minCalories = profile.sex === 'male' ? 1500 : 1200;
  const adjustedDailyTarget = Math.max(dailyTarget, minCalories);

  return {
    dailyTarget: adjustedDailyTarget,
    weeklyTarget: adjustedDailyTarget * 7,
    bmr,
    tdee
  };
}

/**
 * Calculate smart adjustment based on recent tracking history
 */
export function calculateSmartAdjustment(
  recentDays: DailyTracking[],
  baseTarget: number,
  goal: FitnessGoal
): SmartAdjustment {
  if (recentDays.length < 3) {
    return { dailyTarget: baseTarget };
  }

  // Calculate average deviation
  const totalDeviation = recentDays.reduce(
    (sum, day) => sum + (day.consumedCalories - day.targetCalories),
    0
  );
  const avgDeviation = totalDeviation / recentDays.length;

  // If consistently over/under, adjust target
  const threshold = 200; // calories
  let adjustmentReason: string | undefined;
  let dailyTarget = baseTarget;

  if (Math.abs(avgDeviation) > threshold) {
    if (avgDeviation > threshold) {
      // Consistently over target
      if (goal.goalType === 'cutting' || goal.goalType === 'lose_weight') {
        adjustmentReason = 'Target adjusted down due to consistent overeating';
        dailyTarget = Math.round(baseTarget - 100);
      }
    } else if (avgDeviation < -threshold) {
      // Consistently under target
      adjustmentReason = 'Target adjusted up - you have room for more calories';
      dailyTarget = Math.round(baseTarget + 100);
    }
  }

  return {
    dailyTarget,
    adjustmentReason
  };
}

/**
 * Get weekly summary from recent days
 */
export function getWeeklySummary(recentDays: DailyTracking[]): WeeklySummary {
  const totalTarget = recentDays.reduce((sum, day) => sum + day.targetCalories, 0);
  const totalConsumed = recentDays.reduce((sum, day) => sum + day.consumedCalories, 0);
  const weeklyDeviation = totalConsumed - totalTarget;

  // Allow 500 calorie variance per week
  const onTrack = Math.abs(weeklyDeviation) <= 500;

  return {
    totalTarget,
    totalConsumed,
    weeklyDeviation,
    onTrack
  };
}

/**
 * Local Storage Management
 */
export const CalorieStorage = {
  // Profile storage
  saveProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('bloom_calorie_profile', JSON.stringify(profile));
  },

  loadProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('bloom_calorie_profile');
    return data ? JSON.parse(data) : null;
  },

  // Goal storage
  saveGoal(goal: FitnessGoal): void {
    if (typeof window === 'undefined') return;
    const goalData = {
      ...goal,
      startDate: goal.startDate.toISOString()
    };
    localStorage.setItem('bloom_calorie_goal', JSON.stringify(goalData));
  },

  loadGoal(): FitnessGoal | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('bloom_calorie_goal');
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      startDate: new Date(parsed.startDate)
    };
  },

  // Daily tracking storage
  saveDayTracking(tracking: DailyTracking): void {
    if (typeof window === 'undefined') return;
    const key = `bloom_tracking_${tracking.date.toISOString().split('T')[0]}`;
    const trackingData = {
      ...tracking,
      date: tracking.date.toISOString()
    };
    localStorage.setItem(key, JSON.stringify(trackingData));
  },

  loadDayTracking(date: Date): DailyTracking | null {
    if (typeof window === 'undefined') return null;
    const key = `bloom_tracking_${date.toISOString().split('T')[0]}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      date: new Date(parsed.date)
    };
  },

  loadRecentDays(days: number): DailyTracking[] {
    if (typeof window === 'undefined') return [];
    const recentDays: DailyTracking[] = [];

    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const tracking = this.loadDayTracking(date);
      if (tracking) {
        recentDays.push(tracking);
      }
    }

    return recentDays;
  }
};
