"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Zap, CloudRain, Sun, Moon, Sparkles } from 'lucide-react';
import { useState } from 'react';

const cyclePhases = [
  {
    name: 'Menstruation',
    icon: CloudRain,
    days: '1-5',
    color: 'bg-accent',
    description: 'Rest and renew',
    workout: 'Restorative yoga, walking',
    nutrition: 'Iron-rich foods, warm meals',
    energy: 'Lower activity',
    affirmation: 'It\'s okay to rest — your body is working hard for you.',
    calorieAdjustment: '-100 kcal/day',
  },
  {
    name: 'Follicular',
    icon: Sun,
    days: '6-13',
    color: 'bg-primary',
    description: 'Energy rising',
    workout: 'Light strength training, HIIT',
    nutrition: 'Higher carb meals to fuel energy',
    energy: 'Elevated',
    affirmation: 'Strength training and higher carb meals will fuel your energy best!',
    calorieAdjustment: '+100 kcal/day',
  },
  {
    name: 'Ovulation',
    icon: Sparkles,
    days: '14-16',
    color: 'bg-secondary',
    description: 'Peak energy',
    workout: 'Peak intensity workouts',
    nutrition: 'Balanced macros',
    energy: 'Peak',
    affirmation: 'You\'re at your peak - tackle those challenging goals!',
    calorieAdjustment: 'Baseline',
  },
  {
    name: 'Luteal',
    icon: Moon,
    days: '17-28',
    color: 'bg-muted',
    description: 'Wind down',
    workout: 'Low impact & mobility',
    nutrition: 'Magnesium-rich foods (sweet potato, avocado)',
    energy: 'Moderate to low',
    affirmation: 'Your body needs gentleness right now - honor that.',
    calorieAdjustment: '+200 kcal/day',
  },
];

const moodOptions = [
  { emoji: '😊', label: 'Happy', value: 8 },
  { emoji: '😌', label: 'Calm', value: 7 },
  { emoji: '😐', label: 'Neutral', value: 5 },
  { emoji: '😔', label: 'Low', value: 3 },
  { emoji: '😫', label: 'Anxious', value: 2 },
];

const symptoms = [
  'Cramping', 'Bloating', 'Headache', 'Fatigue',
  'Breast Tenderness', 'Mood Swings', 'Increased Energy', 'Clear Skin'
];

export default function CyclePage() {
  const [selectedMood, setSelectedMood] = useState(8);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Increased Energy']);

  const currentCycleDay = 14;
  const cycleLength = 28;
  const currentPhase = 'Ovulation';

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Cycle Tracking</h1>
          <p className="text-muted-foreground text-lg">
            Understanding your body's natural rhythm
          </p>
        </div>

        {/* Current Cycle Status */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-secondary/20 to-secondary/5 border-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{currentPhase}</h2>
                  <p className="text-muted-foreground">Day {currentCycleDay} of {cycleLength}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-secondary">{currentCycleDay}</div>
              <p className="text-sm text-muted-foreground">Current Day</p>
            </div>
          </div>

          {/* Cycle Progress */}
          <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-accent via-primary to-secondary rounded-full transition-all"
              style={{ width: `${(currentCycleDay / cycleLength) * 100}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {cyclePhases.map((phase) => (
              <div
                key={phase.name}
                className={`text-center p-2 rounded-lg ${
                  phase.name === currentPhase ? 'bg-white shadow-bloom-sm' : 'bg-white/50'
                }`}
              >
                <phase.icon className={`w-5 h-5 mx-auto mb-1 ${
                  phase.name === currentPhase ? 'text-secondary' : 'text-muted-foreground'
                }`} />
                <p className="text-xs font-medium">{phase.name}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Mood Tracker */}
        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            How are you feeling today?
          </h3>
          <Card className="bloom-card">
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedMood === mood.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Symptoms Tracker */}
        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" />
            Track your symptoms
          </h3>
          <Card className="bloom-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-bloom-sm'
                        : 'bg-muted/30 text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Cycle Insights */}
        {cyclePhases.filter(phase => phase.name === currentPhase).map((phase) => {
          const PhaseIcon = phase.icon;
          return (
            <Card key={phase.name} className="bloom-card bg-gradient-to-br from-secondary/10 to-secondary/5 border-none mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <PhaseIcon className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{phase.name} Phase Guidance</h3>
                  <p className="text-muted-foreground italic">&quot;{phase.affirmation}&quot;</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    Recommended Workouts
                  </h4>
                  <p className="text-sm text-muted-foreground">{phase.workout}</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Nutrition Focus
                  </h4>
                  <p className="text-sm text-muted-foreground">{phase.nutrition}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Energy Level Expected</h4>
                    <p className="text-sm text-muted-foreground">{phase.energy}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Calorie Adjustment</h4>
                    <p className="text-sm font-medium text-secondary">{phase.calorieAdjustment}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Past Cycles Summary */}
        <div className="mt-8">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Past 3 Months
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { month: 'December', length: 28, symptoms: 'Mild cramping' },
              { month: 'November', length: 29, symptoms: 'Increased energy' },
              { month: 'October', length: 27, symptoms: 'Mild headache' },
            ].map((cycle) => (
              <Card key={cycle.month} className="p-5 hover:shadow-bloom transition-shadow">
                <h4 className="font-semibold mb-2">{cycle.month}</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Length: {cycle.length} days
                </p>
                <Badge variant="secondary" className="text-xs">
                  {cycle.symptoms}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
