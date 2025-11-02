"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Heart, Droplets } from 'lucide-react';
import {
  generateCalendarDays,
  getActiveCycle,
  getCycleInsights,
  saveEvent,
  getEvents,
  deleteEvent,
  getEventTypeColor,
  getEventTypeLabel,
  type CalendarEvent,
  type EventType,
  type BalanceImpact,
  type CalendarDay
} from '@/lib/period-calendar';
import { format, addMonths, subMonths } from 'date-fns';

interface PeriodCalendarProps {
  userId: string;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export function PeriodCalendar({ userId, onEventCreate, onEventUpdate, onEventDelete }: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('fitness');
  const [eventTime, setEventTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [allDay, setAllDay] = useState(false);
  const [balanceImpact, setBalanceImpact] = useState<BalanceImpact>('moderate');

  // Load calendar data
  useEffect(() => {
    const cycle = getActiveCycle(userId);
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const events = getEvents(userId, monthStart, monthEnd);

    const days = generateCalendarDays(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      cycle,
      events,
      selectedDate
    );

    setCalendarDays(days);
  }, [currentMonth, userId, selectedDate]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    resetEventForm();
    setShowEventDialog(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setEventType(event.eventType);
    setEventTime(event.eventTime || '');
    setDurationMinutes(event.durationMinutes?.toString() || '60');
    setAllDay(event.allDay);
    setBalanceImpact(event.balanceImpactType);
    setShowEventDialog(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId, userId);
    if (onEventDelete) {
      onEventDelete(eventId);
    }
    // Refresh calendar
    setCurrentMonth(new Date(currentMonth));
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventType('fitness');
    setEventTime('');
    setDurationMinutes('60');
    setAllDay(false);
    setBalanceImpact('moderate');
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !eventTitle.trim()) return;

    const event: CalendarEvent = {
      id: editingEvent?.id || `event-${Date.now()}`,
      userId,
      title: eventTitle,
      description: eventDescription,
      eventDate: format(selectedDate, 'yyyy-MM-dd'),
      eventTime: eventTime || undefined,
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      eventType,
      allDay,
      recurrencePattern: 'none',
      affectsWeeklyBalance: true,
      balanceImpactType: balanceImpact,
      completed: false,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveEvent(event);

    if (editingEvent && onEventUpdate) {
      onEventUpdate(event);
    } else if (onEventCreate) {
      onEventCreate(event);
    }

    setShowEventDialog(false);
    resetEventForm();
    setEditingEvent(null);
    // Refresh calendar
    setCurrentMonth(new Date(currentMonth));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="bloom-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your period and schedule wellness events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const dayClasses = [
              'calendar-day',
              day.isToday && 'today',
              day.isSelected && 'selected',
              day.cyclePhase && day.cyclePhase,
            ].filter(Boolean).join(' ');

            return (
              <div
                key={index}
                className={dayClasses}
                onClick={() => handleDayClick(day)}
              >
                <div className="day-number">{format(day.date, 'd')}</div>

                {/* Period indicator */}
                {day.isPeriodDay && (
                  <div className="absolute top-1 right-1">
                    <Droplets className="w-3 h-3 text-rose-500" />
                  </div>
                )}

                {/* Event dots */}
                {day.events.length > 0 && (
                  <div className="event-dots">
                    {day.events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`event-dot ${event.eventType}`}
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color menstruation" />
            <span>Menstruation</span>
          </div>
          <div className="legend-item">
            <div className="legend-color follicular" />
            <span>Follicular</span>
          </div>
          <div className="legend-item">
            <div className="legend-color ovulation" />
            <span>Ovulation</span>
          </div>
          <div className="legend-item">
            <div className="legend-color luteal" />
            <span>Luteal</span>
          </div>
        </div>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card className="bloom-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              {calendarDays.find(d => d.date.getTime() === selectedDate.getTime())?.dayOfCycle && (
                <p className="text-sm text-muted-foreground">
                  Day {calendarDays.find(d => d.date.getTime() === selectedDate.getTime())?.dayOfCycle} of cycle
                </p>
              )}
            </div>
            <Button
              onClick={() => handleAddEvent(selectedDate)}
              size="sm"
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Events for selected day */}
          <div className="space-y-3">
            {calendarDays
              .find(d => d.date.getTime() === selectedDate.getTime())
              ?.events.map(event => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: getEventTypeColor(event.eventType) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {getEventTypeLabel(event.eventType)}
                      </Badge>
                    </div>
                    {event.eventTime && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.eventTime}
                        {event.durationMinutes && ` · ${event.durationMinutes} min`}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

            {calendarDays.find(d => d.date.getTime() === selectedDate.getTime())?.events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events scheduled for this day</p>
                <Button
                  variant="link"
                  onClick={() => handleAddEvent(selectedDate)}
                  className="mt-2"
                >
                  Add your first event
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Add/Edit Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="event-modal">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input
                id="event-title"
                placeholder="e.g., Morning Yoga, Team Meeting"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Add details about this event..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                  <SelectTrigger id="event-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance-impact">Balance Impact</Label>
                <Select value={balanceImpact} onValueChange={(v) => setBalanceImpact(v as BalanceImpact)}>
                  <SelectTrigger id="balance-impact">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">Rest</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowEventDialog(false);
                resetEventForm();
                setEditingEvent(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} disabled={!eventTitle.trim()}>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
