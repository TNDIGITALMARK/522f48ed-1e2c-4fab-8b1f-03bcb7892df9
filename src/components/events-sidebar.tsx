"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { CalendarEvent, getUserEvents, getTodaysUpcomingEvents, getWeekEvents } from '@/lib/calendar-events-store';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { seedSampleEvents } from '@/lib/seed-sample-events';

const MOCK_USER_ID = 'demo-user';

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

  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
  const [aiTodos, setAiTodos] = useState<AITodoItem[]>([]);

  // Seed sample events on mount (only runs once if no events exist)
  useEffect(() => {
    seedSampleEvents();
  }, []);

  // Load events when sidebar opens
  useEffect(() => {
    if (isExpanded) {
      loadEvents();
    }
  }, [isExpanded]);

  const loadEvents = () => {
    // Load today's events
    const today = getTodaysUpcomingEvents(MOCK_USER_ID);
    setTodayEvents(today);

    // Load this week's events
    const week = getWeekEvents(MOCK_USER_ID);
    setWeekEvents(week);

    // Load this month's events
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const allEvents = getUserEvents(MOCK_USER_ID);
    const month = allEvents.filter(event => {
      const eventDate = new Date(event.startDatetime);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
    setMonthEvents(month);
  };

  const generateAITodos = () => {
    // AI-generated todo list based on events
    const generatedTodos: AITodoItem[] = [];

    todayEvents.forEach((event, index) => {
      const eventTime = format(new Date(event.startDatetime), 'h:mm a');

      // Generate preparation todos for appointments
      if (event.eventType === 'personal' || event.eventType === 'work') {
        generatedTodos.push({
          id: `prep-${event.id}`,
          title: `Prepare for ${event.title}`,
          completed: false,
          timeBlock: `30 mins before (${format(new Date(new Date(event.startDatetime).getTime() - 30 * 60000), 'h:mm a')})`,
          relatedEvent: event.id
        });
      }

      // Generate workout prep todos
      if (event.eventType === 'fitness') {
        generatedTodos.push({
          id: `prep-${event.id}`,
          title: `Pack gym bag for ${event.title}`,
          completed: false,
          timeBlock: `Before ${eventTime}`,
          relatedEvent: event.id
        });
      }

      // Generate meal prep todos
      if (event.eventType === 'nutrition') {
        generatedTodos.push({
          id: `prep-${event.id}`,
          title: `Prep ingredients for ${event.title}`,
          completed: false,
          timeBlock: `1 hour before`,
          relatedEvent: event.id
        });
      }
    });

    // Add general daily todos for students/busy professionals
    if (todayEvents.length > 0) {
      generatedTodos.unshift({
        id: 'review-schedule',
        title: 'Review today\'s schedule',
        completed: false,
        timeBlock: 'Morning',
        relatedEvent: undefined
      });

      generatedTodos.push({
        id: 'prep-tomorrow',
        title: 'Plan tomorrow\'s tasks',
        completed: false,
        timeBlock: 'Evening',
        relatedEvent: undefined
      });
    }

    setAiTodos(generatedTodos);
  };

  const toggleTodo = (id: string) => {
    setAiTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const formatEventTime = (event: CalendarEvent) => {
    const date = new Date(event.startDatetime);
    if (event.allDay) return 'All day';
    return format(date, 'h:mm a');
  };

  const formatEventDate = (event: CalendarEvent) => {
    const date = new Date(event.startDatetime);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      fitness: 'bg-green-500/10 text-green-700 border-green-500/20',
      wellness: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      nutrition: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      personal: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
      work: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      social: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-foreground';
  };

  return (
    <>
      {/* Sidebar Toggle Button - Hidden when expanded */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-full rounded-r-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-bloom z-50 px-2 py-6"
          size="sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}

      {/* Expandable Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-card/95 backdrop-blur-md border-l border-border shadow-bloom-lg transition-all duration-300 z-40 overflow-y-auto",
          isExpanded ? "w-96" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="p-6 space-y-4">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground font-['Cormorant_Garamond']">Events & Schedule</h2>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* AI Todo List Generator */}
            {todayEvents.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent-foreground" />
                    <h3 className="font-semibold text-foreground">AI Task Planner</h3>
                  </div>
                  <Button
                    onClick={generateAITodos}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Generate
                  </Button>
                </div>

                {aiTodos.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {aiTodos.map((todo) => (
                      <label
                        key={todo.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-4 h-4 mt-0.5 rounded border-2 border-accent text-accent focus:ring-2 focus:ring-accent/20"
                        />
                        <div className="flex-1">
                          <span className={cn(
                            "text-sm block",
                            todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}>
                            {todo.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{todo.timeBlock}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {aiTodos.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Click "Generate" to create a smart todo list based on your events
                  </p>
                )}
              </Card>
            )}

            {/* Daily Events Section */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <button
                onClick={() => setDailyExpanded(!dailyExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Today</h3>
                  <span className="text-xs text-muted-foreground">({todayEvents.length})</span>
                </div>
                {dailyExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {dailyExpanded && (
                <div className="space-y-2 mt-3">
                  {todayEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled for today
                    </p>
                  ) : (
                    todayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-3 rounded-lg border transition-colors hover:shadow-sm",
                          getEventTypeColor(event.eventType)
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {event.description && (
                              <p className="text-xs opacity-80 mt-1">{event.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{formatEventTime(event)}</span>
                            </div>
                          </div>
                          <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-background/50">
                            {event.eventType}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* Weekly Events Section */}
            <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <button
                onClick={() => setWeeklyExpanded(!weeklyExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground">This Week</h3>
                  <span className="text-xs text-muted-foreground">({weekEvents.length})</span>
                </div>
                {weeklyExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {weeklyExpanded && (
                <div className="space-y-2 mt-3">
                  {weekEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled this week
                    </p>
                  ) : (
                    weekEvents.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-3 rounded-lg border transition-colors hover:shadow-sm",
                          getEventTypeColor(event.eventType)
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">{formatEventDate(event)}</span>
                              <span className="text-xs opacity-60">•</span>
                              <span className="text-xs">{formatEventTime(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                          </div>
                          <span className="text-xs capitalize px-2 py-1 rounded-full bg-background/50">
                            {event.eventType}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* Monthly Events Section */}
            <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
              <button
                onClick={() => setMonthlyExpanded(!monthlyExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">This Month</h3>
                  <span className="text-xs text-muted-foreground">({monthEvents.length})</span>
                </div>
                {monthlyExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {monthlyExpanded && (
                <div className="space-y-2 mt-3 max-h-96 overflow-y-auto">
                  {monthEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled this month
                    </p>
                  ) : (
                    monthEvents.slice(0, 20).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-2 rounded-lg border transition-colors hover:shadow-sm",
                          getEventTypeColor(event.eventType)
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-medium">{formatEventDate(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                          </div>
                          <span className="text-xs capitalize">{event.eventType}</span>
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
