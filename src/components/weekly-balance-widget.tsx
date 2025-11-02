"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Moon,
  Zap,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getEvents,
  calculateWeeklyBalance,
  type CalendarEvent,
  type BalanceImpact,
  getEventTypeLabel
} from '@/lib/period-calendar';
import {
  startOfWeek,
  endOfWeek,
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  parseISO
} from 'date-fns';

interface WeeklyBalanceWidgetProps {
  userId: string;
}

export function WeeklyBalanceWidget({ userId }: WeeklyBalanceWidgetProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [balanceData, setBalanceData] = useState({
    restDays: 0,
    activeDays: 0,
    moderateDays: 0,
    recommendation: ''
  });

  useEffect(() => {
    const weekStart = startOfWeek(currentWeek);
    const weekEnd = endOfWeek(currentWeek);
    const events = getEvents(userId, weekStart, weekEnd);

    setWeekEvents(events);

    const balance = calculateWeeklyBalance(events, weekStart);
    setBalanceData({
      restDays: balance.restDays,
      activeDays: balance.activeDays,
      moderateDays: balance.moderateDays,
      recommendation: balance.recommendation
    });
  }, [currentWeek, userId]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleThisWeek = () => {
    setCurrentWeek(new Date());
  };

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const totalBalanceDays = balanceData.restDays + balanceData.activeDays + balanceData.moderateDays;
  const balanceScore = Math.min(100, (totalBalanceDays / 7) * 100);

  // Calculate balance quality (ideal is 2-3 rest, 2-3 active, 2-3 moderate)
  const isBalanced =
    balanceData.restDays >= 1 && balanceData.restDays <= 3 &&
    balanceData.activeDays >= 2 && balanceData.activeDays <= 4 &&
    balanceData.moderateDays >= 2 && balanceData.moderateDays <= 4;

  const impactColors: Record<BalanceImpact, string> = {
    rest: 'bg-blue-100 text-blue-700 border-blue-200',
    moderate: 'bg-green-100 text-green-700 border-green-200',
    active: 'bg-orange-100 text-orange-700 border-orange-200',
    none: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const impactIcons: Record<BalanceImpact, React.ReactNode> = {
    rest: <Moon className="w-3 h-3" />,
    moderate: <Activity className="w-3 h-3" />,
    active: <Zap className="w-3 h-3" />,
    none: <Calendar className="w-3 h-3" />
  };

  return (
    <Card className="bloom-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Smart Weekly Balance</h3>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousWeek}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThisWeek}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Balance Score */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Weekly Activity Balance</span>
          <Badge variant={isBalanced ? 'default' : 'secondary'}>
            {isBalanced ? 'Well Balanced' : 'Adjusting'}
          </Badge>
        </div>
        <Progress value={balanceScore} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{totalBalanceDays} of 7 days planned</span>
          <span>{Math.round(balanceScore)}%</span>
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
          <Moon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-700">{balanceData.restDays}</p>
          <p className="text-xs text-blue-600">Rest</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50 border border-green-100">
          <Activity className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-700">{balanceData.moderateDays}</p>
          <p className="text-xs text-green-600">Moderate</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-orange-50 border border-orange-100">
          <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-orange-700">{balanceData.activeDays}</p>
          <p className="text-xs text-orange-600">Active</p>
        </div>
      </div>

      {/* Week Calendar View */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-medium">This Week's Schedule</h4>
        <div className="space-y-2">
          {weekDays.map(day => {
            const dayEvents = weekEvents.filter(event =>
              isSameDay(parseISO(event.eventDate), day)
            );

            return (
              <div
                key={day.toISOString()}
                className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-xs text-muted-foreground">{format(day, 'EEE')}</p>
                  <p className="font-semibold">{format(day, 'd')}</p>
                </div>
                <div className="flex-1">
                  {dayEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No events</p>
                  ) : (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Badge
                            variant="outline"
                            className={`${impactColors[event.balanceImpactType]} flex items-center gap-1`}
                          >
                            {impactIcons[event.balanceImpactType]}
                            <span className="capitalize">{event.balanceImpactType}</span>
                          </Badge>
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendation */}
      {balanceData.recommendation && (
        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Smart Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              {balanceData.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <p>
            Events from your calendar automatically adjust this weekly balance.
            Aim for a mix of rest, moderate, and active days for optimal wellness.
          </p>
        </div>
      </div>
    </Card>
  );
}
