"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Dumbbell,
  Heart,
  Apple,
  Calendar as CalendarIcon,
  Share2,
  Copy,
  Check,
  Users
} from 'lucide-react';
import { getUserEvents, createEvent, getEventsForDate, subscribeToEvents, type CalendarEvent } from '@/lib/calendar-events-store';

interface SharedCalendarProps {
  userId: string;
}

const EVENT_TYPE_CONFIG = {
  fitness: { icon: Dumbbell, color: '#a8d5ba', label: 'Fitness' },
  wellness: { icon: Heart, color: '#d4b5e3', label: 'Wellness' },
  nutrition: { icon: Apple, color: '#f5cba7', label: 'Nutrition' },
  personal: { icon: CalendarIcon, color: '#f5b5c5', label: 'Personal' },
  work: { icon: CalendarIcon, color: '#b5d8f5', label: 'Work' },
  social: { icon: Users, color: '#c5d4b5', label: 'Social' }
};

const PRESET_COLORS = [
  { name: 'Mint', value: '#a8d5ba' },
  { name: 'Lavender', value: '#d4b5e3' },
  { name: 'Peach', value: '#f5cba7' },
  { name: 'Rose', value: '#f5b5c5' },
  { name: 'Sky', value: '#b5d8f5' },
  { name: 'Sage', value: '#c5d4b5' },
  { name: 'Coral', value: '#f5b5a7' },
  { name: 'Lilac', value: '#e3b5f5' },
  { name: 'Lemon', value: '#f5f5b5' },
  { name: 'Aqua', value: '#b5f5f0' },
  { name: 'Sunset', value: '#f5c5b5' },
  { name: 'Ocean', value: '#b5c5f5' }
];

export function SharedCalendar({ userId }: SharedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'fitness' as CalendarEvent['eventType'],
    color: EVENT_TYPE_CONFIG.fitness.color,
    time: '09:00',
    allDay: false
  });

  // Load events
  useEffect(() => {
    const loadedEvents = getUserEvents(userId);
    setEvents(loadedEvents);

    const unsubscribe = subscribeToEvents(userId, setEvents);
    return unsubscribe;
  }, [userId]);

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for specific day
  const getEventsForDay = (date: Date) => {
    return getEventsForDate(userId, date);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generate shareable link
  const generateShareLink = () => {
    // Generate a unique share token (in production, this would be stored in database)
    const shareToken = Math.random().toString(36).substring(2, 15);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/calendar/shared/${shareToken}`;
    setShareLink(link);
    setIsShareDialogOpen(true);
  };

  // Copy link to clipboard
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Add new event
  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    const eventDateTime = new Date(selectedDate);
    if (!newEvent.allDay && newEvent.time) {
      const [hours, minutes] = newEvent.time.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));
    }

    createEvent(userId, {
      title: newEvent.title,
      description: newEvent.description,
      eventType: newEvent.eventType,
      color: newEvent.color,
      startDatetime: eventDateTime.toISOString(),
      allDay: newEvent.allDay
    });

    // Reset form
    setNewEvent({
      title: '',
      description: '',
      eventType: 'fitness',
      color: EVENT_TYPE_CONFIG.fitness.color,
      time: '09:00',
      allDay: false
    });
    setIsAddEventOpen(false);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container space-y-4">
      {/* Calendar Header - Centered title with rooted font style */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <h2 className="text-3xl font-bold text-center font-['Playfair_Display'] tracking-tight">
          {monthNames[month]} {year}
        </h2>

        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-between">
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={generateShareLink}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Calendar
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDay(date);
          const isTodayDate = isToday(date);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <Card
              key={date.toISOString()}
              className={`
                calendar-day aspect-square p-2 cursor-pointer transition-all
                ${isTodayDate ? 'today' : ''}
                ${isSelected ? 'selected' : ''}
              `}
              onClick={() => {
                setSelectedDate(date);
                if (dayEvents.length === 0) {
                  setIsAddEventOpen(true);
                }
              }}
            >
              <div className="h-full flex flex-col">
                <div className={`text-sm font-semibold mb-1 ${isTodayDate ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </div>
                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                  {dayEvents.slice(0, 3).map(event => {
                    const config = EVENT_TYPE_CONFIG[event.eventType];
                    const eventColor = event.color || config.color;
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-1.5 py-0.5 rounded truncate font-medium"
                        style={{ backgroundColor: eventColor }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Event Legend */}
      <div className="calendar-legend">
        {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: config.color }}>
                <Icon className="w-3 h-3" style={{ margin: '3px auto' }} />
              </div>
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Calendar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Share this link with friends so they can view your calendar and add their own events.
            </p>

            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyShareLink}
              >
                {linkCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {linkCopied && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Link copied to clipboard!
              </p>
            )}

            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-sm">What friends can do:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>View your calendar events</li>
                <li>Add their own events to the shared calendar</li>
                <li>See all shared events in real-time</li>
                <li>Coordinate schedules together</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Add Event
              {selectedDate && ` - ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input
                id="event-title"
                placeholder="e.g., Morning Run, Yoga Class"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select
                value={newEvent.eventType}
                onValueChange={(value) => {
                  const eventType = value as CalendarEvent['eventType'];
                  setNewEvent({
                    ...newEvent,
                    eventType,
                    color: EVENT_TYPE_CONFIG[eventType].color
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Color</Label>
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      className={`w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                        newEvent.color === colorOption.value
                          ? 'ring-2 ring-primary ring-offset-2 scale-105'
                          : 'hover:ring-2 hover:ring-muted-foreground/30'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                      onClick={() => setNewEvent({ ...newEvent, color: colorOption.value })}
                      title={colorOption.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-color" className="text-xs text-muted-foreground">
                    Custom:
                  </Label>
                  <input
                    id="custom-color"
                    type="color"
                    value={newEvent.color}
                    onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                    className="w-12 h-8 rounded-lg border border-border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {newEvent.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                disabled={newEvent.allDay}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="all-day"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="all-day" className="cursor-pointer">All day event</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description (optional)</Label>
              <Textarea
                id="event-description"
                placeholder="Add details about this event..."
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <Button className="w-full" onClick={handleAddEvent} disabled={!newEvent.title}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
