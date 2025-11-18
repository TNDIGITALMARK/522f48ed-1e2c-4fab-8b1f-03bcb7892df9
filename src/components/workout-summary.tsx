"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Activity, Clock, Flame, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface WorkoutLog {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  calories?: number;
  date: string;
}

interface CardioLog {
  id: string;
  machineName: string;
  durationMinutes: number;
  caloriesBurned: number;
  distance?: number;
  distanceUnit?: string;
  workoutDate: string;
  createdAt: string;
}

interface WorkoutSummaryProps {
  workoutLogs?: WorkoutLog[];
  cardioLogs?: CardioLog[];
}

export function WorkoutSummary({ workoutLogs = [], cardioLogs = [] }: WorkoutSummaryProps) {
  // Combine and sort all logs by date
  const allLogs = [
    ...workoutLogs.map(log => ({ ...log, type: 'weights' as const })),
    ...cardioLogs.map(log => ({ ...log, type: 'cardio' as const, date: log.workoutDate }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentLogs = allLogs.slice(0, 3);

  // Calculate weekly stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyWorkouts = allLogs.filter(log => new Date(log.date) >= oneWeekAgo);
  const weeklyCalories = weeklyWorkouts.reduce((total, log) => {
    if (log.type === 'weights') {
      return total + (log.calories || 0);
    } else {
      return total + log.caloriesBurned;
    }
  }, 0);

  return (
    <Card className="rounded-3xl bg-[hsl(35,40%,94%)] backdrop-blur-md border border-black/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] hover:scale-[1.01] transition-all duration-500 widget-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            Recent Workouts
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your latest training sessions
          </p>
        </div>
        <Link href="/workout">
          <Button variant="outline" size="sm" className="rounded-full">
            View All
          </Button>
        </Link>
      </div>

      {/* Weekly Stats */}
      {weeklyWorkouts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">This Week</span>
            </div>
            <p className="text-2xl font-bold text-primary">{weeklyWorkouts.length}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-secondary" />
              <span className="text-xs font-medium text-muted-foreground">Calories Burned</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{Math.round(weeklyCalories)}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 ? (
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-muted/20 rounded-xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${log.type === 'weights' ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center`}>
                    {log.type === 'weights' ? (
                      <Dumbbell className="w-5 h-5 text-primary" />
                    ) : (
                      <Activity className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {log.type === 'weights' ? log.exercise : log.machineName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {log.type}
                </Badge>
              </div>
              <div className="flex gap-4 text-sm">
                {log.type === 'weights' ? (
                  <>
                    <span className="text-muted-foreground">
                      {log.sets} × {log.reps} @ {log.weight} lbs
                    </span>
                    {log.calories && (
                      <span className="text-secondary font-medium">
                        {log.calories} cal
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {log.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <Flame className="w-3 h-3" />
                      {Math.round(log.caloriesBurned)} cal
                    </span>
                    {log.distance && (
                      <span className="text-muted-foreground">
                        {log.distance} {log.distanceUnit}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Dumbbell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No workouts logged yet</p>
          <Link href="/workout">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Workout
            </Button>
          </Link>
        </div>
      )}

      {recentLogs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <Link href="/workout">
            <Button variant="ghost" size="sm" className="w-full rounded-full">
              View All Workouts
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
