"use client";

import { useState, useEffect } from 'react';
import { ExpandableSidebar } from '@/components/expandable-sidebar';
import { EventsSidebar } from '@/components/events-sidebar';
import { TasksSidebar } from '@/components/tasks-sidebar';
import { GoalsPanel } from '@/components/goals-panel';
import { MonthlyCalendar } from '@/components/monthly-calendar';
import { ImportantTasksWidget } from '@/components/important-tasks-widget';
import { VisionBoardWidget } from '@/components/vision-board-widget';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Activity, TrendingUp, Users, Sparkles, CheckCircle2, Apple, Brain, Moon } from 'lucide-react';
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
  const [userName] = useState('Brooklyn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTasksSidebarOpen, setIsTasksSidebarOpen] = useState(false);
  const { goals, isLoading: goalsLoading } = useWellnessGoals();

  useEffect(() => {
    // Get current month name
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Left Expandable Sidebar */}
      <ExpandableSidebar />

      {/* Right Tasks Sidebar - Controlled state */}
      <TasksSidebar isOpen={isTasksSidebarOpen} onOpenChange={setIsTasksSidebarOpen} />

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
              <p className="text-sm text-muted-foreground font-light tracking-wide mb-2">
                Hi {userName}
              </p>
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

            <div className="w-32"></div> {/* Spacer for balance */}
          </div>

          {/* Dashboard Content Grid - No boxes, clean layout */}
          <div className="space-y-12">
            {/* Monthly Vision Board with Tasks Button */}
            <div className="relative">
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

            {/* Quick Stats Row - Half Circle Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/cycle">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-xs">Cycle Tracking</h3>
                  </div>
                </div>
              </Link>

              <Link href="/workout">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-xs">Today's Workout</h3>
                  </div>
                </div>
              </Link>

              <Link href="/wellness">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-xs">Wellness Score</h3>
                  </div>
                </div>
              </Link>

              <Link href="/community">
                <div className="relative overflow-hidden bg-white rounded-t-full aspect-[2/1] hover:shadow-bloom transition-all duration-300 cursor-pointer group border border-border p-4 flex flex-col items-center justify-end pb-6">
                  <div className="absolute top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-semibold text-foreground text-xs">Community</h3>
                  </div>
                </div>
              </Link>
            </div>

            {/* Main Dashboard Widgets - Split into two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT SIDE - Calendar with integrated schedule */}
              <div className="lg:col-span-1">
                <MonthlyCalendar />
              </div>

              {/* RIGHT SIDE - Focus, Progress, and Goals */}
              <div className="lg:col-span-1 space-y-8">
                {/* Today's Focus Card - Personalized based on wellness goals */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">Today's Focus</h2>
                  </div>
                  <div className="space-y-3">
                    {goals.includes('fitness') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" />
                          Movement & Strength
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Your body is ready for movement today. Focus on exercises that energize and strengthen you.
                        </p>
                      </div>
                    )}
                    {goals.includes('nutrition') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                          <Apple className="w-3.5 h-3.5" />
                          Nutrition Tip
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Prioritize whole foods and stay hydrated. Your nutrition choices today support your goals.
                        </p>
                      </div>
                    )}
                    {goals.includes('mental') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5" />
                          Mindfulness Moment
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Take time for stillness today. Even 5 minutes of meditation can ground your mind.
                        </p>
                      </div>
                    )}
                    {goals.includes('sleep') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                          <Moon className="w-3.5 h-3.5" />
                          Rest & Recovery
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Quality rest is essential. Create a calming evening routine for better sleep tonight.
                        </p>
                      </div>
                    )}
                    {goals.includes('cycle') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5" />
                          Cycle Awareness
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Listen to your body's rhythms. Align your activities with your natural cycle.
                        </p>
                      </div>
                    )}
                    {(goals.includes('holistic') || goals.length === 0) && !goals.includes('fitness') && !goals.includes('nutrition') && (
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h3 className="font-medium text-foreground mb-1 text-sm">Morning Intention</h3>
                        <p className="text-xs text-muted-foreground">
                          Start your day with gratitude and balance. Your wellness journey is uniquely yours.
                        </p>
                      </div>
                    )}
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

            {/* Dashboard Customization Settings - Bottom of page */}
            <div className="flex justify-center items-center py-8 border-t border-border/30 mt-8">
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
