"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Plus, ChevronDown, ChevronUp, Target, Calendar as CalendarIcon } from 'lucide-react';
import {
  getUserGoals,
  getActiveGoals,
  createGoal,
  createGoalFromTemplate,
  toggleGoalCompletion,
  subscribeToGoals,
  GOAL_TEMPLATES,
  type Goal
} from '@/lib/goals-store';
import {
  getWeekEvents,
  subscribeToEvents,
  type CalendarEvent
} from '@/lib/calendar-events-store';

interface GoalsTodoListProps {
  userId: string;
}

export function GoalsTodoList({ userId }: GoalsTodoListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [customGoalTitle, setCustomGoalTitle] = useState('');

  // Load goals and week's calendar events
  useEffect(() => {
    const loadedGoals = getActiveGoals(userId);
    setGoals(loadedGoals);

    const loadedWeekEvents = getWeekEvents(userId);
    setWeekEvents(loadedWeekEvents);

    const unsubscribeGoals = subscribeToGoals(userId, (allGoals) => {
      setGoals(allGoals.filter(g => !g.isCompleted));
    });

    const unsubscribeEvents = subscribeToEvents(userId, () => {
      setWeekEvents(getWeekEvents(userId));
    });

    return () => {
      unsubscribeGoals();
      unsubscribeEvents();
    };
  }, [userId]);

  const handleToggleGoal = (goalId: string) => {
    toggleGoalCompletion(userId, goalId);
  };

  const handleAddTemplateGoal = (template: typeof GOAL_TEMPLATES[number]) => {
    createGoalFromTemplate(userId, template);
    setIsAddGoalOpen(false);
  };

  const handleAddCustomGoal = () => {
    if (!customGoalTitle.trim()) return;

    createGoal(userId, {
      title: customGoalTitle,
      category: 'custom'
    });

    setCustomGoalTitle('');
    setIsAddGoalOpen(false);
  };

  // Format event time
  const formatEventTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format event date
  const formatEventDate = (datetime: string) => {
    const date = new Date(datetime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Show first 3 goals + all week events when collapsed
  const displayedGoals = isExpanded ? goals : goals.slice(0, 3);
  const displayedEvents = isExpanded ? weekEvents : weekEvents.slice(0, 5);
  const hasMoreItems = goals.length > 3 || weekEvents.length > 5;
  const totalItems = goals.length + weekEvents.length;

  return (
    <Card className="bloom-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light" style={{ fontFamily: 'Georgia, serif' }}>
          To Do List
        </h2>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsAddGoalOpen(true)}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Week's Calendar Events */}
        {displayedEvents.map(event => (
          <div
            key={event.id}
            className="flex items-center gap-4 p-4 rounded-xl border transition-colors"
            style={{ backgroundColor: 'hsl(100 18% 65% / 0.1)', borderColor: 'hsl(100 18% 65% / 0.2)' }}
          >
            <CalendarIcon className="w-6 h-6 flex-shrink-0" style={{ color: 'hsl(100 18% 45%)' }} />
            <div className="flex-1">
              <span className="text-base font-medium">
                {event.title}
              </span>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span>{formatEventDate(event.startDatetime)}</span>
                {!event.allDay && (
                  <>
                    <span>•</span>
                    <span>{formatEventTime(event.startDatetime)}</span>
                  </>
                )}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'hsl(100 18% 65% / 0.2)', color: 'hsl(100 18% 35%)' }}>
                  {event.eventType}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Goals */}
        {displayedGoals.map(goal => (
          <div
            key={goal.id}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => handleToggleGoal(goal.id)}
          >
            {goal.isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 group-hover:text-secondary transition-colors" />
            )}
            <div className="flex-1">
              <span className={`text-base ${goal.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </span>
              {goal.targetValue && (
                <div className="text-sm text-muted-foreground mt-1">
                  {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                </div>
              )}
            </div>
          </div>
        ))}

        {totalItems === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No tasks or events yet</p>
            <p className="text-sm">Add goals or schedule events to get started!</p>
          </div>
        )}
      </div>

      {hasMoreItems && (
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show {totalItems - 8} More
            </>
          )}
        </Button>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Popular Goals */}
            <div>
              <h3 className="font-semibold mb-3">Popular Goals</h3>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_TEMPLATES.map((template, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                    onClick={() => handleAddTemplateGoal(template)}
                  >
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm leading-tight">
                          {template.title}
                        </div>
                        {template.targetValue && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Target: {template.targetValue} {template.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Goal */}
            <div>
              <h3 className="font-semibold mb-3">Create Custom Goal</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your custom goal..."
                  value={customGoalTitle}
                  onChange={(e) => setCustomGoalTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomGoal();
                    }
                  }}
                />
                <Button onClick={handleAddCustomGoal} disabled={!customGoalTitle.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
