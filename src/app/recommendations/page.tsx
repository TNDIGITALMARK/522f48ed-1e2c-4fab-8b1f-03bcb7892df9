"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Apple, Dumbbell, AlertCircle, Target, TrendingUp, Utensils } from 'lucide-react';
import { getHealthProfile, updateAIRecommendations } from '@/lib/health-profile-store';
import { generateDietRecommendations, generateWorkoutRecommendations } from '@/lib/ai-recommendations';
import type { StoredHealthProfile } from '@/lib/health-profile-store';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<StoredHealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      const userProfile = getHealthProfile(MOCK_USER_ID);
      if (userProfile) {
        // Generate recommendations if they don't exist
        if (!userProfile.aiDietRecommendations || !userProfile.aiWorkoutRecommendations) {
          const dietRecs = generateDietRecommendations(userProfile);
          const workoutRecs = generateWorkoutRecommendations(userProfile);
          const updated = updateAIRecommendations(MOCK_USER_ID, dietRecs, workoutRecs);
          setProfile(updated);
        } else {
          setProfile(userProfile);
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleRegenerateRecommendations = () => {
    if (!profile) return;

    const dietRecs = generateDietRecommendations(profile);
    const workoutRecs = generateWorkoutRecommendations(profile);
    const updated = updateAIRecommendations(MOCK_USER_ID, dietRecs, workoutRecs);
    setProfile(updated);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-muted-foreground">Loading your personalized recommendations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile || !profile.aiDietRecommendations || !profile.aiWorkoutRecommendations) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-12 px-4">
          <Card className="bloom-card text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Complete Your Health Profile</h2>
            <p className="text-muted-foreground mb-6">
              Take our quick quiz to get personalized diet and workout recommendations
            </p>
            <Link href="/onboarding">
              <Button size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Health Quiz
              </Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const dietRecs = profile.aiDietRecommendations;
  const workoutRecs = profile.aiWorkoutRecommendations;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center pt-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Your Personalized Plan</h1>
          <p className="text-muted-foreground text-lg">
            AI-generated recommendations based on your health profile
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateRecommendations}
            className="mt-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate Recommendations
          </Button>
        </div>

        {/* Diet Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Apple className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Nutrition Plan</h2>
              <p className="text-muted-foreground">{dietRecs.summary}</p>
            </div>
          </div>

          {/* Warnings */}
          {dietRecs.warnings && dietRecs.warnings.length > 0 && (
            <Card className="bloom-card border-red-200 dark:border-red-900">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Important Warnings</h3>
                  <ul className="space-y-1">
                    {dietRecs.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Focus Areas */}
          {dietRecs.focus_areas && dietRecs.focus_areas.length > 0 && (
            <Card className="magazine-feature-card">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {dietRecs.focus_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="magazine-feature-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Key Recommendations
            </h3>
            <ul className="space-y-3">
              {dietRecs.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Meal Suggestions */}
          {dietRecs.meal_suggestions && dietRecs.meal_suggestions.length > 0 && (
            <Card className="magazine-feature-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Suggested Meals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {dietRecs.meal_suggestions.map((meal, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{meal.title}</h4>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {meal.meal_type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Calories</div>
                        <div className="font-semibold">{meal.calories}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Protein</div>
                        <div className="font-semibold">{meal.protein}g</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Carbs</div>
                        <div className="font-semibold">{meal.carbs}g</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fat</div>
                        <div className="font-semibold">{meal.fat}g</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {meal.benefits.map((benefit, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Workout Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Workout Plan</h2>
              <p className="text-muted-foreground">{workoutRecs.summary}</p>
            </div>
          </div>

          {/* Warnings */}
          {workoutRecs.warnings && workoutRecs.warnings.length > 0 && (
            <Card className="bloom-card border-red-200 dark:border-red-900">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Important Warnings</h3>
                  <ul className="space-y-1">
                    {workoutRecs.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Focus Areas */}
          {workoutRecs.focus_areas && workoutRecs.focus_areas.length > 0 && (
            <Card className="magazine-feature-card">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {workoutRecs.focus_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="magazine-feature-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Key Recommendations
            </h3>
            <ul className="space-y-3">
              {workoutRecs.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Workout Suggestions */}
          {workoutRecs.workout_suggestions && workoutRecs.workout_suggestions.length > 0 && (
            <Card className="magazine-feature-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Suggested Workouts
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {workoutRecs.workout_suggestions.map((workout, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{workout.title}</h4>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {workout.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{workout.description}</p>
                    <div className="text-sm mb-3">
                      <span className="font-semibold">{workout.duration_minutes} minutes</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="text-sm font-semibold">Exercises:</div>
                      <ul className="text-sm space-y-0.5">
                        {workout.exercises.map((exercise, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {workout.benefits.map((benefit, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
