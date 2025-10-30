/**
 * Intelligent calorie calculation system
 * Automatically curates calorie goals based on weight goals, fitness goals, and weekly targets
 */

import { calculateBMR } from './height-conversions';
import type { GoalType, ActivityLevel, WeightUnit } from './weight-tracking';

export interface CalorieCalculationInput {
  // User metrics
  currentWeight: number;
  targetWeight?: number;
  weightUnit: WeightUnit;
  heightInches: number;
  age: number;
  sex: 'male' | 'female';

  // Goals
  goalType: GoalType;
  weeklyWeightGoal?: number; // lbs per week
  monthlyWeightGoal?: number; // lbs per month
  activityLevel: ActivityLevel;

  // Custom override
  customCalorieGoal?: number;
}

export interface CalorieRecommendation {
  dailyCalories: number;
  weeklyCalories: number;

  // Breakdown
  bmr: number;
  tdee: number; // Total Daily Energy Expenditure
  adjustment: number; // Calories added/subtracted for goal

  // Context
  goalType: GoalType;
  weeklyWeightChange: number; // Expected lbs per week
  isCustom: boolean;

  // Recommendations
  minCalories: number;
  maxCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,       // Little to no exercise
  light: 1.375,         // Light exercise 1-3 days/week
  moderate: 1.55,       // Moderate exercise 3-5 days/week
  active: 1.725,        // Heavy exercise 6-7 days/week
  very_active: 1.9      // Very heavy exercise, physical job
};

/**
 * Calories per pound of body weight change
 * (3500 calories = approximately 1 pound)
 */
const CALORIES_PER_POUND = 3500;

/**
 * Safe weight loss/gain ranges
 */
const SAFE_WEIGHT_LOSS_PER_WEEK = { min: 0.5, max: 2.0 }; // lbs
const SAFE_WEIGHT_GAIN_PER_WEEK = { min: 0.25, max: 1.0 }; // lbs

/**
 * Minimum calorie thresholds for health
 */
const MIN_CALORIES = {
  female: 1200,
  male: 1500
};

/**
 * Calculate recommended daily calories
 */
export function calculateCalories(input: CalorieCalculationInput): CalorieRecommendation {
  // If custom calorie goal is provided, use it
  if (input.customCalorieGoal && input.customCalorieGoal > 0) {
    return buildCustomCalorieRecommendation(input);
  }

  // Calculate BMR (Basal Metabolic Rate)
  const bmr = calculateBMR(
    input.currentWeight,
    input.heightInches,
    input.age,
    input.sex
  );

  // Calculate TDEE (Total Daily Energy Expenditure)
  const activityMultiplier = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const tdee = bmr * activityMultiplier;

  // Determine weekly weight change goal
  let weeklyWeightChange = 0;

  if (input.weeklyWeightGoal) {
    weeklyWeightChange = input.weeklyWeightGoal;
  } else if (input.monthlyWeightGoal) {
    weeklyWeightChange = input.monthlyWeightGoal / 4.33; // Average weeks per month
  } else {
    // Default based on goal type
    weeklyWeightChange = getDefaultWeeklyGoal(input.goalType);
  }

  // Apply safety constraints
  weeklyWeightChange = applySafetyConstraints(weeklyWeightChange, input.goalType);

  // Calculate calorie adjustment
  const weeklyCalorieAdjustment = weeklyWeightChange * CALORIES_PER_POUND;
  const dailyCalorieAdjustment = weeklyCalorieAdjustment / 7;

  // For weight loss, subtract calories; for weight gain, add calories
  const adjustmentDirection = input.goalType === 'cutting' ? -1 : input.goalType === 'bulking' ? 1 : 0;
  const dailyCalories = Math.round(tdee + (dailyCalorieAdjustment * adjustmentDirection));

  // Apply minimum calorie threshold
  const minCalories = MIN_CALORIES[input.sex];
  const adjustedDailyCalories = Math.max(dailyCalories, minCalories);

  // Calculate macros
  const macros = calculateMacros(adjustedDailyCalories, input.currentWeight, input.goalType);

  return {
    dailyCalories: adjustedDailyCalories,
    weeklyCalories: adjustedDailyCalories * 7,
    bmr,
    tdee,
    adjustment: dailyCalorieAdjustment * adjustmentDirection,
    goalType: input.goalType,
    weeklyWeightChange: Math.abs(weeklyWeightChange),
    isCustom: false,
    minCalories,
    maxCalories: Math.round(tdee + 500), // Maximum healthy surplus
    ...macros
  };
}

/**
 * Build recommendation for custom calorie goal
 */
function buildCustomCalorieRecommendation(input: CalorieCalculationInput): CalorieRecommendation {
  const bmr = calculateBMR(input.currentWeight, input.heightInches, input.age, input.sex);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];
  const dailyCalories = input.customCalorieGoal!;
  const adjustment = dailyCalories - tdee;

  // Estimate weekly weight change based on calorie adjustment
  const weeklyCalorieAdjustment = adjustment * 7;
  const weeklyWeightChange = Math.abs(weeklyCalorieAdjustment / CALORIES_PER_POUND);

  const macros = calculateMacros(dailyCalories, input.currentWeight, input.goalType);

  return {
    dailyCalories,
    weeklyCalories: dailyCalories * 7,
    bmr,
    tdee,
    adjustment,
    goalType: input.goalType,
    weeklyWeightChange,
    isCustom: true,
    minCalories: MIN_CALORIES[input.sex],
    maxCalories: Math.round(tdee + 500),
    ...macros
  };
}

/**
 * Get default weekly weight goal based on goal type
 */
function getDefaultWeeklyGoal(goalType: GoalType): number {
  switch (goalType) {
    case 'cutting':
      return 1.0; // 1 lb per week (moderate weight loss)
    case 'bulking':
      return 0.5; // 0.5 lb per week (lean muscle gain)
    case 'maintaining':
      return 0; // Maintain weight
  }
}

/**
 * Apply safety constraints to weekly weight change
 */
function applySafetyConstraints(weeklyGoal: number, goalType: GoalType): number {
  if (goalType === 'cutting') {
    return Math.max(
      SAFE_WEIGHT_LOSS_PER_WEEK.min,
      Math.min(Math.abs(weeklyGoal), SAFE_WEIGHT_LOSS_PER_WEEK.max)
    );
  } else if (goalType === 'bulking') {
    return Math.max(
      SAFE_WEIGHT_GAIN_PER_WEEK.min,
      Math.min(Math.abs(weeklyGoal), SAFE_WEIGHT_GAIN_PER_WEEK.max)
    );
  }
  return 0;
}

/**
 * Calculate macronutrient distribution
 */
function calculateMacros(
  dailyCalories: number,
  currentWeight: number,
  goalType: GoalType
): {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  // Protein: 0.8-1g per lb of body weight (higher for cutting/bulking)
  let proteinPerLb = 0.8;
  if (goalType === 'cutting') {
    proteinPerLb = 1.0; // Higher protein to preserve muscle during cut
  } else if (goalType === 'bulking') {
    proteinPerLb = 0.9; // Moderate-high protein for muscle building
  }

  const proteinGrams = Math.round(currentWeight * proteinPerLb);
  const proteinCalories = proteinGrams * 4;

  // Fat: 25-30% of total calories
  const fatPercentage = goalType === 'cutting' ? 0.25 : 0.30;
  const fatCalories = dailyCalories * fatPercentage;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: Remaining calories
  const carbCalories = dailyCalories - proteinCalories - fatCalories;
  const carbsGrams = Math.round(Math.max(0, carbCalories / 4));

  return {
    proteinGrams,
    carbsGrams,
    fatGrams
  };
}

/**
 * Get activity level description
 */
export function getActivityLevelDescription(level: ActivityLevel): string {
  switch (level) {
    case 'sedentary':
      return 'Little to no exercise';
    case 'light':
      return 'Light exercise 1-3 days/week';
    case 'moderate':
      return 'Moderate exercise 3-5 days/week';
    case 'active':
      return 'Heavy exercise 6-7 days/week';
    case 'very_active':
      return 'Very heavy exercise or physical job';
  }
}

/**
 * Format calorie recommendation for display
 */
export function formatCalorieRecommendation(recommendation: CalorieRecommendation): string {
  const { dailyCalories, weeklyWeightChange, goalType } = recommendation;

  let goalDescription = '';
  if (goalType === 'cutting') {
    goalDescription = `to lose ${weeklyWeightChange.toFixed(1)} lbs/week`;
  } else if (goalType === 'bulking') {
    goalDescription = `to gain ${weeklyWeightChange.toFixed(1)} lbs/week`;
  } else {
    goalDescription = 'to maintain weight';
  }

  return `${dailyCalories.toLocaleString()} cal/day ${goalDescription}`;
}
