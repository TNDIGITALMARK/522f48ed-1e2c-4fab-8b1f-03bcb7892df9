"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, BookOpen, Briefcase, User, Dumbbell, Heart, Users as UsersIcon, Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getEvents,
  createEvent,
  generateGoalsFromEvents,
  type Event
} from '@/lib/supabase/goals';

interface EventsSchedulerProps {
  className?: string;
  onGoalsGenerated?: () => void;
}

const eventTypeIcons = {
  school: BookOpen,
  work: Briefcase,
  personal: User,
  fitness: Dumbbell,
  wellness: Heart,
  social: UsersIcon
};

const eventTypeColors = {
  school: 'text-accent-foreground bg-accent/10',
  work: 'text-primary bg-primary/10',
  personal: 'text-secondary bg-secondary/10',
  fitness: 'text-primary bg-primary/10',
  wellness: 'text-secondary bg-secondary/10',
  social: 'text-accent-foreground bg-accent/10'
};

export function EventsScheduler({ className, onGoalsGenerated }: EventsSchedulerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<Event['event_type']>('school');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setIsLoading(true);
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const allEvents = await getEvents(
        today.toISOString(),
        nextWeek.toISOString()
      );
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddEvent() {
    if (!title || !startTime || !endTime) return;

    try {
      await createEvent({
        title,
        event_type: eventType,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        location: location || undefined,
        description: description || undefined
      });

      // Reset form
      setTitle('');
      setEventType('school');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setDescription('');
      setIsDialogOpen(false);

      // Reload events
      await loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }

  async function handleGenerateGoals() {
    setIsGenerating(true);
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      await generateGoalsFromEvents(
        today.toISOString().split('T')[0],
        nextWeek.toISOString().split('T')[0]
      );

      onGoalsGenerated?.();
    } catch (error) {
      console.error('Error generating goals:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card className={`p-6 bg-gradient-to-br from-card to-secondary/5 border-secondary/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-semibold font-['Cormorant_Garamond']">Schedule & Events</h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Schedule an event to automatically generate goals
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Math Class, Gym Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as Event['event_type'])}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">🎓 School</SelectItem>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="personal">👤 Personal</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="wellness">❤️ Wellness</SelectItem>
                    <SelectItem value="social">👥 Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Room 204, Gym"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Additional details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEvent} className="flex-1">
                  Add Event
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-3 mb-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming events</p>
            <p className="text-xs mt-1">Add your schedule to generate goals!</p>
          </div>
        ) : (
          events.map((event) => {
            const Icon = eventTypeIcons[event.event_type];
            const colorClass = eventTypeColors[event.event_type];
            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);

            return (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Generate Goals Button */}
      {events.length > 0 && (
        <Button
          onClick={handleGenerateGoals}
          disabled={isGenerating}
          className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Generating Goals...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Generate Goals from Schedule
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
