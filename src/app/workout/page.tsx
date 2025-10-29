"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Heart, Zap, Clock, Flame, CheckCircle2, Play } from 'lucide-react';
import { useState } from 'react';

const phaseWorkouts = {
  Menstruation: [
    {
      title: 'Gentle Flow Yoga',
      duration: '15 min',
      intensity: 'Low',
      calories: 80,
      description: 'Restorative poses to ease cramps and support your body',
    },
    {
      title: 'Mindful Walking',
      duration: '20 min',
      intensity: 'Low',
      calories: 100,
      description: 'Light movement outdoors to boost mood gently',
    },
  ],
  Follicular: [
    {
      title: 'Full Body Strength',
      duration: '30 min',
      intensity: 'Medium',
      calories: 250,
      description: 'Build strength with compound movements',
    },
    {
      title: 'HIIT Cardio Blast',
      duration: '20 min',
      intensity: 'High',
      calories: 280,
      description: 'High-energy intervals to match your rising energy',
    },
  ],
  Ovulation: [
    {
      title: 'Power Strength Training',
      duration: '45 min',
      intensity: 'High',
      calories: 400,
      description: 'Challenge yourself with heavy weights and complex moves',
    },
    {
      title: 'Peak HIIT Challenge',
      duration: '30 min',
      intensity: 'High',
      calories: 350,
      description: 'Maximum intensity cardio for your peak phase',
    },
  ],
  Luteal: [
    {
      title: 'Pilates Flow',
      duration: '30 min',
      intensity: 'Low-Medium',
      calories: 180,
      description: 'Low-impact strength and mobility work',
    },
    {
      title: 'Yin Yoga & Stretch',
      duration: '25 min',
      intensity: 'Low',
      calories: 120,
      description: 'Deep stretching and relaxation',
    },
  ],
};

const weeklyProgress = {
  workoutsCompleted: 4,
  workoutsGoal: 5,
  caloriesBurned: 1240,
  minutesActive: 165,
};

export default function WorkoutPage() {
  const [currentPhase] = useState<keyof typeof phaseWorkouts>('Follicular');
  const workouts = phaseWorkouts[currentPhase];

  const completedWorkouts = [
    { day: 'Monday', workout: 'Full Body Strength', duration: '30 min', calories: 250 },
    { day: 'Wednesday', workout: 'HIIT Cardio Blast', duration: '20 min', calories: 280 },
    { day: 'Friday', workout: 'Yoga Flow', duration: '25 min', calories: 150 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Workout Sync</h1>
          <p className="text-muted-foreground text-lg">
            Phase-based training that adapts to your body
          </p>
        </div>

        {/* Weekly Progress */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-none">
          <h3 className="text-xl font-semibold mb-4">This Week's Progress</h3>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {weeklyProgress.workoutsCompleted}/{weeklyProgress.workoutsGoal}
              </div>
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-1">
                {weeklyProgress.caloriesBurned}
              </div>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-accent-foreground mb-1">
                {weeklyProgress.minutesActive}
              </div>
              <p className="text-sm text-muted-foreground">Active Minutes</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Weekly goal progress</p>
              <p className="text-sm font-semibold text-primary">
                {Math.round((weeklyProgress.workoutsCompleted / weeklyProgress.workoutsGoal) * 100)}%
              </p>
            </div>
            <div className="h-2 bg-muted/30 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${(weeklyProgress.workoutsCompleted / weeklyProgress.workoutsGoal) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Recommended Workouts for Current Phase */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Recommended for You
            </h3>
            <Badge variant="secondary" className="text-xs">
              {currentPhase} Phase
            </Badge>
          </div>

          <div className="space-y-4">
            {workouts.map((workout, index) => (
              <Card key={index} className="bloom-card hover:shadow-bloom-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{workout.title}</h4>
                        <p className="text-sm text-muted-foreground">{workout.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-semibold">{workout.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Heart className="w-4 h-4 mx-auto mb-1 text-secondary" />
                    <p className="text-sm font-semibold">{workout.intensity}</p>
                    <p className="text-xs text-muted-foreground">Intensity</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Flame className="w-4 h-4 mx-auto mb-1 text-accent-foreground" />
                    <p className="text-sm font-semibold">{workout.calories}</p>
                    <p className="text-xs text-muted-foreground">Est. Calories</p>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                  Start Workout
                  <Play className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div>
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Completed This Week
          </h3>

          <div className="space-y-3">
            {completedWorkouts.map((workout, index) => (
              <Card key={index} className="p-4 hover:shadow-bloom-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{workout.workout}</h4>
                      <p className="text-sm text-muted-foreground">{workout.day}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{workout.duration}</p>
                    <p className="text-sm text-muted-foreground">{workout.calories} cal</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Phase-Based Training Info */}
        <Card className="bloom-card bg-gradient-to-br from-primary/5 to-accent/5 border-none mt-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follicular Phase Training</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your energy is rising! This is a great time for strength training and HIIT workouts.
                Your body can handle more intensity and recover faster during this phase.
                Focus on progressive overload and challenging yourself with new personal records.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
