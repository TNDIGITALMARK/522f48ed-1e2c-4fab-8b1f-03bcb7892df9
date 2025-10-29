import { ServingSize } from './supabase/client';

/**
 * Unit conversion utilities for food serving sizes
 * Supports: grams (g), pounds (lbs), ounces (oz), cups, tablespoons (tbsp), teaspoons (tsp), milliliters (ml)
 */

// Base conversion ratios to grams
export const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  lb: 453.592,
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,
  // Volume to mass conversions (approximate for water/milk-like liquids)
  cup: 240,
  cups: 240,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  tbsp: 15,
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,
  // Common food-specific units
  slice: 30, // Average bread slice
  slices: 30,
  piece: 50, // Average piece
  pieces: 50,
  serving: 100, // Generic serving
  servings: 100,
};

/**
 * Convert from one unit to another
 */
export function convertUnit(amount: number, fromUnit: string, toUnit: string): number {
  const fromGrams = UNIT_TO_GRAMS[fromUnit.toLowerCase()] || 1;
  const toGrams = UNIT_TO_GRAMS[toUnit.toLowerCase()] || 1;

  const grams = amount * fromGrams;
  return grams / toGrams;
}

/**
 * Convert serving size to grams
 */
export function servingToGrams(serving: ServingSize): number {
  return serving.amount * (UNIT_TO_GRAMS[serving.unit.toLowerCase()] || serving.grams);
}

/**
 * Calculate nutritional values based on serving size
 */
export function calculateNutrition(
  gramsConsumed: number,
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} {
  const multiplier = gramsConsumed / 100;

  return {
    calories: Math.round(nutritionPer100g.calories * multiplier),
    protein: Math.round(nutritionPer100g.protein * multiplier * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbs * multiplier * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * multiplier * 10) / 10,
    fiber: Math.round(nutritionPer100g.fiber * multiplier * 10) / 10,
  };
}

/**
 * Get common serving sizes for a food item
 */
export function getCommonServingSizes(category: string, itemName: string): ServingSize[] {
  const baseSizes: ServingSize[] = [
    { unit: 'g', amount: 100, grams: 100, label: '100g' },
    { unit: 'g', amount: 50, grams: 50, label: '50g' },
    { unit: 'g', amount: 200, grams: 200, label: '200g' },
  ];

  // Add category-specific serving sizes
  const categoryServings: Record<string, ServingSize[]> = {
    protein: [
      { unit: 'oz', amount: 4, grams: 113, label: '4 oz (113g)' },
      { unit: 'oz', amount: 6, grams: 170, label: '6 oz (170g)' },
      { unit: 'oz', amount: 8, grams: 227, label: '8 oz (227g)' },
      { unit: 'piece', amount: 1, grams: 120, label: '1 piece (~120g)' },
    ],
    grains: [
      { unit: 'cup', amount: 0.5, grams: 80, label: '½ cup cooked (80g)' },
      { unit: 'cup', amount: 1, grams: 160, label: '1 cup cooked (160g)' },
      { unit: 'oz', amount: 2, grams: 57, label: '2 oz dry (57g)' },
    ],
    vegetables: [
      { unit: 'cup', amount: 1, grams: 150, label: '1 cup (150g)' },
      { unit: 'cup', amount: 0.5, grams: 75, label: '½ cup (75g)' },
    ],
    fruits: [
      { unit: 'piece', amount: 1, grams: 150, label: '1 medium piece (150g)' },
      { unit: 'cup', amount: 1, grams: 150, label: '1 cup (150g)' },
      { unit: 'cup', amount: 0.5, grams: 75, label: '½ cup (75g)' },
    ],
    dairy: [
      { unit: 'cup', amount: 1, grams: 240, label: '1 cup (240ml)' },
      { unit: 'cup', amount: 0.5, grams: 120, label: '½ cup (120ml)' },
      { unit: 'oz', amount: 1, grams: 28, label: '1 oz (28g)' },
      { unit: 'tbsp', amount: 2, grams: 30, label: '2 tbsp (30g)' },
    ],
    beverages: [
      { unit: 'cup', amount: 1, grams: 240, label: '1 cup (240ml)' },
      { unit: 'oz', amount: 8, grams: 240, label: '8 fl oz (240ml)' },
      { unit: 'oz', amount: 12, grams: 355, label: '12 fl oz (355ml)' },
    ],
  };

  const specificSizes = categoryServings[category.toLowerCase()] || [];
  return [...baseSizes, ...specificSizes];
}

/**
 * Format serving size for display
 */
export function formatServingSize(serving: ServingSize): string {
  if (serving.label) return serving.label;

  const amountStr = serving.amount % 1 === 0 ? serving.amount.toString() : serving.amount.toFixed(1);
  return `${amountStr} ${serving.unit} (${serving.grams}g)`;
}

/**
 * Parse serving size string into ServingSize object
 */
export function parseServingSize(servingString: string): ServingSize | null {
  // Example: "1 cup (240g)" or "100g" or "4 oz"
  const match = servingString.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)(?:\s*\((\d+)g\))?/);

  if (!match) return null;

  const amount = parseFloat(match[1]);
  const unit = match[2];
  const explicitGrams = match[3] ? parseFloat(match[3]) : null;

  const grams = explicitGrams || amount * (UNIT_TO_GRAMS[unit.toLowerCase()] || 1);

  return {
    unit,
    amount,
    grams,
    label: servingString,
  };
}
