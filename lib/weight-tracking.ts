import { supabase, TENANT_ID, PROJECT_ID } from './supabase/client';

export type GoalType = 'cutting' | 'bulking' | 'maintaining';
export type WeightUnit = 'lbs' | 'kg';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  unit: WeightUnit;
  notes?: string;
  loggedAt: Date;
  createdAt: Date;
}

export interface UserGoal {
  id: string;
  userId: string;
  goalType: GoalType;
  currentWeight?: number;
  targetWeight?: number;
  weightUnit: WeightUnit;
  targetDate?: Date;
  weeklyGoal?: number; // pounds per week
  activityLevel?: ActivityLevel;
  isActive: boolean;
  startedAt: Date;
  completedAt?: Date;
}

/**
 * Get weight tracking key for localStorage
 */
function getWeightLogKey(userId: string): string {
  return `weightLogs_${userId}`;
}

/**
 * Get goal key for localStorage
 */
function getGoalKey(userId: string): string {
  return `userGoals_${userId}`;
}

/**
 * Load all weight logs for a user
 */
export function loadWeightLogs(userId: string): WeightLog[] {
  try {
    const stored = localStorage.getItem(getWeightLogKey(userId));
    if (stored) {
      const logs = JSON.parse(stored);
      return logs.map((log: any) => ({
        ...log,
        loggedAt: new Date(log.loggedAt),
        createdAt: new Date(log.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading weight logs:', error);
  }
  return [];
}

/**
 * Add a new weight log
 */
export async function addWeightLog(
  userId: string,
  weight: number,
  unit: WeightUnit = 'lbs',
  notes?: string
): Promise<WeightLog> {
  const newLog: WeightLog = {
    id: `weight_${Date.now()}`,
    userId,
    weight,
    unit,
    notes,
    loggedAt: new Date(),
    createdAt: new Date()
  };

  const existing = loadWeightLogs(userId);
  const updated = [newLog, ...existing];
  localStorage.setItem(getWeightLogKey(userId), JSON.stringify(updated));

  // TODO: Sync to Supabase when tables are operational
  // try {
  //   await supabase.from('weight_logs').insert({
  //     tenantid: TENANT_ID,
  //     projectid: PROJECT_ID,
  //     user_id: userId,
  //     weight,
  //     unit,
  //     notes,
  //     logged_at: newLog.loggedAt.toISOString()
  //   });
  // } catch (error) {
  //   console.error('Failed to sync weight log to Supabase:', error);
  // }

  return newLog;
}

/**
 * Update a weight log
 */
export function updateWeightLog(
  userId: string,
  logId: string,
  updates: Partial<Omit<WeightLog, 'id' | 'userId' | 'createdAt'>>
): WeightLog | null {
  const logs = loadWeightLogs(userId);
  const index = logs.findIndex(log => log.id === logId);
  
  if (index === -1) return null;

  const updated = {
    ...logs[index],
    ...updates
  };

  logs[index] = updated;
  localStorage.setItem(getWeightLogKey(userId), JSON.stringify(logs));

  return updated;
}

/**
 * Delete a weight log
 */
export function deleteWeightLog(userId: string, logId: string): boolean {
  const logs = loadWeightLogs(userId);
  const filtered = logs.filter(log => log.id !== logId);
  
  if (filtered.length === logs.length) return false;

  localStorage.setItem(getWeightLogKey(userId), JSON.stringify(filtered));
  return true;
}

/**
 * Get the latest weight log
 */
export function getLatestWeight(userId: string): WeightLog | null {
  const logs = loadWeightLogs(userId);
  if (logs.length === 0) return null;
  
  // Logs are stored newest first
  return logs[0];
}

/**
 * Get weight logs for a specific date range
 */
export function getWeightLogsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): WeightLog[] {
  const logs = loadWeightLogs(userId);
  return logs.filter(log => {
    const logDate = new Date(log.loggedAt);
    return logDate >= startDate && logDate <= endDate;
  });
}

/**
 * Get weight trend (last 30 days)
 */
export function getWeightTrend(userId: string, days: number = 30): WeightLog[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return getWeightLogsByDateRange(userId, startDate, endDate)
    .sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
}

/**
 * Calculate weight change
 */
export function calculateWeightChange(userId: string): {
  change: number;
  changePercent: number;
  period: string;
} | null {
  const logs = loadWeightLogs(userId);
  if (logs.length < 2) return null;

  const latest = logs[0];
  const oldest = logs[logs.length - 1];
  
  const change = latest.weight - oldest.weight;
  const changePercent = (change / oldest.weight) * 100;
  
  const daysDiff = Math.floor(
    (latest.loggedAt.getTime() - oldest.loggedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return {
    change,
    changePercent,
    period: `${daysDiff} days`
  };
}

/**
 * Load user goals
 */
export function loadUserGoals(userId: string): UserGoal[] {
  try {
    const stored = localStorage.getItem(getGoalKey(userId));
    if (stored) {
      const goals = JSON.parse(stored);
      return goals.map((goal: any) => ({
        ...goal,
        startedAt: new Date(goal.startedAt),
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading user goals:', error);
  }
  return [];
}

/**
 * Get active goal
 */
export function getActiveGoal(userId: string): UserGoal | null {
  const goals = loadUserGoals(userId);
  return goals.find(goal => goal.isActive) || null;
}

/**
 * Create or update user goal
 */
export async function setUserGoal(
  userId: string,
  goalType: GoalType,
  options: {
    currentWeight?: number;
    targetWeight?: number;
    weightUnit?: WeightUnit;
    targetDate?: Date;
    weeklyGoal?: number;
    activityLevel?: ActivityLevel;
  }
): Promise<UserGoal> {
  // Deactivate existing goals
  const existingGoals = loadUserGoals(userId);
  const deactivated = existingGoals.map(goal => ({
    ...goal,
    isActive: false,
    completedAt: goal.isActive ? new Date() : goal.completedAt
  }));

  const newGoal: UserGoal = {
    id: `goal_${Date.now()}`,
    userId,
    goalType,
    currentWeight: options.currentWeight,
    targetWeight: options.targetWeight,
    weightUnit: options.weightUnit || 'lbs',
    targetDate: options.targetDate,
    weeklyGoal: options.weeklyGoal,
    activityLevel: options.activityLevel,
    isActive: true,
    startedAt: new Date()
  };

  const updated = [newGoal, ...deactivated];
  localStorage.setItem(getGoalKey(userId), JSON.stringify(updated));

  // TODO: Sync to Supabase when tables are operational
  // try {
  //   await supabase.from('user_goals').insert({
  //     tenantid: TENANT_ID,
  //     projectid: PROJECT_ID,
  //     user_id: userId,
  //     goal_type: goalType,
  //     current_weight: options.currentWeight,
  //     target_weight: options.targetWeight,
  //     weight_unit: options.weightUnit || 'lbs',
  //     target_date: options.targetDate?.toISOString(),
  //     weekly_goal: options.weeklyGoal,
  //     activity_level: options.activityLevel
  //   });
  // } catch (error) {
  //   console.error('Failed to sync goal to Supabase:', error);
  // }

  return newGoal;
}

/**
 * Update existing goal
 */
export function updateGoal(
  userId: string,
  goalId: string,
  updates: Partial<Omit<UserGoal, 'id' | 'userId' | 'startedAt'>>
): UserGoal | null {
  const goals = loadUserGoals(userId);
  const index = goals.findIndex(goal => goal.id === goalId);
  
  if (index === -1) return null;

  const updated = {
    ...goals[index],
    ...updates
  };

  goals[index] = updated;
  localStorage.setItem(getGoalKey(userId), JSON.stringify(goals));

  return updated;
}

/**
 * Calculate progress toward goal
 */
export function calculateGoalProgress(userId: string): {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  totalChange: number;
  totalGoal: number;
  percentComplete: number;
  onTrack: boolean;
  daysElapsed: number;
  daysRemaining: number | null;
} | null {
  const goal = getActiveGoal(userId);
  if (!goal || !goal.targetWeight) return null;

  const latestLog = getLatestWeight(userId);
  if (!latestLog) return null;

  const startWeight = goal.currentWeight || latestLog.weight;
  const currentWeight = latestLog.weight;
  const targetWeight = goal.targetWeight;

  const totalChange = currentWeight - startWeight;
  const totalGoal = targetWeight - startWeight;
  const percentComplete = (totalChange / totalGoal) * 100;

  const daysElapsed = Math.floor(
    (new Date().getTime() - goal.startedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  let daysRemaining: number | null = null;
  if (goal.targetDate) {
    daysRemaining = Math.floor(
      (goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Check if on track based on weekly goal
  let onTrack = true;
  if (goal.weeklyGoal && daysElapsed > 0) {
    const weeksElapsed = daysElapsed / 7;
    const expectedChange = goal.weeklyGoal * weeksElapsed;
    const actualChange = Math.abs(totalChange);
    onTrack = actualChange >= expectedChange * 0.8; // 80% tolerance
  }

  return {
    startWeight,
    currentWeight,
    targetWeight,
    totalChange,
    totalGoal,
    percentComplete,
    onTrack,
    daysElapsed,
    daysRemaining
  };
}

/**
 * Get goal type display info
 */
export function getGoalTypeInfo(goalType: GoalType): {
  label: string;
  description: string;
  icon: string;
  color: string;
} {
  switch (goalType) {
    case 'cutting':
      return {
        label: 'Cutting',
        description: 'Lose weight while maintaining muscle mass',
        icon: '📉',
        color: 'text-secondary'
      };
    case 'bulking':
      return {
        label: 'Bulking',
        description: 'Gain muscle mass and strength',
        icon: '📈',
        color: 'text-primary'
      };
    case 'maintaining':
      return {
        label: 'Maintaining',
        description: 'Maintain current weight and composition',
        icon: '⚖️',
        color: 'text-accent-foreground'
      };
  }
}

/**
 * Convert weight between units
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight * 0.453592;
  }
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  }
  
  return weight;
}

/**
 * Format weight for display
 */
export function formatWeight(weight: number, unit: WeightUnit, decimals: number = 1): string {
  return `${weight.toFixed(decimals)} ${unit}`;
}
