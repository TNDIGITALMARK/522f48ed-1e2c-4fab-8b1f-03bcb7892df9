/**
 * AI-Powered Personalized Recommendations
 * Generates diet and workout recommendations based on user health profile
 */

import { type StoredHealthProfile, type AIRecommendations, type MealSuggestion, type WorkoutSuggestion } from './health-profile-store';

// Generate personalized diet recommendations
export function generateDietRecommendations(profile: StoredHealthProfile): AIRecommendations {
  const recommendations: string[] = [];
  const focusAreas: string[] = [];
  const warnings: string[] = [];
  const mealSuggestions: MealSuggestion[] = [];

  // Analyze dietary restrictions
  if (profile.dietary_restrictions.length > 0) {
    focusAreas.push('Dietary Compliance');
    recommendations.push(`Follow ${profile.dietary_restrictions.join(', ')} guidelines strictly`);
  }

  // Analyze allergies
  if (profile.allergies.length > 0) {
    warnings.push(`AVOID: ${profile.allergies.join(', ')} - serious allergy risk`);
    recommendations.push('Always check ingredient labels carefully');
  }

  // Analyze health conditions
  if (profile.diseases.includes('Diabetes Type 1') || profile.diseases.includes('Diabetes Type 2')) {
    focusAreas.push('Blood Sugar Management');
    recommendations.push('Focus on low glycemic index foods');
    recommendations.push('Balance carbohydrates with protein and healthy fats');
    warnings.push('Monitor blood sugar levels before and after meals');
  }

  if (profile.diseases.includes('Celiac Disease') && !profile.dietary_restrictions.includes('Gluten-Free')) {
    warnings.push('CRITICAL: Celiac disease requires strict gluten-free diet');
    recommendations.push('Eliminate all gluten-containing grains');
  }

  if (profile.diseases.includes('Hypertension') || profile.diseases.includes('Heart Disease')) {
    focusAreas.push('Cardiovascular Health');
    recommendations.push('Limit sodium intake to under 2,000mg per day');
    recommendations.push('Increase potassium-rich foods (bananas, sweet potatoes, spinach)');
    recommendations.push('Choose heart-healthy fats (omega-3s from fish, nuts, olive oil)');
  }

  if (profile.diseases.includes('PCOS')) {
    focusAreas.push('Hormonal Balance');
    recommendations.push('Focus on anti-inflammatory foods');
    recommendations.push('Include fiber-rich foods to regulate blood sugar');
    recommendations.push('Consider adding cinnamon, turmeric, and green tea');
  }

  // Analyze health goals
  if (profile.health_goals.includes('Weight Loss')) {
    focusAreas.push('Calorie Management');
    recommendations.push('Create a moderate calorie deficit (300-500 calories/day)');
    recommendations.push('Prioritize protein to preserve muscle mass');
    recommendations.push('Include fiber-rich vegetables for satiety');
  }

  if (profile.health_goals.includes('Muscle Gain')) {
    focusAreas.push('Muscle Building Nutrition');
    recommendations.push('Aim for 1.6-2.2g protein per kg body weight');
    recommendations.push('Eat in a slight calorie surplus (+200-300 calories)');
    recommendations.push('Time protein intake around workouts');
  }

  if (profile.health_goals.includes('Improve Energy')) {
    focusAreas.push('Energy Optimization');
    recommendations.push('Eat regular, balanced meals every 3-4 hours');
    recommendations.push('Include complex carbohydrates for sustained energy');
    recommendations.push('Stay hydrated - aim for 8-10 glasses of water daily');
  }

  if (profile.health_goals.includes('Improve Digestion')) {
    focusAreas.push('Digestive Health');
    recommendations.push('Increase fiber gradually (25-30g per day)');
    recommendations.push('Include probiotic foods (yogurt, kefir, sauerkraut)');
    recommendations.push('Eat mindfully and chew food thoroughly');
  }

  // Generate meal suggestions based on profile
  if (profile.dietary_restrictions.includes('Vegan')) {
    mealSuggestions.push({
      meal_type: 'breakfast',
      title: 'Berry Protein Smoothie Bowl',
      description: 'Blended berries, banana, plant protein, topped with granola and chia seeds',
      calories: 380,
      protein: 25,
      carbs: 52,
      fat: 12,
      benefits: ['High protein', 'Antioxidant-rich', 'Energy-boosting']
    });
  } else {
    mealSuggestions.push({
      meal_type: 'breakfast',
      title: 'Greek Yogurt Parfait',
      description: 'Greek yogurt layered with berries, honey, and granola',
      calories: 320,
      protein: 22,
      carbs: 45,
      fat: 8,
      benefits: ['High protein', 'Probiotic-rich', 'Satisfying']
    });
  }

  mealSuggestions.push({
    meal_type: 'lunch',
    title: profile.dietary_restrictions.includes('Vegetarian') ? 'Quinoa Buddha Bowl' : 'Grilled Chicken & Quinoa Bowl',
    description: 'Nutrient-dense bowl with greens, roasted vegetables, and tahini dressing',
    calories: 520,
    protein: 32,
    carbs: 58,
    fat: 18,
    benefits: ['Complete protein', 'Fiber-rich', 'Anti-inflammatory']
  });

  if (!profile.dietary_restrictions.includes('Vegetarian') && !profile.dietary_restrictions.includes('Vegan')) {
    mealSuggestions.push({
      meal_type: 'dinner',
      title: 'Baked Salmon with Sweet Potato',
      description: 'Omega-3 rich salmon, roasted sweet potato, steamed broccoli',
      calories: 480,
      protein: 38,
      carbs: 42,
      fat: 16,
      benefits: ['Heart-healthy omega-3s', 'Anti-inflammatory', 'Balanced macros']
    });
  }

  mealSuggestions.push({
    meal_type: 'snack',
    title: 'Almond Butter & Apple Slices',
    description: 'Fresh apple slices with natural almond butter',
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 10,
    benefits: ['Healthy fats', 'Natural sugars', 'Sustained energy']
  });

  // Default summary
  let summary = `Based on your health profile, focus on ${focusAreas.length > 0 ? focusAreas.join(', ') : 'balanced nutrition'}. `;
  if (profile.health_goals.length > 0) {
    summary += `Your goals of ${profile.health_goals.slice(0, 3).join(', ')} require a personalized approach. `;
  }
  summary += 'Follow these recommendations for optimal results.';

  return {
    summary,
    recommendations,
    focus_areas: focusAreas,
    warnings,
    meal_suggestions: mealSuggestions
  };
}

// Generate personalized workout recommendations
export function generateWorkoutRecommendations(profile: StoredHealthProfile): AIRecommendations {
  const recommendations: string[] = [];
  const focusAreas: string[] = [];
  const warnings: string[] = [];
  const workoutSuggestions: WorkoutSuggestion[] = [];

  // Analyze fitness level
  if (profile.fitness_level === 'beginner') {
    recommendations.push('Start with 2-3 workout sessions per week');
    recommendations.push('Focus on form and consistency over intensity');
    recommendations.push('Allow 48 hours rest between strength training sessions');
  } else if (profile.fitness_level === 'intermediate') {
    recommendations.push('Aim for 4-5 workout sessions per week');
    recommendations.push('Progressive overload - gradually increase weights/intensity');
    recommendations.push('Incorporate variety to prevent plateaus');
  } else {
    recommendations.push('Train 5-6 days per week with proper periodization');
    recommendations.push('Focus on progressive overload and recovery');
    recommendations.push('Consider split routines for optimal muscle recovery');
  }

  // Health condition considerations
  if (profile.diseases.includes('Heart Disease') || profile.diseases.includes('Hypertension')) {
    warnings.push('Consult your doctor before starting high-intensity exercise');
    warnings.push('Monitor heart rate and blood pressure');
    recommendations.push('Focus on moderate-intensity cardio (walking, swimming, cycling)');
    focusAreas.push('Cardiovascular Conditioning');
  }

  if (profile.diseases.includes('Diabetes Type 1') || profile.diseases.includes('Diabetes Type 2')) {
    warnings.push('Check blood sugar before and after workouts');
    recommendations.push('Exercise at consistent times for better blood sugar management');
    recommendations.push('Keep fast-acting carbs available during workouts');
  }

  // Goal-based recommendations
  if (profile.health_goals.includes('Weight Loss')) {
    focusAreas.push('Fat Loss');
    recommendations.push('Combine strength training with cardio for optimal fat loss');
    recommendations.push('Aim for 150-300 minutes of moderate cardio per week');
    recommendations.push('Maintain muscle mass with resistance training 2-3x/week');
  }

  if (profile.health_goals.includes('Muscle Gain')) {
    focusAreas.push('Hypertrophy Training');
    recommendations.push('Focus on compound movements (squats, deadlifts, bench press)');
    recommendations.push('8-12 reps per set in the hypertrophy range');
    recommendations.push('Progressive overload - increase weight by 2.5-5% weekly');
  }

  if (profile.health_goals.includes('Build Strength')) {
    focusAreas.push('Strength Training');
    recommendations.push('Focus on heavy compound movements (3-6 rep range)');
    recommendations.push('Longer rest periods (3-5 minutes between sets)');
    recommendations.push('Train each major muscle group 2x per week');
  }

  if (profile.health_goals.includes('Increase Flexibility')) {
    focusAreas.push('Flexibility & Mobility');
    recommendations.push('Include 10-15 minutes of dynamic stretching before workouts');
    recommendations.push('Add 15-20 minutes of static stretching post-workout');
    recommendations.push('Consider yoga or Pilates 2-3x per week');
  }

  // Generate workout suggestions
  if (profile.fitness_level === 'beginner') {
    workoutSuggestions.push({
      title: 'Full Body Beginner Workout',
      description: 'Perfect starting point for building a fitness foundation',
      duration_minutes: 30,
      difficulty: 'beginner',
      exercises: ['Bodyweight Squats', 'Push-ups (modified)', 'Dumbbell Rows', 'Plank Hold', 'Walking Lunges'],
      benefits: ['Builds foundational strength', 'Improves coordination', 'Low injury risk']
    });
  }

  workoutSuggestions.push({
    title: profile.health_goals.includes('Weight Loss') ? 'HIIT Cardio Blast' : 'Strength & Power',
    description: profile.health_goals.includes('Weight Loss')
      ? 'High-intensity intervals for maximum calorie burn'
      : 'Build strength with compound movements',
    duration_minutes: profile.fitness_level === 'beginner' ? 20 : 45,
    difficulty: profile.fitness_level,
    exercises: profile.health_goals.includes('Weight Loss')
      ? ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Sprint Intervals']
      : ['Barbell Squats', 'Bench Press', 'Deadlifts', 'Pull-ups', 'Overhead Press'],
    benefits: profile.health_goals.includes('Weight Loss')
      ? ['Burns maximum calories', 'Boosts metabolism', 'Time-efficient']
      : ['Builds muscle mass', 'Increases strength', 'Improves bone density']
  });

  if (profile.health_goals.includes('Increase Flexibility') || profile.health_goals.includes('Reduce Stress')) {
    workoutSuggestions.push({
      title: 'Yoga Flow for Wellness',
      description: 'Gentle yoga sequence for flexibility and mindfulness',
      duration_minutes: 30,
      difficulty: profile.fitness_level,
      exercises: ['Sun Salutations', 'Warrior Poses', 'Triangle Pose', 'Pigeon Pose', 'Savasana'],
      benefits: ['Improves flexibility', 'Reduces stress', 'Enhances mind-body connection']
    });
  }

  workoutSuggestions.push({
    title: 'Core Strength & Stability',
    description: 'Essential core workout for overall fitness',
    duration_minutes: 20,
    difficulty: profile.fitness_level,
    exercises: ['Plank Variations', 'Dead Bug', 'Bird Dog', 'Russian Twists', 'Bicycle Crunches'],
    benefits: ['Strengthens core', 'Improves posture', 'Reduces back pain']
  });

  let summary = `Based on your ${profile.fitness_level} fitness level and goals, `;
  if (focusAreas.length > 0) {
    summary += `focus on ${focusAreas.join(', ')}. `;
  }
  summary += 'Consistency and proper form are key to achieving your goals safely.';

  return {
    summary,
    recommendations,
    focus_areas: focusAreas,
    warnings,
    workout_suggestions: workoutSuggestions
  };
}

// Generate both diet and workout recommendations
export function generateAllRecommendations(profile: StoredHealthProfile) {
  return {
    diet: generateDietRecommendations(profile),
    workout: generateWorkoutRecommendations(profile)
  };
}
