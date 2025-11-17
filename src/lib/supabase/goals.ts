import { supabase } from './client';

// Type Definitions
export interface Event {
  id: string;
  tenantid: string;
  projectid: string;
  title: string;
  description?: string;
  event_type: 'school' | 'work' | 'personal' | 'fitness' | 'wellness' | 'social';
  start_time: string;
  end_time: string;
  recurrence_rule?: string;
  location?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DailyGoal {
  id: string;
  tenantid: string;
  projectid: string;
  goal_date: string;
  title: string;
  description?: string;
  category?: 'fitness' | 'wellness' | 'nutrition' | 'productivity' | 'personal';
  target_value?: string;
  current_value?: string;
  completed: boolean;
  priority: number;
  auto_generated: boolean;
  source_event_ids?: string[];
  metadata?: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyGoal {
  id: string;
  tenantid: string;
  projectid: string;
  week_start: string;
  week_end: string;
  title: string;
  description?: string;
  category?: 'fitness' | 'wellness' | 'nutrition' | 'productivity' | 'personal';
  target_value?: string;
  current_value?: string;
  completed: boolean;
  priority: number;
  auto_generated: boolean;
  source_event_ids?: string[];
  daily_goal_ids?: string[];
  metadata?: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyGoal {
  id: string;
  tenantid: string;
  projectid: string;
  month_start: string;
  month_end: string;
  title: string;
  description?: string;
  category?: 'fitness' | 'wellness' | 'nutrition' | 'productivity' | 'personal';
  target_value?: string;
  current_value?: string;
  completed: boolean;
  priority: number;
  auto_generated: boolean;
  source_event_ids?: string[];
  weekly_goal_ids?: string[];
  metadata?: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

const TENANT_ID = 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2';
const PROJECT_ID = '522f48ed-1e2c-4fab-8b1f-03bcb7892df9';

// Event Queries
export async function getEvents(startDate?: string, endDate?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true });

  if (startDate) {
    query = query.gte('start_time', startDate);
  }
  if (endDate) {
    query = query.lte('start_time', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Event[];
}

export async function createEvent(event: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...event
    })
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

// Daily Goals Queries
export async function getDailyGoals(date: string) {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('goal_date', date)
    .order('priority', { ascending: false });

  if (error) throw error;
  return data as DailyGoal[];
}

export async function createDailyGoal(goal: Partial<DailyGoal>) {
  const { data, error } = await supabase
    .from('daily_goals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...goal
    })
    .select()
    .single();

  if (error) throw error;
  return data as DailyGoal;
}

export async function updateDailyGoal(id: string, updates: Partial<DailyGoal>) {
  const { data, error } = await supabase
    .from('daily_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DailyGoal;
}

export async function toggleDailyGoal(id: string, completed: boolean) {
  return updateDailyGoal(id, {
    completed,
    completed_at: completed ? new Date().toISOString() : undefined
  });
}

// Weekly Goals Queries
export async function getWeeklyGoals(weekStart: string) {
  const { data, error } = await supabase
    .from('weekly_goals')
    .select('*')
    .eq('week_start', weekStart)
    .order('priority', { ascending: false });

  if (error) throw error;
  return data as WeeklyGoal[];
}

export async function createWeeklyGoal(goal: Partial<WeeklyGoal>) {
  const { data, error } = await supabase
    .from('weekly_goals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...goal
    })
    .select()
    .single();

  if (error) throw error;
  return data as WeeklyGoal;
}

export async function updateWeeklyGoal(id: string, updates: Partial<WeeklyGoal>) {
  const { data, error} = await supabase
    .from('weekly_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WeeklyGoal;
}

// Monthly Goals Queries
export async function getMonthlyGoals(monthStart: string) {
  const { data, error } = await supabase
    .from('monthly_goals')
    .select('*')
    .eq('month_start', monthStart)
    .order('priority', { ascending: false});

  if (error) throw error;
  return data as MonthlyGoal[];
}

export async function createMonthlyGoal(goal: Partial<MonthlyGoal>) {
  const { data, error } = await supabase
    .from('monthly_goals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...goal
    })
    .select()
    .single();

  if (error) throw error;
  return data as MonthlyGoal;
}

export async function updateMonthlyGoal(id: string, updates: Partial<MonthlyGoal>) {
  const { data, error } = await supabase
    .from('monthly_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as MonthlyGoal;
}

// Goal Generation Logic
export async function generateGoalsFromEvents(startDate: string, endDate: string) {
  const events = await getEvents(startDate, endDate);

  // Group events by date
  const eventsByDate: Record<string, Event[]> = {};
  events.forEach(event => {
    const date = event.start_time.split('T')[0];
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  // Generate daily goals for each date
  const dailyGoals: Partial<DailyGoal>[] = [];
  Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
    // Fitness goals from fitness events
    const fitnessEvents = dayEvents.filter(e => e.event_type === 'fitness');
    if (fitnessEvents.length > 0) {
      dailyGoals.push({
        goal_date: date,
        title: `Complete ${fitnessEvents.length} fitness session${fitnessEvents.length > 1 ? 's' : ''}`,
        category: 'fitness',
        priority: 4,
        auto_generated: true,
        source_event_ids: fitnessEvents.map(e => e.id),
        completed: false
      });
    }

    // Productivity goals from work/school events
    const productivityEvents = dayEvents.filter(e => e.event_type === 'work' || e.event_type === 'school');
    if (productivityEvents.length > 0) {
      dailyGoals.push({
        goal_date: date,
        title: `Attend ${productivityEvents.length} scheduled event${productivityEvents.length > 1 ? 's' : ''}`,
        description: productivityEvents.map(e => e.title).join(', '),
        category: 'productivity',
        priority: 5,
        auto_generated: true,
        source_event_ids: productivityEvents.map(e => e.id),
        completed: false
      });
    }

    // Wellness goals
    const wellnessEvents = dayEvents.filter(e => e.event_type === 'wellness');
    if (wellnessEvents.length > 0) {
      dailyGoals.push({
        goal_date: date,
        title: `Practice wellness activities`,
        description: wellnessEvents.map(e => e.title).join(', '),
        category: 'wellness',
        priority: 3,
        auto_generated: true,
        source_event_ids: wellnessEvents.map(e => e.id),
        completed: false
      });
    }
  });

  // Create the daily goals
  const createdGoals = await Promise.all(
    dailyGoals.map(goal => createDailyGoal(goal))
  );

  return createdGoals;
}
