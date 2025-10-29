import { supabase, TENANT_ID, PROJECT_ID } from './supabase/client';

export interface FoodPreferences {
  proteins: string[];
  vegetables: string[];
  fruits: string[];
  grains: string[];
  dairy: string[];
  fats: string[];
}

export interface MealPlanRequest {
  preferences: FoodPreferences;
  cyclePhase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  calorieTarget?: number;
  dietaryRestrictions?: string[];
}

/**
 * Save food preferences to localStorage and optionally to database
 */
export function saveFoodPreferences(userId: string, preferences: FoodPreferences): void {
  // Save to localStorage for immediate use
  localStorage.setItem('foodPreferences', JSON.stringify(preferences));
  localStorage.setItem('foodPreferencesUserId', userId);
  localStorage.setItem('foodPreferencesDate', new Date().toISOString());

  // TODO: Save to Supabase when tables are fully operational
  // This would be done via the quiz_responses table
}

/**
 * Load food preferences from localStorage
 */
export function loadFoodPreferences(): FoodPreferences | null {
  try {
    const stored = localStorage.getItem('foodPreferences');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading food preferences:', error);
  }
  return null;
}

/**
 * Check if user has completed the food quiz
 */
export function hasFoodPreferences(): boolean {
  const prefs = loadFoodPreferences();
  return prefs !== null && Object.keys(prefs).length > 0;
}

/**
 * Generate AI meal suggestions based on preferences and cycle phase
 */
export function generateMealSuggestions(request: MealPlanRequest) {
  const { preferences, cyclePhase, calorieTarget = 2000 } = request;

  // Get preferred foods from each category
  const preferredProteins = preferences.proteins || [];
  const preferredVegetables = preferences.vegetables || [];
  const preferredFruits = preferences.fruits || [];
  const preferredGrains = preferences.grains || [];

  // Cycle-specific recommendations
  const cycleRecommendations = {
    menstrual: {
      focus: ['Iron-rich foods', 'Magnesium', 'Comfort foods'],
      boost: 'protein',
      description: 'Iron-rich and comforting meals to support you during menstruation'
    },
    follicular: {
      focus: ['High energy', 'Lean proteins', 'Complex carbs'],
      boost: 'carbs',
      description: 'Energizing meals to match your rising energy levels'
    },
    ovulatory: {
      focus: ['Antioxidants', 'Fiber', 'Light proteins'],
      boost: 'fiber',
      description: 'Light, nutritious meals rich in antioxidants'
    },
    luteal: {
      focus: ['B vitamins', 'Magnesium', 'Complex carbs'],
      boost: 'magnesium',
      description: 'Nutrient-dense meals to support hormone balance'
    }
  };

  const phaseInfo = cycleRecommendations[cyclePhase];

  // Generate meal suggestions based on preferences
  const meals = [];

  // Breakfast suggestions
  if (preferredGrains.length > 0 && preferredFruits.length > 0) {
    meals.push({
      title: `${preferredGrains[0]} with ${preferredFruits[0]}`,
      type: 'Breakfast',
      calories: 320,
      protein: 12,
      fiber: 8,
      bloomScore: 92,
      tags: ['High Fiber', `${cyclePhase} Phase`],
      ingredients: [preferredGrains[0], preferredFruits[0], 'Greek Yogurt'],
    });
  }

  // Lunch suggestions
  if (preferredProteins.length > 0 && preferredVegetables.length > 0) {
    meals.push({
      title: `${preferredProteins[0]} with ${preferredVegetables[0]}`,
      type: 'Lunch',
      calories: 450,
      protein: 35,
      fiber: 6,
      bloomScore: 95,
      tags: ['High Protein', ...phaseInfo.focus],
      ingredients: [preferredProteins[0], preferredVegetables[0], preferredGrains[0] || 'Brown Rice'],
    });
  }

  // Dinner suggestions
  if (preferredProteins.length > 1 && preferredVegetables.length > 1) {
    meals.push({
      title: `${preferredProteins[1] || preferredProteins[0]} Bowl`,
      type: 'Dinner',
      calories: 420,
      protein: 18,
      fiber: 12,
      bloomScore: 88,
      tags: [phaseInfo.focus[0], `${cyclePhase} Phase`],
      ingredients: [
        preferredProteins[1] || preferredProteins[0],
        preferredVegetables[1] || preferredVegetables[0],
        preferredGrains[1] || preferredGrains[0] || 'Quinoa'
      ],
    });
  }

  return {
    meals,
    phaseInfo,
    totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    totalProtein: meals.reduce((sum, meal) => sum + meal.protein, 0),
    totalFiber: meals.reduce((sum, meal) => sum + meal.fiber, 0),
  };
}

/**
 * Get grocery list items from meal preferences
 */
export function generateGroceryList(preferences: FoodPreferences) {
  const items: { name: string; category: string; quantity: string }[] = [];

  // Add proteins
  preferences.proteins?.slice(0, 3).forEach(protein => {
    items.push({
      name: protein,
      category: 'Protein',
      quantity: '2 servings'
    });
  });

  // Add vegetables
  preferences.vegetables?.slice(0, 4).forEach(veg => {
    items.push({
      name: veg,
      category: 'Produce',
      quantity: '1 bunch'
    });
  });

  // Add fruits
  preferences.fruits?.slice(0, 3).forEach(fruit => {
    items.push({
      name: fruit,
      category: 'Produce',
      quantity: '1 lb'
    });
  });

  // Add grains
  preferences.grains?.slice(0, 2).forEach(grain => {
    items.push({
      name: grain,
      category: 'Grains',
      quantity: '1 package'
    });
  });

  return items;
}
