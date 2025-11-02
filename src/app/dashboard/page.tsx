"use client";

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Droplets,
  Footprints,
  Brain,
  TrendingUp,
  Calendar,
  Flame,
  Moon,
  Sun,
  Activity,
  Apple,
  Clock,
  Target,
  Award,
  Zap,
  Plus,
  Scale,
  TrendingDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  getLatestWeight,
  getActiveGoal,
  calculateGoalProgress,
  calculateWeightChange,
  getGoalTypeInfo,
  formatWeight,
  type WeightLog,
  type WeightGoal,
  type GoalProgress,
  type WeightChange
} from '@/lib/weight-tracking';
import { GoalsManager, type Goal } from '@/components/goals-manager';
import { useDashboardData } from '@/hooks/use-user-profile';
import { SyncDemoWidget } from '@/components/sync-demo-widget';
import { PeriodCalendar } from '@/components/period-calendar';
import { CycleInsightsWidget } from '@/components/cycle-insights-widget';
import { WeeklyBalanceWidget } from '@/components/weekly-balance-widget';
import { CycleWorkoutInsights } from '@/components/cycle-workout-insights';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

export default function DashboardPage() {
  // Use centralized dashboard data hook - auto-syncs everything!
  const {
    profile,
    updateWellness,
    calorieRecommendation,
    syncFromWeightTracking,
    isLoading
  } = useDashboardData(MOCK_USER_ID);

  // Weight and Goals state (from existing weight tracking system)
  const [latestWeight, setLatestWeight] = useState<WeightLog | null>(null);
  const [activeGoal, setActiveGoal] = useState<WeightGoal | null>(null);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [weightChange, setWeightChange] = useState<WeightChange | null>(null);
  const [userGoals, setUserGoals] = useState<Goal[]>([]);

  // Load weight and goals data on mount
  useEffect(() => {
    const latest = getLatestWeight(MOCK_USER_ID);
    setLatestWeight(latest);

    const goal = getActiveGoal(MOCK_USER_ID);
    setActiveGoal(goal);

    const progress = calculateGoalProgress(MOCK_USER_ID);
    setGoalProgress(progress);

    const change = calculateWeightChange(MOCK_USER_ID);
    setWeightChange(change);

    // Load user goals from localStorage
    const storedGoals = localStorage.getItem(`userGoals_${MOCK_USER_ID}`);
    if (storedGoals) {
      setUserGoals(JSON.parse(storedGoals));
    }

    // Sync weight tracking data into profile
    syncFromWeightTracking();
  }, [syncFromWeightTracking]);

  // Save goals to localStorage when they change
  const handleGoalsChange = (newGoals: Goal[]) => {
    setUserGoals(newGoals);
    localStorage.setItem(`userGoals_${MOCK_USER_ID}`, JSON.stringify(newGoals));
  };

  // Handler for updating water intake
  const handleAddWater = () => {
    if (profile) {
      updateWellness({
        waterConsumed: Math.min(profile.waterConsumed + 1, profile.waterGoal)
      });
    }
  };

  // Handler for updating steps
  const handleUpdateSteps = (steps: number) => {
    updateWellness({ stepsCompleted: steps });
  };

  // Handler for updating meditation
  const handleUpdateMeditation = (minutes: number) => {
    updateWellness({ meditationCompleted: minutes });
  };

  // Mock wellness data (will be replaced by profile data where available)
  const userData = {
    name: "Sarah Thompson",
    cycleDay: 14,
    phase: "Ovulation Phase",
    mood: 8,
    energy: "Elevated",
    sleepHours: profile?.sleepHours || 7.5,
    sleepQuality: "Good",
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
    },
    calories: { consumed: 1850, goal: 2000 },
    weeklyStreak: 12,
  };

  const goalTypeInfo = activeGoal ? getGoalTypeInfo(activeGoal.goalType) : null;

  const recentActivities = [
    { time: "2h ago", activity: "Completed 30 min yoga session", icon: Activity, color: "text-primary" },
    { time: "5h ago", activity: "Logged healthy breakfast", icon: Apple, color: "text-secondary" },
    { time: "Yesterday", activity: "Meditation streak: 5 days", icon: Brain, color: "text-accent-foreground" },
  ];

  const upcomingGoals = [
    { title: "Complete water intake", progress: 75, icon: Droplets },
    { title: "Reach step goal", progress: 80, icon: Footprints },
    { title: "Finish meditation", progress: 80, icon: Brain },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl mb-2">Welcome back, Sarah</h1>
          <p className="text-muted-foreground text-lg">
            Here's your holistic wellness snapshot for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Cycle Status */}
          <Card className="bloom-card bg-gradient-to-br from-primary/8 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cycle Day</p>
                <h3 className="text-3xl font-bold text-primary">{userData.cycleDay}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">{userData.phase}</p>
          </Card>

          {/* Energy Level */}
          <Card className="bloom-card bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/25">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Energy Level</p>
                <h3 className="text-3xl font-bold text-secondary-foreground">{userData.energy}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-sm">
                <Zap className="w-7 h-7 text-secondary-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 rounded ${
                      i < 4 ? 'bg-secondary' : 'bg-secondary/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Sleep Quality */}
          <Card className="bloom-card bg-gradient-to-br from-accent/12 to-accent/5 border-accent/25">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sleep Quality</p>
                <h3 className="text-3xl font-bold text-accent-foreground">{userData.sleepHours}h</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-sm">
                <Moon className="w-7 h-7 text-accent-foreground" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">{userData.sleepQuality}</p>
          </Card>

          {/* Weekly Streak */}
          <Card className="bloom-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/25">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Weekly Streak</p>
                <h3 className="text-3xl font-bold text-primary">{userData.weeklyStreak}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <Flame className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">Days Active</p>
          </Card>
        </div>

        {/* Weight & Goals Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Weight Card */}
          <Card className="bloom-card bg-gradient-to-br from-secondary/12 to-secondary/5 border-secondary/25">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Current Weight</h3>
                {latestWeight ? (
                  <>
                    <p className="text-4xl font-bold text-primary mb-1">
                      {formatWeight(latestWeight.weight, latestWeight.unit, 1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Logged {new Date(latestWeight.loggedAt).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No weight logged yet</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary" />
              </div>
            </div>

            {weightChange && (
              <div className="flex items-center gap-2 text-sm mb-4">
                {weightChange.change < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-secondary" />
                    <span className="text-secondary font-medium">
                      {Math.abs(weightChange.change).toFixed(1)} lbs lost
                    </span>
                  </>
                ) : weightChange.change > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">
                      {weightChange.change.toFixed(1)} lbs gained
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No change</span>
                )}
                <span className="text-muted-foreground">over {weightChange.period}</span>
              </div>
            )}

            <Link href="/weight">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                <Scale className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </Link>
          </Card>

          {/* Active Goal Card */}
          <Card className="bloom-card bg-gradient-to-br from-accent/12 to-accent/5 border-accent/25">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Active Goal</h3>
                {activeGoal && goalTypeInfo ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{goalTypeInfo.icon}</span>
                      <div>
                        <p className="text-xl font-bold">{goalTypeInfo.label}</p>
                        <p className="text-sm text-muted-foreground">{goalTypeInfo.description}</p>
                      </div>
                    </div>
                    {goalProgress && (
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">{formatWeight(goalProgress.targetWeight, activeGoal.weightUnit)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-medium">{goalProgress.percentComplete.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all"
                            style={{ width: `${Math.min(Math.abs(goalProgress.percentComplete), 100)}%` }}
                          />
                        </div>
                        {goalProgress.onTrack ? (
                          <Badge variant="secondary" className="mt-2">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            On Track
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-2">
                            Adjust your plan
                          </Badge>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground mb-4">No active goal set</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-secondary" />
              </div>
            </div>

            <Link href="/weight">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full">
                <Target className="w-4 h-4 mr-2" />
                {activeGoal ? 'Manage Goal' : 'Set Goal'}
              </Button>
            </Link>
          </Card>
        </div>

        {/* Period Calendar & Cycle Insights Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Period Calendar - Full Width */}
          <div className="lg:col-span-2">
            <PeriodCalendar userId={MOCK_USER_ID} />
          </div>

          {/* Cycle Insights - Right Column */}
          <div className="space-y-6">
            <CycleInsightsWidget userId={MOCK_USER_ID} />
          </div>
        </div>

        {/* Weekly Balance Section */}
        <WeeklyBalanceWidget userId={MOCK_USER_ID} />

        {/* Cycle-Based Workout Recommendations - Replaces Video Section */}
        <CycleWorkoutInsights userId={MOCK_USER_ID} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Daily Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Goals */}
            <Card className="bloom-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Today's Goals</h2>
                <Badge variant="secondary" className="px-3 py-1">
                  <Target className="w-3 h-3 mr-1" />
                  3/5 Complete
                </Badge>
              </div>

              <div className="space-y-5">
                {upcomingGoals.map((goal, index) => {
                  const Icon = goal.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{goal.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Daily Rituals Progress */}
            <Card className="bloom-card">
              <h2 className="text-2xl font-semibold mb-6">Daily Rituals</h2>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Meditation */}
                <div className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Meditation</h4>
                      <p className="text-sm text-muted-foreground">
                        {userData.meditation.completed}/{userData.meditation.goal} min
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(userData.meditation.completed / userData.meditation.goal) * 100}
                    className="h-2 mb-3"
                  />
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Log Session
                  </Button>
                </div>

                {/* Movement */}
                <div className="bg-gradient-to-br from-secondary/5 to-transparent p-4 rounded-xl border border-secondary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Footprints className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Movement</h4>
                      <p className="text-sm text-muted-foreground">
                        {userData.steps.completed.toLocaleString()}/{userData.steps.goal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(userData.steps.completed / userData.steps.goal) * 100}
                    className="h-2 mb-3"
                  />
                  <Button size="sm" variant="outline" className="w-full">
                    <Activity className="w-4 h-4 mr-1" />
                    Track Activity
                  </Button>
                </div>

                {/* Hydration */}
                <div className="bg-gradient-to-br from-accent/10 to-transparent p-4 rounded-xl border border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Hydration</h4>
                      <p className="text-sm text-muted-foreground">
                        {userData.water.completed}/{userData.water.goal} glasses
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(userData.water.completed / userData.water.goal) * 100}
                    className="h-2 mb-3"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddWater}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Glass
                  </Button>
                </div>
              </div>
            </Card>

            {/* Personalized Insight */}
            <Card className="bloom-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personalized Insight</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your energy levels are typically elevated during the ovulation phase.
                    This is a great time to schedule important meetings, tackle challenging workouts,
                    and focus on high-priority tasks. Keep up your meditation practice to maintain
                    emotional balance throughout your cycle.
                  </p>
                  <Button variant="link" className="mt-3 px-0">
                    Learn more about your cycle phase →
                  </Button>
                </div>
              </div>
            </Card>

            {/* Weekly Calorie Balance */}
            {calorieRecommendation && (
              <Card className="bloom-card bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Weekly Calorie Balance</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically curated from your weight and fitness goals
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Daily Target</p>
                      <p className="text-2xl font-bold text-secondary">
                        {calorieRecommendation.dailyCalories.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">calories</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Weekly Total</p>
                      <p className="text-2xl font-bold text-primary">
                        {calorieRecommendation.weeklyCalories.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">calories</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Protein</span>
                      <span className="font-medium">{calorieRecommendation.proteinGrams}g/day</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Carbs</span>
                      <span className="font-medium">{calorieRecommendation.carbsGrams}g/day</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Fat</span>
                      <span className="font-medium">{calorieRecommendation.fatGrams}g/day</span>
                    </div>
                  </div>

                  {!calorieRecommendation.isCustom && (
                    <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">
                        Based on your {goalTypeInfo?.label.toLowerCase()} goal of {calorieRecommendation.weeklyWeightChange.toFixed(1)} lbs/week
                      </p>
                    </div>
                  )}

                  <Button variant="outline" className="w-full rounded-full text-sm">
                    Set Custom Calorie Goal
                  </Button>
                </div>
              </Card>
            )}

            {/* Goals Manager */}
            <GoalsManager
              activeGoals={userGoals}
              onGoalsChange={handleGoalsChange}
            />
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Live Sync Demo */}
            <SyncDemoWidget userId={MOCK_USER_ID} />

            {/* Quick Actions */}
            <Card className="bloom-card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Log Today's Entry
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Track Activity
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Apple className="w-4 h-4 mr-2" />
                  Log Meal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Guided Meditation
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bloom-card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.activity}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="link" className="w-full mt-4">
                View All Activity
              </Button>
            </Card>

            {/* Achievements */}
            <Card className="bloom-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-900">Achievement Unlocked!</h3>
                  <p className="text-sm text-orange-700">12-Day Wellness Streak</p>
                </div>
              </div>
              <p className="text-sm text-orange-800">
                You've logged wellness activities for 12 consecutive days. Keep up the amazing work!
              </p>
            </Card>

            {/* AI Calorie Tracking */}
            <Card className="bloom-card bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-primary">AI Calorie Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Get personalized calorie targets based on your height, weight, and fitness goals. AI automatically adjusts your daily calories to keep you on track.
              </p>
              <Link href="/fitness-setup">
                <Button className="w-full" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Set Up Fitness Profile
                </Button>
              </Link>
            </Card>

            {/* Daily Tip */}
            <Card className="bloom-card bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Sun className="w-6 h-6 text-accent-foreground" />
                <h3 className="font-semibold text-accent-foreground">Daily Wellness Tip</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Morning sunlight exposure helps regulate your circadian rhythm. Try to get 10-15 minutes
                of natural light within the first hour of waking.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
