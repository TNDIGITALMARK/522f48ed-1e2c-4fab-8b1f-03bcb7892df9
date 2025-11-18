"use client";

import { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createCalendarEvent } from '@/lib/supabase/calendar-events';
import type { EventCategory, ColorScheme } from '@/lib/types/calendar-events';
import { DEFAULT_CATEGORY_COLORS, CATEGORY_COLORS } from '@/lib/types/calendar-events';
import { ColorSchemePicker } from './color-scheme-picker';
import { toast } from 'sonner';

interface AddCalendarEventDialogProps {
  onEventCreated?: () => void;
  selectedDate?: Date;
  trigger?: React.ReactNode;
}

export function AddCalendarEventDialog({
  onEventCreated,
  selectedDate,
  trigger,
}: AddCalendarEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('personal');
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLORS.personal);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('brown');
  const [startDate, setStartDate] = useState(
    selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('09:00');
  const [allDay, setAllDay] = useState(false);

  const handleCategoryChange = (newCategory: EventCategory) => {
    setCategory(newCategory);
    setColor(DEFAULT_CATEGORY_COLORS[newCategory]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = allDay
        ? new Date(startDate).toISOString()
        : new Date(`${startDate}T${startTime}`).toISOString();

      await createCalendarEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        start_date: startDateTime,
        all_day: allDay,
      });

      toast.success('Event created successfully!');
      setOpen(false);
      resetForm();
      onEventCreated?.();
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('personal');
    setColor(DEFAULT_CATEGORY_COLORS.personal);
    setStartDate(new Date().toISOString().split('T')[0]);
    setStartTime('09:00');
    setAllDay(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Add Calendar Event
            </DialogTitle>
            <DialogDescription>
              Create a new event for your calendar with color-coded categories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter event title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add event details (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => handleCategoryChange(value as EventCategory)}
              >
                <SelectTrigger id="category">
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

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="all-day"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="all-day" className="cursor-pointer">
                All day event
              </Label>
            </div>

            {/* Time (only if not all day) */}
            {!allDay && (
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
  );
}
