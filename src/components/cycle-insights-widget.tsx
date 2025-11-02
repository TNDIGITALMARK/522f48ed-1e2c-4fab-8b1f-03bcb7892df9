"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Heart,
  Droplets,
  Sparkles,
  Calendar,
  TrendingUp,
  Activity,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import {
  getActiveCycle,
  getCycleInsights,
  saveCycle,
  predictNextPeriod,
  getDayOfCycle,
  type PeriodCycle,
  type CyclePhase
} from '@/lib/period-calendar';
import { format, parseISO, addDays } from 'date-fns';

interface CycleInsightsWidgetProps {
  userId: string;
  onCycleUpdate?: (cycle: PeriodCycle) => void;
}

export function CycleInsightsWidget({ userId, onCycleUpdate }: CycleInsightsWidgetProps) {
  const [cycle, setCycle] = useState<PeriodCycle | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');

  useEffect(() => {
    const activeCycle = getActiveCycle(userId);
    setCycle(activeCycle);

    if (!activeCycle) {
      // Show setup dialog if no cycle exists
      setShowSetupDialog(true);
    }
  }, [userId]);

  const handleSaveCycle = () => {
    if (!lastPeriodStart) return;

    const newCycle: PeriodCycle = {
      id: cycle?.id || `cycle-${Date.now()}`,
      userId,
      startDate: lastPeriodStart,
      cycleLength: parseInt(cycleLength),
      periodLength: parseInt(periodLength),
      createdAt: cycle?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveCycle(newCycle);
    setCycle(newCycle);
    setShowSetupDialog(false);

    if (onCycleUpdate) {
      onCycleUpdate(newCycle);
    }
  };

  if (!cycle) {
    return (
      <Card className="bloom-card cycle-insight-card">
        <div className="text-center py-8">
          <Heart className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Start Tracking Your Cycle</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized insights based on your menstrual cycle phase
          </p>
          <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Set Up Period Tracking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Period Tracking Setup</DialogTitle>
                <DialogDescription>
                  Enter your last period start date to begin tracking your cycle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="period-start">Last Period Start Date *</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycle-length">Cycle Length (days)</Label>
                    <Input
                      id="cycle-length"
                      type="number"
                      min="21"
                      max="45"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Average: 28 days</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period-length">Period Length (days)</Label>
                    <Input
                      id="period-length"
                      type="number"
                      min="2"
                      max="10"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Average: 5 days</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCycle} disabled={!lastPeriodStart}>
                  Save & Start Tracking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  const insights = getCycleInsights(cycle);
  const lastPeriodDate = parseISO(cycle.startDate);
  const currentDay = getDayOfCycle(lastPeriodDate);
  const nextPeriod = predictNextPeriod(lastPeriodDate, cycle.cycleLength);
  const daysUntilPeriod = Math.max(0, cycle.cycleLength - ((currentDay - 1) % cycle.cycleLength));

  const phaseColors: Record<CyclePhase, string> = {
    menstruation: 'from-rose-100 to-rose-50 border-rose-200',
    follicular: 'from-purple-100 to-purple-50 border-purple-200',
    ovulation: 'from-green-100 to-green-50 border-green-200',
    luteal: 'from-amber-100 to-amber-50 border-amber-200'
  };

  const phaseIcons: Record<CyclePhase, React.ReactNode> = {
    menstruation: <Droplets className="w-5 h-5" />,
    follicular: <Moon className="w-5 h-5" />,
    ovulation: <Sun className="w-5 h-5" />,
    luteal: <Zap className="w-5 h-5" />
  };

  const energyColors = {
    low: 'text-rose-600',
    moderate: 'text-amber-600',
    high: 'text-green-600',
    elevated: 'text-purple-600'
  };

  return (
    <div className="space-y-4">
      {/* Main Cycle Card */}
      <Card className={`bloom-card cycle-insight-card bg-gradient-to-br ${phaseColors[insights.phase]}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                {phaseIcons[insights.phase]}
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize">{insights.phase} Phase</h3>
                <p className="text-sm text-muted-foreground">
                  Day {insights.dayInPhase} of {insights.totalDaysInPhase}
                </p>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Cycle Information</DialogTitle>
                <DialogDescription>
                  Adjust your cycle tracking details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="update-period-start">Last Period Start Date</Label>
                  <Input
                    id="update-period-start"
                    type="date"
                    value={cycle.startDate}
                    onChange={(e) => {
                      const updated = { ...cycle, startDate: e.target.value };
                      saveCycle(updated);
                      setCycle(updated);
                      if (onCycleUpdate) onCycleUpdate(updated);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="update-cycle-length">Cycle Length</Label>
                    <Input
                      id="update-cycle-length"
                      type="number"
                      value={cycle.cycleLength}
                      onChange={(e) => {
                        const updated = { ...cycle, cycleLength: parseInt(e.target.value) };
                        saveCycle(updated);
                        setCycle(updated);
                        if (onCycleUpdate) onCycleUpdate(updated);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="update-period-length">Period Length</Label>
                    <Input
                      id="update-period-length"
                      type="number"
                      value={cycle.periodLength}
                      onChange={(e) => {
                        const updated = { ...cycle, periodLength: parseInt(e.target.value) };
                        saveCycle(updated);
                        setCycle(updated);
                        if (onCycleUpdate) onCycleUpdate(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Phase Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Phase Progress</span>
            <span className="font-medium">{Math.round(insights.phaseProgress)}%</span>
          </div>
          <div className="phase-progress">
            <div
              className="phase-progress-bar"
              style={{
                width: `${insights.phaseProgress}%`,
                background: `hsl(var(--cycle-${insights.phase}))`
              }}
            />
          </div>
        </div>

        {/* Energy Level */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${energyColors[insights.energyLevel]}`} />
            <span className="font-medium">Energy Level</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {insights.energyLevel}
          </Badge>
        </div>

        {/* Next Period Prediction */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">Next Period</span>
          </div>
          <div className="text-right">
            <p className="font-semibold">{format(nextPeriod, 'MMM d')}</p>
            <p className="text-xs text-muted-foreground">{daysUntilPeriod} days</p>
          </div>
        </div>
      </Card>

      {/* Recommendations Card */}
      <Card className="bloom-card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h4 className="font-semibold">Personalized Recommendations</h4>
        </div>
        <ul className="space-y-2">
          {insights.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Common Symptoms Card */}
      <Card className="bloom-card bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-secondary" />
          <h4 className="font-semibold">What to Expect</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {insights.symptoms.map((symptom, index) => (
            <Badge key={index} variant="outline">
              {symptom}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
