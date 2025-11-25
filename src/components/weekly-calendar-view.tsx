"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCalendarEventsByDateRange, createCalendarEvent } from '@/lib/supabase/calendar-events';
import type { CalendarEvent, EventCategory } from '@/lib/types/calendar-events';
import { DEFAULT_CATEGORY_COLORS, type ColorScheme } from '@/lib/types/calendar-events';
import { ColorSchemePicker } from '@/components/color-scheme-picker';
import { toast } from 'sonner';
import { getCalorieTotalsByDateRange, type DailyCalorieTotals } from '@/lib/supabase/nutrition-queries';

interface WeeklyCalendarViewProps {
  selectedWeekStart: Date;
  onClose: () => void;
  onEventCreated?: () => void;
  userId?: string; // User ID for loading food log data
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeeklyCalendarView({
  selectedWeekStart,
  onClose,
  onEventCreated,
  userId = 'demo-user' // Default user ID for demo purposes
}: WeeklyCalendarViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(selectedWeekStart);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calorieTotals, setCalorieTotals] = useState<Map<string, DailyCalorieTotals>>(new Map());

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('personal');
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLORS.personal);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('brown');
  const [allDay, setAllDay] = useState(false);

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

  // Load events and calorie data for current week
  useEffect(() => {
    async function loadWeekData() {
      try {
        const startDate = weekDates[0].toISOString().split('T')[0]; // YYYY-MM-DD format
        const endDate = weekDates[6].toISOString().split('T')[0];

        // Load calendar events
        const weekEvents = await getCalendarEventsByDateRange(
          weekDates[0].toISOString(),
          new Date(weekDates[6].setHours(23, 59, 59)).toISOString()
        );
        setEvents(weekEvents);

        // Load calorie totals
        const totals = await getCalorieTotalsByDateRange(userId, startDate, endDate);
        setCalorieTotals(totals);
      } catch (error) {
        console.error('Failed to load week data:', error);
      }
    }
    loadWeekData();
  }, [weekDates, userId]);

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

  const handleSlotClick = (date: Date, hour: number) => {
    setSelectedSlot({ date, hour });
    setIsDialogOpen(true);
  };

  const handleEventCreated = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
    // Reload events and calorie data
    async function reloadWeekData() {
      try {
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];

        const weekEvents = await getCalendarEventsByDateRange(
          weekDates[0].toISOString(),
          new Date(weekDates[6].setHours(23, 59, 59)).toISOString()
        );
        setEvents(weekEvents);

        const totals = await getCalorieTotalsByDateRange(userId, startDate, endDate);
        setCalorieTotals(totals);
      } catch (error) {
        console.error('Failed to reload week data:', error);
      }
    }
    reloadWeekData();
    onEventCreated?.();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('personal');
    setColor(DEFAULT_CATEGORY_COLORS.personal);
    setAllDay(false);
  };

  const handleCategoryChange = (newCategory: EventCategory) => {
    setCategory(newCategory);
    setColor(DEFAULT_CATEGORY_COLORS[newCategory]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !selectedSlot) {
      toast.error('Please enter an event title');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventDate = new Date(selectedSlot.date);
      eventDate.setHours(selectedSlot.hour, 0, 0, 0);

      const startDateTime = allDay
        ? new Date(eventDate.toISOString().split('T')[0]).toISOString()
        : eventDate.toISOString();

      await createCalendarEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        start_date: startDateTime,
        all_day: allDay,
      });

      toast.success('Event created successfully!');
      handleEventCreated();
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

              const dateKey = date.toISOString().split('T')[0];
              const dailyTotal = calorieTotals.get(dateKey);
              const hasCalorieData = dailyTotal && dailyTotal.totalCalories > 0;

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
                  {hasCalorieData && (
                    <div className="mt-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <div className="text-xs font-semibold text-primary">
                        {Math.round(dailyTotal.totalCalories)} cal
                      </div>
                      {dailyTotal.mealCount > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          {dailyTotal.mealCount} {dailyTotal.mealCount === 1 ? 'meal' : 'meals'}
                        </div>
                      )}
                    </div>
                  )}
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
                      onClick={() => handleSlotClick(date, hour)}
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

      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Add Event
                {selectedSlot && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}
                    - {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}{' '}
                    at {formatHour(selectedSlot.hour)}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                Create a new event for your calendar with color-coded categories.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  placeholder="Enter event title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Add event details (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="event-category">Category *</Label>
                <Select
                  value={category}
                  onValueChange={(value) => handleCategoryChange(value as EventCategory)}
                >
                  <SelectTrigger id="event-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">🎓 School</SelectItem>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="personal">🌟 Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Scheme Picker */}
              <div className="space-y-2">
                <Label>Event Color</Label>
                <ColorSchemePicker
                  value={color}
                  onChange={setColor}
                  selectedScheme={colorScheme}
                  onSchemeChange={setColorScheme}
                />
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="event-all-day"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <Label htmlFor="event-all-day" className="cursor-pointer">
                  All day event
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
