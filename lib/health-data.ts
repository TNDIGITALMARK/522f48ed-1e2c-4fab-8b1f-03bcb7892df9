import { supabase, TENANT_ID, PROJECT_ID } from './supabase/client';

export interface HealthMetric {
  id: string;
  userId: string;
  dataType: 'steps' | 'distance' | 'activeMinutes' | 'caloriesBurned' | 'heartRate';
  value: number;
  unit: string;
  source: string;
  recordedAt: Date;
  syncedAt: Date;
}

export interface DailyHealthSummary {
  date: Date;
  steps: number;
  stepsGoal: number;
  distance: number;
  activeMinutes: number;
  caloriesBurned: number;
  heartRate?: number;
}

/**
 * Save health data to localStorage
 * In production, this would sync with Apple Health via HealthKit
 */
export function saveHealthData(userId: string, data: Partial<DailyHealthSummary>): void {
  const today = new Date().toISOString().split('T')[0];
  const key = `healthData_${userId}_${today}`;

  const existing = localStorage.getItem(key);
  const currentData = existing ? JSON.parse(existing) : {};

  const updated = {
    ...currentData,
    ...data,
    lastSync: new Date().toISOString()
  };

  localStorage.setItem(key, JSON.stringify(updated));
  localStorage.setItem(`healthData_${userId}_latest`, JSON.stringify(updated));
}

/**
 * Load today's health data
 */
export function loadTodayHealthData(userId: string): DailyHealthSummary | null {
  try {
    const latest = localStorage.getItem(`healthData_${userId}_latest`);
    if (latest) {
      return JSON.parse(latest);
    }
  } catch (error) {
    console.error('Error loading health data:', error);
  }
  return null;
}

/**
 * Check if Apple Health is connected
 */
export function isHealthConnected(userId: string): boolean {
  const connected = localStorage.getItem(`healthConnected_${userId}`);
  return connected === 'true';
}

/**
 * Set Apple Health connection status
 */
export function setHealthConnected(userId: string, connected: boolean): void {
  localStorage.setItem(`healthConnected_${userId}`, connected.toString());
  if (connected) {
    localStorage.setItem(`healthConnectedAt_${userId}`, new Date().toISOString());
  }
}

/**
 * Simulate Apple Health sync
 * In production, this would use HealthKit APIs
 */
export async function syncAppleHealth(userId: string): Promise<DailyHealthSummary> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate realistic data
  const currentData = loadTodayHealthData(userId);
  const baseSteps = currentData?.steps || 7000;

  const synced: DailyHealthSummary = {
    date: new Date(),
    steps: baseSteps + Math.floor(Math.random() * 200),
    stepsGoal: 10000,
    distance: (baseSteps / 1300), // ~1300 steps per km
    activeMinutes: Math.floor(baseSteps / 160), // ~160 steps per active minute
    caloriesBurned: Math.floor(baseSteps * 0.04), // ~0.04 calories per step
    heartRate: 68 + Math.floor(Math.random() * 10),
  };

  saveHealthData(userId, synced);

  // TODO: Save to Supabase health_data table when fully operational
  // await supabase.from('health_data').insert({
  //   tenantid: TENANT_ID,
  //   projectid: PROJECT_ID,
  //   user_id: userId,
  //   data_type: 'steps',
  //   value: synced.steps,
  //   unit: 'count',
  //   source: 'Apple Health',
  //   recorded_at: new Date().toISOString(),
  // });

  return synced;
}

/**
 * Get weekly health summary
 */
export function getWeeklyHealthSummary(userId: string): DailyHealthSummary[] {
  const summary: DailyHealthSummary[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const key = `healthData_${userId}_${dateKey}`;

    const stored = localStorage.getItem(key);
    if (stored) {
      summary.push(JSON.parse(stored));
    } else {
      // Generate placeholder data for missing days
      const baseSteps = 6000 + Math.floor(Math.random() * 4000);
      summary.push({
        date,
        steps: baseSteps,
        stepsGoal: 10000,
        distance: baseSteps / 1300,
        activeMinutes: Math.floor(baseSteps / 160),
        caloriesBurned: Math.floor(baseSteps * 0.04),
      });
    }
  }

  return summary;
}

/**
 * Calculate activity-adjusted calorie recommendations
 */
export function getActivityAdjustedCalories(
  baseCalories: number,
  steps: number,
  stepsGoal: number
): number {
  const activityLevel = steps / stepsGoal;

  if (activityLevel < 0.5) {
    // Low activity: reduce calories slightly
    return Math.round(baseCalories * 0.95);
  } else if (activityLevel >= 1.0) {
    // High activity: increase calories
    return Math.round(baseCalories * 1.1);
  } else {
    // Moderate activity: maintain base calories
    return baseCalories;
  }
}

/**
 * Get activity level description
 */
export function getActivityLevelDescription(steps: number): {
  level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  description: string;
  emoji: string;
} {
  if (steps < 5000) {
    return {
      level: 'sedentary',
      description: 'Low activity today',
      emoji: '🪑'
    };
  } else if (steps < 7500) {
    return {
      level: 'light',
      description: 'Light activity',
      emoji: '🚶'
    };
  } else if (steps < 10000) {
    return {
      level: 'moderate',
      description: 'Moderate activity',
      emoji: '🚶‍♀️'
    };
  } else if (steps < 12500) {
    return {
      level: 'active',
      description: 'Active day!',
      emoji: '🏃'
    };
  } else {
    return {
      level: 'very-active',
      description: 'Very active day!',
      emoji: '🏃‍♀️'
    };
  }
}
