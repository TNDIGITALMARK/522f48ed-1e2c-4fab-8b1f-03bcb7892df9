"use client";

import { useState, useEffect } from 'react';
import { getCurrentTemplate, type HomepageTemplateId } from '@/types/homepage-templates';
import { NutritionFocusedDashboard } from '@/components/nutrition-focused-dashboard';
import { FitnessFocusedDashboard } from '@/components/fitness-focused-dashboard';

// Default/Custom Dashboard
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
import { useDashboardData } from '@/hooks/use-user-profile';
import { SharedCalendar } from '@/components/shared-calendar';
import { GoalsTodoList } from '@/components/goals-todo-list';
import { BloomingFlower } from '@/components/blooming-flower';
import { HormoneWave3D } from '@/components/hormone-wave-3d';
import { DailyAspiration } from '@/components/daily-aspiration';
import { HomepageCustomizerButton } from '@/components/homepage-customizer-button';
import { CircularNavigation } from '@/components/circular-navigation';
import { DashboardQuickAccess } from '@/components/dashboard-quick-access';
import { SmartScannerButton } from '@/components/smart-scanner-button';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

function CustomDashboard() {
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

  // Sleep stages data (from SwipeableSleepTracker)
  const sleepStages = [
    {
      id: 'deep',
      stage: 'Deep Sleep',
      duration: 2.3,
      quality: 'good' as const,
      icon: 'moon' as const,
      color: 'from-indigo-500/20 to-purple-500/20',
    },
    {
      id: 'rem',
      stage: 'REM Sleep',
      duration: 1.8,
      quality: 'good' as const,
      icon: 'star' as const,
      color: 'from-violet-500/20 to-fuchsia-500/20',
    },
    {
      id: 'light',
      stage: 'Light Sleep',
      duration: 3.4,
      quality: 'excellent' as const,
      icon: 'cloud-moon' as const,
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'awake',
      stage: 'Awake Time',
      duration: 0.2,
      quality: 'excellent' as const,
      icon: 'sun' as const,
      color: 'from-amber-500/20 to-orange-500/20',
    },
  ];

  const totalSleep = sleepStages.reduce((sum, stage) => sum + stage.duration, 0);

  // Mock wellness data
  const userData = {
    name: "Sarah",
    cycleDay: 14,
    phase: "Ovulation Phase",
    sleepHours: totalSleep,
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
        {/* Greeting Header */}
        <div className="pt-2 pb-3 animate-fade-in-up">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-foreground">
              Hi {userData.name}
            </h1>
          </div>
        </div>

        {/* Hi Brooklyn Greeting with Dramatic 3D Shadow */}
        <div className="animate-fade-in-up animation-delay-200 mt-1 mb-4">
          <div className="relative text-center py-8">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: 'hsl(25 11% 21%)',
                textShadow: `
                  0 1px 0 hsl(25 11% 31%),
                  0 2px 0 hsl(25 11% 36%),
                  0 3px 0 hsl(25 11% 41%),
                  0 4px 0 hsl(25 11% 46%),
                  0 5px 0 hsl(25 11% 51%),
                  0 6px 0 hsl(25 11% 56%),
                  0 7px 0 hsl(25 11% 61%),
                  0 8px 0 hsl(25 11% 66%),
                  0 9px 0 hsl(25 11% 71%),
                  0 10px 10px rgba(0, 0, 0, 0.15),
                  0 20px 25px rgba(0, 0, 0, 0.10),
                  0 30px 35px rgba(0, 0, 0, 0.05)
                `,
                letterSpacing: '0.03em',
                lineHeight: 1.2,
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              Hi
            </h1>
          </div>
          {/* Visual break - small background space */}
          <div className="w-full h-8 relative overflow-hidden">
            <div
              className="absolute inset-0 blur-sm"
              style={{
                background: 'linear-gradient(to bottom, hsl(38 65% 96%) 0%, hsl(35 40% 94% / 0.5) 50%, transparent 100%)'
              }}
            />
          </div>
          <div className="relative text-center py-8">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: 'hsl(25 11% 21%)',
                textShadow: `
                  0 1px 0 hsl(25 11% 31%),
                  0 2px 0 hsl(25 11% 36%),
                  0 3px 0 hsl(25 11% 41%),
                  0 4px 0 hsl(25 11% 46%),
                  0 5px 0 hsl(25 11% 51%),
                  0 6px 0 hsl(25 11% 56%),
                  0 7px 0 hsl(25 11% 61%),
                  0 8px 0 hsl(25 11% 66%),
                  0 9px 0 hsl(25 11% 71%),
                  0 10px 10px rgba(0, 0, 0, 0.15),
                  0 20px 25px rgba(0, 0, 0, 0.10),
                  0 30px 35px rgba(0, 0, 0, 0.05)
                `,
                letterSpacing: '0.03em',
                lineHeight: 1.2,
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              Brooklyn
            </h1>
          </div>
        </div>

        {/* Cycle Phase Banner - Ovulation Widget with Animation */}
        <div className="overflow-hidden relative animate-fade-in-up animation-delay-300 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] mt-1 p-6" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)' }}>
          {/* Animated background gradient pulse */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: 'hsl(35 40% 94% / 0.25)' }} />
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none hidden lg:block">
            <BloomingFlower size={120} duration={3000} delay={1500} />
          </div>

          {/* Title at top */}
          <div className="relative z-10 mb-6">
            <p className="text-sm text-muted-foreground mb-2 text-center">Your Cycle Phase</p>
          </div>

          {/* 3D Animated Hormone Wave - Main focus now */}
          <div className="relative z-10 mb-6 -mx-6">
            <HormoneWave3D
              phase="ovulation"
              width={800}
              height={180}
              className="w-full"
            />
          </div>

          {/* Phase info - Now below the animation */}
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

          {/* Log a Symptom Button */}
          <div className="relative z-10 mt-6 -mx-6 p-6 border-t" style={{ backgroundColor: 'hsl(35 40% 94% / 0.35)', borderTopColor: 'hsl(35 40% 94% / 0.4)' }}>
            <Link href="/log-symptom">
              <Button className="w-full rounded-full shadow-bloom" style={{ backgroundColor: 'hsl(35 40% 88%)', border: '2px solid rgba(0, 0, 0, 0.4)', color: 'hsl(var(--foreground))', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                <Plus className="mr-2 w-5 h-5" />
                Log a Symptom
              </Button>
            </Link>
          </div>
        </div>

        {/* Smart Scanner Button - NEW: Above Calendar, Below Log a Symptom */}
        <div className="animate-fade-in-up animation-delay-350 mt-4">
          <SmartScannerButton />
        </div>

        {/* Shared Calendar Section */}
        <div className="animate-fade-in-up animation-delay-400 mt-4">
          <SharedCalendar userId={MOCK_USER_ID} />
        </div>

        {/* Quick Access Dashboard Sections - 3 Cards: To-Do, Weight & Goals, Meal Tracker */}
        <div className="animate-fade-in-up animation-delay-500 mt-4">
          <DashboardQuickAccess userId={MOCK_USER_ID} />
        </div>

        {/* Todo List Section - MOVED UNDERNEATH QUICK ACCESS */}
        <div className="animate-fade-in-up animation-delay-600 mt-4">
          <GoalsTodoList userId={MOCK_USER_ID} />
        </div>

        {/* Daily Aspiration - MOVED ABOVE CIRCULAR NAVIGATION, BELOW TODO LIST */}
        <div className="animate-fade-in-up animation-delay-800 mt-4">
          <DailyAspiration userId={MOCK_USER_ID} />
        </div>

        {/* Circular Navigation - Replacing Health Metrics Grid */}
        <div className="animate-fade-in-scale animation-delay-1000 mt-4">
          <CircularNavigation />
        </div>

        {/* Homepage Customizer Button - At Bottom */}
        <div className="animate-fade-in-up animation-delay-1600 mt-6 mb-8">
          <HomepageCustomizerButton />
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
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'hsl(100 30% 80%)' }}>
                      <Moon className="w-6 h-6" style={{ color: 'hsl(100 35% 40%)' }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Sleep Insights</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Total Sleep Summary */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Sleep</p>
                          <p className="text-4xl font-bold" style={{ color: 'hsl(100 35% 35%)' }}>
                            {userData.sleepHours.toFixed(1)}h
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Goal</p>
                          <p className="text-2xl font-semibold">8.0h</p>
                        </div>
                      </div>
                      <Progress value={(userData.sleepHours / 8) * 100} className="h-3 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {userData.sleepHours >= 7.5
                          ? '🎉 Excellent sleep! You hit your goal!'
                          : userData.sleepHours >= 7
                          ? '✨ Great sleep! Almost at your goal'
                          : userData.sleepHours >= 6
                          ? '💤 Good rest, but could be better'
                          : '😴 Try to get more rest tonight'}
                      </p>
                    </div>

                    {/* Sleep Stages Breakdown */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Sleep Stages</h4>
                      <div className="space-y-3">
                        {sleepStages.map((stage) => (
                          <div key={stage.id} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'hsl(100 30% 85%)' }}>
                                  <span className="text-2xl">
                                    {stage.icon === 'moon' && '🌙'}
                                    {stage.icon === 'star' && '⭐'}
                                    {stage.icon === 'cloud-moon' && '☁️'}
                                    {stage.icon === 'sun' && '☀️'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-base">{stage.stage}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{stage.quality} quality</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold" style={{ color: 'hsl(100 30% 25%)' }}>{stage.duration}h</p>
                                <p className="text-xs text-muted-foreground">{((stage.duration / totalSleep) * 100).toFixed(0)}% of total</p>
                              </div>
                            </div>
                            <Progress
                              value={(stage.duration / totalSleep) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sleep Insight */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'hsl(100 30% 95%)' }}>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <span>💡</span> Sleep Quality Analysis
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {userData.sleepHours >= 7
                          ? 'Excellent! You got quality rest with good distribution across all sleep stages. Your deep sleep (2.3h) and REM (1.8h) are both on target for optimal recovery and cognitive function.'
                          : `Try to get ${(8 - userData.sleepHours).toFixed(1)} more hours tonight for optimal recovery across all sleep stages. Aim for at least 1.5-2 hours each of deep sleep and REM sleep.`}
                      </p>
                    </div>

                    <Button className="w-full" onClick={closeModal}>Close</Button>
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

export default function DashboardPage() {
  const [currentTemplate, setCurrentTemplate] = useState<HomepageTemplateId>('custom');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const template = getCurrentTemplate();
    setCurrentTemplate(template.id);
  }, []);

  // Prevent hydration mismatch by rendering null on server
  if (!isClient) {
    return null;
  }

  // Render the appropriate dashboard based on selected template
  switch (currentTemplate) {
    case 'nutrition-focus':
      return <NutritionFocusedDashboard />;
    case 'fitness-focus':
      return <FitnessFocusedDashboard />;
    case 'custom':
    default:
      return <CustomDashboard />;
  }
}
