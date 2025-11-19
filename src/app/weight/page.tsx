"use client";


import { Navigation } from '@/components/navigation';
import { RootedHeader } from '@/components/rooted-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Scale, Target, TrendingDown, TrendingUp, Minus, Plus, Calendar, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  addWeightLog,
  loadWeightLogs,
  getLatestWeight,
  getWeightTrend,
  calculateWeightChange,
  setUserGoal,
  getActiveGoal,
  calculateGoalProgress,
  getGoalTypeInfo,
  formatWeight,
  formatHeight,
  getLatestHeight,
  calculateBMI,
  getBMICategory,
  deleteWeightLog,
  type WeightLog,
  type GoalType,
  type WeightUnit,
  type HeightUnit
} from '@/lib/weight-tracking';

const MOCK_USER_ID = 'demo-user-001';

export default function WeightTrackingPage() {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [latestWeight, setLatestWeight] = useState<WeightLog | null>(null);
  const [activeGoal, setActiveGoal] = useState<ReturnType<typeof getActiveGoal>>(null);
  const [goalProgress, setGoalProgress] = useState<ReturnType<typeof calculateGoalProgress>>(null);
  const [weightChange, setWeightChange] = useState<ReturnType<typeof calculateWeightChange>>(null);

  // Log weight dialog state
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightUnit, setNewWeightUnit] = useState<WeightUnit>('lbs');
  const [newHeight, setNewHeight] = useState('');
  const [newHeightUnit, setNewHeightUnit] = useState<HeightUnit>('inches');
  const [newWeightNotes, setNewWeightNotes] = useState('');

  // Set goal dialog state
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [goalType, setGoalType] = useState<GoalType>('maintaining');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [goalWeightUnit, setGoalWeightUnit] = useState<WeightUnit>('lbs');
  const [weeklyGoal, setWeeklyGoal] = useState('');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const logs = loadWeightLogs(MOCK_USER_ID);
    setWeightLogs(logs);
    
    const latest = getLatestWeight(MOCK_USER_ID);
    setLatestWeight(latest);
    
    const goal = getActiveGoal(MOCK_USER_ID);
    setActiveGoal(goal);
    
    const progress = calculateGoalProgress(MOCK_USER_ID);
    setGoalProgress(progress);
    
    const change = calculateWeightChange(MOCK_USER_ID);
    setWeightChange(change);

    // Pre-fill current weight and height if we have them
    if (latest && !currentWeight) {
      setCurrentWeight(latest.weight.toString());
      setNewWeightUnit(latest.unit);
      setGoalWeightUnit(latest.unit);
    }

    // Pre-fill height from latest log
    const latestHeightData = getLatestHeight(MOCK_USER_ID);
    if (latestHeightData && !newHeight) {
      setNewHeight(latestHeightData.height.toString());
      setNewHeightUnit(latestHeightData.unit);
    }
  };

  const handleLogWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      await addWeightLog(
        MOCK_USER_ID,
        parseFloat(newWeight),
        newWeightUnit,
        newWeightNotes || undefined,
        newHeight ? parseFloat(newHeight) : undefined,
        newHeight ? newHeightUnit : undefined
      );

      toast.success('Weight logged successfully!', {
        description: `${newWeight} ${newWeightUnit}${newHeight ? ` • ${formatHeight(parseFloat(newHeight), newHeightUnit)}` : ''}`
      });

      setNewWeight('');
      setNewHeight('');
      setNewWeightNotes('');
      setShowLogDialog(false);
      loadData();
    } catch (error) {
      toast.error('Failed to log weight');
      console.error(error);
    }
  };

  const handleSetGoal = async () => {
    if (!currentWeight || !targetWeight) {
      toast.error('Please enter current and target weights');
      return;
    }

    try {
      await setUserGoal(MOCK_USER_ID, goalType, {
        currentWeight: parseFloat(currentWeight),
        targetWeight: parseFloat(targetWeight),
        weightUnit: goalWeightUnit,
        weeklyGoal: weeklyGoal ? parseFloat(weeklyGoal) : undefined
      });

      const goalInfo = getGoalTypeInfo(goalType);
      toast.success('Goal set successfully!', {
        description: `${goalInfo.icon} ${goalInfo.label}: ${targetWeight} ${goalWeightUnit}`
      });

      setShowGoalDialog(false);
      loadData();
    } catch (error) {
      toast.error('Failed to set goal');
      console.error(error);
    }
  };

  const handleDeleteLog = (logId: string) => {
    deleteWeightLog(MOCK_USER_ID, logId);
    toast.success('Weight log deleted');
    loadData();
  };

  const goalTypeInfo = activeGoal ? getGoalTypeInfo(activeGoal.goalType) : null;
  const trend = getWeightTrend(MOCK_USER_ID, 30);
  const latestHeightData = getLatestHeight(MOCK_USER_ID);

  // Calculate BMI if we have both weight and height
  const bmi = latestWeight && latestHeightData
    ? calculateBMI(latestWeight.weight, latestWeight.unit, latestHeightData.height, latestHeightData.unit)
    : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <RootedHeader />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-4xl mb-2">Weight & Goals</h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and achieve your fitness goals
          </p>
        </div>

        {/* BMI Card - Show if height is available */}
        {latestHeightData && bmi && bmiCategory && (
          <Card className="bloom-card bg-gradient-to-br from-accent/10 to-accent/5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Body Mass Index (BMI)</h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-accent-foreground">{bmi.toFixed(1)}</p>
                  <Badge variant="outline" className={bmiCategory.color}>
                    {bmiCategory.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Height: {formatHeight(latestHeightData.height, latestHeightData.unit)}
                </p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </Card>
        )}

        {/* Current Weight & Goal Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Weight Card */}
          <Card className="bloom-card bg-gradient-to-br from-primary/10 to-primary/5">
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
              <div className="flex items-center gap-2 text-sm">
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

            <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Weight
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Scale className="w-6 h-6 text-primary" />
                    Log Your Weight
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="weight">Weight *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="150.0"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-28">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={newWeightUnit} onValueChange={(v) => setNewWeightUnit(v as WeightUnit)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="height">Height (optional)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder={newHeightUnit === 'inches' ? '66' : '168'}
                        value={newHeight}
                        onChange={(e) => setNewHeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-28">
                      <Label htmlFor="height-unit">Unit</Label>
                      <Select value={newHeightUnit} onValueChange={(v) => setNewHeightUnit(v as HeightUnit)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inches">inches</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="How are you feeling? Any notes about today..."
                      value={newWeightNotes}
                      onChange={(e) => setNewWeightNotes(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleLogWeight}
                    disabled={!newWeight}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Weight Log
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Active Goal Card */}
          <Card className="bloom-card bg-gradient-to-br from-secondary/10 to-secondary/5">
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

            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full">
                  <Target className="w-4 h-4 mr-2" />
                  {activeGoal ? 'Update Goal' : 'Set Goal'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-secondary" />
                    Set Your Fitness Goal
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <Select value={goalType} onValueChange={(v) => setGoalType(v as GoalType)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cutting">📉 Cutting (Lose Weight)</SelectItem>
                        <SelectItem value="bulking">📈 Bulking (Gain Muscle)</SelectItem>
                        <SelectItem value="maintaining">⚖️ Maintaining (Stay Current)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="current-weight">Current Weight</Label>
                      <Input
                        id="current-weight"
                        type="number"
                        step="0.1"
                        placeholder="150.0"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-weight">Target Weight</Label>
                      <Input
                        id="target-weight"
                        type="number"
                        step="0.1"
                        placeholder="140.0"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="goal-unit">Unit</Label>
                      <Select value={goalWeightUnit} onValueChange={(v) => setGoalWeightUnit(v as WeightUnit)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weekly-goal">Weekly Change</Label>
                      <Input
                        id="weekly-goal"
                        type="number"
                        step="0.1"
                        placeholder="1.0"
                        value={weeklyGoal}
                        onChange={(e) => setWeeklyGoal(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-muted-foreground">
                      {goalType === 'cutting' && 'Aim for 1-2 lbs per week for healthy weight loss'}
                      {goalType === 'bulking' && 'Aim for 0.5-1 lbs per week for lean muscle gain'}
                      {goalType === 'maintaining' && 'Focus on consistency and body composition'}
                    </p>
                  </div>

                  <Button
                    onClick={handleSetGoal}
                    disabled={!currentWeight || !targetWeight}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Set Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </div>

        {/* Weight History */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="history">Weight History</TabsTrigger>
            <TabsTrigger value="trend">Trend Graph</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card className="bloom-card">
              <h3 className="text-xl font-semibold mb-4">Recent Weigh-ins</h3>

              {weightLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">No weight logs yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start tracking your weight to see your progress
                  </p>
                  <Button
                    onClick={() => setShowLogDialog(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Weight
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {weightLogs.slice(0, 10).map((log) => (
                    <Card key={log.id} className="p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Scale className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold">{formatWeight(log.weight, log.unit)}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(log.loggedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {log.notes && (
                              <p className="text-sm text-muted-foreground italic mt-1">
                                &ldquo;{log.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trend">
            <Card className="bloom-card">
              <h3 className="text-xl font-semibold mb-4">30-Day Trend</h3>
              
              {trend.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Log more weights to see your trend
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Simple text-based trend visualization */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Starting Weight</p>
                      <p className="text-xl font-bold">
                        {formatWeight(trend[0].weight, trend[0].unit)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
                      <p className="text-xl font-bold">
                        {formatWeight(trend[trend.length - 1].weight, trend[trend.length - 1].unit)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Change</p>
                      <p className="text-xl font-bold text-secondary">
                        {(trend[trend.length - 1].weight - trend[0].weight).toFixed(1)} {trend[0].unit}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Data Points</p>
                      <p className="text-xl font-bold">{trend.length}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      Keep logging consistently to see detailed trends and insights!
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
}
