"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Footprints,
  Moon,
  BookOpen,
  CalendarDays,
  UtensilsCrossed
} from 'lucide-react';

export default function WellnessDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get week days starting from Sunday
  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date();

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold italic font-['Playfair_Display']">rooted</h1>
                <p className="text-xs text-muted-foreground">by Rooted</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search wellness data, meals..."
                className="pl-10 bg-muted/30 border-border/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">Sarah Thompson</p>
                <p className="text-xs text-muted-foreground">Premium Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <User className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Hi Sarah</h2>
          <p className="text-muted-foreground">welcome to your wellness dashboard</p>
        </div>

        {/* Tip Section */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            A little tip like its your slow-down season view your tips of the day:
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
            start blooming
          </Button>
        </div>

        {/* Calendar Widget */}
        <Card className="bg-primary p-6 mb-8 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary-foreground">
              {formatMonthYear(currentDate)}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((date, index) => (
              <div
                key={index}
                className={`
                  bg-white rounded-2xl p-4 text-center min-h-[120px] flex flex-col justify-between
                  ${isToday(date) ? 'ring-2 ring-primary-foreground' : ''}
                `}
              >
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {formatDayName(date)}
                  </p>
                  <p className="text-xs text-muted-foreground">{date.getDate()}</p>
                </div>
                {isToday(date) && (
                  <div className="mt-2">
                    <span className="text-xl">🌸</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full border-none"
            >
              Go to Calendar
            </Button>
          </div>
        </Card>

        {/* Current Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Current Stats:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hydration Card */}
            <Card className="bg-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Hydration</p>
                  <p className="text-3xl font-bold">6<span className="text-lg">📓</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">2 glasses remaining</p>
              </div>
            </Card>

            {/* Steps Card */}
            <Card className="bg-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Steps</p>
                  <p className="text-3xl font-bold">8.0k</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: '80%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">2.0k to goal</p>
              </div>
            </Card>

            {/* Sleep Card */}
            <Card className="bg-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Sleep</p>
                  <p className="text-3xl font-bold">7.5h</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: '94%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">0.5h until target</p>
              </div>
            </Card>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full border-none"
            >
              Track More
            </Button>
          </div>
        </div>

        {/* Cycle Phase Section */}
        <div className="mb-8">
          {/* Wave Divider */}
          <div className="mb-6 relative h-8">
            <svg
              viewBox="0 0 1200 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q300,20 600,50 T1200,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-foreground/30"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-center mb-6">
            You are in your Ovulation Phase
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nourish Card */}
            <Card className="bg-primary p-6 rounded-3xl text-primary-foreground">
              <h4 className="text-lg font-semibold mb-2">Nourish</h4>
              <p className="text-sm opacity-90">
                Nourish your body with warmth today
              </p>
            </Card>

            {/* Flow Card */}
            <Card className="bg-primary p-6 rounded-3xl text-primary-foreground">
              <h4 className="text-lg font-semibold mb-2">Flow</h4>
              <p className="text-sm opacity-90">
                Flow with energy — try your phase workout
              </p>
            </Card>

            {/* rooted Card */}
            <Card className="bg-primary p-6 rounded-3xl text-primary-foreground">
              <h4 className="text-lg font-semibold mb-2">rooted</h4>
              <p className="text-sm opacity-90">
                rooted into calm — journal, stretch, or reflect
              </p>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Journal
          </Button>
          <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Track your cycle
          </Button>
          <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Meal Plan
          </Button>
        </div>
      </main>
    </div>
  );
}
