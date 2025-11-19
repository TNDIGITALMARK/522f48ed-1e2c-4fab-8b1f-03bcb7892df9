"use client";

import { Navigation } from '@/components/navigation';
import { RootedHeader } from '@/components/rooted-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, ArrowLeft, Plus, Droplets, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  generateCalendarDays,
  getActiveCycle,
  saveCycle,
  type PeriodCycle,
  type CalendarDay,
} from '@/lib/period-calendar';
import { format, addMonths, subMonths } from 'date-fns';

export default function PeriodCalendarPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [activeCycle, setActiveCycle] = useState<PeriodCycle | null>(null);

  // Mock user ID - in production this would come from authentication
  const userId = 'demo-user';

  // Load calendar data
  useEffect(() => {
    const cycle = getActiveCycle(userId);
    setActiveCycle(cycle);

    const days = generateCalendarDays(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      cycle,
      [], // No events needed for period tracking
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
    setShowLogDialog(true);
  };

  const handleLogPeriodStart = () => {
    if (!selectedDate) return;

    const newCycle: PeriodCycle = {
      id: `cycle-${Date.now()}`,
      userId,
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      cycleLength: activeCycle?.cycleLength || 28,
      periodLength: activeCycle?.periodLength || 5,
      currentPhase: 'menstruation',
      flowIntensity: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCycle(newCycle);
    setActiveCycle(newCycle);
    setShowLogDialog(false);

    // Refresh calendar
    setCurrentMonth(new Date(currentMonth));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get phase color classes
  const getPhaseColorClass = (phase?: string) => {
    switch (phase) {
      case 'menstruation':
        return 'bg-gradient-to-br from-[hsl(345,40%,88%)] to-[hsl(345,40%,78%)]';
      case 'follicular':
        return 'bg-gradient-to-br from-[hsl(280,35%,85%)] to-[hsl(280,35%,75%)]';
      case 'ovulation':
        return 'bg-gradient-to-br from-[hsl(135,20%,85%)] to-[hsl(135,20%,75%)]';
      case 'luteal':
        return 'bg-gradient-to-br from-[hsl(15,50%,88%)] to-[hsl(15,50%,78%)]';
      default:
        return 'bg-[hsl(35,40%,94%)]';
    }
  };

  return (
    <div className="min-h-screen relative pb-24">
      {/* Botanical background with reduced opacity - matching homepage */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('/backgrounds/botanical-pattern.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      {/* Pure white background layer - matching homepage */}
      <div className="fixed inset-0 -z-20 bg-white" />

      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 px-6 py-4 animate-fade-in-up shadow-bloom-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
              <span className="text-foreground italic">Period Calendar</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-4xl mb-2">Log Your Period</h1>
          <p className="text-muted-foreground text-lg">
            Track your cycle with color-coded phases
          </p>
        </div>

        {/* Calendar Card */}
        <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6 animate-fade-in-up animation-delay-400">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeCycle
                  ? `Tracking cycle starting ${format(new Date(activeCycle.startDate), 'MMM d, yyyy')}`
                  : 'Click a date to log your period start'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
                className="rounded-full"
              >
                <CalendarIcon className="w-4 h-4 rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="rounded-full"
              >
                <CalendarIcon className="w-4 h-4" />
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
              const phaseColorClass = getPhaseColorClass(day.cyclePhase);
              const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();

              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    calendar-day
                    ${day.isToday ? 'today ring-2 ring-primary' : ''}
                    ${day.isSelected ? 'selected ring-2 ring-secondary' : ''}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    transition-all hover:scale-105
                    ${phaseColorClass}
                  `}
                >
                  <div className="day-number font-semibold">
                    {format(day.date, 'd')}
                  </div>

                  {/* Period indicator */}
                  {day.isPeriodDay && (
                    <div className="absolute top-1 right-1">
                      <Droplets className="w-4 h-4 text-rose-600 fill-rose-500" />
                    </div>
                  )}

                  {/* Cycle day number */}
                  {day.dayOfCycle && (
                    <div className="absolute bottom-1 left-1 text-[10px] font-medium text-primary/60">
                      D{day.dayOfCycle}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="mt-6 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Cycle Phase Colors</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[hsl(345,40%,88%)] to-[hsl(345,40%,78%)] border border-foreground/20" />
                <span className="text-sm">Menstruation (Days 1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[hsl(280,35%,85%)] to-[hsl(280,35%,75%)] border border-foreground/20" />
                <span className="text-sm">Follicular (Days 6-13)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[hsl(135,20%,85%)] to-[hsl(135,20%,75%)] border border-foreground/20" />
                <span className="text-sm">Ovulation (Days 14-16)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[hsl(15,50%,88%)] to-[hsl(15,50%,78%)] border border-foreground/20" />
                <span className="text-sm">Luteal (Days 17-28)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cycle Info Card */}
        {activeCycle && (
          <Card className="mt-6 bloom-card animate-fade-in-up animation-delay-600">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Current Cycle</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Started</p>
                    <p className="font-medium">{format(new Date(activeCycle.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cycle Length</p>
                    <p className="font-medium">{activeCycle.cycleLength} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Period Length</p>
                    <p className="font-medium">{activeCycle.periodLength} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Phase</p>
                    <Badge variant="secondary" className="capitalize">
                      {activeCycle.currentPhase}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Log Period Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="event-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-rose-500" />
              Log Period Start
            </DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-muted/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                This will mark <strong>{selectedDate && format(selectedDate, 'MMMM d')}</strong> as the
                start of your period. The calendar will automatically color-code your cycle phases.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <span className="text-sm font-medium">Cycle Length</span>
                <span className="text-sm text-muted-foreground">{activeCycle?.cycleLength || 28} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <span className="text-sm font-medium">Period Length</span>
                <span className="text-sm text-muted-foreground">{activeCycle?.periodLength || 5} days</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLogPeriodStart} className="gap-2">
              <Plus className="w-4 h-4" />
              Log Period Start
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}
