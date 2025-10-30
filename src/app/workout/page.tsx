"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dumbbell, Heart, Zap, Clock, Flame, CheckCircle2, Play, ListChecks, Plus, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import { AppleHealthSync } from '@/components/apple-health-sync';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

const cycleGuidance = {
  Menstruation: {
    title: 'Menstruation Phase Training',
    focus: 'Rest, Restore, and Gentle Movement',
    description: 'Your body is working hard during menstruation. Energy levels are naturally lower, and that\'s completely normal. This is not the time to push yourself with intense workouts.',
    recommendations: [
      'Focus on gentle, restorative movements like yoga and walking',
      'Prioritize stretching and flexibility over intensity',
      'Listen to your body - if you need rest, take it',
      'Avoid heavy lifting and high-intensity cardio',
      'Stay hydrated and consume iron-rich foods to support recovery'
    ],
    optimal: 'Light yoga, walking, gentle stretching',
    avoid: 'Heavy strength training, intense HIIT, long endurance runs',
    intensity: 'Keep it to 40-50% of your max effort',
    recovery: 'Prioritize sleep and stress management'
  },
  Follicular: {
    title: 'Follicular Phase Training',
    focus: 'Build Strength and Increase Intensity',
    description: 'Your energy is rising! Estrogen levels are increasing, which means better muscle recovery, higher pain tolerance, and improved endurance. This is your power phase for building strength.',
    recommendations: [
      'Focus on progressive overload in strength training',
      'Great time to increase weights and challenge yourself with new PRs',
      'HIIT workouts are effective during this phase',
      'Your body recovers faster, so you can train more frequently',
      'Fuel with complex carbs to support your increased energy output'
    ],
    optimal: 'Compound lifts (squats, deadlifts), HIIT cardio, interval training',
    avoid: 'Under-eating - your body needs fuel for this intensity',
    intensity: 'Push yourself to 80-90% of your max effort',
    recovery: 'You\'ll recover faster, but still prioritize 7-9 hours of sleep'
  },
  Ovulation: {
    title: 'Ovulation Phase Training',
    focus: 'Peak Performance and Maximum Intensity',
    description: 'You\'re at your strongest! Testosterone and estrogen peak during ovulation, giving you maximum strength, endurance, and pain tolerance. This is when you can hit your hardest workouts.',
    recommendations: [
      'Go for personal records and maximum lifts',
      'High-intensity interval training at peak capacity',
      'Complex, challenging movements and heavy compound lifts',
      'Your coordination and reaction time are at their best',
      'Take advantage of this peak window - it only lasts 2-3 days'
    ],
    optimal: 'Maximal strength training, plyometrics, sprints, competitive workouts',
    avoid: 'Wasting this peak phase with low-intensity workouts',
    intensity: 'Push to 90-100% of your max effort',
    recovery: 'Your body can handle more, but still listen to fatigue signals'
  },
  Luteal: {
    title: 'Luteal Phase Training',
    focus: 'Moderate Intensity and Recovery Focus',
    description: 'Progesterone is rising, which can make you feel warmer, more fatigued, and less explosive. Your body is preparing for menstruation, so it\'s time to dial back intensity and focus on sustainability.',
    recommendations: [
      'Shift to lower-impact workouts like Pilates, barre, and yoga',
      'Focus on mobility, flexibility, and functional movements',
      'Moderate-intensity strength training is fine, but avoid maximal lifts',
      'Your metabolism is slightly higher, so you may need more calories',
      'Prioritize stress management and restorative activities'
    ],
    optimal: 'Pilates, yoga, moderate strength training, steady-state cardio',
    avoid: 'Maximal lifting, intense HIIT, pushing through fatigue',
    intensity: 'Keep it to 60-70% of your max effort',
    recovery: 'Prioritize magnesium, good sleep, and stress reduction'
  }
};

const weeklyProgress = {
  workoutsCompleted: 4,
  workoutsGoal: 5,
  caloriesBurned: 1240,
  minutesActive: 165,
};

const gymExercises = [
  { id: '1', name: 'Barbell Squat', muscle: 'Legs', equipment: 'Barbell' },
  { id: '2', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
  { id: '3', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell' },
  { id: '5', name: 'Pull-ups', muscle: 'Back', equipment: 'Bodyweight' },
  { id: '6', name: 'Dumbbell Row', muscle: 'Back', equipment: 'Dumbbells' },
  { id: '7', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine' },
  { id: '8', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable' },
];

export default function WorkoutPage() {
  const [currentPhase] = useState<keyof typeof phaseWorkouts>('Follicular');
  const workouts = phaseWorkouts[currentPhase];
  const guidance = cycleGuidance[currentPhase];

  const completedWorkouts = [
    { day: 'Monday', workout: 'Full Body Strength', duration: '30 min', calories: 250 },
    { day: 'Wednesday', workout: 'HIIT Cardio Blast', duration: '20 min', calories: 280 },
    { day: 'Friday', workout: 'Yoga Flow', duration: '25 min', calories: 150 },
  ];

  const [workoutPlan, setWorkoutPlan] = useState([
    { id: '1', exercise: 'Barbell Squat', sets: 4, reps: 8, weight: 135, notes: '' },
    { id: '2', exercise: 'Bench Press', sets: 4, reps: 10, weight: 95, notes: '' },
    { id: '3', exercise: 'Deadlift', sets: 3, reps: 6, weight: 185, notes: 'Increase next week' },
  ]);

  const [workoutLogs, setWorkoutLogs] = useState([
    { id: '1', exercise: 'Barbell Squat', sets: 4, reps: 8, weight: 135, date: '2025-10-28' },
    { id: '2', exercise: 'Bench Press', sets: 4, reps: 10, weight: 95, date: '2025-10-28' },
    { id: '3', exercise: 'Deadlift', sets: 3, reps: 6, weight: 185, date: '2025-10-26' },
  ]);

  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logExercise, setLogExercise] = useState('');
  const [logSets, setLogSets] = useState('');
  const [logReps, setLogReps] = useState('');
  const [logWeight, setLogWeight] = useState('');

  const handleLogWorkout = (exerciseName?: string, exerciseSets?: number, exerciseReps?: number, exerciseWeight?: number) => {
    const today = new Date().toISOString().split('T')[0];

    const newLog = {
      id: Date.now().toString(),
      exercise: exerciseName || logExercise,
      sets: exerciseSets || parseInt(logSets),
      reps: exerciseReps || parseInt(logReps),
      weight: exerciseWeight || parseInt(logWeight),
      date: today
    };

    setWorkoutLogs([newLog, ...workoutLogs]);

    // Show success toast
    toast.success('Workout logged successfully!', {
      description: `${newLog.exercise} - ${newLog.sets} sets × ${newLog.reps} reps @ ${newLog.weight} lbs`,
    });

    // Reset form
    setLogExercise('');
    setLogSets('');
    setLogReps('');
    setLogWeight('');
    setShowLogDialog(false);
  };

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

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Apple Health</TabsTrigger>
            <TabsTrigger value="plan">Workout Plan</TabsTrigger>
            <TabsTrigger value="log">Workout Log</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">

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
          </TabsContent>

          {/* APPLE HEALTH TAB */}
          <TabsContent value="health" className="space-y-6">
            <AppleHealthSync />
          </TabsContent>

          {/* WORKOUT PLAN TAB */}
          <TabsContent value="plan" className="space-y-6">
            <Card className="bloom-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-primary" />
                    My Workout Plan
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {workoutPlan.length} exercises in your plan
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-5 h-5 text-secondary flex-shrink-0" />
                      <h4 className="font-semibold text-sm">AI-Synced to {currentPhase} Phase</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This workout is optimized for your current cycle phase. Click the lightning bolt for detailed guidance.
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-3 py-1 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        View Guidance
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                          <Zap className="w-6 h-6 text-secondary" />
                          {guidance.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="bg-secondary/10 p-4 rounded-xl">
                          <h4 className="font-semibold text-lg mb-2 text-secondary">{guidance.focus}</h4>
                          <p className="text-muted-foreground leading-relaxed">{guidance.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Key Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {guidance.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-sm text-muted-foreground">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              Optimal Workouts
                            </h4>
                            <p className="text-sm text-muted-foreground">{guidance.optimal}</p>
                          </div>
                          <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20">
                            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                              <Info className="w-4 h-4 text-destructive" />
                              What to Avoid
                            </h4>
                            <p className="text-sm text-muted-foreground">{guidance.avoid}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-4 rounded-xl">
                            <h4 className="font-semibold mb-2 text-sm">Intensity Level</h4>
                            <p className="text-sm text-muted-foreground">{guidance.intensity}</p>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-xl">
                            <h4 className="font-semibold mb-2 text-sm">Recovery Focus</h4>
                            <p className="text-sm text-muted-foreground">{guidance.recovery}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-3">
                {workoutPlan.map((exercise, index) => (
                  <Card key={exercise.id} className="p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{exercise.exercise}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{exercise.sets}</span> sets
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{exercise.reps}</span> reps
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{exercise.weight}</span> lbs
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">{exercise.notes}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleLogWorkout(exercise.exercise, exercise.sets, exercise.reps, exercise.weight)}
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                      >
                        Log
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/20 rounded-xl">
                <h4 className="font-semibold text-sm mb-3">Suggested Exercises for Your Phase</h4>
                <div className="grid grid-cols-2 gap-2">
                  {gymExercises.slice(0, 6).map((exercise) => (
                    <button
                      key={exercise.id}
                      className="p-3 bg-white rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">{exercise.muscle} • {exercise.equipment}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* WORKOUT LOG TAB */}
          <TabsContent value="log" className="space-y-6">
            <Card className="bloom-card">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Workout History
                  </h3>
                  <p className="text-muted-foreground">
                    Track your progress and see your strength gains
                  </p>
                </div>
                <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Workout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <Plus className="w-6 h-6 text-primary" />
                        Log Manual Workout
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="exercise" className="text-sm font-semibold mb-2 block">
                          Exercise Name
                        </Label>
                        <Input
                          id="exercise"
                          placeholder="e.g., Barbell Squat"
                          value={logExercise}
                          onChange={(e) => setLogExercise(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="sets" className="text-sm font-semibold mb-2 block">
                            Sets
                          </Label>
                          <Input
                            id="sets"
                            type="number"
                            placeholder="4"
                            value={logSets}
                            onChange={(e) => setLogSets(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reps" className="text-sm font-semibold mb-2 block">
                            Reps
                          </Label>
                          <Input
                            id="reps"
                            type="number"
                            placeholder="8"
                            value={logReps}
                            onChange={(e) => setLogReps(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight" className="text-sm font-semibold mb-2 block">
                            Weight (lbs)
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="135"
                            value={logWeight}
                            onChange={(e) => setLogWeight(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => handleLogWorkout()}
                        disabled={!logExercise || !logSets || !logReps || !logWeight}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Workout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {workoutLogs.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{log.exercise}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Sets</p>
                        <p className="font-semibold">{log.sets}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Reps</p>
                        <p className="font-semibold">{log.reps}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Weight</p>
                        <p className="font-semibold">{log.weight} lbs</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Progress Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep logging your workouts to track strength gains and see your progress over time. The app automatically tracks your personal records!
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
}
