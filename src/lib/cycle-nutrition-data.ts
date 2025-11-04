// Comprehensive cycle-phase specific nutrition and workout guidance

export interface CyclePhaseGuidance {
  phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
  phaseName: string;
  daysInPhase: string;
  hormones: string[];
  workoutIntensity: string;
  workoutTypes: string[];
  energyLevel: string;
  focusAreas: string[];
  nutritionFocus: {
    keyNutrients: string[];
    recommendedFoods: string[];
    foodsToLimit: string[];
    hydration: string;
    supplements: string[];
  };
  symptoms: string[];
  selfCare: string[];
}

export const CYCLE_PHASE_GUIDANCE: Record<string, CyclePhaseGuidance> = {
  menstruation: {
    phase: 'menstruation',
    phaseName: 'Menstruation Phase',
    daysInPhase: 'Days 1-5',
    hormones: ['Low estrogen', 'Low progesterone'],
    workoutIntensity: 'Low to Moderate',
    workoutTypes: [
      'Gentle yoga',
      'Walking',
      'Light stretching',
      'Pilates',
      'Swimming (if comfortable)',
      'Restorative exercises'
    ],
    energyLevel: 'Low - Rest and restore',
    focusAreas: ['Recovery', 'Gentle movement', 'Pain management'],
    nutritionFocus: {
      keyNutrients: [
        'Iron (to replenish blood loss)',
        'Vitamin C (enhances iron absorption)',
        'Omega-3 fatty acids (anti-inflammatory)',
        'Magnesium (reduces cramps)',
        'Vitamin B6 (mood support)'
      ],
      recommendedFoods: [
        'Leafy greens (spinach, kale)',
        'Red meat (grass-fed beef)',
        'Lentils and beans',
        'Dark chocolate (70%+ cacao)',
        'Fatty fish (salmon, mackerel)',
        'Citrus fruits',
        'Berries',
        'Pumpkin seeds',
        'Quinoa',
        'Ginger tea (reduces cramps)',
        'Turmeric (anti-inflammatory)',
        'Bone broth'
      ],
      foodsToLimit: [
        'Excess caffeine',
        'High sodium foods',
        'Processed sugars',
        'Alcohol',
        'Fried foods'
      ],
      hydration: 'Increase water intake to 10-12 cups/day',
      supplements: ['Iron (if needed)', 'Magnesium', 'Omega-3', 'Vitamin D']
    },
    symptoms: ['Cramps', 'Fatigue', 'Lower back pain', 'Mood changes', 'Bloating'],
    selfCare: [
      'Use heating pad for cramps',
      'Practice gentle self-massage',
      'Prioritize sleep (8-9 hours)',
      'Take warm baths',
      'Practice meditation'
    ]
  },
  
  follicular: {
    phase: 'follicular',
    phaseName: 'Follicular Phase',
    daysInPhase: 'Days 6-13',
    hormones: ['Rising estrogen', 'Rising testosterone'],
    workoutIntensity: 'Moderate to High',
    workoutTypes: [
      'Strength training',
      'High-intensity interval training (HIIT)',
      'Running',
      'Cycling',
      'Dance cardio',
      'Power yoga',
      'Boxing',
      'Weight lifting'
    ],
    energyLevel: 'High - Peak performance time',
    focusAreas: ['Building strength', 'Challenging workouts', 'Skill development'],
    nutritionFocus: {
      keyNutrients: [
        'Protein (muscle building)',
        'Complex carbohydrates (sustained energy)',
        'B-vitamins (energy metabolism)',
        'Zinc (hormone balance)',
        'Healthy fats'
      ],
      recommendedFoods: [
        'Lean proteins (chicken, turkey, fish)',
        'Eggs',
        'Greek yogurt',
        'Whole grains (oats, brown rice)',
        'Sweet potatoes',
        'Avocados',
        'Nuts and seeds',
        'Broccoli',
        'Berries',
        'Legumes',
        'Fermented foods (sauerkraut, kimchi)',
        'Green tea'
      ],
      foodsToLimit: [
        'Heavy processed foods',
        'Excess dairy (for some)',
        'Refined sugars'
      ],
      hydration: 'Maintain 8-10 cups/day, more during workouts',
      supplements: ['Protein powder', 'B-complex', 'Probiotics']
    },
    symptoms: ['Increased energy', 'Better mood', 'Improved focus', 'Clearer skin'],
    selfCare: [
      'Schedule important tasks',
      'Social activities',
      'Try new challenges',
      'Set ambitious goals',
      'Enjoy increased confidence'
    ]
  },

  ovulation: {
    phase: 'ovulation',
    phaseName: 'Ovulation Phase',
    daysInPhase: 'Days 14-16',
    hormones: ['Peak estrogen', 'Surge in LH', 'Rising testosterone'],
    workoutIntensity: 'High - Maximum capacity',
    workoutTypes: [
      'Intense HIIT',
      'Heavy weight lifting',
      'Sprints',
      'Competitive sports',
      'Advanced yoga',
      'Plyometrics',
      'CrossFit',
      'Long-distance running'
    ],
    energyLevel: 'Elevated - Peak physical and mental performance',
    focusAreas: ['Maximum effort workouts', 'Personal records', 'Competition'],
    nutritionFocus: {
      keyNutrients: [
        'Antioxidants (egg quality)',
        'Fiber (hormone balance)',
        'Calcium',
        'Vitamin E',
        'Folate',
        'Omega-3s'
      ],
      recommendedFoods: [
        'Colorful vegetables',
        'Berries',
        'Almonds',
        'Spinach',
        'Asparagus',
        'Brussels sprouts',
        'Wild-caught salmon',
        'Sesame seeds',
        'Tahini',
        'Bone broth',
        'Eggs',
        'Quinoa',
        'Watermelon'
      ],
      foodsToLimit: [
        'Heavy carbs in large amounts',
        'Excess sugar',
        'Inflammatory foods'
      ],
      hydration: '10-12 cups/day, electrolytes during intense workouts',
      supplements: ['Omega-3', 'Vitamin E', 'Magnesium']
    },
    symptoms: ['Peak energy', 'Heightened senses', 'Increased libido', 'Confidence', 'Clear skin'],
    selfCare: [
      'Leverage high energy for productivity',
      'Social engagement',
      'Important presentations/meetings',
      'Creative projects',
      'Romantic time'
    ]
  },

  luteal: {
    phase: 'luteal',
    phaseName: 'Luteal Phase',
    daysInPhase: 'Days 17-28',
    hormones: ['High progesterone', 'Declining estrogen'],
    workoutIntensity: 'Moderate - Listen to your body',
    workoutTypes: [
      'Yoga',
      'Pilates',
      'Moderate cardio',
      'Light strength training',
      'Swimming',
      'Barre',
      'Walking',
      'Cycling (moderate pace)'
    ],
    energyLevel: 'Moderate to Low - Variable energy',
    focusAreas: ['Consistency over intensity', 'Mood management', 'Stress relief'],
    nutritionFocus: {
      keyNutrients: [
        'Magnesium (PMS relief)',
        'Vitamin B6 (mood support)',
        'Complex carbs (serotonin boost)',
        'Calcium',
        'Vitamin D',
        'Fiber (hormone elimination)'
      ],
      recommendedFoods: [
        'Root vegetables (sweet potato, squash)',
        'Brown rice',
        'Chickpeas',
        'Pumpkin',
        'Dark leafy greens',
        'Bananas',
        'Turkey',
        'Pumpkin seeds',
        'Dark chocolate (70%+)',
        'Herbal teas (chamomile, peppermint)',
        'Spirulina',
        'Sesame seeds',
        'Avocados'
      ],
      foodsToLimit: [
        'Excess caffeine',
        'Refined sugar',
        'High sodium foods',
        'Alcohol',
        'Processed foods'
      ],
      hydration: '8-10 cups/day, herbal teas for bloating',
      supplements: ['Magnesium', 'Vitamin B6', 'Evening primrose oil', 'Calcium']
    },
    symptoms: [
      'Mood changes',
      'Food cravings',
      'Bloating',
      'Fatigue',
      'Breast tenderness',
      'Irritability',
      'Difficulty concentrating'
    ],
    selfCare: [
      'Prioritize rest',
      'Practice stress management',
      'Light exercise',
      'Journaling',
      'Warm baths',
      'Extra sleep',
      'Mindfulness practices'
    ]
  }
};

export function getCyclePhaseGuidance(phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal'): CyclePhaseGuidance {
  return CYCLE_PHASE_GUIDANCE[phase];
}

// Grocery list generator helper
export interface GroceryItem {
  name: string;
  category: string;
  quantity?: string;
}

export function generateGroceryList(meals: Array<{ ingredients: string[] }>): GroceryItem[] {
  const groceryMap = new Map<string, GroceryItem>();

  meals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const category = categorizeIngredient(ingredient);
      if (!groceryMap.has(ingredient)) {
        groceryMap.set(ingredient, {
          name: ingredient,
          category,
          quantity: '1'
        });
      }
    });
  });

  return Array.from(groceryMap.values()).sort((a, b) => 
    a.category.localeCompare(b.category)
  );
}

function categorizeIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (lowerIngredient.includes('chicken') || lowerIngredient.includes('beef') || 
      lowerIngredient.includes('fish') || lowerIngredient.includes('turkey') ||
      lowerIngredient.includes('salmon')) {
    return 'Protein';
  }
  if (lowerIngredient.includes('spinach') || lowerIngredient.includes('kale') ||
      lowerIngredient.includes('broccoli') || lowerIngredient.includes('lettuce') ||
      lowerIngredient.includes('vegetable')) {
    return 'Vegetables';
  }
  if (lowerIngredient.includes('apple') || lowerIngredient.includes('banana') ||
      lowerIngredient.includes('berry') || lowerIngredient.includes('fruit') ||
      lowerIngredient.includes('orange')) {
    return 'Fruits';
  }
  if (lowerIngredient.includes('rice') || lowerIngredient.includes('bread') ||
      lowerIngredient.includes('pasta') || lowerIngredient.includes('oat') ||
      lowerIngredient.includes('quinoa')) {
    return 'Grains';
  }
  if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') ||
      lowerIngredient.includes('yogurt') || lowerIngredient.includes('butter')) {
    return 'Dairy';
  }
  
  return 'Other';
}
