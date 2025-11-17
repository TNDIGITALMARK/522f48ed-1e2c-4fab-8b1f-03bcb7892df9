/**
 * Calendar Events Types
 * Color-coded events for school, work, and personal categories
 */

export type EventCategory = 'school' | 'work' | 'personal';

export interface CalendarEvent {
  id: string;
  tenantid: string;
  projectid: string;
  title: string;
  description?: string | null;
  category: EventCategory;
  color: string; // Hex color code
  start_date: string; // ISO date string
  end_date?: string | null; // ISO date string
  all_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  category: EventCategory;
  color: string;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
}

export interface UpdateCalendarEventInput {
  title?: string;
  description?: string;
  category?: EventCategory;
  color?: string;
  start_date?: string;
  end_date?: string;
  all_day?: boolean;
}

// Predefined colors for each category
export const CATEGORY_COLORS: Record<EventCategory, string[]> = {
  school: [
    '#60A5FA', // Blue
    '#3B82F6', // Darker Blue
    '#2563EB', // Deep Blue
    '#1D4ED8', // Navy Blue
  ],
  work: [
    '#F59E0B', // Amber
    '#D97706', // Orange
    '#B45309', // Dark Orange
    '#92400E', // Brown-Orange
  ],
  personal: [
    '#10B981', // Green
    '#059669', // Emerald
    '#047857', // Dark Emerald
    '#065F46', // Forest Green
  ],
};

// Default color for each category
export const DEFAULT_CATEGORY_COLORS: Record<EventCategory, string> = {
  school: '#60A5FA', // Light Blue
  work: '#F59E0B', // Amber
  personal: '#10B981', // Green
};
