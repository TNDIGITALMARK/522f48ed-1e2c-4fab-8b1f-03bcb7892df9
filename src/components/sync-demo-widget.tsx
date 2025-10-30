/**
 * Sync Demo Widget
 *
 * Demonstrates real-time data synchronization across the app.
 * Shows how updates in one place instantly reflect everywhere else.
 */

"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';

interface SyncDemoWidgetProps {
  userId: string;
}

export function SyncDemoWidget({ userId }: SyncDemoWidgetProps) {
  const { profile, updateWellness } = useUserProfile(userId);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    if (profile) {
      const formattedTime = new Date(profile.lastUpdated).toLocaleTimeString();
      setLastUpdate(formattedTime);
    }
  }, [profile]);

  const handleQuickTest = () => {
    // Update water intake to demonstrate sync
    if (profile) {
      updateWellness({
        waterConsumed: Math.min(profile.waterConsumed + 1, profile.waterGoal)
      });
    }
  };

  if (!profile) return null;

  return (
    <Card className="bloom-card bg-gradient-to-br from-secondary/10 to-accent/5 border-secondary/20">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Zap className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">
            Live Data Sync
            <Badge variant="secondary" className="text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            All data syncs across dashboard, profile, and nutrition pages in real-time
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium">Water Intake</span>
          <span className="text-sm">
            {profile.waterConsumed} / {profile.waterGoal} glasses
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium">Steps</span>
          <span className="text-sm">
            {profile.stepsCompleted.toLocaleString()} / {profile.stepsGoal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <span className="text-sm font-medium">Meditation</span>
          <span className="text-sm">
            {profile.meditationCompleted} / {profile.meditationGoal} min
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Last updated: {lastUpdate}
        </span>
      </div>

      <Button
        onClick={handleQuickTest}
        size="sm"
        className="w-full"
        variant="outline"
      >
        <Zap className="w-4 h-4 mr-2" />
        Test Sync (Add Water)
      </Button>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Click "Test Sync" and watch this data update across all pages instantly
      </p>
    </Card>
  );
}
