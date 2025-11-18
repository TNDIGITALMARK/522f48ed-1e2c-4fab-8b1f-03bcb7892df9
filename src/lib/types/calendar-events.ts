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

// Color schemes for events
export type ColorScheme = 'brown' | 'blue' | 'pink' | 'green' | 'custom';

// Predefined color schemes with curated hex codes
export const COLOR_SCHEMES: Record<ColorScheme, string[]> = {
  brown: [
    '#8B6F47', // Warm brown
    '#A0826D', // Light brown
    '#6B5446', // Dark brown
    '#9B7653', // Medium brown
    '#7A5C4D', // Deep brown
  ],
  blue: [
    '#60A5FA', // Sky blue
    '#3B82F6', // Blue
    '#2563EB', // Deep blue
    '#1D4ED8', // Navy blue
    '#4F9CE8', // Medium blue
  ],
  pink: [
    '#F472B6', // Pink
    '#EC4899', // Hot pink
    '#DB2777', // Deep pink
    '#BE185D', // Dark pink
    '#E879B9', // Light pink
  ],
  green: [
    '#10B981', // Emerald
    '#059669', // Green
    '#047857', // Dark emerald
    '#065F46', // Forest green
    '#34D399', // Light green
  ],
  custom: [], // User-defined colors
};

// Get default color for a scheme
export function getDefaultColorForScheme(scheme: ColorScheme): string {
  const colors = COLOR_SCHEMES[scheme];
  return colors[0] || '#6B7280'; // Fallback to gray
}

// Get all colors for a scheme
export function getColorsForScheme(scheme: ColorScheme): string[] {
  return COLOR_SCHEMES[scheme];
}

// Predefined colors for each category (legacy support)
export const CATEGORY_COLORS: Record<EventCategory, string[]> = {
  school: COLOR_SCHEMES.blue,
  work: COLOR_SCHEMES.brown,
  personal: COLOR_SCHEMES.green,
};

// Default color for each category (legacy support)
export const DEFAULT_CATEGORY_COLORS: Record<EventCategory, string> = {
  school: getDefaultColorForScheme('blue'),
  work: getDefaultColorForScheme('brown'),
  personal: getDefaultColorForScheme('green'),
};
