"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Heart,
  Footprints,
  Flame,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface HealthData {
  steps: number;
  stepsGoal: number;
  distance: number;
  activeMinutes: number;
  caloriesBurned: number;
  heartRate: number;
  lastSync: Date | null;
}

interface AppleHealthSyncProps {
  onConnect?: () => void;
  onSync?: () => void;
}

export function AppleHealthSync({ onConnect, onSync }: AppleHealthSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 7234,
    stepsGoal: 10000,
    distance: 5.2,
    activeMinutes: 45,
    caloriesBurned: 482,
    heartRate: 72,
    lastSync: new Date(),
  });

  const handleConnect = async () => {
    setIsSyncing(true);

    // Simulate Apple Health connection
    setTimeout(() => {
      setIsConnected(true);
      setIsSyncing(false);
      onConnect?.();
    }, 2000);
  };

  const handleSync = async () => {
    setIsSyncing(true);

    // Simulate data sync
    setTimeout(() => {
      setHealthData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 100),
        lastSync: new Date(),
      }));
      setIsSyncing(false);
      onSync?.();
    }, 1500);
  };

  const stepsProgress = (healthData.steps / healthData.stepsGoal) * 100;

  if (!isConnected) {
    return (
      <Card className="bloom-card bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <Activity className="w-12 h-12 text-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-2">Connect Apple Health</h3>
            <p className="text-muted-foreground mb-4">
              Sync your step count and activity data to get personalized nutrition recommendations
              based on your daily movement.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                <Footprints className="w-3 h-3 mr-1" />
                Steps
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Heart Rate
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Calories
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Activity
              </Badge>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isSyncing}
            size="lg"
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="bloom-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                Apple Health Connected
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Last synced: {healthData.lastSync?.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Steps Card */}
        <Card className="bloom-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Footprints className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Daily Steps</h4>
              <p className="text-sm text-muted-foreground">
                {healthData.steps.toLocaleString()} / {healthData.stepsGoal.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {Math.round(stepsProgress)}%
              </p>
            </div>
          </div>

          <Progress value={stepsProgress} className="h-3 mb-2" />

          <p className="text-xs text-muted-foreground text-center">
            {healthData.stepsGoal - healthData.steps > 0
              ? `${(healthData.stepsGoal - healthData.steps).toLocaleString()} steps to goal`
              : 'Goal achieved! 🎉'
            }
          </p>
        </Card>

        {/* Activity Card */}
        <Card className="bloom-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <Activity className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Active Minutes</h4>
              <p className="text-sm text-muted-foreground">Today's activity</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-secondary">
                {healthData.activeMinutes}
              </p>
              <p className="text-xs text-muted-foreground">minutes</p>
            </div>
          </div>
        </Card>

        {/* Distance Card */}
        <Card className="bloom-card">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Distance</h4>
              <p className="text-sm text-muted-foreground">Total walked</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {healthData.distance}
              </p>
              <p className="text-xs text-muted-foreground">kilometers</p>
            </div>
          </div>
        </Card>

        {/* Calories Card */}
        <Card className="bloom-card">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Calories Burned</h4>
              <p className="text-sm text-muted-foreground">Active energy</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {healthData.caloriesBurned}
              </p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Insight */}
      <Card className="bloom-card bg-gradient-to-br from-accent/10 to-primary/5 border-none">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Activity-Based Nutrition</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on your {healthData.steps.toLocaleString()} steps today, we've adjusted your meal plan
              to include an extra {Math.round(healthData.caloriesBurned / 10)} kcal to support your
              active lifestyle. Keep moving! 💪
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
