"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Zap, Sparkles, TrendingUp } from 'lucide-react';

interface AISymptomTrackerProps {
  cyclePhase: 'Menstruation' | 'Follicular' | 'Ovulation' | 'Luteal';
  cycleDay: number;
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  selectedMood: number;
  onMoodChange: (mood: number) => void;
}

const moodOptions = [
  { emoji: '😊', label: 'Happy', value: 8 },
  { emoji: '😌', label: 'Calm', value: 7 },
  { emoji: '😐', label: 'Neutral', value: 5 },
  { emoji: '😔', label: 'Low', value: 3 },
  { emoji: '😫', label: 'Anxious', value: 2 },
];

const symptoms = [
  'Cramping',
  'Bloating',
  'Headache',
  'Fatigue',
  'Breast Tenderness',
  'Mood Swings',
  'Increased Energy',
  'Clear Skin',
  'Acne',
  'Back Pain',
  'Food Cravings',
  'Irritability'
];

export function AISymptomTracker({
  cyclePhase,
  cycleDay,
  selectedSymptoms,
  onSymptomsChange,
  selectedMood,
  onMoodChange
}: AISymptomTrackerProps) {
  const [notes, setNotes] = useState('');
  const [symptomInsight, setSymptomInsight] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const toggleSymptom = (symptom: string) => {
    const newSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    onSymptomsChange(newSymptoms);
  };

  // Generate quick insight when symptoms or mood change
  useEffect(() => {
    if (selectedSymptoms.length > 0 || notes.trim()) {
      generateQuickInsight();
    }
  }, [selectedSymptoms, selectedMood, notes]);

  const generateQuickInsight = () => {
    // Generate contextual insights based on symptoms and phase
    const insights: Record<string, Record<string, string>> = {
      'Menstruation': {
        'Cramping': 'Cramping is very common during menstruation. Try magnesium-rich foods like dark chocolate, nuts, or leafy greens, and apply heat to your lower abdomen.',
        'Fatigue': 'Low energy is normal during menstruation due to lower hormone levels. Prioritize rest and iron-rich foods to replenish what your body is losing.',
        'Bloating': 'Bloating during menstruation is caused by hormone fluctuations. Stay hydrated, reduce salt intake, and try gentle movement like walking.',
        'default': 'Your body is working hard during menstruation. Be gentle with yourself and prioritize rest, warmth, and nourishment.'
      },
      'Follicular': {
        'Increased Energy': 'Your rising estrogen levels are giving you a natural energy boost! This is the perfect time for strength training and challenging workouts.',
        'Clear Skin': 'Rising estrogen during the follicular phase often improves skin clarity. Keep up your skincare routine to maintain this glow!',
        'default': 'Your energy is rising during the follicular phase. Take advantage of this natural boost to tackle your goals and try new challenges!'
      },
      'Ovulation': {
        'Increased Energy': 'You\'re at peak energy during ovulation! This is when you can push hardest in your workouts and take on your biggest challenges.',
        'Mood Swings': 'Even at peak ovulation, stress can affect hormones. Make sure you\'re getting enough rest and managing stress through movement or meditation.',
        'default': 'Ovulation is your power phase! Estrogen and testosterone are peaking, making this the ideal time for peak performance and confidence.'
      },
      'Luteal': {
        'Bloating': 'Bloating in the luteal phase is caused by rising progesterone. Focus on anti-inflammatory foods, stay hydrated, and try gentle yoga.',
        'Fatigue': 'Fatigue is your body\'s signal to slow down. Honor this by reducing your workout intensity and prioritizing sleep (aim for 8-9 hours).',
        'Mood Swings': 'Progesterone can affect mood in the luteal phase. Magnesium-rich foods (avocado, nuts, dark chocolate) can help stabilize your mood.',
        'Food Cravings': 'Cravings are normal in the luteal phase due to increased metabolic needs. Honor them mindfully with nutrient-dense options.',
        'default': 'The luteal phase is your body\'s signal to slow down and be gentle with yourself. Lower-intensity workouts and extra rest are your priorities.'
      }
    };

    // Get the most relevant symptom
    const primarySymptom = selectedSymptoms[0];
    const phaseInsights = insights[cyclePhase] || insights['Menstruation'];

    if (primarySymptom && phaseInsights[primarySymptom]) {
      setSymptomInsight(phaseInsights[primarySymptom]);
    } else {
      setSymptomInsight(phaseInsights['default']);
    }

    setShowInsight(true);
  };

  const getSymptomTrend = (symptom: string): 'common' | 'monitor' | null => {
    // Suggest if symptoms are typical for the phase
    const typicalSymptoms: Record<string, string[]> = {
      'Menstruation': ['Cramping', 'Fatigue', 'Bloating', 'Back Pain'],
      'Follicular': ['Increased Energy', 'Clear Skin'],
      'Ovulation': ['Increased Energy'],
      'Luteal': ['Bloating', 'Mood Swings', 'Food Cravings', 'Breast Tenderness', 'Fatigue']
    };

    if (typicalSymptoms[cyclePhase]?.includes(symptom)) {
      return 'common';
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Symptoms Tracker */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" />
            Track your symptoms
          </h3>
          {selectedSymptoms.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {selectedSymptoms.length} tracked
            </Badge>
          )}
        </div>
        <Card className="magazine-feature-card bg-[hsl(35,40%,94%)] border border-secondary/20 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              const trend = getSymptomTrend(symptom);

              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all flex-shrink-0 snap-center min-w-[140px] ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-bloom-sm'
                      : 'bg-muted/30 text-foreground hover:bg-muted/50'
                  }`}
                >
                  {symptom}
                  {trend === 'common' && !isSelected && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-lg mb-3 font-medium">Additional Notes (Optional)</h3>
        <Textarea
          placeholder="How else are you feeling? Any patterns you notice?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-24"
        />
      </div>

      {/* Quick AI Insight */}
      {showInsight && symptomInsight && (
        <Card className="magazine-feature-card bg-[hsl(35,40%,94%)] border border-secondary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                Quick Insight
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed">{symptomInsight}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="text-center">
        <Button
          className="gap-2"
          onClick={() => {
            // Save to localStorage for now
            const logEntry = {
              date: new Date().toISOString(),
              cyclePhase,
              cycleDay,
              symptoms: selectedSymptoms,
              mood: selectedMood,
              notes
            };

            const existingLogs = JSON.parse(localStorage.getItem('cycleLogs') || '[]');
            localStorage.setItem('cycleLogs', JSON.stringify([...existingLogs, logEntry]));

            alert('Symptoms logged successfully! ✨');
          }}
        >
          <Sparkles className="w-4 h-4" />
          Save Today's Log
        </Button>
      </div>
    </div>
  );
}
