"use client";

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Droplets,
  Footprints,
  Brain,
  Calendar,
  Moon,
  Sun,
  Wind,
  Sparkles,
  Plus,
  ArrowRight
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
      <div className="max-w-6xl mx-auto space-y-6 pb-12 px-6">
        {/* Modern Header with Greeting and rooteding Flower Animation */}
        <div className="pt-6 pb-2 animate-fade-in-up">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-1">
                {days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}
              </p>
              <h1 className="text-4xl font-bold mb-2">
                Hi {userData.name}
              </h1>
              <p className="text-muted-foreground">
                Welcome to your wellness dashboard
              </p>
            </div>
            {/* Desktop flower - larger, prominent */}
            <div className="hidden md:flex items-center justify-center animate-fade-in-scale animation-delay-400">
              <BloomingFlower size={180} duration={2500} delay={800} />
            </div>
            {/* Mobile flower - smaller, compact */}
            <div className="flex md:hidden items-center justify-center animate-fade-in-scale animation-delay-400">
              <BloomingFlower size={100} duration={2000} delay={600} />
            </div>
          </div>
        </div>

        {/* Cycle Phase Banner - Hero Card Style with 3D Hormone Wave - MOVED TO TOP */}
        <Card className="glass-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20 overflow-hidden relative animate-fade-in-up animation-delay-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none hidden lg:block">
            <BloomingFlower size={120} duration={3000} delay={1500} />
          </div>

          {/* Top section with title and info */}
          <div className="relative z-10 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Cycle Phase</p>
                <h2 className="text-3xl font-bold mb-2">{userData.phase}</h2>
                <p className="text-muted-foreground mb-4">Day {userData.cycleDay} of your cycle</p>
                <Link href="/cycle">
                  <Button className="rounded-full">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* 3D Animated Hormone Wave */}
          <div className="relative z-10 mt-4 -mx-6 -mb-6">
            <HormoneWave3D
              phase="ovulation"
              width={800}
              height={180}
              className="w-full"
            />
          </div>
        </Card>

        {/* Rooted Reset Section - MOVED AFTER CYCLE PHASE */}
        <div className="animate-fade-in-up animation-delay-300">
          <DailyAspiration userId={MOCK_USER_ID} />
        </div>

        {/* Shared Calendar Section */}
        <Card className="bloom-card card-fabric animate-fade-in-up animation-delay-400 textile-overlay-cream">
          <SharedCalendar userId={MOCK_USER_ID} />
        </Card>

        {/* Todo List Section - MOVED UNDERNEATH CALENDAR */}
        <div className="animate-fade-in-up animation-delay-600">
          <GoalsTodoList userId={MOCK_USER_ID} />
        </div>

        {/* Horizontal Week Calendar - Rounded Pill Style */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-up animation-delay-800">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === now.toDateString();
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center min-w-[4.5rem] h-24 rounded-3xl transition-all duration-300 ${
                  isToday
                    ? 'bg-primary text-primary-foreground shadow-bloom scale-105'
                    : 'bg-card hover:bg-muted/80 hover:scale-105 hover:shadow-bloom-sm border border-border/50'
                }`}
              >
                <span className="text-xs font-medium mb-1.5 opacity-70 uppercase tracking-wider">
                  {days[date.getDay()]}
                </span>
                <span className="text-2xl font-bold">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Grid - Inspired by Smart Home Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-scale animation-delay-1000">
          {/* Hydration Card */}
          <Card className="glass-card card-marble group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hydration</p>
                <p className="text-3xl font-bold">
                  {userData.water.completed}<span className="text-lg text-muted-foreground">/{userData.water.goal}</span>
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.water.completed / userData.water.goal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userData.water.goal - userData.water.completed} glasses remaining
              </p>
            </div>
          </Card>

          {/* Steps Card */}
          <Card className="glass-card group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Steps</p>
                <p className="text-3xl font-bold">
                  {(userData.steps.completed / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Footprints className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.steps.completed / userData.steps.goal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {((userData.steps.goal - userData.steps.completed) / 1000).toFixed(1)}k to goal
              </p>
            </div>
          </Card>

          {/* Sleep Card */}
          <Card className="glass-card group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sleep</p>
                <p className="text-3xl font-bold">
                  {userData.sleepHours}h
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Moon className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={(userData.sleepHours / 8) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(8 - userData.sleepHours).toFixed(1)}h until target
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions - Circular Buttons Inspired by Smart Home */}
        <div className="grid grid-cols-4 gap-4 animate-fade-in-scale animation-delay-1200">
          <Link href="/workout" className="group">
            <Card className="glass-card flex flex-col items-center justify-center h-32 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Workout</span>
            </Card>
          </Link>

          <Link href="/nutrition" className="group">
            <Card className="glass-card flex flex-col items-center justify-center h-32 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-semibold">Nutrition</span>
            </Card>
          </Link>

          <Link href="/rituals" className="group">
            <Card className="glass-card flex flex-col items-center justify-center h-32 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-sm font-semibold">Rituals</span>
            </Card>
          </Link>

          <Link href="/recommendations" className="group">
            <Card className="glass-card flex flex-col items-center justify-center h-32 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">AI Plan</span>
            </Card>
          </Link>
        </div>

        {/* Swipeable Sleep Tracker Section */}
        <div className="animate-fade-in-up animation-delay-1400">
          <SwipeableSleepTracker />
        </div>
      </div>
    </DashboardLayout>
  );
}
