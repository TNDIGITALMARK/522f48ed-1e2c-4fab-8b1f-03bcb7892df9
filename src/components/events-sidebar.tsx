"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Calendar, Clock, Sparkles, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import {
  getUpcomingCalendarEvents,
  getCalendarEventsByMonth,
  deleteCalendarEvent,
} from '@/lib/supabase/calendar-events';
import type { CalendarEvent } from '@/lib/types/calendar-events';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AITodoItem {
  id: string;
  title: string;
  completed: boolean;
  timeBlock: string;
  relatedEvent?: string;
}

interface EventsSidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EventsSidebar({ isOpen, onOpenChange }: EventsSidebarProps = {}) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isExpanded = isOpen !== undefined ? isOpen : internalIsExpanded;
  const setIsExpanded = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsExpanded(value);
    }
  };
  const [dailyExpanded, setDailyExpanded] = useState(true);
  const [weeklyExpanded, setWeeklyExpanded] = useState(false);
  const [monthlyExpanded, setMonthlyExpanded] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load events when sidebar opens
  useEffect(() => {
    if (isExpanded) {
      loadEvents();
    }
  }, [isExpanded]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // Load upcoming events
      const upcoming = await getUpcomingCalendarEvents(20);
      setUpcomingEvents(upcoming);

      // Load this month's events
      const now = new Date();
      const month = await getCalendarEventsByMonth(now.getFullYear(), now.getMonth());
      setMonthEvents(month);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteCalendarEvent(id);
      toast.success('Event deleted');
      await loadEvents(); // Reload events
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.all_day) return 'All day';
    const date = new Date(event.start_date);
    return format(date, 'h:mm a');
  };

  const formatEventDate = (event: CalendarEvent) => {
    const date = new Date(event.start_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      school: '🎓',
      work: '💼',
      personal: '🌟',
    };
    return icons[category as keyof typeof icons] || '📅';
  };

  return (
    <>
      {/* Sidebar Toggle Button - Hidden when expanded */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-full rounded-r-none bg-white hover:bg-gray-50 border border-gray-200 shadow-bloom z-50 px-2 py-6"
          size="sm"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </Button>
      )}

      {/* Expandable Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-40 overflow-y-auto",
          isExpanded ? "w-96" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="p-5 space-y-3">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Events & Schedule</h2>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 text-black" />
              </Button>
            </div>

            {/* Upcoming Events Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setDailyExpanded(!dailyExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-black/80" />
                  <h3 className="text-sm font-medium text-gray-800">Upcoming Events</h3>
                  <span className="text-xs text-gray-500">({upcomingEvents.length})</span>
                </div>
                {dailyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {dailyExpanded && (
                <div className="space-y-2 mt-2">
                  {isLoading ? (
                    <p className="text-xs text-gray-500 text-center py-3">Loading...</p>
                  ) : upcomingEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No upcoming events
                    </p>
                  ) : (
                    upcomingEvents.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className="p-2.5 rounded-md border transition-colors hover:bg-gray-50 group"
                        style={{ borderColor: event.color + '40', backgroundColor: event.color + '10' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-lg">{getCategoryIcon(event.category)}</span>
                              <span className="text-xs font-medium text-gray-700">{formatEventDate(event)}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600">{formatEventTime(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                            {event.description && (
                              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* All Events This Month */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setMonthlyExpanded(!monthlyExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-black/80" />
                  <h3 className="text-sm font-medium text-gray-800">This Month</h3>
                  <span className="text-xs text-gray-500">({monthEvents.length})</span>
                </div>
                {monthlyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {monthlyExpanded && (
                <div className="space-y-1.5 mt-2 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <p className="text-xs text-gray-500 text-center py-3">Loading...</p>
                  ) : monthEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No events this month
                    </p>
                  ) : (
                    monthEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-2 rounded-md border transition-colors hover:bg-gray-50 group"
                        style={{ borderColor: event.color + '40' }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-sm">{getCategoryIcon(event.category)}</span>
                              <span className="text-xs font-medium text-gray-700">{formatEventDate(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Backdrop when sidebar is expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
        />
      )}
    </>
  );
}
