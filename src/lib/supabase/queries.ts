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
