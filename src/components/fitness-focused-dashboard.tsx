"use client";

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SharedCalendar } from '@/components/shared-calendar';
import { GoalsTodoList } from '@/components/goals-todo-list';
import { BloomingFlower } from '@/components/blooming-flower';
import { HormoneWave3D } from '@/components/hormone-wave-3d';
import { DailyAspiration } from '@/components/daily-aspiration';
import { HomepageCustomizerButton } from '@/components/homepage-customizer-button';
import { CircularNavigation } from '@/components/circular-navigation';
import { WorkoutSummary } from '@/components/workout-summary';
import { FitnessGoals } from '@/components/fitness-goals';
import { CycleWorkoutInsights } from '@/components/cycle-workout-insights';

const MOCK_USER_ID = 'demo-user-001';

export function FitnessFocusedDashboard() {
  const userData = {
    name: "Sarah",
    cycleDay: 14,
    phase: "Ovulation Phase",
  };

  // Mock workout logs
  const workoutLogs = [
    {
      id: '1',
      exercise: 'Squats',
      sets: 3,
      reps: 12,
      weight: 135,
      calories: 180,
      date: new Date().toISOString(),
    },
    {
      id: '2',
      exercise: 'Bench Press',
      sets: 4,
      reps: 10,
      weight: 95,
      calories: 150,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const cardioLogs = [
    {
      id: '1',
      machineName: 'Treadmill',
      durationMinutes: 30,
      caloriesBurned: 320,
      distance: 3.2,
      distanceUnit: 'miles',
      workoutDate: new Date(Date.now() - 172800000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12 px-6">
        {/* Greeting Header */}
        <div className="pt-2 pb-3 animate-fade-in-up">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-foreground text-center font-['Cormorant_Garamond']">
              Hi {userData.name}
            </h1>
          </div>
        </div>

        {/* Cycle Phase Banner */}
        <div className="overflow-hidden relative animate-fade-in-up animation-delay-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] mt-1 p-6" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: 'hsl(35 40% 94% / 0.25)' }} />
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none hidden lg:block">
            <BloomingFlower size={120} duration={3000} delay={1500} />
          </div>

          <div className="relative z-10 mb-6">
            <p className="text-sm text-muted-foreground mb-2 text-center">Your Cycle Phase</p>
          </div>

          <div className="relative z-10 mb-6 -mx-6">
            <HormoneWave3D
              phase="ovulation"
              width={800}
              height={180}
              className="w-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h3
                className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight font-['Playfair_Display']"
                style={{
                  color: 'hsl(25 11% 21%)',
                  textShadow: '0 2px 12px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.7), 0 4px 20px rgba(168, 184, 165, 0.3)',
                  opacity: 0.9,
                  letterSpacing: '0.02em'
                }}
              >
                Hi Brooklyn
              </h3>
            </div>
          </div>

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

          <div className="relative z-10 mt-6 -mx-6 p-6 border-t" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)', borderTopColor: 'hsl(35 40% 94% / 0.4)' }}>
            <Link href="/log-symptom">
              <Button className="w-full rounded-full shadow-bloom" style={{ backgroundColor: 'hsl(35 40% 88%)', border: '2px solid rgba(0, 0, 0, 0.4)', color: 'hsl(var(--foreground))', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                <Plus className="mr-2 w-5 h-5" />
                Log a Symptom
              </Button>
            </Link>
          </div>
        </div>

        {/* Workout Summary */}
        <div className="animate-fade-in-up animation-delay-300 mt-4">
          <WorkoutSummary workoutLogs={workoutLogs} cardioLogs={cardioLogs} />
        </div>

        {/* Fitness Goals */}
        <div className="animate-fade-in-up animation-delay-400 mt-4">
          <FitnessGoals userId={MOCK_USER_ID} />
        </div>

        {/* Cycle Workout Insights */}
        <div className="animate-fade-in-up animation-delay-500 mt-4">
          <CycleWorkoutInsights userId={MOCK_USER_ID} />
        </div>

        {/* Shared Calendar Section */}
        <div className="animate-fade-in-up animation-delay-600 mt-4">
          <SharedCalendar userId={MOCK_USER_ID} />
        </div>

        {/* Goals & Todo List */}
        <div className="animate-fade-in-up animation-delay-700 mt-4">
          <GoalsTodoList userId={MOCK_USER_ID} />
        </div>

        {/* Daily Aspiration */}
        <div className="animate-fade-in-up animation-delay-800 mt-4">
          <DailyAspiration userId={MOCK_USER_ID} />
        </div>

        {/* Circular Navigation */}
        <div className="animate-fade-in-scale animation-delay-1000 mt-4">
          <CircularNavigation />
        </div>

        {/* Homepage Customizer Button */}
        <div className="animate-fade-in-up animation-delay-1600 mt-6 mb-8">
          <HomepageCustomizerButton />
        </div>
      </div>
    </DashboardLayout>
  );
}
