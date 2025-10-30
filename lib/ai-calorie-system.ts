/**
 * AI-Powered Calorie Management System
 * Handles intelligent calorie calculation, goal tracking, and daily adjustments
 */

import { calculateBMR } from './height-conversions';

export type GoalType = 'lose_weight' | 'gain_weight' | 'maintain_weight';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface UserProfile {
  userId: string;
  age: number;
  sex: 'male' | 'female';
  heightInches: number;
  heightUnit: 'in' | 'cm' | 'ft';
  weightLbs: number;
  weightUnit: 'lbs' | 'kg';
  activityLevel: ActivityLevel;
}

export interface FitnessGoal {
  goalType: GoalType;
  targetWeightLbs: number;
  weeklyGoalLbs: number; // How many lbs per week to lose/gain
  startDate: Date;
  targetDate?: Date;
}

export interface CalorieTarget {
  bmr: number;
  tdee: number;
  dailyTarget: number;
  adjustmentReason?: string;
}

export interface DailyTracking {
  date: Date;
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  isAdjusted: boolean;
  adjustmentReason?: string;
  originalTarget?: number;
}

/**
 * Activity multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Exercise 1-3 days/week
  moderate: 1.55,      // Exercise 3-5 days/week
  active: 1.725,       // Exercise 6-7 days/week
  very_active: 1.9     // Hard exercise 6-7 days/week
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate daily calorie target based on fitness goal
 */
export function calculateDailyCalorieTarget(
  profile: UserProfile,
  goal: FitnessGoal
): CalorieTarget {
  const bmr = calculateBMR(profile.weightLbs, profile.heightInches, profile.age, profile.sex);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  // 1 lb = 3500 calories
  const weeklyCalorieDeficit = goal.weeklyGoalLbs * 3500;
  const dailyCalorieAdjustment = weeklyCalorieDeficit / 7;

  let dailyTarget: number;
  
  switch (goal.goalType) {
    case 'lose_weight':
      dailyTarget = Math.round(tdee - dailyCalorieAdjustment);
      // Safety check: don't go below 1200 calories (women) or 1500 (men)
      const minCalories = profile.sex === 'female' ? 1200 : 1500;
      dailyTarget = Math.max(dailyTarget, minCalories);
      break;
    
    case 'gain_weight':
      dailyTarget = Math.round(tdee + dailyCalorieAdjustment);
      break;
    
    case 'maintain_weight':
      dailyTarget = Math.round(tdee);
      break;
  }

  return {
    bmr: Math.round(bmr),
    tdee,
    dailyTarget
  };
}

/**
 * AI Smart Calorie Adjustment Logic
 * Automatically adjusts future days if user overeats/undereats
 */
export function calculateSmartAdjustment(
  recentDays: DailyTracking[],
  currentTarget: number,
  goal: FitnessGoal
): CalorieTarget {
  // Calculate total surplus/deficit over recent days
  const totalDeviation = recentDays.reduce((sum, day) => {
    const deviation = day.consumedCalories - day.targetCalories;
    return sum + deviation;
  }, 0);

  // Average daily deviation
  const avgDeviation = totalDeviation / recentDays.length;

  // If average deviation is significant (>100 calories), adjust future days
  if (Math.abs(avgDeviation) > 100) {
    // Spread the adjustment over the next 7 days to stay on track
    const dailyCorrection = Math.round(avgDeviation / 7);
    
    // For weight loss: if overate, reduce future calories
    // For weight gain: if underate, increase future calories
    const adjustedTarget = currentTarget - dailyCorrection;

    // Safety bounds
    const minCalories = 1200;
    const maxCalories = 4000;
    const safeAdjustedTarget = Math.max(minCalories, Math.min(maxCalories, adjustedTarget));

    return {
      bmr: 0, // Not recalculating BMR, just adjusting
      tdee: 0,
      dailyTarget: safeAdjustedTarget,
      adjustmentReason: avgDeviation > 0 
        ? `Reduced by ${Math.abs(dailyCorrection)} cal/day to compensate for recent overeating`
        : `Increased by ${Math.abs(dailyCorrection)} cal/day to compensate for recent undereating`
    };
  }

  // No adjustment needed
  return {
    bmr: 0,
    tdee: 0,
    dailyTarget: currentTarget
  };
}

/**
 * Get weekly calorie summary for smart tracking
 */
export function getWeeklySummary(weekData: DailyTracking[]): {
  totalTarget: number;
  totalConsumed: number;
  weeklyDeviation: number;
  averageDailyDeviation: number;
  onTrack: boolean;
} {
  const totalTarget = weekData.reduce((sum, day) => sum + day.targetCalories, 0);
  const totalConsumed = weekData.reduce((sum, day) => sum + day.consumedCalories, 0);
  const weeklyDeviation = totalConsumed - totalTarget;
  const averageDailyDeviation = weeklyDeviation / weekData.length;

  // Consider "on track" if within 300 calories per day on average
  const onTrack = Math.abs(averageDailyDeviation) <= 300;

  return {
    totalTarget,
    totalConsumed,
    weeklyDeviation,
    averageDailyDeviation,
    onTrack
  };
}

/**
 * Predict time to reach goal based on current progress
 */
export function predictGoalCompletion(
  currentWeight: number,
  targetWeight: number,
  recentProgress: DailyTracking[],
  goal: FitnessGoal
): {
  estimatedDays: number;
  estimatedDate: Date;
  weeklyRateLbs: number;
  onPace: boolean;
} {
  const weekSummary = getWeeklySummary(recentProgress);
  
  // Calculate actual weekly rate based on calorie deficit/surplus
  // 3500 calories = 1 lb
  const weeklyCalorieDeviation = weekSummary.weeklyDeviation;
  const actualWeeklyRateLbs = weeklyCalorieDeviation / 3500;

  const weightToLose = Math.abs(targetWeight - currentWeight);
  const weeksNeeded = weightToLose / Math.abs(actualWeeklyRateLbs || goal.weeklyGoalLbs);
  const estimatedDays = Math.round(weeksNeeded * 7);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

  // Check if on pace (within 20% of target rate)
  const onPace = Math.abs(actualWeeklyRateLbs - goal.weeklyGoalLbs) <= (goal.weeklyGoalLbs * 0.2);

  return {
    estimatedDays,
    estimatedDate,
    weeklyRateLbs: Math.abs(actualWeeklyRateLbs),
    onPace
  };
}

/**
 * LocalStorage persistence for user profile and tracking
 */
export const CalorieStorage = {
  PROFILE_KEY: 'fitness_user_profile',
  GOAL_KEY: 'fitness_goal',
  TRACKING_KEY_PREFIX: 'calorie_tracking_',

  saveProfile(profile: UserProfile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    }
  },

  loadProfile(): UserProfile | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  saveGoal(goal: FitnessGoal): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.GOAL_KEY, JSON.stringify(goal));
    }
  },

  loadGoal(): FitnessGoal | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.GOAL_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  saveDayTracking(tracking: DailyTracking): void {
    if (typeof window !== 'undefined') {
      const dateKey = tracking.date.toISOString().split('T')[0];
      localStorage.setItem(
        `${this.TRACKING_KEY_PREFIX}${dateKey}`,
        JSON.stringify(tracking)
      );
    }
  },

  loadDayTracking(date: Date): DailyTracking | null {
    if (typeof window !== 'undefined') {
      const dateKey = date.toISOString().split('T')[0];
      const data = localStorage.getItem(`${this.TRACKING_KEY_PREFIX}${dateKey}`);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  loadRecentDays(numDays: number): DailyTracking[] {
    const days: DailyTracking[] = [];
    const today = new Date();

    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const tracking = this.loadDayTracking(date);
      if (tracking) {
        days.push(tracking);
      }
    }

    return days.reverse(); // Oldest first
  }
};
