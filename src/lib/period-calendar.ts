/**
 * Period Calendar - Cycle Tracking & Event Management
 * Utilities for managing menstrual cycles, calculating phases, and event scheduling
 */

import { addDays, differenceInDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';

// ============================================
// TYPES
// ============================================

export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';
export type EventType = 'fitness' | 'wellness' | 'nutrition' | 'personal' | 'other';
export type BalanceImpact = 'rest' | 'active' | 'moderate' | 'none';

export interface PeriodCycle {
  id: string;
  userId: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  cycleLength: number; // Average cycle length (e.g., 28 days)
  periodLength: number; // Length of menstruation (e.g., 5 days)
  currentPhase?: CyclePhase;
  flowIntensity?: FlowIntensity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventDate: string; // ISO date string
  eventTime?: string; // HH:mm format
  durationMinutes?: number;
  eventType: EventType;
  eventColor?: string;
  allDay: boolean;
  recurrencePattern: 'none' | 'daily' | 'weekly' | 'monthly';
  affectsWeeklyBalance: boolean;
  balanceImpactType: BalanceImpact;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CycleInsight {
  phase: CyclePhase;
  dayInPhase: number;
  totalDaysInPhase: number;
  phaseProgress: number; // 0-100
  energyLevel: 'low' | 'moderate' | 'high' | 'elevated';
  recommendations: string[];
  symptoms: string[];
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  cyclePhase?: CyclePhase;
  events: CalendarEvent[];
  isPeriodDay: boolean;
  dayOfCycle?: number; // Day number in current cycle (1-28+)
}

// ============================================
// CYCLE CALCULATIONS
// ============================================

/**
 * Calculate which phase of the cycle a given date falls into
 */
export function calculateCyclePhase(
  dayOfCycle: number,
  cycleLength: number = 28,
  periodLength: number = 5
): CyclePhase {
  // Menstruation: Days 1-5 (period length)
  if (dayOfCycle <= periodLength) {
    return 'menstruation';
  }

  // Follicular: Days 6-13 (post-period until ovulation)
  const follicularEnd = Math.floor(cycleLength / 2) - 1;
  if (dayOfCycle <= follicularEnd) {
    return 'follicular';
  }

  // Ovulation: Days 14-16 (mid-cycle, ~3 days)
  const ovulationEnd = Math.floor(cycleLength / 2) + 2;
  if (dayOfCycle <= ovulationEnd) {
    return 'ovulation';
  }

  // Luteal: Days 17-28 (post-ovulation until next period)
  return 'luteal';
}

/**
 * Calculate the current day of cycle based on last period start date
 */
export function getDayOfCycle(lastPeriodStart: Date, currentDate: Date = new Date()): number {
  const daysSinceStart = differenceInDays(currentDate, lastPeriodStart);
  return daysSinceStart + 1; // Day 1 is the first day of period
}

/**
 * Predict the next period start date based on average cycle length
 */
export function predictNextPeriod(lastPeriodStart: Date, cycleLength: number = 28): Date {
  return addDays(lastPeriodStart, cycleLength);
}

/**
 * Calculate fertile window (typically days 10-17 of a 28-day cycle)
 */
export function getFertileWindow(lastPeriodStart: Date, cycleLength: number = 28): { start: Date; end: Date } {
  const ovulationDay = Math.floor(cycleLength / 2);
  const start = addDays(lastPeriodStart, ovulationDay - 5); // 5 days before ovulation
  const end = addDays(lastPeriodStart, ovulationDay + 1); // 1 day after ovulation
  return { start, end };
}

/**
 * Get comprehensive cycle insights for a specific date
 */
export function getCycleInsights(
  cycle: PeriodCycle,
  currentDate: Date = new Date()
): CycleInsight {
  const lastPeriodStart = parseISO(cycle.startDate);
  const dayOfCycle = getDayOfCycle(lastPeriodStart, currentDate);
  const adjustedDay = ((dayOfCycle - 1) % cycle.cycleLength) + 1; // Wrap around for next cycles

  const phase = calculateCyclePhase(adjustedDay, cycle.cycleLength, cycle.periodLength);

  // Calculate phase-specific info
  let dayInPhase = 0;
  let totalDaysInPhase = 0;
  let energyLevel: 'low' | 'moderate' | 'high' | 'elevated' = 'moderate';
  let recommendations: string[] = [];
  let symptoms: string[] = [];

  switch (phase) {
    case 'menstruation':
      dayInPhase = adjustedDay;
      totalDaysInPhase = cycle.periodLength;
      energyLevel = 'low';
      recommendations = [
        'Rest and gentle movement',
        'Stay hydrated and eat iron-rich foods',
        'Practice self-care and relaxation'
      ];
      symptoms = ['Cramps', 'Fatigue', 'Lower back pain'];
      break;

    case 'follicular':
      const follicularStart = cycle.periodLength + 1;
      const follicularEnd = Math.floor(cycle.cycleLength / 2) - 1;
      dayInPhase = adjustedDay - follicularStart + 1;
      totalDaysInPhase = follicularEnd - follicularStart + 1;
      energyLevel = 'high';
      recommendations = [
        'Great time for challenging workouts',
        'Focus on strength training',
        'Schedule important meetings and tasks'
      ];
      symptoms = ['Increased energy', 'Better mood'];
      break;

    case 'ovulation':
      const ovulationStart = Math.floor(cycle.cycleLength / 2);
      dayInPhase = adjustedDay - ovulationStart + 1;
      totalDaysInPhase = 3;
      energyLevel = 'elevated';
      recommendations = [
        'Peak energy and confidence',
        'Social activities and networking',
        'High-intensity workouts'
      ];
      symptoms = ['Peak energy', 'Heightened senses', 'Increased libido'];
      break;

    case 'luteal':
      const lutealStart = Math.floor(cycle.cycleLength / 2) + 3;
      dayInPhase = adjustedDay - lutealStart + 1;
      totalDaysInPhase = cycle.cycleLength - lutealStart + 1;
      energyLevel = 'moderate';
      recommendations = [
        'Focus on yoga and moderate cardio',
        'Prioritize sleep and stress management',
        'Eat complex carbs and magnesium-rich foods'
      ];
      symptoms = ['Mood changes', 'Food cravings', 'Bloating'];
      break;
  }

  const phaseProgress = (dayInPhase / totalDaysInPhase) * 100;

  return {
    phase,
    dayInPhase,
    totalDaysInPhase,
    phaseProgress,
    energyLevel,
    recommendations,
    symptoms
  };
}

// ============================================
// CALENDAR GENERATION
// ============================================

/**
 * Generate calendar days for a given month with period and event data
 */
export function generateCalendarDays(
  year: number,
  month: number,
  cycle: PeriodCycle | null,
  events: CalendarEvent[],
  selectedDate: Date | null = null
): CalendarDay[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return days.map(date => {
    const dayEvents = events.filter(event =>
      isSameDay(parseISO(event.eventDate), date)
    );

    let cyclePhase: CyclePhase | undefined;
    let isPeriodDay = false;
    let dayOfCycle: number | undefined;

    if (cycle) {
      const lastPeriodStart = parseISO(cycle.startDate);
      const currentDayOfCycle = getDayOfCycle(lastPeriodStart, date);
      const adjustedDay = ((currentDayOfCycle - 1) % cycle.cycleLength) + 1;

      dayOfCycle = adjustedDay;
      cyclePhase = calculateCyclePhase(adjustedDay, cycle.cycleLength, cycle.periodLength);
      isPeriodDay = adjustedDay <= cycle.periodLength;
    }

    return {
      date,
      isToday: isToday(date),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      cyclePhase,
      events: dayEvents,
      isPeriodDay,
      dayOfCycle
    };
  });
}

// ============================================
// LOCALSTORAGE PERSISTENCE
// ============================================

const STORAGE_KEYS = {
  CYCLES: 'bloom_period_cycles',
  EVENTS: 'bloom_calendar_events'
};

export function saveCycle(cycle: PeriodCycle): void {
  const cycles = getCycles(cycle.userId);
  const existingIndex = cycles.findIndex(c => c.id === cycle.id);

  if (existingIndex >= 0) {
    cycles[existingIndex] = { ...cycle, updatedAt: new Date().toISOString() };
  } else {
    cycles.push(cycle);
  }

  localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
}

export function getCycles(userId: string): PeriodCycle[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CYCLES);
  if (!stored) return [];

  const allCycles = JSON.parse(stored) as PeriodCycle[];
  return allCycles.filter(c => c.userId === userId);
}

export function getActiveCycle(userId: string): PeriodCycle | null {
  const cycles = getCycles(userId);
  if (cycles.length === 0) return null;

  // Return the most recent cycle
  return cycles.sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )[0];
}

export function saveEvent(event: CalendarEvent): void {
  const events = getEvents(event.userId);
  const existingIndex = events.findIndex(e => e.id === event.id);

  if (existingIndex >= 0) {
    events[existingIndex] = { ...event, updatedAt: new Date().toISOString() };
  } else {
    events.push(event);
  }

  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function getEvents(userId: string, startDate?: Date, endDate?: Date): CalendarEvent[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!stored) return [];

  let allEvents = JSON.parse(stored) as CalendarEvent[];
  allEvents = allEvents.filter(e => e.userId === userId);

  if (startDate && endDate) {
    allEvents = allEvents.filter(e => {
      const eventDate = parseISO(e.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  return allEvents;
}

export function deleteEvent(eventId: string, userId: string): void {
  const events = getEvents(userId);
  const filtered = events.filter(e => e.id !== eventId);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
}

// ============================================
// EVENT TYPE HELPERS
// ============================================

export function getEventTypeColor(eventType: EventType): string {
  const colors: Record<EventType, string> = {
    fitness: 'hsl(var(--event-fitness))',
    wellness: 'hsl(var(--event-wellness))',
    nutrition: 'hsl(var(--event-nutrition))',
    personal: 'hsl(var(--event-personal))',
    other: 'hsl(var(--muted))'
  };
  return colors[eventType];
}

export function getEventTypeLabel(eventType: EventType): string {
  const labels: Record<EventType, string> = {
    fitness: 'Fitness',
    wellness: 'Wellness',
    nutrition: 'Nutrition',
    personal: 'Personal',
    other: 'Other'
  };
  return labels[eventType];
}

// ============================================
// WEEKLY BALANCE INTEGRATION
// ============================================

export interface WeeklyBalanceData {
  week: Date;
  restDays: number;
  activeDays: number;
  moderateDays: number;
  events: CalendarEvent[];
  recommendation: string;
}

/**
 * Calculate weekly balance based on events
 */
export function calculateWeeklyBalance(
  events: CalendarEvent[],
  weekStart: Date
): WeeklyBalanceData {
  const weekEnd = addDays(weekStart, 6);
  const weekEvents = events.filter(event => {
    const eventDate = parseISO(event.eventDate);
    return eventDate >= weekStart && eventDate <= weekEnd && event.affectsWeeklyBalance;
  });

  const impactCounts = weekEvents.reduce((acc, event) => {
    acc[event.balanceImpactType] = (acc[event.balanceImpactType] || 0) + 1;
    return acc;
  }, {} as Record<BalanceImpact, number>);

  const restDays = impactCounts.rest || 0;
  const activeDays = impactCounts.active || 0;
  const moderateDays = impactCounts.moderate || 0;

  let recommendation = '';
  if (activeDays > 5) {
    recommendation = 'You have many high-intensity activities this week. Consider adding a rest day.';
  } else if (restDays > 4) {
    recommendation = 'This week is very restful. Consider adding moderate activity for balance.';
  } else if (activeDays + moderateDays < 3) {
    recommendation = 'This week could use more movement. Try adding gentle exercise.';
  } else {
    recommendation = 'Your weekly balance looks great! Keep up the good work.';
  }

  return {
    week: weekStart,
    restDays,
    activeDays,
    moderateDays,
    events: weekEvents,
    recommendation
  };
}
