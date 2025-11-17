/**
 * Calendar Events Supabase Queries
 * CRUD operations for color-coded calendar events
 */

import { supabase, TENANT_ID, PROJECT_ID } from './client';
import type {
  CalendarEvent,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../types/calendar-events';

/**
 * Get all calendar events for the current user/project
 */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }

  return data as CalendarEvent[];
}

/**
 * Get calendar events for a specific date range
 */
export async function getCalendarEventsByDateRange(
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('start_date', startDate)
    .lte('start_date', endDate)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events by date range:', error);
    throw error;
  }

  return data as CalendarEvent[];
}

/**
 * Get calendar events for a specific month
 */
export async function getCalendarEventsByMonth(
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  // Month is 0-indexed (0 = January)
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  return getCalendarEventsByDateRange(startDate, endDate);
}

/**
 * Get calendar events for a specific day
 */
export async function getCalendarEventsByDay(date: Date): Promise<CalendarEvent[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getCalendarEventsByDateRange(
    startOfDay.toISOString(),
    endOfDay.toISOString()
  );
}

/**
 * Get calendar events by category
 */
export async function getCalendarEventsByCategory(
  category: 'school' | 'work' | 'personal'
): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('category', category)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events by category:', error);
    throw error;
  }

  return data as CalendarEvent[];
}

/**
 * Get upcoming calendar events (from now onwards)
 */
export async function getUpcomingCalendarEvents(limit: number = 10): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('start_date', now)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming calendar events:', error);
    throw error;
  }

  return data as CalendarEvent[];
}

/**
 * Get a single calendar event by ID
 */
export async function getCalendarEventById(id: string): Promise<CalendarEvent | null> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No event found
    }
    console.error('Error fetching calendar event by ID:', error);
    throw error;
  }

  return data as CalendarEvent;
}

/**
 * Create a new calendar event
 */
export async function createCalendarEvent(
  input: CreateCalendarEventInput
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      title: input.title,
      description: input.description || null,
      category: input.category,
      color: input.color,
      start_date: input.start_date,
      end_date: input.end_date || null,
      all_day: input.all_day || false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }

  return data as CalendarEvent;
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(
  id: string,
  updates: UpdateCalendarEventInput
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }

  return data as CalendarEvent;
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(id: string): Promise<void> {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);

  if (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
}

/**
 * Get events count by category
 */
export async function getEventCountByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('category');

  if (error) {
    console.error('Error fetching event counts:', error);
    return { school: 0, work: 0, personal: 0 };
  }

  const counts: Record<string, number> = { school: 0, work: 0, personal: 0 };
  data.forEach((event: { category: string }) => {
    counts[event.category] = (counts[event.category] || 0) + 1;
  });

  return counts;
}
