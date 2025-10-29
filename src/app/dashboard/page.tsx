"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Droplets, Footprints, Brain, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  // Mock data for Sarah Thompson
  const userData = {
    name: "Sarah Thompson",
    cycleDay: 14,
    phase: "Ovulation Phase",
    mood: 7,
    energy: "Elevated",
    meditation: { completed: 12, goal: 15 },
    steps: { completed: 8000, goal: 10000 },
    water: { completed: 6, goal: 8 },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <BloomLogo />
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <Image
              src="/generated/wellness-coach-1.png"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Welcome back, Sarah</h1>
          <p className="text-muted-foreground text-lg">
            Here's your wellness snapshot for today
          </p>
        </div>

        {/* Cycle Status Card */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl mb-1">Cycle Day {userData.cycleDay}</h3>
              <p className="text-muted-foreground">{userData.phase}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Energy Level</span>
              <span className="font-medium text-primary">{userData.energy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mood Rating</span>
              <span className="font-medium">{userData.mood}/10</span>
            </div>
          </div>
        </Card>

        {/* Daily Rituals */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Today's Rituals</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Meditation */}
            <Card className="bloom-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Meditation</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.meditation.completed} / {userData.meditation.goal} min
                  </p>
                </div>
              </div>
              <Progress
                value={(userData.meditation.completed / userData.meditation.goal) * 100}
                className="h-2"
              />
            </Card>

            {/* Steps */}
            <Card className="bloom-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Footprints className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold">Movement</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.steps.completed.toLocaleString()} / {userData.steps.goal.toLocaleString()} steps
                  </p>
                </div>
              </div>
              <Progress
                value={(userData.steps.completed / userData.steps.goal) * 100}
                className="h-2"
              />
            </Card>

            {/* Water */}
            <Card className="bloom-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">Hydration</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.water.completed} / {userData.water.goal} glasses
                  </p>
                </div>
              </div>
              <Progress
                value={(userData.water.completed / userData.water.goal) * 100}
                className="h-2"
              />
            </Card>
          </div>
        </div>

        {/* Insights */}
        <Card className="bloom-card bg-gradient-to-br from-primary/5 to-primary/10 border-none">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Personalized Insight</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your energy levels are typically elevated during the ovulation phase.
                This is a great time to schedule important meetings or tackle challenging workouts.
                Keep up your meditation practice to maintain emotional balance.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
