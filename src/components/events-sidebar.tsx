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
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* AI Todo List Generator */}
            {todayEvents.length > 0 && (
              <Card className="p-3 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-700" />
                    <h3 className="text-sm font-medium text-gray-800">AI Task Planner</h3>
                  </div>
                  <Button
                    onClick={generateAITodos}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-gray-300 hover:bg-gray-50"
                  >
                    Generate
                  </Button>
                </div>

                {aiTodos.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {aiTodos.map((todo) => (
                      <label
                        key={todo.id}
                        className="flex items-start gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-4 h-4 mt-0.5 rounded border border-gray-300 text-gray-800 focus:ring-1 focus:ring-gray-400"
                        />
                        <div className="flex-1">
                          <span className={cn(
                            "text-sm block",
                            todo.completed ? "line-through text-gray-400" : "text-gray-700"
                          )}>
                            {todo.title}
                          </span>
                          <span className="text-xs text-gray-500">{todo.timeBlock}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {aiTodos.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    Click "Generate" to create a smart todo list
                  </p>
                )}
              </Card>
            )}

            {/* Daily Events Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setDailyExpanded(!dailyExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <h3 className="text-sm font-medium text-gray-800">Today</h3>
                  <span className="text-xs text-gray-500">({todayEvents.length})</span>
                </div>
                {dailyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {dailyExpanded && (
                <div className="space-y-2 mt-2">
                  {todayEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No events scheduled for today
                    </p>
                  ) : (
                    todayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-2.5 rounded-md border border-gray-200 bg-gray-50/50 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                            {event.description && (
                              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{formatEventTime(event)}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 capitalize px-2 py-0.5 rounded-full bg-white border border-gray-200">
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
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setWeeklyExpanded(!weeklyExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <h3 className="text-sm font-medium text-gray-800">This Week</h3>
                  <span className="text-xs text-gray-500">({weekEvents.length})</span>
                </div>
                {weeklyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {weeklyExpanded && (
                <div className="space-y-2 mt-2">
                  {weekEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No events scheduled this week
                    </p>
                  ) : (
                    weekEvents.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className="p-2.5 rounded-md border border-gray-200 bg-gray-50/50 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-medium text-gray-700">{formatEventDate(event)}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600">{formatEventTime(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                          </div>
                          <span className="text-xs text-gray-600 capitalize px-2 py-0.5 rounded-full bg-white border border-gray-200">
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
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setMonthlyExpanded(!monthlyExpanded)}
                className="w-full flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <h3 className="text-sm font-medium text-gray-800">This Month</h3>
                  <span className="text-xs text-gray-500">({monthEvents.length})</span>
                </div>
                {monthlyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {monthlyExpanded && (
                <div className="space-y-1.5 mt-2 max-h-96 overflow-y-auto">
                  {monthEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No events scheduled this month
                    </p>
                  ) : (
                    monthEvents.slice(0, 20).map((event) => (
                      <div
                        key={event.id}
                        className="p-2 rounded-md border border-gray-200 bg-gray-50/50 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-medium text-gray-700">{formatEventDate(event)}</span>
                            </div>
                            <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                          </div>
                          <span className="text-xs text-gray-600 capitalize">{event.eventType}</span>
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
