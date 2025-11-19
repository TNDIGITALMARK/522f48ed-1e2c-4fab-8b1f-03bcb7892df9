"use client";

import { useState, useEffect } from 'react';
import { ExpandableSidebar } from '@/components/expandable-sidebar';
import { EventsSidebar } from '@/components/events-sidebar';
import { TasksSidebar } from '@/components/tasks-sidebar';
import { MonthlyCalendar } from '@/components/monthly-calendar';
import { ImportantTasksWidget } from '@/components/important-tasks-widget';
import { VisionBoardWidget } from '@/components/vision-board-widget';
import { TodaysFocusWidget } from '@/components/todays-focus-widget';
import { DailyRootsWidget } from '@/components/daily-roots-widget';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Activity, Users, Sparkles, CheckCircle2, Apple, Brain, Moon } from 'lucide-react';
import Link from 'next/link';
import { DashboardSettings } from '@/components/dashboard-settings';
import { useWellnessGoals } from '@/hooks/use-wellness-goals';

const GOAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fitness: Activity,
  nutrition: Apple,
  mental: Brain,
  sleep: Moon,
  cycle: Heart,
  holistic: Sparkles,
};

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTasksSidebarOpen, setIsTasksSidebarOpen] = useState(false);
  const { goals, isLoading: goalsLoading } = useWellnessGoals();

  useEffect(() => {
    // Get current month name
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Botanical background with reduced opacity - subtle flower and root patterns */}
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
      {/* Pure white background layer */}
      <div className="fixed inset-0 -z-20 bg-white" />

      {/* Dashboard Header with profile picture, name, and status */}
      <DashboardHeader />

      {/* Left Expandable Sidebar */}
      <ExpandableSidebar />

      {/* Right Tasks Sidebar - Controlled state */}
      <TasksSidebar isOpen={isTasksSidebarOpen} onOpenChange={setIsTasksSidebarOpen} />

      {/* Main Content Area */}
      <div className="min-h-screen p-8 pt-16">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          {/* Greeting centered at top */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold font-['Cormorant_Garamond'] text-foreground mb-2">
              Wellness Home
            </h2>
            {!goalsLoading && goals.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {goals.slice(0, 4).map((goalId) => {
                  const Icon = GOAL_ICONS[goalId] || Sparkles;
                  return (
                    <div
                      key={goalId}
                      className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                      title={`${goalId} goal active`}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  );
                })}
                {goals.length > 4 && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    +{goals.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dashboard Content Grid - No boxes, clean layout */}
          <div className="space-y-12">
            {/* Monthly Vision Board with Tasks Button */}
            <div className="relative">
              {/* Month label above vision board - smaller size */}
              <h3 className="text-lg font-medium text-foreground font-['Cormorant_Garamond'] mb-3">
                {currentMonth}
              </h3>
              <VisionBoardWidget />
              <Button
                onClick={() => setIsTasksSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                View Tasks
              </Button>
            </div>

            {/* Important Tasks with integrated Wellness Bars */}
            <ImportantTasksWidget onOpenSidebar={() => setIsSidebarOpen(true)} />

            {/* Widget Header - Single Line */}
            <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
              <Link href="/cycle" className="block flex-shrink-0">
                <div className="bg-[hsl(35,40%,94%)] hover:bg-[hsl(35,40%,92%)] border border-black/10 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group hover:shadow-md flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight whitespace-nowrap">Cycle Tracking</h3>
                </div>
              </Link>

              <Link href="/workout" className="block flex-shrink-0">
                <div className="bg-[hsl(35,40%,94%)] hover:bg-[hsl(35,40%,92%)] border border-black/10 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group hover:shadow-md flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight whitespace-nowrap">Workout</h3>
                </div>
              </Link>

              <Link href="/nutrition" className="block flex-shrink-0">
                <div className="bg-[hsl(35,40%,94%)] hover:bg-[hsl(35,40%,92%)] border border-black/10 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group hover:shadow-md flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Apple className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight whitespace-nowrap">Nutrition</h3>
                </div>
              </Link>

              <Link href="/community" className="block flex-shrink-0">
                <div className="bg-[hsl(35,40%,94%)] hover:bg-[hsl(35,40%,92%)] border border-black/10 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group hover:shadow-md flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight whitespace-nowrap">Community</h3>
                </div>
              </Link>
            </div>

            {/* Main Dashboard Widgets - Split into two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT SIDE - Calendar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Calendar */}
                <MonthlyCalendar />
              </div>

              {/* RIGHT SIDE - Focus & Streak Tracker */}
              <div className="lg:col-span-1 space-y-8">
                {/* AI-Curated Today's Focus - Based on cycle phase with wellness quote */}
                <TodaysFocusWidget />

                {/* Daily Roots - App usage streak tracker */}
                <DailyRootsWidget />
              </div>
            </div>

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

            {/* Dashboard Customization Settings - Bottom of page */}
            <div className="flex justify-center items-center py-8 border-t border-black/30 mt-8">
              <div className="text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  Personalize your wellness dashboard
                </p>
                <DashboardSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
