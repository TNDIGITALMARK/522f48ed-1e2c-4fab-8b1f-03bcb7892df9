"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCalendarEventDialog } from './add-calendar-event-dialog';
import { getCalendarEventsByMonth } from '@/lib/supabase/calendar-events';
import type { CalendarEvent } from '@/lib/types/calendar-events';

interface MonthlyCalendarProps {
  className?: string;
}

export function MonthlyCalendar({ className = '' }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Previous month's days to show
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek;

    // Build calendar grid
    const days: { date: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month's days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Load events for current month
  useEffect(() => {
    async function loadEvents() {
      try {
        const monthEvents = await getCalendarEventsByMonth(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
        setEvents(monthEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    }
    loadEvents();
  }, [currentDate]);

  // Get events for a specific date
  const getEventsForDate = (date: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDayClick = (date: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    setSelectedDate(clickedDate);
    setShowAddDialog(true);
  };

  const handleEventCreated = () => {
    // Reload events
    getCalendarEventsByMonth(currentDate.getFullYear(), currentDate.getMonth()).then(
      setEvents
    );
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-bloom border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold font-['Cormorant_Garamond'] text-foreground">
          {monthName}
        </h3>
        <div className="flex gap-2 items-center">
          <AddCalendarEventDialog
            onEventCreated={handleEventCreated}
            selectedDate={selectedDate || undefined}
            trigger={
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Plus className="h-3 w-3" />
                Add Event
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((day, index) => {
          const dayEvents = day.isCurrentMonth ? getEventsForDate(day.date) : [];

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day.date, day.isCurrentMonth)}
              className={`
                aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-sm
                transition-all duration-200 cursor-pointer relative
                ${
                  day.isCurrentMonth
                    ? 'text-foreground hover:bg-muted/50 hover:shadow-sm'
                    : 'text-muted-foreground opacity-40'
                }
                ${
                  day.isToday
                    ? 'bg-primary text-primary-foreground font-bold hover:bg-primary/90'
                    : ''
                }
              `}
            >
              <span className="mb-auto">{day.date}</span>

              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center mt-auto">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] ml-0.5">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
