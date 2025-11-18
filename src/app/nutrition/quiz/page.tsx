"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';

import { FoodQuiz } from '@/components/food-quiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function NutritionQuizPage() {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);

  const handleQuizComplete = (prefs: any) => {
    setPreferences(prefs);
    setQuizComplete(true);

    // Save to localStorage for now (will integrate with Supabase later)
    localStorage.setItem('foodPreferences', JSON.stringify(prefs));
  };

  const handleContinue = () => {
    router.push('/nutrition/personalized');
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-textile-beige textile-overlay-cream pb-24">
        <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16">
          <Card className="bloom-card text-center p-12">
            <h1 className="text-4xl mb-4">Quiz Complete!</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              We've captured your food preferences and we're ready to create personalized meal plans
              that match your cycle and nutritional needs.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              {Object.entries(preferences).map(([group, items]: [string, any]) => (
                <div key={group} className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-primary mb-1">{items.length}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {group.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              size="lg"
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View My Meal Plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </main>

        <Navigation />
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-textile-beige textile-overlay-cream pb-24">
        <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <FoodQuiz
            onComplete={handleQuizComplete}
            onSkip={() => router.push('/nutrition')}
          />
        </main>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textile-beige textile-overlay-cream pb-24">
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-1 bg-primary/10 text-primary border-primary/20">
            Personalization
          </Badge>
          <h1 className="text-5xl mb-4">Food Preferences Quiz</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us understand your food preferences so we can create personalized meal plans
            that align with your cycle and health goals.
          </p>
        </div>

        <Card className="bloom-card p-8 mb-8">
          <h3 className="text-2xl mb-6 text-center">What You'll Discover</h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🥗</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cycle-Synced Nutrition</h4>
                <p className="text-sm text-muted-foreground">
                  Meal suggestions that adapt to your menstrual cycle phases for optimal energy and hormone balance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary/5 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI-Generated Meal Plans</h4>
                <p className="text-sm text-muted-foreground">
                  Smart meal recommendations based on your preferences, avoiding foods you don't enjoy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Personalized Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track macros and nutrition goals aligned with your unique food preferences
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={() => setShowQuiz(true)}
              size="lg"
              className="rounded-full px-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-muted-foreground">
              Takes about 3-5 minutes • 6 food groups
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/nutrition')}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
