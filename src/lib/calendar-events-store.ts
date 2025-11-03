/**
 * Calendar Events Local Storage
 * Manages calendar events and schedules
 */

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventType: 'fitness' | 'wellness' | 'nutrition' | 'personal';
  startDatetime: string;
  endDatetime?: string;
  allDay: boolean;
  recurrenceRule?: string; // RRULE format
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'bloom_calendar_events';

// Get all events from localStorage
function getAllEvents(): Record<string, CalendarEvent[]> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save all events to localStorage
function saveAllEvents(events: Record<string, CalendarEvent[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save calendar events:', error);
  }
}

// Get events for user
export function getUserEvents(userId: string): CalendarEvent[] {
  const allEvents = getAllEvents();
  return allEvents[userId] || [];
}

// Get events for specific date range
export function getEventsInRange(userId: string, startDate: Date, endDate: Date): CalendarEvent[] {
  const events = getUserEvents(userId);
  return events.filter(event => {
    const eventDate = new Date(event.startDatetime);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

// Get events for specific date
export function getEventsForDate(userId: string, date: Date): CalendarEvent[] {
  const events = getUserEvents(userId);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return events.filter(event => {
    const eventDate = new Date(event.startDatetime);
    return eventDate >= dayStart && eventDate <= dayEnd;
  });
}

// Create new event
export function createEvent(userId: string, eventData: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): CalendarEvent {
  const allEvents = getAllEvents();
  const userEvents = allEvents[userId] || [];

  const newEvent: CalendarEvent = {
    ...eventData,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  userEvents.push(newEvent);
  allEvents[userId] = userEvents;
  saveAllEvents(allEvents);

  notifySubscribers(userId, userEvents);
  return newEvent;
}

// Update event
export function updateEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
  const allEvents = getAllEvents();
  const userEvents = allEvents[userId] || [];

  const index = userEvents.findIndex(e => e.id === eventId);
  if (index === -1) return null;

  const updatedEvent: CalendarEvent = {
    ...userEvents[index],
    ...updates,
    id: eventId,
    userId,
    updatedAt: new Date().toISOString()
  };

  userEvents[index] = updatedEvent;
  allEvents[userId] = userEvents;
  saveAllEvents(allEvents);

  notifySubscribers(userId, userEvents);
  return updatedEvent;
}

// Delete event
export function deleteEvent(userId: string, eventId: string): boolean {
  const allEvents = getAllEvents();
  const userEvents = allEvents[userId] || [];

  const filtered = userEvents.filter(e => e.id !== eventId);
  if (filtered.length === userEvents.length) return false;

  allEvents[userId] = filtered;
  saveAllEvents(allEvents);

  notifySubscribers(userId, filtered);
  return true;
}

// Subscribe to event changes
const subscribers: Record<string, Set<(events: CalendarEvent[]) => void>> = {};

export function subscribeToEvents(
  userId: string,
  callback: (events: CalendarEvent[]) => void
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
function notifySubscribers(userId: string, events: CalendarEvent[]) {
  subscribers[userId]?.forEach(callback => {
    try {
      callback(events);
    } catch (error) {
      console.error('Error in calendar event subscriber:', error);
    }
  });
}

// Get events grouped by type
export function getEventsByType(userId: string): Record<string, CalendarEvent[]> {
  const events = getUserEvents(userId);
  const grouped: Record<string, CalendarEvent[]> = {
    fitness: [],
    wellness: [],
    nutrition: [],
    personal: []
  };

  events.forEach(event => {
    if (grouped[event.eventType]) {
      grouped[event.eventType].push(event);
    }
  });

  return grouped;
}
