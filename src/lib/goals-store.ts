/**
 * Goals Local Storage
 * Manages user health and fitness goals
 */

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Predefined goal templates
export const GOAL_TEMPLATES = [
  { title: 'Drink 8 glasses of water daily', category: 'hydration', targetValue: 8, unit: 'glasses' },
  { title: 'Walk 10,000 steps daily', category: 'fitness', targetValue: 10000, unit: 'steps' },
  { title: 'Meditate for 10 minutes', category: 'mindfulness', targetValue: 10, unit: 'minutes' },
  { title: 'Get 8 hours of sleep', category: 'sleep', targetValue: 8, unit: 'hours' },
  { title: 'Eat 5 servings of vegetables', category: 'nutrition', targetValue: 5, unit: 'servings' },
  { title: 'Workout 4 times this week', category: 'fitness', targetValue: 4, unit: 'sessions' },
  { title: 'Practice gratitude journaling', category: 'mindfulness', targetValue: 1, unit: 'entry' },
  { title: 'Stretch for 15 minutes', category: 'flexibility', targetValue: 15, unit: 'minutes' },
  { title: 'Meal prep for the week', category: 'nutrition', targetValue: 7, unit: 'meals' },
  { title: 'Take vitamins/supplements', category: 'health', targetValue: 1, unit: 'dose' }
];

const STORAGE_KEY = 'bloom_goals';

// Get all goals from localStorage
function getAllGoals(): Record<string, Goal[]> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save all goals to localStorage
function saveAllGoals(goals: Record<string, Goal[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
}

// Get goals for user
export function getUserGoals(userId: string): Goal[] {
  const allGoals = getAllGoals();
  return allGoals[userId] || [];
}

// Get active (incomplete) goals
export function getActiveGoals(userId: string): Goal[] {
  return getUserGoals(userId).filter(goal => !goal.isCompleted);
}

// Get completed goals
export function getCompletedGoals(userId: string): Goal[] {
  return getUserGoals(userId).filter(goal => goal.isCompleted);
}

// Get goals by category
export function getGoalsByCategory(userId: string, category: string): Goal[] {
  return getUserGoals(userId).filter(goal => goal.category === category);
}

// Create new goal
export function createGoal(userId: string, goalData: Omit<Goal, 'id' | 'userId' | 'isCompleted' | 'createdAt' | 'updatedAt'>): Goal {
  const allGoals = getAllGoals();
  const userGoals = allGoals[userId] || [];

  const newGoal: Goal = {
    ...goalData,
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  userGoals.push(newGoal);
  allGoals[userId] = userGoals;
  saveAllGoals(allGoals);

  notifySubscribers(userId, userGoals);
  return newGoal;
}

// Create goal from template
export function createGoalFromTemplate(userId: string, template: typeof GOAL_TEMPLATES[number]): Goal {
  return createGoal(userId, {
    title: template.title,
    category: template.category,
    targetValue: template.targetValue,
    currentValue: 0,
    unit: template.unit
  });
}

// Update goal
export function updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Goal | null {
  const allGoals = getAllGoals();
  const userGoals = allGoals[userId] || [];

  const index = userGoals.findIndex(g => g.id === goalId);
  if (index === -1) return null;

  const updatedGoal: Goal = {
    ...userGoals[index],
    ...updates,
    id: goalId,
    userId,
    updatedAt: new Date().toISOString()
  };

  userGoals[index] = updatedGoal;
  allGoals[userId] = userGoals;
  saveAllGoals(allGoals);

  notifySubscribers(userId, userGoals);
  return updatedGoal;
}

// Update goal progress
export function updateGoalProgress(userId: string, goalId: string, currentValue: number): Goal | null {
  const goal = getUserGoals(userId).find(g => g.id === goalId);
  if (!goal) return null;

  const isCompleted = goal.targetValue ? currentValue >= goal.targetValue : false;

  return updateGoal(userId, goalId, {
    currentValue,
    isCompleted,
    completedAt: isCompleted && !goal.isCompleted ? new Date().toISOString() : goal.completedAt
  });
}

// Toggle goal completion
export function toggleGoalCompletion(userId: string, goalId: string): Goal | null {
  const goal = getUserGoals(userId).find(g => g.id === goalId);
  if (!goal) return null;

  return updateGoal(userId, goalId, {
    isCompleted: !goal.isCompleted,
    completedAt: !goal.isCompleted ? new Date().toISOString() : undefined,
    currentValue: !goal.isCompleted ? goal.targetValue : goal.currentValue
  });
}

// Delete goal
export function deleteGoal(userId: string, goalId: string): boolean {
  const allGoals = getAllGoals();
  const userGoals = allGoals[userId] || [];

  const filtered = userGoals.filter(g => g.id !== goalId);
  if (filtered.length === userGoals.length) return false;

  allGoals[userId] = filtered;
  saveAllGoals(allGoals);

  notifySubscribers(userId, filtered);
  return true;
}

// Subscribe to goal changes
const subscribers: Record<string, Set<(goals: Goal[]) => void>> = {};

export function subscribeToGoals(
  userId: string,
  callback: (goals: Goal[]) => void
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

// Notify subscribers
function notifySubscribers(userId: string, goals: Goal[]) {
  subscribers[userId]?.forEach(callback => {
    try {
      callback(goals);
    } catch (error) {
      console.error('Error in goals subscriber:', error);
    }
  });
}

// Get goal completion rate
export function getGoalCompletionRate(userId: string): number {
  const goals = getUserGoals(userId);
  if (goals.length === 0) return 0;

  const completed = goals.filter(g => g.isCompleted).length;
  return Math.round((completed / goals.length) * 100);
}

// Get today's goals
export function getTodaysGoals(userId: string): Goal[] {
  const goals = getActiveGoals(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return goals.filter(goal => {
    if (!goal.dueDate) return true; // Goals without due dates are always shown
    const dueDate = new Date(goal.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
}
