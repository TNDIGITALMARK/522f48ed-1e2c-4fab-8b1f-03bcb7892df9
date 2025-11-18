"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart, Activity, Apple, Brain, Moon } from 'lucide-react';
import { getActiveCycle, getCycleInsights, type CyclePhase } from '@/lib/period-calendar';
import { useWellnessGoals } from '@/hooks/use-wellness-goals';

// Wellness quotes organized by cycle phase and wellness goals
const WELLNESS_QUOTES: Record<CyclePhase | 'default', Record<string, string[]>> = {
  menstruation: {
    fitness: "Rest is not weakness; it's wisdom. Your body is doing the remarkable work of renewal.",
    nutrition: "Nourish yourself with iron-rich foods and gentle warmth. You are honoring your body's needs.",
    mental: "Be gentle with yourself during this time. Your sensitivity is a strength, not a weakness.",
    sleep: "Deep rest is your body's gift to itself. Embrace the call to slow down and restore.",
    cycle: "You are connected to the ancient rhythms of nature. Trust in your body's wisdom.",
    holistic: "This is a time of letting go. Release what no longer serves you, just as your body does.",
  },
  follicular: {
    fitness: "Your energy is rising like the dawn. Channel this vitality into movement that makes you feel alive.",
    nutrition: "Fresh, vibrant foods mirror your growing energy. Fuel your body for the adventures ahead.",
    mental: "Your mind is sharp and creative. This is the perfect time to start new projects and dream big.",
    sleep: "Quality rest now amplifies your daytime energy. Sleep is your secret weapon for peak performance.",
    cycle: "You are in your season of growth. Like spring, everything within you is blooming with possibility.",
    holistic: "Embrace this upward energy. Your body and mind are aligned for transformation.",
  },
  ovulation: {
    fitness: "You are at your peak power. Honor this strength with movement that celebrates what your body can do.",
    nutrition: "Your body is a temple of vitality. Choose foods that match your elevated energy.",
    mental: "Your confidence is magnetic. Trust your intuition—it's never been clearer.",
    sleep: "Even at your peak, rest replenishes your power. Balance intensity with restoration.",
    cycle: "You are radiant, connected, and fully alive. This is your moment to shine.",
    holistic: "You embody the fullness of your potential. Express yourself authentically and boldly.",
  },
  luteal: {
    fitness: "Gentle strength serves you now. Choose movement that grounds and centers you.",
    nutrition: "Complex carbs and magnesium-rich foods support your body's natural rhythms. Nourish with intention.",
    mental: "Your boundaries are a form of self-care. It's okay to turn inward and protect your peace.",
    sleep: "Prioritize rest as your body prepares for renewal. Sleep is not luxury; it's necessity.",
    cycle: "You are entering your season of wisdom. Listen to the quiet voice of your inner knowing.",
    holistic: "Honor the ebb as much as the flow. Slowing down is part of the sacred cycle.",
  },
  default: {
    fitness: "Movement is medicine for the body and soul. Every step forward is an act of self-love.",
    nutrition: "You are what you repeatedly nourish yourself with. Choose foods that honor your body.",
    mental: "Peace begins with a single breath. You have the power to create calm within.",
    sleep: "Rest is the foundation of all wellness. Give yourself permission to restore fully.",
    cycle: "Your body holds ancient wisdom. Trust the rhythms that guide you.",
    holistic: "Wellness is not a destination; it's a daily practice of honoring yourself.",
  },
};

// AI-curated focus areas based on cycle phase
const CYCLE_FOCUS_AREAS: Record<CyclePhase, Array<{
  icon: typeof Activity;
  title: string;
  description: string;
  goalType: string;
}>> = {
  menstruation: [
    {
      icon: Heart,
      title: "Rest & Restore",
      description: "Your body is shedding and renewing. Prioritize gentle self-care, warm comfort, and deep rest today.",
      goalType: "cycle",
    },
    {
      icon: Apple,
      title: "Iron-Rich Nourishment",
      description: "Support your body with iron-rich leafy greens, lean proteins, and vitamin C to enhance absorption.",
      goalType: "nutrition",
    },
    {
      icon: Brain,
      title: "Emotional Gentleness",
      description: "Honor your sensitivity. Practice self-compassion and give yourself permission to feel without judgment.",
      goalType: "mental",
    },
  ],
  follicular: [
    {
      icon: Activity,
      title: "High-Energy Movement",
      description: "Your energy is building! This is the ideal time for challenging workouts, strength training, and trying new exercises.",
      goalType: "fitness",
    },
    {
      icon: Brain,
      title: "Creative Projects",
      description: "Your mind is sharp and innovative. Start new projects, brainstorm ideas, and tackle complex problems.",
      goalType: "mental",
    },
    {
      icon: Apple,
      title: "Fresh & Vibrant Foods",
      description: "Match your rising energy with fresh vegetables, lean proteins, and foods that make you feel light and energized.",
      goalType: "nutrition",
    },
  ],
  ovulation: [
    {
      icon: Sparkles,
      title: "Peak Performance",
      description: "You're at your physical and mental peak. Embrace high-intensity workouts, important meetings, and social connections.",
      goalType: "fitness",
    },
    {
      icon: Heart,
      title: "Connection & Community",
      description: "Your confidence is magnetic. This is the perfect time for networking, deep conversations, and authentic expression.",
      goalType: "holistic",
    },
    {
      icon: Apple,
      title: "Energy-Sustaining Nutrition",
      description: "Fuel your elevated energy with balanced meals rich in complex carbs, healthy fats, and quality proteins.",
      goalType: "nutrition",
    },
  ],
  luteal: [
    {
      icon: Moon,
      title: "Grounding Movement",
      description: "Shift to gentler exercises like yoga, walking, and stretching. Focus on movements that calm and center you.",
      goalType: "fitness",
    },
    {
      icon: Apple,
      title: "Comfort & Balance",
      description: "Support your body with complex carbs, magnesium-rich foods, and warm, nourishing meals that satisfy cravings.",
      goalType: "nutrition",
    },
    {
      icon: Brain,
      title: "Boundaries & Self-Care",
      description: "Protect your energy. Say no to what drains you and yes to what restores your peace.",
      goalType: "mental",
    },
  ],
};

export function TodaysFocusWidget() {
  const { goals, isLoading: goalsLoading } = useWellnessGoals();
  const [cycleInsights, setCycleInsights] = useState<ReturnType<typeof getCycleInsights> | null>(null);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase | null>(null);
  const [wellnessQuote, setWellnessQuote] = useState<string>("");

  useEffect(() => {
    // Get user's current cycle information
    const activeCycle = getActiveCycle('demo-user'); // TODO: Replace with actual user ID

    if (activeCycle) {
      const insights = getCycleInsights(activeCycle);
      setCycleInsights(insights);
      setCurrentPhase(insights.phase);

      // Select appropriate wellness quote based on cycle phase and primary goal
      const primaryGoal = goals[0] || 'holistic';
      const phaseQuotes = WELLNESS_QUOTES[insights.phase] || WELLNESS_QUOTES.default;
      const quote = phaseQuotes[primaryGoal] || phaseQuotes.holistic;
      setWellnessQuote(quote);
    } else {
      // Default quote if no cycle data
      const primaryGoal = goals[0] || 'holistic';
      const quote = WELLNESS_QUOTES.default[primaryGoal] || WELLNESS_QUOTES.default.holistic;
      setWellnessQuote(quote);
    }
  }, [goals]);

  // Get curated focus areas based on cycle phase
  const focusAreas = currentPhase
    ? CYCLE_FOCUS_AREAS[currentPhase]
    : [
        {
          icon: Sparkles,
          title: "Morning Intention",
          description: "Start your day with gratitude and mindfulness. Your wellness journey is uniquely yours.",
          goalType: "holistic",
        },
      ];

  // Filter focus areas based on user's wellness goals (show relevant ones first)
  const prioritizedFocusAreas = [
    ...focusAreas.filter(area => goals.includes(area.goalType)),
    ...focusAreas.filter(area => !goals.includes(area.goalType)),
  ].slice(0, 3);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 widget-card">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold font-['Cormorant_Garamond']">Today's Focus</h2>
        {currentPhase && (
          <span className="ml-auto text-xs font-medium text-primary/70 capitalize">
            {currentPhase} phase
          </span>
        )}
      </div>

      {/* Rooted in Wellness Quote */}
      <div className="mb-5 p-4 bg-background/60 rounded-lg border-l-4 border-primary">
        <p className="text-sm italic text-foreground/90 font-['Cormorant_Garamond'] leading-relaxed">
          "{wellnessQuote}"
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          — Rooted in Wellness
        </p>
      </div>

      {/* AI-Curated Focus Areas */}
      <div className="space-y-3">
        {prioritizedFocusAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <div key={index} className="p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors">
              <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {area.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {area.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Cycle Progress Indicator (if cycle data available) */}
      {cycleInsights && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Phase Progress</span>
            <span className="font-medium">
              Day {cycleInsights.dayInPhase} of {cycleInsights.totalDaysInPhase}
            </span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
              style={{ width: `${cycleInsights.phaseProgress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
