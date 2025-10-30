/**
 * Centralized User Profile Store
 *
 * This store manages all user profile data and automatically syncs
 * across dashboard, profile, nutrition, and all other pages.
 * When you update data anywhere in the app, it propagates everywhere.
 */

import { type HeightValue } from './height-conversions';
import { type WeightUnit, type ActivityLevel, type GoalType } from './weight-tracking';
import { calculateCalories, type CalorieRecommendation } from './calorie-calculator';
import { getActiveGoal, getLatestWeight, addWeightLog } from './weight-tracking';

// User profile interface - the single source of truth
export interface UserProfile {
  userId: string;

  // Physical attributes
  height: HeightValue;
  weight: number;
  weightUnit: WeightUnit;
  age: number;
  sex: 'male' | 'female';

  // Activity and goals
  activityLevel: ActivityLevel;
  goalType?: GoalType;
  targetWeight?: number;
  weeklyWeightGoal?: number;

  // Nutrition tracking
  dailyCalories?: number;
  weeklyCalories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;

  // Hydration
  waterGoal: number; // glasses per day
  waterConsumed: number;

  // Wellness metrics
  stepsGoal: number;
  stepsCompleted: number;
  meditationGoal: number; // minutes per day
  meditationCompleted: number;
  sleepHours?: number;

  // Timestamps
  lastUpdated: string;
  createdAt: string;
}

// Nutrition tracking data
export interface NutritionData {
  date: string; // ISO date string
  meals: {
    breakfast?: MealEntry;
    lunch?: MealEntry;
    dinner?: MealEntry;
    snacks?: MealEntry[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number; // glasses
}

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize?: string;
  quantity?: number;
}

// Storage keys
const USER_PROFILE_KEY = 'bloom_user_profile';
const NUTRITION_DATA_KEY = 'bloom_nutrition_data';
const PROFILE_UPDATE_EVENT = 'bloom_profile_updated';
const NUTRITION_UPDATE_EVENT = 'bloom_nutrition_updated';

// Type for update listeners
type ProfileUpdateListener = (profile: UserProfile) => void;
type NutritionUpdateListener = (nutrition: NutritionData[]) => void;

// Store for listeners
const profileListeners: Set<ProfileUpdateListener> = new Set();
const nutritionListeners: Set<NutritionUpdateListener> = new Set();

/**
 * Get user profile from storage
 */
export function getUserProfile(userId: string): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(`${USER_PROFILE_KEY}_${userId}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Get or create default user profile
 */
export function getOrCreateProfile(userId: string): UserProfile {
  const existing = getUserProfile(userId);
  if (existing) return existing;

  // Create default profile
  const defaultProfile: UserProfile = {
    userId,
    height: { value: 67, unit: 'in' }, // 5'7" default
    weight: 150,
    weightUnit: 'lbs',
    age: 30,
    sex: 'female',
    activityLevel: 'moderate',
    waterGoal: 8,
    waterConsumed: 0,
    stepsGoal: 10000,
    stepsCompleted: 0,
    meditationGoal: 15,
    meditationCompleted: 0,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  saveUserProfile(defaultProfile);
  return defaultProfile;
}

/**
 * Save user profile and trigger sync across all pages
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;

  // Update timestamp
  profile.lastUpdated = new Date().toISOString();

  // Save to localStorage
  localStorage.setItem(`${USER_PROFILE_KEY}_${profile.userId}`, JSON.stringify(profile));

  // Trigger storage event for cross-tab sync
  window.dispatchEvent(new StorageEvent('storage', {
    key: `${USER_PROFILE_KEY}_${profile.userId}`,
    newValue: JSON.stringify(profile),
    storageArea: localStorage
  }));

  // Notify all listeners
  notifyProfileListeners(profile);

  // Trigger custom event for same-page updates
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATE_EVENT, { detail: profile }));
}

/**
 * Update user profile with partial data
 */
export function updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
  const profile = getOrCreateProfile(userId);
  const updated = { ...profile, ...updates, userId }; // Ensure userId doesn't change
  saveUserProfile(updated);
  return updated;
}

/**
 * Update physical attributes (height, weight, age)
 * Automatically recalculates calories and syncs to dashboard
 */
export function updatePhysicalAttributes(
  userId: string,
  updates: {
    height?: HeightValue;
    weight?: number;
    weightUnit?: WeightUnit;
    age?: number;
  }
): UserProfile {
  const profile = getOrCreateProfile(userId);

  // Update physical attributes
  if (updates.height) profile.height = updates.height;
  if (updates.weight !== undefined) profile.weight = updates.weight;
  if (updates.weightUnit) profile.weightUnit = updates.weightUnit;
  if (updates.age !== undefined) profile.age = updates.age;

  // If weight changed, add to weight tracking
  if (updates.weight !== undefined && updates.weight !== profile.weight) {
    addWeightLog(
      userId,
      updates.weight,
      updates.weightUnit || profile.weightUnit,
      'Auto-logged from profile update',
      profile.height.unit === 'in' ? profile.height.value : undefined,
      profile.height.unit === 'in' ? 'inches' : 'cm'
    );
  }

  // Recalculate calories if we have enough data
  const updated = recalculateCalories(profile);
  saveUserProfile(updated);

  return updated;
}

/**
 * Update fitness goals and recalculate calories
 */
export function updateFitnessGoals(
  userId: string,
  updates: {
    goalType?: GoalType;
    targetWeight?: number;
    weeklyWeightGoal?: number;
    activityLevel?: ActivityLevel;
  }
): UserProfile {
  const profile = getOrCreateProfile(userId);

  // Update goals
  if (updates.goalType) profile.goalType = updates.goalType;
  if (updates.targetWeight !== undefined) profile.targetWeight = updates.targetWeight;
  if (updates.weeklyWeightGoal !== undefined) profile.weeklyWeightGoal = updates.weeklyWeightGoal;
  if (updates.activityLevel) profile.activityLevel = updates.activityLevel;

  // Recalculate calories
  const updated = recalculateCalories(profile);
  saveUserProfile(updated);

  return updated;
}

/**
 * Recalculate calorie targets based on current profile
 */
function recalculateCalories(profile: UserProfile): UserProfile {
  // Need minimum data to calculate
  if (!profile.goalType || !profile.targetWeight) {
    return profile;
  }

  // Get height in inches
  const heightInches = profile.height.unit === 'in'
    ? profile.height.value
    : profile.height.value / 2.54;

  const recommendation = calculateCalories({
    currentWeight: profile.weight,
    targetWeight: profile.targetWeight,
    weightUnit: profile.weightUnit,
    heightInches,
    age: profile.age,
    sex: profile.sex,
    goalType: profile.goalType,
    weeklyWeightGoal: profile.weeklyWeightGoal,
    activityLevel: profile.activityLevel
  });

  // Update profile with new calorie targets
  profile.dailyCalories = recommendation.dailyCalories;
  profile.weeklyCalories = recommendation.weeklyCalories;
  profile.proteinGrams = recommendation.proteinGrams;
  profile.carbsGrams = recommendation.carbsGrams;
  profile.fatGrams = recommendation.fatGrams;

  return profile;
}

/**
 * Get current calorie recommendation
 */
export function getCurrentCalorieRecommendation(userId: string): CalorieRecommendation | null {
  const profile = getUserProfile(userId);
  if (!profile || !profile.goalType || !profile.targetWeight) {
    return null;
  }

  const heightInches = profile.height.unit === 'in'
    ? profile.height.value
    : profile.height.value / 2.54;

  return calculateCalories({
    currentWeight: profile.weight,
    targetWeight: profile.targetWeight,
    weightUnit: profile.weightUnit,
    heightInches,
    age: profile.age,
    sex: profile.sex,
    goalType: profile.goalType,
    weeklyWeightGoal: profile.weeklyWeightGoal,
    activityLevel: profile.activityLevel
  });
}

/**
 * Update daily wellness metrics (water, steps, meditation)
 */
export function updateWellnessMetrics(
  userId: string,
  updates: {
    waterConsumed?: number;
    stepsCompleted?: number;
    meditationCompleted?: number;
    sleepHours?: number;
  }
): UserProfile {
  return updateUserProfile(userId, updates);
}

/**
 * Subscribe to profile updates
 * Returns unsubscribe function
 */
export function subscribeToProfile(userId: string, callback: ProfileUpdateListener): () => void {
  profileListeners.add(callback);

  // Set up storage event listener for cross-tab sync
  const storageListener = (e: StorageEvent) => {
    if (e.key === `${USER_PROFILE_KEY}_${userId}` && e.newValue) {
      try {
        const profile = JSON.parse(e.newValue);
        callback(profile);
      } catch {
        // Ignore parse errors
      }
    }
  };

  // Set up custom event listener for same-page updates
  const customListener = ((e: CustomEvent<UserProfile>) => {
    if (e.detail.userId === userId) {
      callback(e.detail);
    }
  }) as EventListener;

  window.addEventListener('storage', storageListener);
  window.addEventListener(PROFILE_UPDATE_EVENT, customListener);

  // Return unsubscribe function
  return () => {
    profileListeners.delete(callback);
    window.removeEventListener('storage', storageListener);
    window.removeEventListener(PROFILE_UPDATE_EVENT, customListener);
  };
}

/**
 * Notify all profile listeners
 */
function notifyProfileListeners(profile: UserProfile): void {
  profileListeners.forEach(listener => {
    try {
      listener(profile);
    } catch (error) {
      console.error('Error in profile listener:', error);
    }
  });
}

/**
 * Nutrition Data Management
 */

/**
 * Get nutrition data for a date range
 */
export function getNutritionData(userId: string, startDate?: Date, endDate?: Date): NutritionData[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(`${NUTRITION_DATA_KEY}_${userId}`);
  if (!stored) return [];

  try {
    const allData: NutritionData[] = JSON.parse(stored);

    if (!startDate && !endDate) return allData;

    return allData.filter(data => {
      const dataDate = new Date(data.date);
      if (startDate && dataDate < startDate) return false;
      if (endDate && dataDate > endDate) return false;
      return true;
    });
  } catch {
    return [];
  }
}

/**
 * Get today's nutrition data
 */
export function getTodaysNutrition(userId: string): NutritionData | null {
  const today = new Date().toISOString().split('T')[0];
  const data = getNutritionData(userId);
  return data.find(d => d.date === today) || null;
}

/**
 * Save nutrition data for a specific date
 */
export function saveNutritionData(userId: string, nutritionData: NutritionData): void {
  if (typeof window === 'undefined') return;

  const allData = getNutritionData(userId);
  const existingIndex = allData.findIndex(d => d.date === nutritionData.date);

  if (existingIndex >= 0) {
    allData[existingIndex] = nutritionData;
  } else {
    allData.push(nutritionData);
  }

  // Sort by date descending
  allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  localStorage.setItem(`${NUTRITION_DATA_KEY}_${userId}`, JSON.stringify(allData));

  // Notify listeners
  notifyNutritionListeners(allData);

  // Trigger custom event
  window.dispatchEvent(new CustomEvent(NUTRITION_UPDATE_EVENT, { detail: allData }));
}

/**
 * Add a meal to today's nutrition
 */
export function addMealToToday(
  userId: string,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
  meal: MealEntry
): NutritionData {
  const today = new Date().toISOString().split('T')[0];
  const existing = getTodaysNutrition(userId);

  const nutritionData: NutritionData = existing || {
    date: today,
    meals: {},
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    waterIntake: 0
  };

  // Add meal
  if (mealType === 'snacks') {
    nutritionData.meals.snacks = [...(nutritionData.meals.snacks || []), meal];
  } else {
    nutritionData.meals[mealType] = meal;
  }

  // Recalculate totals
  nutritionData.totalCalories += meal.calories;
  nutritionData.totalProtein += meal.protein;
  nutritionData.totalCarbs += meal.carbs;
  nutritionData.totalFat += meal.fat;

  saveNutritionData(userId, nutritionData);
  return nutritionData;
}

/**
 * Subscribe to nutrition updates
 */
export function subscribeToNutrition(userId: string, callback: NutritionUpdateListener): () => void {
  nutritionListeners.add(callback);

  const customListener = ((e: CustomEvent<NutritionData[]>) => {
    callback(e.detail);
  }) as EventListener;

  window.addEventListener(NUTRITION_UPDATE_EVENT, customListener);

  return () => {
    nutritionListeners.delete(callback);
    window.removeEventListener(NUTRITION_UPDATE_EVENT, customListener);
  };
}

/**
 * Notify all nutrition listeners
 */
function notifyNutritionListeners(data: NutritionData[]): void {
  nutritionListeners.forEach(listener => {
    try {
      listener(data);
    } catch (error) {
      console.error('Error in nutrition listener:', error);
    }
  });
}

/**
 * Sync data from weight tracking system into profile
 * Call this to ensure profile stays in sync with weight logs
 */
export function syncWeightDataToProfile(userId: string): UserProfile {
  const profile = getOrCreateProfile(userId);
  const latestWeight = getLatestWeight(userId);
  const activeGoal = getActiveGoal(userId);

  if (latestWeight) {
    profile.weight = latestWeight.weight;
    profile.weightUnit = latestWeight.unit;
  }

  if (activeGoal) {
    profile.goalType = activeGoal.goalType;
    profile.targetWeight = activeGoal.targetWeight;
    profile.weeklyWeightGoal = activeGoal.weeklyGoal;
  }

  const updated = recalculateCalories(profile);
  saveUserProfile(updated);

  return updated;
}

/**
 * Get weekly nutrition summary
 */
export function getWeeklyNutritionSummary(userId: string): {
  totalCalories: number;
  averageCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  daysLogged: number;
} {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekData = getNutritionData(userId, weekAgo);

  const summary = weekData.reduce((acc, day) => {
    acc.totalCalories += day.totalCalories;
    acc.totalProtein += day.totalProtein;
    acc.totalCarbs += day.totalCarbs;
    acc.totalFat += day.totalFat;
    return acc;
  }, {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });

  return {
    ...summary,
    averageCalories: weekData.length > 0 ? summary.totalCalories / weekData.length : 0,
    daysLogged: weekData.length
  };
}
