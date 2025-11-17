"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Target, TrendingUp, Calendar, MapPin, Award, Clock, Plus, CheckCircle2, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';

export interface WellnessJourney {
  id: string;
  title: string;
  goalType: 'half-marathon' | 'marathon' | 'hyrox' | 'running-endurance' | '5k' | '10k' | 'triathlon' | '75-hard' | 'custom';
  targetDate: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyCommitment: number; // hours per week
  focusAreas: string[];
  notes: string;
  milestones: JourneyMilestone[];
  createdAt: string;
  isActive: boolean;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedAt?: string;
}

const JOURNEY_TEMPLATES = {
  'half-marathon': {
    title: 'Half Marathon Training',
    description: 'Complete 13.1 miles (21.1 km) with structured training',
    duration: '12-16 weeks',
    icon: '🏃‍♀️',
    focusAreas: ['Endurance Running', 'Speed Work', 'Long Runs', 'Recovery', 'Nutrition'],
    weeklyHours: '4-6 hours',
    milestones: [
      { week: 4, title: 'Build Base Endurance', description: 'Complete 6-8 mile long run comfortably' },
      { week: 8, title: 'Increase Mileage', description: 'Complete 10 mile long run with confidence' },
      { week: 12, title: 'Peak Performance', description: 'Complete 12 mile long run and taper begins' },
      { week: 16, title: 'Race Day Ready', description: 'Run your half marathon!' },
    ],
  },
  'marathon': {
    title: 'Full Marathon Training',
    description: 'Conquer 26.2 miles (42.2 km) with comprehensive preparation',
    duration: '16-20 weeks',
    icon: '🏅',
    focusAreas: ['Long Distance Running', 'Tempo Runs', 'Strength Training', 'Mental Toughness', 'Fueling Strategy'],
    weeklyHours: '6-10 hours',
    milestones: [
      { week: 6, title: 'Foundation Phase', description: 'Consistently run 25-30 miles per week' },
      { week: 12, title: 'Build Phase', description: 'Complete 18-20 mile long run successfully' },
      { week: 16, title: 'Peak Training', description: 'Hit 22-24 mile long run and 40+ weekly miles' },
      { week: 20, title: 'Marathon Day', description: 'Complete your marathon!' },
    ],
  },
  'hyrox': {
    title: 'HYROX Competition Prep',
    description: 'Hybrid fitness race combining running and functional workouts',
    duration: '12-16 weeks',
    icon: '💪',
    focusAreas: ['Running Intervals', 'Functional Strength', 'Rowing', 'Sled Push/Pull', 'SkiErg', 'Sandbag Lunges'],
    weeklyHours: '6-8 hours',
    milestones: [
      { week: 4, title: 'Master the Movements', description: 'Perfect form on all 8 HYROX stations' },
      { week: 8, title: 'Build Work Capacity', description: 'Complete full HYROX simulation at moderate pace' },
      { week: 12, title: 'Peak Performance', description: 'Hit target split times for each station' },
      { week: 16, title: 'Race Day', description: 'Compete in your HYROX event!' },
    ],
  },
  'running-endurance': {
    title: 'General Running & Endurance',
    description: 'Build cardiovascular fitness and running consistency',
    duration: '8-12 weeks',
    icon: '🏃',
    focusAreas: ['Aerobic Base', 'Running Form', 'Consistency', 'Injury Prevention', 'Progressive Overload'],
    weeklyHours: '3-5 hours',
    milestones: [
      { week: 3, title: 'Establish Routine', description: 'Run 3-4 times per week consistently' },
      { week: 6, title: 'Increase Duration', description: 'Complete 60-minute continuous run' },
      { week: 9, title: 'Build Speed', description: 'Add tempo and interval sessions' },
      { week: 12, title: 'Endurance Milestone', description: 'Complete your longest run yet!' },
    ],
  },
  '5k': {
    title: '5K Race Training',
    description: 'Build speed and endurance for a 5K race (3.1 miles)',
    duration: '6-8 weeks',
    icon: '⚡',
    focusAreas: ['Speed Work', 'Interval Training', 'Running Form', 'Race Pacing'],
    weeklyHours: '2-4 hours',
    milestones: [
      { week: 2, title: 'Base Building', description: 'Run 2-3 miles comfortably' },
      { week: 4, title: 'Speed Development', description: 'Complete first interval workout' },
      { week: 6, title: 'Race Pace', description: 'Practice target 5K pace' },
      { week: 8, title: 'Race Day', description: 'Complete your 5K!' },
    ],
  },
  '10k': {
    title: '10K Race Training',
    description: 'Prepare for a 10K race (6.2 miles) with balanced training',
    duration: '8-10 weeks',
    icon: '🎯',
    focusAreas: ['Endurance', 'Tempo Runs', 'Race Strategy', 'Recovery'],
    weeklyHours: '3-5 hours',
    milestones: [
      { week: 3, title: 'Build Mileage', description: 'Consistently run 15-20 miles per week' },
      { week: 6, title: 'Long Run Progress', description: 'Complete 8 mile long run' },
      { week: 8, title: 'Race Pace Practice', description: 'Run 5 miles at target 10K pace' },
      { week: 10, title: 'Race Day', description: 'Complete your 10K!' },
    ],
  },
  'triathlon': {
    title: 'Triathlon Training',
    description: 'Multi-sport training for swim, bike, and run',
    duration: '12-20 weeks',
    icon: '🏊‍♀️',
    focusAreas: ['Swimming', 'Cycling', 'Running', 'Transitions', 'Brick Workouts'],
    weeklyHours: '8-12 hours',
    milestones: [
      { week: 6, title: 'Individual Discipline Comfort', description: 'Complete each leg at race distance' },
      { week: 12, title: 'Brick Workouts', description: 'Successfully complete bike-to-run transitions' },
      { week: 16, title: 'Full Simulation', description: 'Complete a full triathlon distance in training' },
      { week: 20, title: 'Race Day', description: 'Complete your triathlon!' },
    ],
  },
  '75-hard': {
    title: '75 Hard Challenge',
    description: 'Mental toughness program: 2 workouts daily (1 outdoor), gallon of water, read 10 pages, follow diet, progress photo - 75 days straight',
    duration: '75 days',
    icon: '🔥',
    focusAreas: ['Mental Toughness', 'Discipline', 'Daily Workouts', 'Nutrition', 'Reading', 'Consistency'],
    weeklyHours: '7-10 hours',
    milestones: [
      { week: 3, title: 'Establish Routine', description: 'Complete first 21 days - habits forming' },
      { week: 6, title: 'Quarter Mark', description: 'Hit 45 days - mental strength building' },
      { week: 9, title: 'Two-Thirds Complete', description: 'Reach 60 days - the finish line is in sight' },
      { week: 11, title: '75 Days Complete!', description: 'Finish all 75 days - you did it!' },
    ],
  },
};

interface WellnessJourneyPlannerProps {
  onJourneyCreated?: (journey: WellnessJourney) => void;
  existingJourneys?: WellnessJourney[];
}

export function WellnessJourneyPlanner({ onJourneyCreated, existingJourneys = [] }: WellnessJourneyPlannerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGoalType, setSelectedGoalType] = useState<keyof typeof JOURNEY_TEMPLATES | 'custom'>('half-marathon');
  const [customTitle, setCustomTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [weeklyCommitment, setWeeklyCommitment] = useState(5);
  const [notes, setNotes] = useState('');
  const [journeys, setJourneys] = useState<WellnessJourney[]>(existingJourneys);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

  const selectedTemplate = selectedGoalType !== 'custom' ? JOURNEY_TEMPLATES[selectedGoalType] : null;

  const handleCreateJourney = () => {
    if (!targetDate) {
      toast.error('Please select a target date');
      return;
    }

    if (selectedGoalType === 'custom' && !customTitle) {
      toast.error('Please enter a title for your custom journey');
      return;
    }

    const template = selectedTemplate;
    const newJourney: WellnessJourney = {
      id: Date.now().toString(),
      title: selectedGoalType === 'custom' ? customTitle : template!.title,
      goalType: selectedGoalType as WellnessJourney['goalType'],
      targetDate,
      currentLevel,
      weeklyCommitment,
      focusAreas: template?.focusAreas || [],
      notes,
      milestones: template?.milestones.map((m, idx) => ({
        id: `${Date.now()}-${idx}`,
        title: m.title,
        description: m.description,
        targetDate: calculateMilestoneDate(targetDate, template!.milestones.length, idx),
        completed: false,
      })) || [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setJourneys([...journeys, newJourney]);
    onJourneyCreated?.(newJourney);

    toast.success('Wellness journey created!', {
      description: `${newJourney.title} - Target: ${new Date(targetDate).toLocaleDateString()}`,
    });

    // Reset form
    setShowCreateDialog(false);
    setCustomTitle('');
    setTargetDate('');
    setNotes('');
  };

  const calculateMilestoneDate = (targetDate: string, totalMilestones: number, milestoneIndex: number): string => {
    const target = new Date(targetDate);
    const weeksPerMilestone = Math.floor(16 / totalMilestones);
    const weeksOffset = weeksPerMilestone * (milestoneIndex + 1);
    const milestoneDate = new Date(target);
    milestoneDate.setDate(target.getDate() - (16 * 7 - weeksOffset * 7));
    return milestoneDate.toISOString().split('T')[0];
  };

  const toggleMilestone = (journeyId: string, milestoneId: string) => {
    setJourneys(journeys.map(journey => {
      if (journey.id === journeyId) {
        return {
          ...journey,
          milestones: journey.milestones.map(m => {
            if (m.id === milestoneId) {
              const newCompleted = !m.completed;
              toast.success(newCompleted ? 'Milestone completed! 🎉' : 'Milestone unmarked');
              return {
                ...m,
                completed: newCompleted,
                completedAt: newCompleted ? new Date().toISOString() : undefined,
              };
            }
            return m;
          }),
        };
      }
      return journey;
    }));
  };

  const activeJourney = journeys.find(j => j.isActive);
  const completedMilestones = activeJourney?.milestones.filter(m => m.completed).length || 0;
  const totalMilestones = activeJourney?.milestones.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Current Active Journey */}
      {activeJourney ? (
        <Card className="bloom-card border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{activeJourney.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Target: {new Date(activeJourney.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Active
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Journey Progress</span>
              <span className="text-sm text-primary font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {completedMilestones} of {totalMilestones} milestones completed
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.ceil((new Date(activeJourney.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
              </span>
            </div>
          </div>

          {/* Journey Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-white rounded-xl border border-border">
              <Badge variant="outline" className="mb-2 text-xs">
                {activeJourney.currentLevel}
              </Badge>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-border">
              <p className="font-bold text-lg text-primary">{activeJourney.weeklyCommitment}h</p>
              <p className="text-xs text-muted-foreground">Weekly</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-border">
              <p className="font-bold text-lg text-secondary">{activeJourney.focusAreas.length}</p>
              <p className="text-xs text-muted-foreground">Focus Areas</p>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Journey Milestones
            </h4>
            {activeJourney.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border transition-all ${
                  milestone.completed
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-white border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMilestone(activeJourney.id, milestone.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      milestone.completed
                        ? 'bg-primary border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {milestone.completed && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className={`font-semibold text-sm ${milestone.completed ? 'text-primary' : ''}`}>
                        {milestone.title}
                      </h5>
                      <span className="text-xs text-muted-foreground">
                        {new Date(milestone.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    {milestone.completed && milestone.completedAt && (
                      <p className="text-xs text-primary mt-1">
                        ✓ Completed {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Focus Areas */}
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">Training Focus</h4>
            <div className="flex flex-wrap gap-2">
              {activeJourney.focusAreas.map((area, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {activeJourney.notes && (
            <div className="mt-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <h4 className="font-semibold text-sm mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{activeJourney.notes}</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="bloom-card border-2 border-dashed border-border">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Plan Your Wellness Journey</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Set a clear goal for your training - whether it's a race, event, or personal milestone.
              Create a structured plan with milestones to track your progress.
            </p>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Wellness Journey
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Plan Your Wellness Journey
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Goal Type Selection */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Select Your Goal</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(JOURNEY_TEMPLATES).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedGoalType(key as keyof typeof JOURNEY_TEMPLATES)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedGoalType === key
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                              <h4 className="font-semibold text-sm">{template.title}</h4>
                              <p className="text-xs text-muted-foreground">{template.duration}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedGoalType('custom')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedGoalType === 'custom'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">✨</span>
                          <div>
                            <h4 className="font-semibold text-sm">Custom Goal</h4>
                            <p className="text-xs text-muted-foreground">Design your own</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Template Info */}
                  {selectedTemplate && (
                    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-secondary" />
                        About This Goal
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{selectedTemplate.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weekly Commitment:</span>
                          <span className="ml-2 font-medium">{selectedTemplate.weeklyHours}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Title (if custom) */}
                  {selectedGoalType === 'custom' && (
                    <div>
                      <Label htmlFor="custom-title" className="text-sm font-semibold mb-2 block">
                        Journey Title
                      </Label>
                      <Input
                        id="custom-title"
                        placeholder="e.g., Summer Fitness Challenge"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Target Date */}
                  <div>
                    <Label htmlFor="target-date" className="text-sm font-semibold mb-2 block">
                      Target Date
                    </Label>
                    <Input
                      id="target-date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Current Level */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Current Fitness Level</Label>
                    <Select value={currentLevel} onValueChange={(value) => setCurrentLevel(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - New to this activity</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                        <SelectItem value="advanced">Advanced - Highly experienced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weekly Commitment */}
                  <div>
                    <Label htmlFor="weekly-hours" className="text-sm font-semibold mb-2 block">
                      Weekly Time Commitment (hours)
                    </Label>
                    <Input
                      id="weekly-hours"
                      type="number"
                      min="1"
                      max="20"
                      value={weeklyCommitment}
                      onChange={(e) => setWeeklyCommitment(parseInt(e.target.value) || 5)}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-semibold mb-2 block">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes about your journey, motivation, or specific considerations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleCreateJourney}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Wellness Journey
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      )}

      {/* Create Journey Button (when active journey exists) */}
      {activeJourney && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Plan Another Journey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Plan Your Wellness Journey
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Same form content as above */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Select Your Goal</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(JOURNEY_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedGoalType(key as keyof typeof JOURNEY_TEMPLATES)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedGoalType === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm">{template.title}</h4>
                          <p className="text-xs text-muted-foreground">{template.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedGoalType('custom')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedGoalType === 'custom'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✨</span>
                      <div>
                        <h4 className="font-semibold text-sm">Custom Goal</h4>
                        <p className="text-xs text-muted-foreground">Design your own</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {selectedTemplate && (
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-secondary" />
                    About This Goal
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-medium">{selectedTemplate.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weekly Commitment:</span>
                      <span className="ml-2 font-medium">{selectedTemplate.weeklyHours}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedGoalType === 'custom' && (
                <div>
                  <Label htmlFor="custom-title-2" className="text-sm font-semibold mb-2 block">
                    Journey Title
                  </Label>
                  <Input
                    id="custom-title-2"
                    placeholder="e.g., Summer Fitness Challenge"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="target-date-2" className="text-sm font-semibold mb-2 block">
                  Target Date
                </Label>
                <Input
                  id="target-date-2"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Current Fitness Level</Label>
                <Select value={currentLevel} onValueChange={(value) => setCurrentLevel(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - New to this activity</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Highly experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weekly-hours-2" className="text-sm font-semibold mb-2 block">
                  Weekly Time Commitment (hours)
                </Label>
                <Input
                  id="weekly-hours-2"
                  type="number"
                  min="1"
                  max="20"
                  value={weeklyCommitment}
                  onChange={(e) => setWeeklyCommitment(parseInt(e.target.value) || 5)}
                />
              </div>

              <div>
                <Label htmlFor="notes-2" className="text-sm font-semibold mb-2 block">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes-2"
                  placeholder="Any additional notes about your journey, motivation, or specific considerations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCreateJourney}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Create Wellness Journey
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
