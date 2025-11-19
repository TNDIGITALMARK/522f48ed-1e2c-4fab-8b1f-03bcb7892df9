"use client";

import { Navigation } from '@/components/navigation';
import { RootedHeader } from '@/components/rooted-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dumbbell, Heart, Zap, Clock, Flame, CheckCircle2, Play, ListChecks, Plus, TrendingUp, Info, Activity, Scale, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CardioLogDialog } from '@/components/cardio-log-dialog';
import type { CardioLog } from '@/lib/cardio-machines';
import { getLatestWeight, getActiveGoal, formatWeight, getGoalTypeInfo } from '@/lib/weight-tracking';
import Link from 'next/link';
import { WellnessJourneyPlanner, type WellnessJourney } from '@/components/wellness-journey-planner';
import { AppleHealthSync } from '@/components/apple-health-sync';

const phaseWorkouts = {
  Menstruation: [
    {
      title: 'Gentle Flow Yoga',
      duration: '15 min',
      intensity: 'Low',
      calories: 80,
      description: 'Restorative poses to ease cramps and support your body',
      exercises: [
        { name: 'Child\'s Pose', sets: '3 min', reps: 'Hold', notes: 'Deep breathing, relaxation' },
        { name: 'Cat-Cow Stretch', sets: '2', reps: '10', notes: 'Gentle spinal mobility' },
        { name: 'Supine Twist', sets: '2', reps: '30 sec/side', notes: 'Releases lower back tension' },
        { name: 'Legs Up the Wall', sets: '5 min', reps: 'Hold', notes: 'Reduces bloating, calms nervous system' },
        { name: 'Savasana', sets: '3 min', reps: 'Rest', notes: 'Deep relaxation and recovery' },
      ],
      benefits: ['Reduces cramps', 'Eases bloating', 'Calms nervous system', 'Improves circulation'],
    },
    {
      title: 'Mindful Walking',
      duration: '20 min',
      intensity: 'Low',
      calories: 100,
      description: 'Light movement outdoors to boost mood gently',
      exercises: [
        { name: 'Warm-up Walk', sets: '5 min', reps: 'Slow pace', notes: 'Gentle start, focus on breathing' },
        { name: 'Steady Walk', sets: '10 min', reps: 'Comfortable pace', notes: 'Maintain consistent rhythm' },
        { name: 'Cool-down Walk', sets: '5 min', reps: 'Slow pace', notes: 'Gradual decrease in intensity' },
      ],
      benefits: ['Boosts mood', 'Gentle cardio', 'Reduces fatigue', 'Supports mental clarity'],
    },
  ],
  Follicular: [
    {
      title: 'Full Body Strength',
      duration: '30 min',
      intensity: 'Medium',
      calories: 250,
      description: 'Build strength with compound movements',
      exercises: [
        { name: 'Goblet Squats', sets: '3', reps: '12', notes: 'Focus on depth and control' },
        { name: 'Push-ups', sets: '3', reps: '10-12', notes: 'Modify on knees if needed' },
        { name: 'Dumbbell Rows', sets: '3', reps: '12/arm', notes: 'Keep core engaged' },
        { name: 'Lunges', sets: '3', reps: '10/leg', notes: 'Alternate legs, control descent' },
        { name: 'Plank Hold', sets: '3', reps: '45 sec', notes: 'Maintain neutral spine' },
        { name: 'Shoulder Press', sets: '3', reps: '10', notes: 'Slow and controlled' },
      ],
      benefits: ['Builds strength', 'Increases energy', 'Improves confidence', 'Enhanced muscle recovery'],
    },
    {
      title: 'HIIT Cardio Blast',
      duration: '20 min',
      intensity: 'High',
      calories: 280,
      description: 'High-energy intervals to match your rising energy',
      exercises: [
        { name: 'Jumping Jacks', sets: '4', reps: '30 sec', notes: 'Explosive movement, full body' },
        { name: 'Burpees', sets: '4', reps: '20 sec', notes: 'High intensity, modify as needed' },
        { name: 'Mountain Climbers', sets: '4', reps: '30 sec', notes: 'Keep hips low, fast pace' },
        { name: 'High Knees', sets: '4', reps: '30 sec', notes: 'Drive knees up, quick tempo' },
        { name: 'Rest Intervals', sets: '4', reps: '30 sec', notes: 'Active recovery between rounds' },
      ],
      benefits: ['Maximizes calorie burn', 'Boosts metabolism', 'Improves endurance', 'Leverages peak energy'],
    },
  ],
  Ovulation: [
    {
      title: 'Power Strength Training',
      duration: '45 min',
      intensity: 'High',
      calories: 400,
      description: 'Challenge yourself with heavy weights and complex moves',
      exercises: [
        { name: 'Barbell Squats', sets: '4', reps: '6-8', notes: 'Heavy weight, focus on form' },
        { name: 'Deadlifts', sets: '4', reps: '6-8', notes: 'Hip hinge, maintain neutral spine' },
        { name: 'Bench Press', sets: '4', reps: '6-8', notes: 'Chest and triceps, controlled reps' },
        { name: 'Pull-ups', sets: '3', reps: '8-10', notes: 'Full range of motion, use assistance if needed' },
        { name: 'Overhead Press', sets: '3', reps: '8', notes: 'Shoulder strength, core stability' },
        { name: 'Bulgarian Split Squats', sets: '3', reps: '10/leg', notes: 'Single leg strength, balance' },
      ],
      benefits: ['Peak strength gains', 'Maximum power output', 'PR opportunities', 'Optimal muscle building'],
    },
    {
      title: 'Peak HIIT Challenge',
      duration: '30 min',
      intensity: 'High',
      calories: 350,
      description: 'Maximum intensity cardio for your peak phase',
      exercises: [
        { name: 'Sprint Intervals', sets: '6', reps: '30 sec', notes: 'All-out effort, explosive' },
        { name: 'Box Jumps', sets: '5', reps: '10', notes: 'Plyometric power, soft landing' },
        { name: 'Battle Ropes', sets: '5', reps: '40 sec', notes: 'Full body engagement, intensity' },
        { name: 'Tuck Jumps', sets: '5', reps: '12', notes: 'Maximum vertical, soft landing' },
        { name: 'Rest/Recovery', sets: '6', reps: '60 sec', notes: 'Between sprint intervals' },
      ],
      benefits: ['Maximum calorie burn', 'Peak cardiovascular performance', 'Enhanced explosiveness', 'Optimal for PRs'],
    },
  ],
  Luteal: [
    {
      title: 'Pilates Flow',
      duration: '30 min',
      intensity: 'Low-Medium',
      calories: 180,
      description: 'Low-impact strength and mobility work',
      exercises: [
        { name: 'Hundred', sets: '2', reps: '100 breaths', notes: 'Core activation, breathing focus' },
        { name: 'Roll Up', sets: '3', reps: '10', notes: 'Spinal articulation, control' },
        { name: 'Single Leg Stretch', sets: '2', reps: '12/leg', notes: 'Core stability, coordination' },
        { name: 'Spine Twist', sets: '2', reps: '10', notes: 'Rotation, posture' },
        { name: 'Side Leg Lifts', sets: '2', reps: '15/side', notes: 'Hip strength, balance' },
        { name: 'Bridge', sets: '3', reps: '12', notes: 'Glute activation, spinal support' },
      ],
      benefits: ['Maintains strength', 'Improves flexibility', 'Low stress on body', 'Supports digestion'],
    },
    {
      title: 'Yin Yoga & Stretch',
      duration: '25 min',
      intensity: 'Low',
      calories: 120,
      description: 'Deep stretching and relaxation',
      exercises: [
        { name: 'Dragon Pose', sets: '2', reps: '3 min/side', notes: 'Hip flexor stretch, deep hold' },
        { name: 'Seated Forward Fold', sets: '1', reps: '5 min', notes: 'Hamstring and spine stretch' },
        { name: 'Butterfly Pose', sets: '1', reps: '4 min', notes: 'Hip opening, groin stretch' },
        { name: 'Reclining Twist', sets: '2', reps: '3 min/side', notes: 'Spinal release, relaxation' },
        { name: 'Supported Bridge', sets: '1', reps: '5 min', notes: 'Gentle backbend, restorative' },
      ],
      benefits: ['Deep relaxation', 'Reduces stress', 'Improves flexibility', 'Supports sleep quality'],
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

const MOCK_USER_ID = 'demo-user-001';

export default function WorkoutPage() {
  const [currentPhase] = useState<keyof typeof phaseWorkouts>('Follicular');
  const workouts = phaseWorkouts[currentPhase];
  const guidance = cycleGuidance[currentPhase];

  // Weight and goal state
  const [latestWeight, setLatestWeight] = useState<ReturnType<typeof getLatestWeight>>(null);
  const [activeGoal, setActiveGoal] = useState<ReturnType<typeof getActiveGoal>>(null);

  useEffect(() => {
    const weight = getLatestWeight(MOCK_USER_ID);
    const goal = getActiveGoal(MOCK_USER_ID);
    setLatestWeight(weight);
    setActiveGoal(goal);
  }, []);

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

  const [workoutLogs, setWorkoutLogs] = useState<Array<{
    id: string;
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    date: string;
    calories?: number;
  }>>([
    { id: '1', exercise: 'Barbell Squat', sets: 4, reps: 8, weight: 135, date: '2025-10-28' },
    { id: '2', exercise: 'Bench Press', sets: 4, reps: 10, weight: 95, date: '2025-10-28' },
    { id: '3', exercise: 'Deadlift', sets: 3, reps: 6, weight: 185, date: '2025-10-26' },
  ]);

  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logExercise, setLogExercise] = useState('');
  const [logSets, setLogSets] = useState('');
  const [logReps, setLogReps] = useState('');
  const [logWeight, setLogWeight] = useState('');
  const [logWeightCalories, setLogWeightCalories] = useState('');
  const [useManualWeightCalories, setUseManualWeightCalories] = useState(false);

  const [showCardioLogDialog, setShowCardioLogDialog] = useState(false);
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [wellnessJourneys, setWellnessJourneys] = useState<WellnessJourney[]>([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(new Set());

  const handleLogWorkout = (exerciseName?: string, exerciseSets?: number, exerciseReps?: number, exerciseWeight?: number, manualCalories?: number) => {
    const today = new Date().toISOString().split('T')[0];

    const newLog = {
      id: Date.now().toString(),
      exercise: exerciseName || logExercise,
      sets: exerciseSets || parseInt(logSets),
      reps: exerciseReps || parseInt(logReps),
      weight: exerciseWeight || parseInt(logWeight),
      calories: manualCalories || (useManualWeightCalories && logWeightCalories ? parseInt(logWeightCalories) : undefined),
      date: today
    };

    setWorkoutLogs([newLog, ...workoutLogs]);

    // Show success toast
    const caloriesMsg = newLog.calories ? `, ${newLog.calories} cal` : '';
    toast.success('Workout logged successfully!', {
      description: `${newLog.exercise} - ${newLog.sets} sets × ${newLog.reps} reps @ ${newLog.weight} lbs${caloriesMsg}`,
    });

    // Reset form
    setLogExercise('');
    setLogSets('');
    setLogReps('');
    setLogWeight('');
    setLogWeightCalories('');
    setUseManualWeightCalories(false);
    setShowLogDialog(false);
  };

  const handleLogCardio = (log: Omit<CardioLog, 'id' | 'createdAt'>) => {
    const newCardioLog: CardioLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCardioLogs([newCardioLog, ...cardioLogs]);
  };

  const handleJourneyCreated = (journey: WellnessJourney) => {
    setWellnessJourneys([...wellnessJourneys, journey]);
  };

  const toggleWorkoutExpanded = (index: number) => {
    setExpandedWorkouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen relative pb-24">
      {/* Botanical background with reduced opacity - matching cycle and home pages */}
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
      {/* Pure white background layer - matching cycle and home pages */}
      <div className="fixed inset-0 -z-20 bg-white" />

      {/* Header */}
      <RootedHeader />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-4xl mb-2">Workout Sync</h1>
          <p className="text-muted-foreground text-lg">
            Phase-based training that adapts to your body
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full animate-fade-in-up animation-delay-400">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="journey">Plan Journey</TabsTrigger>
            <TabsTrigger value="logging">Logging</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">

        {/* Apple Health Sync */}
        <div className="mb-6">
          <AppleHealthSync />
        </div>

        {/* Weekly Progress */}
        <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl mb-6">
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

        {/* Weight & Goals Widget */}
        {(latestWeight || activeGoal) && (
          <Card className="magazine-feature-card bg-white border border-secondary/20 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Weight & Goals</h3>
              <Link href="/weight">
                <Button variant="outline" size="sm" className="rounded-full">
                  View Details
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {latestWeight && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Weight</p>
                    <p className="text-lg font-bold">{formatWeight(latestWeight.weight, latestWeight.unit)}</p>
                  </div>
                </div>
              )}

              {activeGoal && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="text-lg font-bold">{getGoalTypeInfo(activeGoal.goalType).label}</p>
                  </div>
                </div>
              )}
            </div>

            {!latestWeight && !activeGoal && (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">Track your weight and set fitness goals</p>
                <Link href="/weight">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {/* Recent Logged Workouts - Expandable Widget */}
        <Card className="magazine-feature-card bg-white border border-primary/20 rounded-xl">
          <button
            onClick={() => setExpandedWorkouts(prev => {
              const newSet = new Set(prev);
              if (newSet.has(-1)) {
                newSet.delete(-1);
              } else {
                newSet.add(-1);
              }
              return newSet;
            })}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Recent Logged Workouts
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {workoutLogs.length + cardioLogs.length} total
                </Badge>
                {expandedWorkouts.has(-1) ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </button>

          {/* Collapsed View - Show just count and summary */}
          {!expandedWorkouts.has(-1) && (
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {workoutLogs.length > 0 || cardioLogs.length > 0 ? (
                    <>Click to view your {workoutLogs.length} weight training and {cardioLogs.length} cardio sessions</>
                  ) : (
                    <>No workouts logged yet. Click to start tracking!</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Expanded View - Show all workout logs */}
          {expandedWorkouts.has(-1) && (
            <div className="space-y-3 mt-2">
              {/* Show Weight Training Logs */}
              {workoutLogs.slice(0, 5).map((log) => (
                <Card key={log.id} className="p-4 hover:shadow-bloom-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{log.exercise}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Weights</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {log.sets} sets × {log.reps} reps @ {log.weight} lbs
                    </span>
                    {log.calories && (
                      <span className="text-secondary font-medium">
                        {log.calories} cal
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {/* Show Cardio Logs */}
              {cardioLogs.slice(0, 5).map((log) => (
                <Card key={log.id} className="p-4 hover:shadow-bloom-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{log.machineName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.workoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Cardio</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {log.durationMinutes} min
                    </span>
                    <span className="text-secondary font-medium">
                      {Math.round(log.caloriesBurned)} cal
                    </span>
                    {log.distance && (
                      <span className="text-muted-foreground">
                        {log.distance} {log.distanceUnit}
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {/* Show empty state if no logs */}
              {workoutLogs.length === 0 && cardioLogs.length === 0 && (
                <div className="text-center py-8 bg-muted/10 rounded-xl">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No workouts logged yet</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start logging your workouts to see them here
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Switch to logging tab, weights sub-tab
                        const loggingTab = document.querySelector('[value="logging"]') as HTMLElement;
                        loggingTab?.click();
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Weights
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Switch to logging tab, cardio sub-tab
                        const loggingTab = document.querySelector('[value="logging"]') as HTMLElement;
                        loggingTab?.click();
                        setTimeout(() => {
                          const cardioTab = document.querySelector('[value="cardio"]') as HTMLElement;
                          cardioTab?.click();
                        }, 100);
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Cardio
                    </Button>
                  </div>
                </div>
              )}

              {/* View All Link */}
              {(workoutLogs.length > 5 || cardioLogs.length > 5) && (
                <div className="pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {Math.min(5, workoutLogs.length + cardioLogs.length)} of {workoutLogs.length + cardioLogs.length} workouts
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Phase-Based Training Info */}
        <Card className="magazine-feature-card bg-white border border-secondary/20 rounded-xl mt-6">
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

          {/* WELLNESS JOURNEY TAB */}
          <TabsContent value="journey" className="space-y-6">
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
                {workouts.map((workout, index) => {
                  const isExpanded = expandedWorkouts.has(index);
                  return (
                    <Card key={index} className="bloom-card hover:shadow-bloom-lg transition-all group">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleWorkoutExpanded(index)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const loggingTab = document.querySelector('[value="logging"]') as HTMLElement;
                                  loggingTab?.click();
                                }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-1.5 h-auto text-xs font-semibold"
                              >
                                log
                              </Button>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold">{workout.title}</h4>
                                <p className="text-sm text-muted-foreground">{workout.description}</p>
                              </div>
                              <div className="ml-auto">
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-primary" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
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
                      </div>

                      {/* Expandable Exercise Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-border/40 space-y-4 animate-fade-in-up">
                          {/* Benefits Section */}
                          {workout.benefits && (
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-secondary" />
                                Key Benefits
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {workout.benefits.map((benefit, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exercise List */}
                          <div>
                            <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <ListChecks className="w-4 h-4 text-primary" />
                              Exercise Breakdown
                            </h5>
                            <div className="space-y-3">
                              {workout.exercises?.map((exercise, exerciseIdx) => (
                                <div
                                  key={exerciseIdx}
                                  className="p-4 bg-muted/20 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h6 className="font-semibold text-sm">{exercise.name}</h6>
                                      <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs ml-2">
                                      {exercise.sets} × {exercise.reps}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Phase Alignment Info */}
                          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <h5 className="font-semibold text-sm mb-1">Why This Works for {currentPhase} Phase</h5>
                                <p className="text-sm text-muted-foreground">
                                  {currentPhase === 'Menstruation' && 'Gentle, restorative movements support your body during menstruation when energy levels are naturally lower.'}
                                  {currentPhase === 'Follicular' && 'Your rising estrogen levels mean better recovery and higher energy - perfect for building strength and intensity.'}
                                  {currentPhase === 'Ovulation' && 'Peak hormone levels give you maximum strength, endurance, and pain tolerance - ideal for PRs and intense training.'}
                                  {currentPhase === 'Luteal' && 'Progesterone is rising, so focus on sustainability with moderate intensity and recovery-focused activities.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            <WellnessJourneyPlanner
              onJourneyCreated={handleJourneyCreated}
              existingJourneys={wellnessJourneys}
            />
          </TabsContent>

          {/* LOGGING TAB - Combined Cardio and Weights */}
          <TabsContent value="logging" className="space-y-6">
            <Tabs defaultValue="weights" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="weights">Weights</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
              </TabsList>

              {/* CARDIO SUB-TAB */}
              <TabsContent value="cardio" className="space-y-6">
            <Card className="bloom-card bg-white border border-secondary/20 rounded-xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                    <Activity className="w-6 h-6 text-secondary" />
                    Cardio Workouts
                  </h3>
                  <p className="text-muted-foreground">
                    Log your cardio sessions with automatic calorie tracking
                  </p>
                </div>
                <Button
                  onClick={() => setShowCardioLogDialog(true)}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Cardio
                </Button>
              </div>

              {cardioLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-secondary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">No cardio workouts logged yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start tracking your cardio sessions to see your progress
                  </p>
                  <Button
                    onClick={() => setShowCardioLogDialog(true)}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Cardio Workout
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cardioLogs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <Activity className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{log.machineName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.workoutDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={log.caloriesManualOverride ? 'secondary' : 'outline'}>
                          {log.caloriesManualOverride ? 'Manual' : 'Auto-calculated'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="font-semibold text-sm">{log.durationMinutes} min</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-secondary/10 rounded-lg">
                          <Flame className="w-4 h-4 mx-auto mb-1 text-secondary" />
                          <p className="font-semibold text-sm">{Math.round(log.caloriesBurned)}</p>
                          <p className="text-xs text-muted-foreground">Calories</p>
                        </div>
                        {log.distance && (
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                            <p className="font-semibold text-sm">
                              {log.distance} {log.distanceUnit}
                            </p>
                            <p className="text-xs text-muted-foreground">Distance</p>
                          </div>
                        )}
                      </div>

                      {(log.averageHeartRate || log.notes) && (
                        <div className="pt-3 border-t border-border space-y-2">
                          {log.averageHeartRate && (
                            <div className="flex items-center gap-2 text-sm">
                              <Heart className="w-4 h-4 text-secondary" />
                              <span className="text-muted-foreground">
                                Avg HR: <span className="font-medium text-foreground">{log.averageHeartRate} bpm</span>
                              </span>
                            </div>
                          )}
                          {log.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              &ldquo;{log.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Calorie Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Calories are automatically calculated based on duration and machine type. You can override with your own measurements for more accuracy!
                    </p>
                  </div>
                </div>
              </div>
            </Card>
              </TabsContent>

              {/* WEIGHTS SUB-TAB */}
              <TabsContent value="weights" className="space-y-6">
            <Card className="bloom-card bg-white border border-primary/20 rounded-xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Weights Training
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

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="weight-calories" className="text-sm font-semibold">
                            Calories Burned (optional)
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUseManualWeightCalories(!useManualWeightCalories);
                              if (useManualWeightCalories) setLogWeightCalories('');
                            }}
                            className="text-xs h-auto py-1"
                          >
                            {useManualWeightCalories ? 'Clear' : 'Add Calories'}
                          </Button>
                        </div>
                        {useManualWeightCalories && (
                          <Input
                            id="weight-calories"
                            type="number"
                            placeholder="e.g., 250"
                            value={logWeightCalories}
                            onChange={(e) => setLogWeightCalories(e.target.value)}
                            className="w-full"
                            min="0"
                          />
                        )}
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
                    <div className={`grid ${log.calories ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
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
                      {log.calories && (
                        <div className="text-center p-2 bg-secondary/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Calories</p>
                          <p className="font-semibold">{log.calories}</p>
                        </div>
                      )}
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
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />

      {/* Cardio Log Dialog */}
      <CardioLogDialog
        open={showCardioLogDialog}
        onOpenChange={setShowCardioLogDialog}
        onLogCardio={handleLogCardio}
      />
    </div>
  );
}
