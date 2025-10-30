// Weekly Balance Score Calculator
// Integrates user goals, cycle tracking, and nutrition data to provide adaptive weekly targets

import { getActiveGoal, getLatestWeight, type GoalType } from './weight-tracking';

export interface CyclePhase {
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  day: number;
}

export interface WeeklyBalanceScore {
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  adjustedForCycle: boolean;
  adjustedForGoal: boolean;
  cycleModifier: number;
  goalModifier: number;
  recommendations: string[];
}

// Base calorie calculation using Mifflin-St Jeor equation
export function calculateBMR(
  weight: number, // in lbs
  height: number, // in inches
  age: number,
  sex: 'male' | 'female'
): number {
  // Convert to metric
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;

  if (sex === 'female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
}

// Apply activity multiplier
export function calculateTDEE(bmr: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  return bmr * multipliers[activityLevel];
}

// Get cycle phase modifier for calorie needs
export function getCycleModifier(phase: CyclePhase['phase']): number {
  // Research shows metabolic rate increases during luteal phase
  const modifiers = {
    menstrual: 1.0,    // Baseline
    follicular: 0.98,  // Slightly lower metabolism
    ovulation: 1.02,   // Peak energy
    luteal: 1.05       // Increased metabolism (up to 10% increase)
  };

  return modifiers[phase];
}

// Get goal modifier for calorie targets
export function getGoalModifier(goalType: GoalType, weeklyGoal: number = 1.0): { calorieModifier: number; proteinMultiplier: number } {
  // 1 lb fat = ~3500 calories, so weekly deficit/surplus
  const weeklyCalorieChange = weeklyGoal * 3500;
  const dailyCalorieChange = weeklyCalorieChange / 7;

  const modifiers = {
    cutting: {
      calorieModifier: -dailyCalorieChange, // Deficit
      proteinMultiplier: 1.0 // 1.0g per lb bodyweight to preserve muscle
    },
    bulking: {
      calorieModifier: dailyCalorieChange, // Surplus
      proteinMultiplier: 0.8 // 0.8g per lb bodyweight for muscle gain
    },
    maintaining: {
      calorieModifier: 0, // Maintenance
      proteinMultiplier: 0.8 // 0.8g per lb bodyweight for maintenance
    }
  };

  return modifiers[goalType];
}

// Calculate macro targets based on goal
export function calculateMacros(
  totalCalories: number,
  weight: number,
  goalType: GoalType
): { protein: number; carbs: number; fats: number } {
  const goalModifier = getGoalModifier(goalType);
  
  // Protein (in grams)
  const proteinGrams = weight * goalModifier.proteinMultiplier;
  const proteinCalories = proteinGrams * 4;

  // Fat (20-30% of calories depending on goal)
  const fatPercentage = goalType === 'cutting' ? 0.25 : 0.30;
  const fatCalories = totalCalories * fatPercentage;
  const fatGrams = fatCalories / 9;

  // Carbs (remainder)
  const carbCalories = totalCalories - proteinCalories - fatCalories;
  const carbGrams = carbCalories / 4;

  return {
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbGrams),
    fats: Math.round(fatGrams)
  };
}

// Main function to calculate weekly balance score
export function calculateWeeklyBalanceScore(
  userId: string,
  cyclePhase: CyclePhase | null,
  weight: number, // lbs
  height: number, // inches
  age: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'moderate'
): WeeklyBalanceScore {
  // Get user's active goal
  const activeGoal = getActiveGoal(userId);
  
  // Calculate base metabolic needs
  const bmr = calculateBMR(weight, height, age, 'female');
  let tdee = calculateTDEE(bmr, activityLevel);

  // Apply cycle modifier if available
  let cycleModifier = 1.0;
  let adjustedForCycle = false;
  if (cyclePhase) {
    cycleModifier = getCycleModifier(cyclePhase.phase);
    tdee *= cycleModifier;
    adjustedForCycle = true;
  }

  // Apply goal modifier
  let goalModifier = 0;
  let adjustedForGoal = false;
  let goalType: GoalType = 'maintaining';

  if (activeGoal) {
    const goalMod = getGoalModifier(activeGoal.goalType, activeGoal.weeklyGoal || 1.0);
    goalModifier = goalMod.calorieModifier;
    goalType = activeGoal.goalType;
    adjustedForGoal = true;
  }

  // Final calorie target
  const targetCalories = Math.round(tdee + goalModifier);

  // Calculate macros
  const macros = calculateMacros(targetCalories, weight, goalType);

  // Generate recommendations based on cycle and goal
  const recommendations: string[] = [];

  if (cyclePhase) {
    if (cyclePhase.phase === 'menstrual') {
      recommendations.push('Focus on iron-rich foods and stay hydrated');
      recommendations.push('Gentle movement and rest are important');
    } else if (cyclePhase.phase === 'follicular') {
      recommendations.push('Great time for high-intensity workouts');
      recommendations.push('Energy levels are rising');
    } else if (cyclePhase.phase === 'ovulation') {
      recommendations.push('Peak energy - ideal for challenging workouts');
      recommendations.push('Social activities and collaboration feel easier');
    } else if (cyclePhase.phase === 'luteal') {
      recommendations.push('Metabolism is naturally higher - honor increased hunger');
      recommendations.push('Focus on strength training and moderate cardio');
    }
  }

  if (activeGoal) {
    if (goalType === 'cutting') {
      recommendations.push(`Aiming for ${activeGoal.weeklyGoal || 1}lb per week weight loss`);
      recommendations.push('Prioritize protein to preserve muscle mass');
    } else if (goalType === 'bulking') {
      recommendations.push(`Aiming for ${activeGoal.weeklyGoal || 0.5}lb per week muscle gain`);
      recommendations.push('Focus on progressive overload in training');
    } else {
      recommendations.push('Maintaining current weight and body composition');
      recommendations.push('Focus on consistency and sustainable habits');
    }
  }

  return {
    targetCalories,
    proteinTarget: macros.protein,
    carbsTarget: macros.carbs,
    fatsTarget: macros.fats,
    adjustedForCycle,
    adjustedForGoal,
    cycleModifier,
    goalModifier,
    recommendations
  };
}

// Get user's current cycle phase (placeholder - would integrate with actual cycle tracking)
export function getCurrentCyclePhase(userId: string): CyclePhase | null {
  // This would integrate with actual cycle tracking system
  // For now, return null (no cycle data available)
  return null;
}

// Calculate weekly averages and provide feedback
export interface WeeklyProgress {
  averageCalories: number;
  averageProtein: number;
  targetMet: boolean;
  daysOnTrack: number;
  feedback: string;
}

export function calculateWeeklyProgress(
  dailyCalories: number[],
  targetCalories: number,
  dailyProtein: number[],
  targetProtein: number
): WeeklyProgress {
  const averageCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
  const averageProtein = dailyProtein.reduce((a, b) => a + b, 0) / dailyProtein.length;

  // Count days within 10% of target
  const daysOnTrack = dailyCalories.filter(cal => {
    const diff = Math.abs(cal - targetCalories) / targetCalories;
    return diff <= 0.10;
  }).length;

  const targetMet = averageCalories >= targetCalories * 0.9 && averageCalories <= targetCalories * 1.1;

  let feedback = '';
  if (targetMet) {
    feedback = 'Great work! You hit your targets this week 🎉';
  } else if (averageCalories < targetCalories * 0.9) {
    feedback = 'You were under target - make sure you are eating enough to fuel your body';
  } else {
    feedback = 'You were over target - consider adjusting portions or meal planning';
  }

  return {
    averageCalories: Math.round(averageCalories),
    averageProtein: Math.round(averageProtein),
    targetMet,
    daysOnTrack,
    feedback
  };
}
