"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddCalendarEventDialog } from './add-calendar-event-dialog';
import { ScanCalendarEventsDialog } from './scan-calendar-events-dialog';
import { WeeklyCalendarView } from './weekly-calendar-view';
import { getCalendarEventsByMonth } from '@/lib/supabase/calendar-events';
import type { CalendarEvent } from '@/lib/types/calendar-events';

interface MonthlyCalendarProps {
  className?: string;
}

const EVENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  fitness: '💪',
  wellness: '❤️',
  nutrition: '🍎',
  personal: '📅',
};

export function MonthlyCalendar({ className = '' }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState(false);
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);

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

  const handleWeekdayClick = (dayOfWeek: number) => {
    // dayOfWeek: 0 = Sunday, 1 = Monday, etc.
    // Find the first occurrence of this weekday in the current month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Find first day of month that matches the clicked weekday
    let date = new Date(year, month, 1);
    while (date.getDay() !== dayOfWeek) {
      date.setDate(date.getDate() + 1);
    }

    // Calculate the week start (Sunday) for this date
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);

    setWeekStartDate(weekStart);
    setShowWeeklyView(true);
  };

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return events
      .filter((event) => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 5); // Show max 5 upcoming events
  }, [events]);

  return (
    <>
      {/* Weekly View Overlay */}
      {showWeeklyView && weekStartDate && (
        <WeeklyCalendarView
          selectedWeekStart={weekStartDate}
          onClose={() => setShowWeeklyView(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      <div className={`bg-white rounded-2xl p-6 shadow-bloom border border-black ${className}`}>
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
          <ScanCalendarEventsDialog
            onEventsCreated={handleEventCreated}
          />
          <div className="w-px h-5 bg-border mx-1" />
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

      {/* Weekday headers - Clickable to open weekly view */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <button
            key={day}
            onClick={() => handleWeekdayClick(index)}
            className="text-center text-xs font-medium text-muted-foreground py-2 hover:bg-primary/10 hover:text-primary rounded transition-colors cursor-pointer"
            title={`Click to view weekly calendar starting from ${day}`}
          >
            {day}
          </button>
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

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold font-['Cormorant_Garamond'] text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-secondary" />
              Upcoming Schedule
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedEvents(!expandedEvents)}
              className="text-xs"
            >
              {expandedEvents ? 'Show Less' : 'View All'}
            </Button>
          </div>

          <div className="space-y-3">
            {(expandedEvents ? upcomingEvents : upcomingEvents.slice(0, 3)).map((event) => {
              const eventDate = new Date(event.start_date);
              const isToday =
                eventDate.toDateString() === new Date().toDateString();

              return (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-border bg-background/50 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h5 className="font-medium text-sm text-foreground">
                          {event.title}
                        </h5>
                        {isToday && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0"
                          >
                            Today
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {eventDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {eventDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {upcomingEvents.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events this week</p>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}
