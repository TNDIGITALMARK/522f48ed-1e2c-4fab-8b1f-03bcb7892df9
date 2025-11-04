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
  CheckCircle2,
  Circle,
  Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/use-user-profile';
import { SmartCalendar } from '@/components/smart-calendar';
import { GoalsTodoList } from '@/components/goals-todo-list';
import { WorkoutSummary } from '@/components/workout-summary';
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

  // Mock workout data (in real app, this would come from state management or API)
  const mockWorkoutLogs = [
    { id: '1', exercise: 'Barbell Squat', sets: 4, reps: 8, weight: 135, calories: 250, date: '2025-10-28' },
    { id: '2', exercise: 'Bench Press', sets: 4, reps: 10, weight: 95, calories: 200, date: '2025-10-28' },
    { id: '3', exercise: 'Deadlift', sets: 3, reps: 6, weight: 185, calories: 300, date: '2025-10-26' },
  ];

  const mockCardioLogs = [
    {
      id: '1',
      machineName: 'Treadmill',
      durationMinutes: 30,
      caloriesBurned: 280,
      distance: 3.2,
      distanceUnit: 'mi',
      workoutDate: '2025-10-27',
      createdAt: '2025-10-27T10:00:00Z'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Minimal Header */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {days[now.getDay()].toUpperCase()}
          </p>
          <h1 className="text-6xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
            {months[now.getMonth()]}
          </h1>
          <p className="text-muted-foreground">{now.getFullYear()}</p>
        </div>

        {/* Horizontal Week Calendar */}
        <div className="flex justify-center gap-3 px-4">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === now.toDateString();
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all ${
                  isToday
                    ? 'bg-secondary text-white shadow-lg scale-110'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <span className="text-xs font-medium mb-1 opacity-70">
                  {days[date.getDay()]}
                </span>
                <span className={`text-2xl font-semibold ${isToday ? 'text-white' : ''}`}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Calendar Section - Now Smart Calendar */}
        <Card className="bloom-card p-8">
          <SmartCalendar userId={MOCK_USER_ID} />
        </Card>

        {/* Todo List Section - Now Goals Todo List */}
        <GoalsTodoList userId={MOCK_USER_ID} />

        {/* Workout Summary Section */}
        <WorkoutSummary workoutLogs={mockWorkoutLogs} cardioLogs={mockCardioLogs} />

        {/* Wellness Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Hydration */}
          <Card className="bloom-card flex flex-col items-center justify-center p-8 hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 rounded-full border-8 border-muted mb-4 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-8 border-secondary"
                style={{
                  clipPath: `inset(${100 - (userData.water.completed / userData.water.goal) * 100}% 0 0 0)`
                }}
              />
              <Droplets className="w-10 h-10 text-secondary z-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">
              {userData.water.completed}/{userData.water.goal}
            </p>
            <p className="text-sm text-muted-foreground">Glasses</p>
          </Card>

          {/* Steps */}
          <Card className="bloom-card flex flex-col items-center justify-center p-8 hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 rounded-full border-8 border-muted mb-4 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-8 border-secondary"
                style={{
                  clipPath: `inset(${100 - (userData.steps.completed / userData.steps.goal) * 100}% 0 0 0)`
                }}
              />
              <Footprints className="w-10 h-10 text-secondary z-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">
              {(userData.steps.completed / 1000).toFixed(1)}k
            </p>
            <p className="text-sm text-muted-foreground">Steps</p>
          </Card>

          {/* Sleep */}
          <Card className="bloom-card flex flex-col items-center justify-center p-8 hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 rounded-full border-8 border-muted mb-4 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-8 border-secondary"
                style={{
                  clipPath: `inset(${100 - (userData.sleepHours / 8) * 100}% 0 0 0)`
                }}
              />
              <Moon className="w-10 h-10 text-secondary z-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">{userData.sleepHours}h</p>
            <p className="text-sm text-muted-foreground">Sleep</p>
          </Card>
        </div>

        {/* Circular Action Buttons - Inspired by Image 1 */}
        <div className="flex justify-center gap-6 pt-4">
          <Link href="/recommendations">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/5 hover:bg-primary/10 hover:shadow-lg transition-all flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-primary transition-colors">
                AI PLAN
              </span>
            </button>
          </Link>

          <Link href="/rituals">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full border-2 border-muted hover:border-secondary hover:shadow-lg transition-all flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-colors">
                RITUALS
              </span>
            </button>
          </Link>

          <Link href="/workout">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full border-2 border-muted hover:border-secondary hover:shadow-lg transition-all flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-colors">
                WELLNESS
              </span>
            </button>
          </Link>

          <Link href="/nutrition">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full border-2 border-muted hover:border-secondary hover:shadow-lg transition-all flex items-center justify-center">
                <Brain className="w-8 h-8 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-colors">
                MINDFUL
              </span>
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
