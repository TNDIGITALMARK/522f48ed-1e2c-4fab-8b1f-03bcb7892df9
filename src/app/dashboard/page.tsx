"use client";

import { useState, useEffect, useRef } from 'react';
import { ExpandableSidebar } from '@/components/expandable-sidebar';
import { EventsSidebar } from '@/components/events-sidebar';
import { GoalsPanel } from '@/components/goals-panel';
import { EventsScheduler } from '@/components/events-scheduler';
import { MonthlyCalendar } from '@/components/monthly-calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Activity, TrendingUp, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [userName] = useState('Brooklyn');
  const goalsPanelRef = useRef<{ reloadGoals: () => void } | null>(null);

  useEffect(() => {
    // Get current month name
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  }, []);

  function handleGoalsGenerated() {
    // Trigger reload of goals panel when goals are generated
    window.location.reload(); // Simple approach to refresh data
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Left Expandable Sidebar */}
      <ExpandableSidebar />

      {/* Right Events Sidebar */}
      <EventsSidebar />

      {/* Main Content Area */}
      <div className="min-h-screen p-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          {/* Month at top left, greeting in center */}
          <div className="flex items-start justify-between mb-12">
            <h1 className="text-4xl font-bold text-foreground font-['Cormorant_Garamond']">
              {currentMonth}
            </h1>

            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground font-light tracking-wide">
                Hi {userName}
              </p>
            </div>

            <div className="w-32"></div> {/* Spacer for balance */}
          </div>

          {/* Dashboard Content Grid - No boxes, clean layout */}
          <div className="space-y-12">
            {/* Quick Stats Row - Half Circle Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/cycle">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-sm">Cycle Tracking</h3>
                    <p className="text-xs text-muted-foreground">Day 12 - Follicular</p>
                  </div>
                </div>
              </Link>

              <Link href="/workout">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-sm">Today's Workout</h3>
                    <p className="text-xs text-muted-foreground">Strength Training</p>
                  </div>
                </div>
              </Link>

              <Link href="/wellness">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-sm">Wellness Score</h3>
                    <p className="text-xs text-muted-foreground">85% - Great!</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Main Dashboard Widgets - Split into three columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT SIDE - Calendar */}
              <div className="lg:col-span-1">
                <MonthlyCalendar />
              </div>

              {/* MIDDLE - Existing Dashboard Content */}
              <div className="lg:col-span-1 space-y-8">
                {/* Today's Focus Card */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">Today's Focus</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-1 text-sm">Morning Intention</h3>
                      <p className="text-xs text-muted-foreground">
                        Start your day with gratitude and movement. Your body is ready for energy and nourishment.
                      </p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-1 text-sm">Nutrition Tip</h3>
                      <p className="text-xs text-muted-foreground">
                        You're in your follicular phase - great time for complex carbs and lean proteins.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Weekly Progress Card */}
                <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">This Week</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-xs text-foreground">Workouts Completed</span>
                      <span className="text-xl font-bold text-primary">3/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-xs text-foreground">Water Intake</span>
                      <span className="text-xl font-bold text-secondary">64oz</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-xs text-foreground">Sleep Average</span>
                      <span className="text-xl font-bold text-accent-foreground">7.5h</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT SIDE - Goals and Scheduling System */}
              <div className="lg:col-span-1 space-y-8">
                {/* Events Scheduler */}
                <EventsScheduler onGoalsGenerated={handleGoalsGenerated} />

                {/* Goals Panel - Daily/Weekly/Monthly */}
                <GoalsPanel />
              </div>
            </div>

            {/* Activity Calendar Preview */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold font-['Cormorant_Garamond']">Activity Calendar</h2>
                <Link href="/cycle">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View Full Calendar
                    <Calendar className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">{i + 1}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Section */}
            <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-accent-foreground" />
                <h2 className="text-2xl font-semibold font-['Cormorant_Garamond']">Community</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Connect with others on their wellness journey. Share experiences, tips, and support.
              </p>
              <Link href="/community">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Join the Conversation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
