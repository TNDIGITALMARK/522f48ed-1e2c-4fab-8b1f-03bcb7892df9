// Weight Tracking Library
// Provides functions for managing user weight logs and fitness goals

export type WeightUnit = 'lbs' | 'kg';
export type GoalType = 'cutting' | 'bulking' | 'maintaining';

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  unit: WeightUnit;
  loggedAt: string;
  notes?: string;
}

export interface WeightGoal {
  id: string;
  userId: string;
  goalType: GoalType;
  currentWeight: number;
  targetWeight: number;
  weightUnit: WeightUnit;
  weeklyGoal?: number;
  createdAt: string;
  isActive: boolean;
}

export interface GoalProgress {
  currentWeight: number;
  targetWeight: number;
  weightChange: number;
  percentComplete: number;
  onTrack: boolean;
}

export interface WeightChange {
  change: number;
  period: string;
  unit: WeightUnit;
}

export interface GoalTypeInfo {
  label: string;
  icon: string;
  description: string;
}

// Local storage keys
const WEIGHT_LOGS_KEY = 'bloom_weight_logs';
const WEIGHT_GOALS_KEY = 'bloom_weight_goals';

// Helper function to get data from localStorage
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Helper function to save data to localStorage
function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Add a new weight log
export async function addWeightLog(
  userId: string,
  weight: number,
  unit: WeightUnit,
  notes?: string
): Promise<WeightLog> {
  const newLog: WeightLog = {
    id: Date.now().toString(),
    userId,
    weight,
    unit,
    loggedAt: new Date().toISOString(),
    notes,
  };

  const logs = getFromStorage<WeightLog>(WEIGHT_LOGS_KEY);
  logs.push(newLog);
  saveToStorage(WEIGHT_LOGS_KEY, logs);

  return newLog;
}

// Load all weight logs for a user
export function loadWeightLogs(userId: string): WeightLog[] {
  const logs = getFromStorage<WeightLog>(WEIGHT_LOGS_KEY);
  return logs
    .filter((log) => log.userId === userId)
    .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
}

// Get the latest weight log for a user
export function getLatestWeight(userId: string): WeightLog | null {
  const logs = loadWeightLogs(userId);
  return logs.length > 0 ? logs[0] : null;
}

// Get weight trend over a period of days
export function getWeightTrend(userId: string, days: number): WeightLog[] {
  const logs = loadWeightLogs(userId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return logs.filter((log) => new Date(log.loggedAt) >= cutoffDate);
}

// Calculate weight change over a period
export function calculateWeightChange(userId: string, days: number = 30): WeightChange | null {
  const trend = getWeightTrend(userId, days);

  if (trend.length < 2) return null;

  const latest = trend[0];
  const oldest = trend[trend.length - 1];
  const change = latest.weight - oldest.weight;

  return {
    change,
    period: `${days} days`,
    unit: latest.unit,
  };
}

// Set or update a user's goal
export async function setUserGoal(
  userId: string,
  goalType: GoalType,
  params: {
    currentWeight: number;
    targetWeight: number;
    weightUnit: WeightUnit;
    weeklyGoal?: number;
  }
): Promise<WeightGoal> {
  const goals = getFromStorage<WeightGoal>(WEIGHT_GOALS_KEY);

  // Deactivate existing goals for this user
  goals.forEach((goal) => {
    if (goal.userId === userId) {
      goal.isActive = false;
    }
  });

  const newGoal: WeightGoal = {
    id: Date.now().toString(),
    userId,
    goalType,
    currentWeight: params.currentWeight,
    targetWeight: params.targetWeight,
    weightUnit: params.weightUnit,
    weeklyGoal: params.weeklyGoal,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  goals.push(newGoal);
  saveToStorage(WEIGHT_GOALS_KEY, goals);

  return newGoal;
}

// Get the active goal for a user
export function getActiveGoal(userId: string): WeightGoal | null {
  const goals = getFromStorage<WeightGoal>(WEIGHT_GOALS_KEY);
  const activeGoal = goals.find((goal) => goal.userId === userId && goal.isActive);
  return activeGoal || null;
}

// Calculate progress toward a goal
export function calculateGoalProgress(userId: string): GoalProgress | null {
  const goal = getActiveGoal(userId);
  const latestWeight = getLatestWeight(userId);

  if (!goal || !latestWeight) return null;

  const totalChange = goal.targetWeight - goal.currentWeight;
  const currentChange = latestWeight.weight - goal.currentWeight;
  const percentComplete = totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;

  // Determine if on track based on weekly goal
  let onTrack = true;
  if (goal.weeklyGoal) {
    const weeksSinceStart = Math.max(
      1,
      (new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    const expectedChange = goal.weeklyGoal * weeksSinceStart;
    const actualChange = Math.abs(currentChange);

    // Allow 20% variance
    onTrack = actualChange >= expectedChange * 0.8;
  }

  return {
    currentWeight: latestWeight.weight,
    targetWeight: goal.targetWeight,
    weightChange: currentChange,
    percentComplete,
    onTrack,
  };
}

// Get information about a goal type
export function getGoalTypeInfo(goalType: GoalType): GoalTypeInfo {
  const goalTypes: Record<GoalType, GoalTypeInfo> = {
    cutting: {
      label: 'Cutting',
      icon: '📉',
      description: 'Lose weight and reduce body fat',
    },
    bulking: {
      label: 'Bulking',
      icon: '📈',
      description: 'Gain muscle mass and strength',
    },
    maintaining: {
      label: 'Maintaining',
      icon: '⚖️',
      description: 'Maintain current weight and body composition',
    },
  };

  return goalTypes[goalType];
}

// Format weight for display
export function formatWeight(weight: number, unit: WeightUnit, decimals: number = 1): string {
  return `${weight.toFixed(decimals)} ${unit}`;
}

// Delete a weight log
export function deleteWeightLog(userId: string, logId: string): void {
  const logs = getFromStorage<WeightLog>(WEIGHT_LOGS_KEY);
  const filteredLogs = logs.filter((log) => !(log.userId === userId && log.id === logId));
  saveToStorage(WEIGHT_LOGS_KEY, filteredLogs);
}
