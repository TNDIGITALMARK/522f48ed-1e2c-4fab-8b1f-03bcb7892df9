"use client";

import { useRouter } from 'next/navigation';
import { OnboardingQuiz, type HealthProfileData } from '@/components/onboarding-quiz';
import { saveQuizResults, updateAIRecommendations } from '@/lib/health-profile-store';
import { generateDietRecommendations, generateWorkoutRecommendations } from '@/lib/ai-recommendations';

const MOCK_USER_ID = 'demo-user-001';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = (data: HealthProfileData) => {
    // Save quiz results
    const profile = saveQuizResults(MOCK_USER_ID, data);

    // Generate AI recommendations
    const dietRecs = generateDietRecommendations(profile);
    const workoutRecs = generateWorkoutRecommendations(profile);

    // Save AI recommendations
    updateAIRecommendations(MOCK_USER_ID, dietRecs, workoutRecs);

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return <OnboardingQuiz onComplete={handleComplete} onSkip={handleSkip} />;
}
