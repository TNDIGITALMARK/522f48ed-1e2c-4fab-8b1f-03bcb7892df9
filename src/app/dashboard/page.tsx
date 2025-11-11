"use client";

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Droplets,
  Footprints,
  Calendar,
  Moon,
  Plus,
  ArrowRight,
  Dumbbell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/use-user-profile';
import { SharedCalendar } from '@/components/shared-calendar';
import { GoalsTodoList } from '@/components/goals-todo-list';
import { BloomingFlower } from '@/components/blooming-flower';
import { HormoneWave3D } from '@/components/hormone-wave-3d';
import { SwipeableSleepTracker } from '@/components/swipeable-sleep-tracker';
import { DailyAspiration } from '@/components/daily-aspiration';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

export default function DashboardPage() {
  // Use centralized dashboard data hook
  const {
    profile,
    updateWellness,
    isLoading
  } = useDashboardData(MOCK_USER_ID);

  // Modal state for metric cards
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'hydration' | 'steps' | 'sleep' | 'workout' | null>(null);

  const openMetricModal = (metric: 'hydration' | 'steps' | 'sleep' | 'workout') => {
    setSelectedMetric(metric);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMetric(null);
  };

  // Mock wellness data
  const userData = {
    name: "Sarah",
    cycleDay: 14,
    phase: "Ovulation Phase",
    sleepHours: profile?.sleepHours || 7.5,
    meditation: {
      completed: profile?.meditationCompleted || 12,
      goal: profile?.meditationGoal || 15
    },
    steps: {
      completed: profile?.stepsCompleted || 8000,
      goal: profile?.stepsGoal || 10000
    },
    water: {
      completed: profile?.waterConsumed || 6,
      goal: profile?.waterGoal || 8
    }
  };

  // Handler for updating water intake
  const handleAddWater = () => {
    if (profile) {
      updateWellness({
        waterConsumed: Math.min(profile.waterConsumed + 1, profile.waterGoal)
      });
    }
  };

  // Get current date info
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Generate week dates (centered on today)
  const getWeekDates = () => {
    const dates = [];
    const today = now.getDay();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12 px-6">
        {/* Modern Header with Greeting - Reduced spacing */}
        <div className="pt-6 pb-0 animate-fade-in-up">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-1">
                {days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}
              </p>
              <h1 className="text-4xl font-bold mb-1">
                Hi {userData.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Cycle Phase Banner - Rearranged Layout */}
        <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden relative animate-fade-in-up animation-delay-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] mt-2 p-6">
          {/* Animated background gradient pulse */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none hidden lg:block">
            <BloomingFlower size={120} duration={3000} delay={1500} />
          </div>

          {/* Title at top */}
          <div className="relative z-10 mb-6">
            <p className="text-sm text-muted-foreground mb-2 text-center">Your Cycle Phase</p>
          </div>

          {/* Animation in center */}
          <div className="relative z-10 flex justify-center mb-6">
            {/* Desktop flower - larger, prominent */}
            <div className="hidden md:flex items-center justify-center animate-fade-in-scale animation-delay-400">
              <BloomingFlower size={160} duration={2500} delay={800} />
            </div>
            {/* Mobile flower - smaller, compact */}
            <div className="flex md:hidden items-center justify-center animate-fade-in-scale animation-delay-400">
              <BloomingFlower size={90} duration={2000} delay={600} />
            </div>
          </div>

          {/* Phase info below animation */}
          <div className="relative z-10 mb-6 text-center">
            <h2 className="text-3xl font-bold mb-2">{userData.phase}</h2>
            <p className="text-muted-foreground mb-4">Day {userData.cycleDay} of your cycle</p>
            <Link href="/cycle">
              <Button className="rounded-full">
                View Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* 3D Animated Hormone Wave */}
          <div className="relative z-10 mt-4 -mx-6">
            <HormoneWave3D
              phase="ovulation"
              width={800}
              height={180}
              className="w-full"
            />
          </div>

          {/* Log a Symptom Button */}
          <div className="relative z-10 mt-6 -mx-6 p-6 bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 border-t border-primary/10">
            <Link href="/log-symptom">
              <Button className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-bloom">
                <Plus className="mr-2 w-5 h-5" />
                Log a Symptom
              </Button>
            </Link>
          </div>
        </div>

        {/* Rooted Reset Section - MOVED AFTER CYCLE PHASE */}
        <div className="animate-fade-in-up animation-delay-300 mt-4">
          <DailyAspiration userId={MOCK_USER_ID} />
        </div>

        {/* Shared Calendar Section */}
        <Card className="bloom-card card-fabric animate-fade-in-up animation-delay-400 textile-overlay-cream mt-4">
          <SharedCalendar userId={MOCK_USER_ID} />
        </Card>

        {/* Todo List Section - MOVED UNDERNEATH CALENDAR */}
        <div className="animate-fade-in-up animation-delay-600 mt-4">
          <GoalsTodoList userId={MOCK_USER_ID} />
        </div>


        {/* Health Metrics Grid - 4 Interactive Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-scale animation-delay-1000 mt-4">
          {/* Hydration Card - Blue */}
          <Card
            className="glass-card card-marble group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'hsl(210 100% 92%)', borderColor: 'hsl(210 80% 75%)' }}
            onClick={() => openMetricModal('hydration')}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'hsl(210 60% 40%)' }}>Hydration</p>
                <p className="text-3xl font-bold" style={{ color: 'hsl(210 80% 30%)' }}>
                  {userData.water.completed}<span className="text-lg opacity-70">/{userData.water.goal}</span>
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(210 100% 85%)' }}>
                <Droplets className="w-7 h-7" style={{ color: 'hsl(210 90% 45%)' }} />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.water.completed / userData.water.goal) * 100} className="h-2" />
              <p className="text-xs" style={{ color: 'hsl(210 40% 50%)' }}>
                {userData.water.goal - userData.water.completed} glasses remaining
              </p>
            </div>
          </Card>

          {/* Steps Card - Brown */}
          <Card
            className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'hsl(25 30% 90%)', borderColor: 'hsl(25 25% 70%)' }}
            onClick={() => openMetricModal('steps')}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'hsl(25 25% 35%)' }}>Steps</p>
                <p className="text-3xl font-bold" style={{ color: 'hsl(25 30% 25%)' }}>
                  {(userData.steps.completed / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(25 35% 80%)' }}>
                <Footprints className="w-7 h-7" style={{ color: 'hsl(25 40% 40%)' }} />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.steps.completed / userData.steps.goal) * 100} className="h-2" />
              <p className="text-xs" style={{ color: 'hsl(25 20% 45%)' }}>
                {((userData.steps.goal - userData.steps.completed) / 1000).toFixed(1)}k to goal
              </p>
            </div>
          </Card>

          {/* Sleep Card - Light Sage Green */}
          <Card
            className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'hsl(100 25% 90%)', borderColor: 'hsl(100 20% 70%)' }}
            onClick={() => openMetricModal('sleep')}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'hsl(100 25% 35%)' }}>Sleep</p>
                <p className="text-3xl font-bold" style={{ color: 'hsl(100 30% 25%)' }}>
                  {userData.sleepHours}h
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(100 30% 80%)' }}>
                <Moon className="w-7 h-7" style={{ color: 'hsl(100 35% 40%)' }} />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.sleepHours / 8) * 100} className="h-2" />
              <p className="text-xs" style={{ color: 'hsl(100 20% 40%)' }}>
                {(8 - userData.sleepHours).toFixed(1)}h until target
              </p>
            </div>
          </Card>

          {/* Workout Card - White/Black */}
          <Card
            className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'hsl(0 0% 98%)', borderColor: 'hsl(0 0% 85%)' }}
            onClick={() => openMetricModal('workout')}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'hsl(0 0% 30%)' }}>Workout</p>
                <p className="text-3xl font-bold" style={{ color: 'hsl(0 0% 10%)' }}>
                  3<span className="text-lg opacity-70">/5</span>
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 90%)' }}>
                <Dumbbell className="w-7 h-7" style={{ color: 'hsl(0 0% 20%)' }} />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={60} className="h-2" />
              <p className="text-xs" style={{ color: 'hsl(0 0% 45%)' }}>
                2 sessions this week
              </p>
            </div>
          </Card>
        </div>

        {/* Swipeable Sleep Tracker Section */}
        <div className="animate-fade-in-up animation-delay-1400 mt-4">
          <SwipeableSleepTracker />
        </div>

        {/* Metric Insights/Edit Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closeModal}
          >
            <Card
              className="w-full max-w-md p-6 relative animate-fade-in-scale"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {selectedMetric === 'hydration' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(210 100% 85%)' }}>
                      <Droplets className="w-6 h-6" style={{ color: 'hsl(210 90% 45%)' }} />
                    </div>
                    <h3 className="text-2xl font-bold">Hydration Tracker</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Daily Goal</p>
                      <p className="text-3xl font-bold">{userData.water.goal} glasses</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Completed Today</p>
                      <p className="text-3xl font-bold" style={{ color: 'hsl(210 80% 40%)' }}>
                        {userData.water.completed} glasses
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">💡 Insight</p>
                      <p className="text-sm text-muted-foreground">
                        You're {Math.round((userData.water.completed / userData.water.goal) * 100)}% of the way to your daily hydration goal. Keep it up!
                      </p>
                    </div>
                    <Button className="w-full" onClick={handleAddWater}>
                      Add Glass of Water
                    </Button>
                  </div>
                </div>
              )}

              {selectedMetric === 'steps' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(25 35% 80%)' }}>
                      <Footprints className="w-6 h-6" style={{ color: 'hsl(25 40% 40%)' }} />
                    </div>
                    <h3 className="text-2xl font-bold">Steps Tracker</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Daily Goal</p>
                      <p className="text-3xl font-bold">{userData.steps.goal.toLocaleString()} steps</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Steps Today</p>
                      <p className="text-3xl font-bold" style={{ color: 'hsl(25 40% 35%)' }}>
                        {userData.steps.completed.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(25 40% 95%)' }}>
                      <p className="text-sm font-medium mb-2">💡 Insight</p>
                      <p className="text-sm text-muted-foreground">
                        Great progress! You've walked {(userData.steps.completed / userData.steps.goal * 100).toFixed(0)}% of your daily goal.
                      </p>
                    </div>
                    <Link href="/workout">
                      <Button className="w-full">Log Activity</Button>
                    </Link>
                  </div>
                </div>
              )}

              {selectedMetric === 'sleep' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(100 30% 80%)' }}>
                      <Moon className="w-6 h-6" style={{ color: 'hsl(100 35% 40%)' }} />
                    </div>
                    <h3 className="text-2xl font-bold">Sleep Tracker</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Target Sleep</p>
                      <p className="text-3xl font-bold">8 hours</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Last Night</p>
                      <p className="text-3xl font-bold" style={{ color: 'hsl(100 35% 35%)' }}>
                        {userData.sleepHours} hours
                      </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(100 30% 95%)' }}>
                      <p className="text-sm font-medium mb-2">💡 Insight</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.sleepHours >= 7
                          ? 'Excellent! You got quality rest last night.'
                          : `Try to get ${(8 - userData.sleepHours).toFixed(1)} more hours tonight for optimal recovery.`}
                      </p>
                    </div>
                    <Button className="w-full">Edit Sleep Log</Button>
                  </div>
                </div>
              )}

              {selectedMetric === 'workout' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 90%)' }}>
                      <Dumbbell className="w-6 h-6" style={{ color: 'hsl(0 0% 20%)' }} />
                    </div>
                    <h3 className="text-2xl font-bold">Workout Tracker</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Weekly Goal</p>
                      <p className="text-3xl font-bold">5 sessions</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">This Week</p>
                      <p className="text-3xl font-bold">3 sessions</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">💡 Insight</p>
                      <p className="text-sm text-muted-foreground">
                        You're on track! Complete 2 more sessions this week to hit your goal.
                      </p>
                    </div>
                    <Link href="/workout">
                      <Button className="w-full">Start Workout</Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
