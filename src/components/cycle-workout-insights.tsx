"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dumbbell,
  Flame,
  Heart,
  TrendingUp,
  Activity,
  Zap,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import {
  getActiveCycle,
  getCycleInsights,
  type CyclePhase
} from '@/lib/period-calendar';

interface CycleWorkoutInsightsProps {
  userId: string;
}

interface WorkoutRecommendation {
  title: string;
  intensity: 'low' | 'moderate' | 'high';
  duration: string;
  description: string;
  rationale: string;
  benefits: string[];
  icon: React.ElementType;
}

const getWorkoutRecommendations = (phase: CyclePhase): WorkoutRecommendation[] => {
  switch (phase) {
    case 'menstruation':
      return [
        {
          title: 'Gentle Yoga Flow',
          intensity: 'low',
          duration: '20-30 min',
          description: 'Focus on restorative poses and deep breathing',
          rationale: 'Your body needs rest during menstruation. Gentle movement helps with cramps and reduces inflammation while respecting your energy levels.',
          benefits: ['Reduces cramping', 'Improves circulation', 'Relieves stress'],
          icon: Moon
        },
        {
          title: 'Light Walking',
          intensity: 'low',
          duration: '15-25 min',
          description: 'Easy-paced outdoor walk or treadmill session',
          rationale: 'Low-impact movement can actually reduce period pain and boost endorphins without overtaxing your body.',
          benefits: ['Natural pain relief', 'Mood boost', 'Gentle cardio'],
          icon: Activity
        }
      ];

    case 'follicular':
      return [
        {
          title: 'High-Intensity Interval Training',
          intensity: 'high',
          duration: '30-40 min',
          description: 'Power through intense bursts with short recovery',
          rationale: 'Rising estrogen levels boost your energy and pain tolerance. Your body is primed for challenging workouts and building strength.',
          benefits: ['Maximum calorie burn', 'Strength building', 'Endurance boost'],
          icon: Flame
        },
        {
          title: 'Strength Training',
          intensity: 'high',
          duration: '40-50 min',
          description: 'Focus on compound movements and progressive overload',
          rationale: 'This is your power phase! Higher estrogen enhances muscle recovery and growth. Take advantage of increased strength capacity.',
          benefits: ['Muscle growth', 'Increased metabolism', 'Bone density'],
          icon: Dumbbell
        },
        {
          title: 'Running or Cycling',
          intensity: 'high',
          duration: '30-45 min',
          description: 'Sustained cardio at a challenging pace',
          rationale: 'Your cardiovascular system is at peak performance. Push your limits with longer, more intense cardio sessions.',
          benefits: ['Cardio endurance', 'Fat burning', 'Mental clarity'],
          icon: TrendingUp
        }
      ];

    case 'ovulation':
      return [
        {
          title: 'CrossFit or Circuit Training',
          intensity: 'high',
          duration: '35-45 min',
          description: 'Mixed modality high-intensity circuits',
          rationale: 'Peak estrogen and testosterone levels make this your strongest phase. Your body can handle maximum intensity and quick recovery.',
          benefits: ['Peak performance', 'Maximum strength', 'Fast recovery'],
          icon: Zap
        },
        {
          title: 'Power Yoga or Pilates',
          intensity: 'moderate',
          duration: '45-60 min',
          description: 'Dynamic flows with strength-building holds',
          rationale: 'Excellent balance of strength and flexibility training during your most energetic phase.',
          benefits: ['Core strength', 'Flexibility', 'Mind-body connection'],
          icon: Sun
        },
        {
          title: 'Dance Cardio or Boxing',
          intensity: 'high',
          duration: '30-40 min',
          description: 'Fun, high-energy workouts',
          rationale: 'Take advantage of elevated mood and energy. Social or expressive workouts feel especially rewarding now.',
          benefits: ['Cardio blast', 'Stress relief', 'Coordination'],
          icon: Sparkles
        }
      ];

    case 'luteal':
      return [
        {
          title: 'Moderate Strength Training',
          intensity: 'moderate',
          duration: '30-40 min',
          description: 'Focus on maintenance with slightly lower volume',
          rationale: 'Progesterone rises and can make you feel sluggish. Moderate intensity prevents overtraining while maintaining gains.',
          benefits: ['Maintains strength', 'Stable energy', 'Mood regulation'],
          icon: Dumbbell
        },
        {
          title: 'Vinyasa or Hatha Yoga',
          intensity: 'moderate',
          duration: '40-50 min',
          description: 'Balanced practice with restorative elements',
          rationale: 'Combat PMS symptoms with mindful movement. The stretching helps with bloating and mood swings.',
          benefits: ['Reduces PMS', 'Improves digestion', 'Calms anxiety'],
          icon: Heart
        },
        {
          title: 'Swimming or Water Aerobics',
          intensity: 'moderate',
          duration: '30-40 min',
          description: 'Low-impact full-body workout',
          rationale: 'Water resistance provides excellent training without joint stress. Perfect when your body feels heavier or more sensitive.',
          benefits: ['Full-body workout', 'Joint-friendly', 'Reduces swelling'],
          icon: Activity
        }
      ];
  }
};

const intensityColors = {
  low: 'bg-accent/20 text-accent-foreground border-accent',
  moderate: 'bg-secondary/20 text-secondary-foreground border-secondary',
  high: 'bg-primary/20 text-primary-foreground border-primary'
};

const intensityLabels = {
  low: 'Low Intensity',
  moderate: 'Moderate',
  high: 'High Intensity'
};

export function CycleWorkoutInsights({ userId }: CycleWorkoutInsightsProps) {
  const [cycle, setCycle] = useState<ReturnType<typeof getActiveCycle>>(null);
  const [insights, setInsights] = useState<ReturnType<typeof getCycleInsights> | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRecommendation | null>(null);

  useEffect(() => {
    const activeCycle = getActiveCycle(userId);
    setCycle(activeCycle);

    if (activeCycle) {
      const cycleInsights = getCycleInsights(activeCycle);
      setInsights(cycleInsights);
    }
  }, [userId]);

  if (!cycle || !insights) {
    return (
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Track Your Cycle</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized workout recommendations based on your menstrual cycle phase
          </p>
        </div>
      </Card>
    );
  }

  const recommendations = getWorkoutRecommendations(insights.phase);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Recommended Workouts</h2>
            <p className="text-muted-foreground leading-relaxed">
              Based on your <span className="font-semibold capitalize text-foreground">{insights.phase} phase</span>
            </p>
            <Badge variant="outline" className="mt-3 border-primary/40">
              Day {insights.dayInPhase} of {insights.totalDaysInPhase}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Phase Insight Card */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Why These Workouts?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insights.phase === 'menstruation' &&
                'During menstruation, hormone levels are at their lowest. Your body needs gentler movement that supports rest and recovery while still providing therapeutic benefits for cramps and mood.'}
              {insights.phase === 'follicular' &&
                'Your estrogen is rising, giving you increased energy, strength, and pain tolerance. This is the ideal time for challenging workouts and building fitness gains.'}
              {insights.phase === 'ovulation' &&
                'Peak hormone levels mean peak performance! You have maximum energy, strength, and recovery capacity. Push your limits during this phase.'}
              {insights.phase === 'luteal' &&
                'Progesterone can make you feel more tired and bloated. Moderate intensity workouts help combat PMS while avoiding overtraining. Listen to your body.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className={`w-4 h-4 ${insights.energyLevel === 'high' || insights.energyLevel === 'elevated' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="font-medium">Energy Level:</span>
          <Badge variant="secondary" className="capitalize">
            {insights.energyLevel}
          </Badge>
        </div>
      </Card>

      {/* Workout Recommendations Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Your Workout</h3>

        {recommendations.map((workout, index) => {
          const Icon = workout.icon;
          const isExpanded = selectedWorkout?.title === workout.title;

          return (
            <Card
              key={index}
              className={`bloom-card cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isExpanded ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedWorkout(isExpanded ? null : workout)}
            >
              <div className="space-y-4">
                {/* Workout Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${intensityColors[workout.intensity]} border-2 flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{workout.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {workout.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className={`${intensityColors[workout.intensity]} border`}>
                          {intensityLabels[workout.intensity]}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{workout.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <ArrowRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                    {/* Rationale */}
                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <h5 className="font-semibold">Why This Works Now</h5>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                        {workout.rationale}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Key Benefits
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {workout.benefits.map((benefit, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-accent/10 rounded-lg px-3 py-2 border border-accent/20"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      size="lg"
                    >
                      <Activity className="w-5 h-5 mr-2" />
                      Start This Workout
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Tip */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Listen to Your Body</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These are recommendations based on typical hormonal patterns. Always adjust intensity
              based on how you feel. Rest days are just as important as training days.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
