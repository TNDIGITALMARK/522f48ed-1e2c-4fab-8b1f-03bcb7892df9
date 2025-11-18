"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCalendarEventsByDateRange } from '@/lib/supabase/calendar-events';
import type { CalendarEvent } from '@/lib/types/calendar-events';

interface WeeklyCalendarViewProps {
  selectedWeekStart: Date;
  onClose: () => void;
  onEventCreated?: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeeklyCalendarView({
  selectedWeekStart,
  onClose,
  onEventCreated
}: WeeklyCalendarViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(selectedWeekStart);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Get week dates (Sunday to Saturday)
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  // Load events for current week
  useEffect(() => {
    async function loadEvents() {
      try {
        const startDate = weekDates[0].toISOString();
        const endDate = new Date(weekDates[6]);
        endDate.setHours(23, 59, 59);
        const weekEvents = await getCalendarEventsByDateRange(
          startDate,
          endDate.toISOString()
        );
        setEvents(weekEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    }
    loadEvents();
  }, [weekDates]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
  };

  // Get events for a specific hour on a specific day
  const getEventsForHour = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      const isSameDay =
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();

      if (!isSameDay) return false;

      // For all-day events, show in the first hour slot
      if (event.all_day) return hour === 0;

      // For timed events, show in the hour slot
      return eventDate.getHours() === hour;
    });
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const weekStartFormatted = currentWeekStart.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const weekEndFormatted = weekDates[6].toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-4 shadow-bloom-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Close Weekly View
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">
              {weekStartFormatted} - {weekEndFormatted}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-l border-border">
            {/* Day Headers */}
            <div className="sticky top-0 bg-white border-b border-r border-border z-10 p-2 text-xs font-medium text-muted-foreground">
              Time
            </div>
            {weekDates.map((date, idx) => {
              const isToday =
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`sticky top-0 bg-white border-b border-r border-border z-10 p-3 text-center ${
                    isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="text-xs font-medium text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={`text-xl font-semibold font-['Cormorant_Garamond'] mt-1 ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}

            {/* Hourly Rows */}
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                {/* Time Label */}
                <div className="border-b border-r border-border p-2 text-xs text-muted-foreground text-right bg-muted/10">
                  {formatHour(hour)}
                </div>

                {/* Day Columns */}
                {weekDates.map((date, dayIdx) => {
                  const hourEvents = getEventsForHour(date, hour);
                  const isToday =
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={`${hour}-${dayIdx}`}
                      className={`border-b border-r border-border p-1 min-h-[60px] relative ${
                        isToday ? 'bg-primary/5' : 'bg-white'
                      } hover:bg-muted/20 transition-colors cursor-pointer`}
                    >
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className="mb-1 p-2 rounded text-xs font-medium text-white overflow-hidden"
                          style={{
                            backgroundColor: event.color,
                            minHeight: event.all_day ? '40px' : '54px'
                          }}
                          title={event.title}
                        >
                          <div className="font-semibold truncate">
                            {event.title}
                          </div>
                          {event.description && (
                            <div className="text-[10px] opacity-90 truncate mt-0.5">
                              {event.description}
                            </div>
                          )}
                          {event.all_day && (
                            <div className="text-[10px] opacity-90 mt-0.5">
                              All Day
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
