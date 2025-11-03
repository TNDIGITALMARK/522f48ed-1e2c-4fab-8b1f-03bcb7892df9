/**
 * Health Profile Local Storage
 * Manages user health data from onboarding quiz and AI recommendations
 */

import { type HealthProfileData } from '@/components/onboarding-quiz';

export interface StoredHealthProfile extends HealthProfileData {
  userId: string;
  aiDietRecommendations?: AIRecommendations;
  aiWorkoutRecommendations?: AIRecommendations;
  lastAiUpdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendations {
  summary: string;
  recommendations: string[];
  focus_areas: string[];
  warnings: string[];
  meal_suggestions?: MealSuggestion[];
  workout_suggestions?: WorkoutSuggestion[];
}

export interface MealSuggestion {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  benefits: string[];
}

export interface WorkoutSuggestion {
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: string[];
  benefits: string[];
}

const STORAGE_KEY = 'bloom_health_profiles';

// Get all profiles from localStorage
function getAllProfiles(): Record<string, StoredHealthProfile> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save all profiles to localStorage
function saveAllProfiles(profiles: Record<string, StoredHealthProfile>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Failed to save health profiles:', error);
  }
}

// Get or create health profile for user
export function getOrCreateHealthProfile(userId: string): StoredHealthProfile {
  const profiles = getAllProfiles();

  if (profiles[userId]) {
    return profiles[userId];
  }

  // Create new profile with defaults
  const newProfile: StoredHealthProfile = {
    userId,
    dietary_restrictions: [],
    allergies: [],
    diseases: [],
    medications: [],
    fitness_level: 'beginner',
    diet_type: '',
    health_goals: [],
    custom_dietary: '',
    custom_allergies: '',
    custom_diseases: '',
    custom_medications: '',
    custom_goals: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  profiles[userId] = newProfile;
  saveAllProfiles(profiles);

  return newProfile;
}

// Update health profile
export function updateHealthProfile(
  userId: string,
  updates: Partial<StoredHealthProfile>
): StoredHealthProfile {
  const profiles = getAllProfiles();
  const existing = profiles[userId] || getOrCreateHealthProfile(userId);

  const updated: StoredHealthProfile = {
    ...existing,
    ...updates,
    userId,
    updatedAt: new Date().toISOString()
  };

  profiles[userId] = updated;
  saveAllProfiles(profiles);

  return updated;
}

// Save quiz results
export function saveQuizResults(userId: string, quizData: HealthProfileData): StoredHealthProfile {
  return updateHealthProfile(userId, {
    ...quizData,
    updatedAt: new Date().toISOString()
  });
}

// Update AI recommendations
export function updateAIRecommendations(
  userId: string,
  dietRecommendations: AIRecommendations,
  workoutRecommendations: AIRecommendations
): StoredHealthProfile {
  return updateHealthProfile(userId, {
    aiDietRecommendations: dietRecommendations,
    aiWorkoutRecommendations: workoutRecommendations,
    lastAiUpdate: new Date().toISOString()
  });
}

// Check if user needs onboarding
export function needsOnboarding(userId: string): boolean {
  const profile = getOrCreateHealthProfile(userId);
  // User needs onboarding if they haven't set their fitness level or have no goals
  return !profile.fitness_level || profile.health_goals.length === 0;
}

// Check if AI recommendations need update
export function needsAIUpdate(userId: string): boolean {
  const profile = getOrCreateHealthProfile(userId);

  if (!profile.lastAiUpdate) return true;

  // Update if older than 7 days
  const lastUpdate = new Date(profile.lastAiUpdate);
  const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceUpdate > 7;
}

// Get health profile
export function getHealthProfile(userId: string): StoredHealthProfile | null {
  const profiles = getAllProfiles();
  return profiles[userId] || null;
}

// Subscribe to profile changes
const subscribers: Record<string, Set<(profile: StoredHealthProfile) => void>> = {};

export function subscribeToHealthProfile(
  userId: string,
  callback: (profile: StoredHealthProfile) => void
): () => void {
  if (!subscribers[userId]) {
    subscribers[userId] = new Set();
  }

  subscribers[userId].add(callback);

  // Return unsubscribe function
  return () => {
    subscribers[userId]?.delete(callback);
  };
}

// Notify subscribers of changes
function notifySubscribers(userId: string, profile: StoredHealthProfile) {
  subscribers[userId]?.forEach(callback => {
    try {
      callback(profile);
    } catch (error) {
      console.error('Error in health profile subscriber:', error);
    }
  });
}

// Enhanced update function that notifies subscribers
export function updateHealthProfileWithNotify(
  userId: string,
  updates: Partial<StoredHealthProfile>
): StoredHealthProfile {
  const updated = updateHealthProfile(userId, updates);
  notifySubscribers(userId, updated);
  return updated;
}
