import { supabase, TENANT_ID, PROJECT_ID } from './client';

// Types
export interface UserProfile {
  id: string;
  tenantid: string;
  projectid: string;
  user_email: string;
  full_name: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyWellnessLog {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  log_date: string;
  cycle_day: number | null;
  cycle_phase: string | null;
  mood_rating: number | null;
  energy_level: string | null;
  sleep_hours: number | null;
  sleep_quality: string | null;
  meditation_minutes: number;
  steps_count: number;
  water_glasses: number;
  calories_consumed: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WellnessGoal {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// User Profile Queries
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function createUserProfile(profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...profile,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Daily Wellness Log Queries
export async function getTodayWellnessLog(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_wellness_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data as DailyWellnessLog | null;
}

export async function getRecentWellnessLogs(userId: string, days: number = 7) {
  const { data, error } = await supabase
    .from('daily_wellness_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(days);

  if (error) throw error;
  return data as DailyWellnessLog[];
}

export async function createWellnessLog(log: Partial<DailyWellnessLog>) {
  const { data, error } = await supabase
    .from('daily_wellness_logs')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...log,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DailyWellnessLog;
}

export async function updateWellnessLog(id: string, updates: Partial<DailyWellnessLog>) {
  const { data, error } = await supabase
    .from('daily_wellness_logs')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DailyWellnessLog;
}

// Wellness Goals Queries
export async function getActiveGoals(userId: string) {
  const { data, error } = await supabase
    .from('wellness_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WellnessGoal[];
}

export async function createWellnessGoal(goal: Partial<WellnessGoal>) {
  const { data, error } = await supabase
    .from('wellness_goals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...goal,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WellnessGoal;
}

export async function updateGoalProgress(id: string, currentValue: number) {
  const { data: goal } = await supabase
    .from('wellness_goals')
    .select('target_value')
    .eq('id', id)
    .single();

  const completed = goal && currentValue >= goal.target_value;

  const { data, error } = await supabase
    .from('wellness_goals')
    .update({
      current_value: currentValue,
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WellnessGoal;
}

// Dashboard Summary
export async function getDashboardSummary(userId: string) {
  const [todayLog, recentLogs, activeGoals] = await Promise.all([
    getTodayWellnessLog(userId),
    getRecentWellnessLogs(userId, 7),
    getActiveGoals(userId),
  ]);

  // Calculate weekly streak
  const streak = recentLogs.filter(log => {
    const logDate = new Date(log.log_date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  return {
    todayLog,
    recentLogs,
    activeGoals,
    weeklyStreak: streak,
  };
}

// ============================================
// GROCERY LIST TYPES & QUERIES
// ============================================

export interface GroceryList {
  id: string;
  tenantid: string;
  projectid: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GroceryItem {
  id: string;
  tenantid: string;
  projectid: string;
  list_id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  checked: boolean;
  created_at: string;
}

export async function getGroceryLists() {
  const { data, error } = await supabase
    .from('grocery_lists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GroceryList[];
}

export async function createGroceryList(name: string = 'My Grocery List') {
  const { data, error } = await supabase
    .from('grocery_lists')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      name,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GroceryList;
}

export async function getGroceryItems(listId: string) {
  const { data, error } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as GroceryItem[];
}

export async function addGroceryItem(item: Omit<GroceryItem, 'id' | 'tenantid' | 'projectid' | 'created_at'>) {
  const { data, error } = await supabase
    .from('grocery_items')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...item,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GroceryItem;
}

export async function toggleGroceryItem(id: string, checked: boolean) {
  const { data, error } = await supabase
    .from('grocery_items')
    .update({ checked })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as GroceryItem;
}

export async function deleteGroceryItem(id: string) {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteGroceryList(id: string) {
  const { error } = await supabase
    .from('grocery_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// MEAL PLANNING TYPES & QUERIES
// ============================================

export interface MealPlan {
  id: string;
  tenantid: string;
  projectid: string;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  tenantid: string;
  projectid: string;
  meal_plan_id: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string | null;
  calories: number | null;
  protein: number | null;
  fiber: number | null;
  created_at: string;
}

export async function getCurrentWeekMealPlan() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const weekStart = monday.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('week_start_date', weekStart)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as MealPlan | null;
}

export async function createMealPlan(weekStartDate: string) {
  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      week_start_date: weekStartDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data as MealPlan;
}

export async function getMealsForPlan(mealPlanId: string) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('meal_plan_id', mealPlanId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Meal[];
}

export async function addMeal(meal: Omit<Meal, 'id' | 'tenantid' | 'projectid' | 'created_at'>) {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...meal,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Meal;
}

export async function updateMeal(id: string, updates: Partial<Meal>) {
  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Meal;
}

export async function deleteMeal(id: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// WORKOUT PLANNING TYPES & QUERIES
// ============================================

export interface WorkoutPlan {
  id: string;
  tenantid: string;
  projectid: string;
  name: string;
  description: string | null;
  phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal' | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  tenantid: string;
  projectid: string;
  workout_plan_id: string;
  name: string;
  description: string | null;
  muscle_group: string | null;
  equipment: string | null;
  order_index: number;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  tenantid: string;
  projectid: string;
  exercise_id: string;
  logged_at: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
}

export async function getWorkoutPlans(phase?: string) {
  let query = supabase
    .from('workout_plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (phase) {
    query = query.eq('phase', phase);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as WorkoutPlan[];
}

export async function createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'tenantid' | 'projectid' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...plan,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutPlan;
}

export async function getWorkoutExercises(workoutPlanId: string) {
  const { data, error } = await supabase
    .from('workout_exercises')
    .select('*')
    .eq('workout_plan_id', workoutPlanId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as WorkoutExercise[];
}

export async function addWorkoutExercise(exercise: Omit<WorkoutExercise, 'id' | 'tenantid' | 'projectid' | 'created_at'>) {
  const { data, error } = await supabase
    .from('workout_exercises')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...exercise,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutExercise;
}

export async function logWorkout(log: Omit<WorkoutLog, 'id' | 'tenantid' | 'projectid' | 'logged_at'>) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...log,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutLog;
}

export async function getWorkoutLogs(exerciseId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('logged_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WorkoutLog[];
}

export async function getRecentWorkoutLogs(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*, workout_exercises!inner(*)')
    .gte('logged_at', startDate.toISOString())
    .order('logged_at', { ascending: false });

  if (error) throw error;
  return data;
}
