"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Utensils, Zap, Lightbulb, RefreshCw } from 'lucide-react';

interface AICycleInsightsProps {
  cyclePhase: 'Menstruation' | 'Follicular' | 'Ovulation' | 'Luteal';
  symptoms: string[];
  mood?: { rating: number; label: string };
  cycleDay?: number;
  previousSymptoms?: string[];
}

interface Insights {
  phaseAnalysis: string;
  symptomInsights: string;
  recommendations: {
    nutrition: string[];
    workout: string[];
    selfCare: string[];
  };
  wellnessTips: string[];
  affirmation: string;
}

export function AICycleInsights({
  cyclePhase,
  symptoms,
  mood,
  cycleDay,
  previousSymptoms
}: AICycleInsightsProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cycle-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cyclePhase,
          symptoms,
          mood,
          cycleDay,
          previousSymptoms
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Unable to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [cyclePhase, symptoms.join(','), mood?.rating]);

  if (loading) {
    return (
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
            <p className="text-muted-foreground">Generating personalized insights...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[hsl(35,40%,94%)] border border-destructive/50 rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchInsights} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* AI-Powered Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-secondary" />
          Your Personalized Insights
        </h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI-Powered
        </Badge>
      </div>

      {/* Phase Analysis */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-secondary" />
          What's Happening in Your Body
        </h3>
        <p className="text-foreground/90 leading-relaxed">{insights.phaseAnalysis}</p>
      </Card>

      {/* Symptom Insights */}
      {symptoms.length > 0 && (
        <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Understanding Your Symptoms
          </h3>
          <p className="text-foreground/90 leading-relaxed">{insights.symptomInsights}</p>
        </Card>
      )}

      {/* Affirmation */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6 text-center">
        <div className="py-4">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent" />
          <p className="text-lg font-medium italic text-foreground">
            "{insights.affirmation}"
          </p>
        </div>
      </Card>

      {/* Recommendations */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Nutrition */}
        <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-secondary" />
            Nutrition Focus
          </h4>
          <ul className="space-y-2">
            {insights.recommendations.nutrition.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Workout */}
        <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Workout Guidance
          </h4>
          <ul className="space-y-2">
            {insights.recommendations.workout.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Self-Care */}
        <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            Self-Care Practices
          </h4>
          <ul className="space-y-2">
            {insights.recommendations.selfCare.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Wellness Tips */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-secondary" />
          Today's Wellness Tips
        </h3>
        <div className="grid gap-3">
          {insights.wellnessTips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground/90 pt-1">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button
          onClick={fetchInsights}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>
    </div>
  );
}
