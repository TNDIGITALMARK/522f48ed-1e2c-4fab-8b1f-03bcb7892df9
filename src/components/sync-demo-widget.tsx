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
    <Card className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_-8px_rgba(168,181,160,0.15)] hover:shadow-[0_16px_48px_-12px_rgba(168,181,160,0.25)] hover:scale-[1.01] transition-all duration-500 widget-card">
      <div className="flex flex-col items-center text-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(100,15%,67%)] to-[hsl(80,12%,37%)] flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm flex items-center justify-center gap-1.5">
            Live Data Sync
            <Badge variant="secondary" className="text-[0.625rem] px-1.5 py-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
              Active
            </Badge>
          </h3>
          <p className="text-[0.625rem] text-muted-foreground mt-0.5 leading-snug">
            All data syncs across dashboard, profile, and nutrition pages in real-time
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between p-2 bg-white/50 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300">
          <span className="text-[0.6875rem] font-medium">Water Intake</span>
          <span className="text-[0.625rem]">
            {profile.waterConsumed} / {profile.waterGoal} glasses
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/50 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300">
          <span className="text-[0.6875rem] font-medium">Steps</span>
          <span className="text-[0.625rem]">
            {profile.stepsCompleted.toLocaleString()} / {profile.stepsGoal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/50 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300">
          <span className="text-[0.6875rem] font-medium">Meditation</span>
          <span className="text-[0.625rem]">
            {profile.meditationCompleted} / {profile.meditationGoal} min
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[0.625rem] text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <RefreshCw className="w-2.5 h-2.5" />
          Last updated: {lastUpdate}
        </span>
      </div>

      <Button
        onClick={handleQuickTest}
        size="sm"
        className="w-full text-[0.6875rem]"
        variant="outline"
      >
        <Zap className="w-3 h-3 mr-1.5" />
        Test Sync (Add Water)
      </Button>

      <p className="text-[0.625rem] text-muted-foreground mt-2 text-center leading-snug">
        Click "Test Sync" and watch this data update across all pages instantly
      </p>
    </Card>
  );
}
