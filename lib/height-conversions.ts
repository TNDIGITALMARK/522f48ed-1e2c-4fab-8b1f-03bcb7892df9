/**
 * Height conversion utilities
 * Supports inches, centimeters, and feet+inches
 */

export type HeightUnit = 'in' | 'cm' | 'ft';

export interface HeightValue {
  value: number;
  unit: HeightUnit;
  // For feet+inches format
  feet?: number;
  inches?: number;
}

/**
 * Convert height to inches (base unit)
 */
export function convertToInches(height: HeightValue): number {
  switch (height.unit) {
    case 'in':
      return height.value;
    case 'cm':
      return height.value / 2.54;
    case 'ft':
      return (height.feet || 0) * 12 + (height.inches || 0);
    default:
      return height.value;
  }
}

/**
 * Convert inches to target unit
 */
export function convertFromInches(inches: number, targetUnit: HeightUnit): HeightValue {
  switch (targetUnit) {
    case 'in':
      return { value: inches, unit: 'in' };
    case 'cm':
      return { value: inches * 2.54, unit: 'cm' };
    case 'ft':
      const feet = Math.floor(inches / 12);
      const remainingInches = inches % 12;
      return {
        value: inches,
        unit: 'ft',
        feet,
        inches: remainingInches
      };
    default:
      return { value: inches, unit: 'in' };
  }
}

/**
 * Convert height between units
 */
export function convertHeight(height: HeightValue, targetUnit: HeightUnit): HeightValue {
  const inches = convertToInches(height);
  return convertFromInches(inches, targetUnit);
}

/**
 * Format height for display
 */
export function formatHeight(height: HeightValue): string {
  switch (height.unit) {
    case 'in':
      return `${height.value.toFixed(1)} in`;
    case 'cm':
      return `${height.value.toFixed(1)} cm`;
    case 'ft':
      return `${height.feet || 0}' ${(height.inches || 0).toFixed(1)}"`;
    default:
      return `${height.value.toFixed(1)} ${height.unit}`;
  }
}

/**
 * Parse height string input (flexible parsing)
 */
export function parseHeightInput(input: string, unit: HeightUnit): HeightValue | null {
  const trimmed = input.trim();

  // Parse feet+inches format (e.g., "5'10", "5 10", "5ft 10in")
  if (unit === 'ft') {
    const feetInchesMatch = trimmed.match(/^(\d+)['ft]?\s*(\d+(?:\.\d+)?)?["in]?$/i);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1], 10);
      const inches = feetInchesMatch[2] ? parseFloat(feetInchesMatch[2]) : 0;
      const totalInches = feet * 12 + inches;
      return { value: totalInches, unit: 'ft', feet, inches };
    }
  }

  // Parse numeric value
  const numericValue = parseFloat(trimmed.replace(/[^\d.]/g, ''));
  if (isNaN(numericValue) || numericValue <= 0) {
    return null;
  }

  if (unit === 'ft') {
    // If just a number for feet, assume it's feet only
    const feet = Math.floor(numericValue);
    const inches = (numericValue - feet) * 12;
    const totalInches = feet * 12 + inches;
    return { value: totalInches, unit: 'ft', feet, inches };
  }

  return { value: numericValue, unit };
}

/**
 * Validate height value
 */
export function isValidHeight(height: HeightValue): boolean {
  const inches = convertToInches(height);

  // Reasonable height range: 48 inches (4 feet) to 96 inches (8 feet)
  return inches >= 48 && inches <= 96;
}

/**
 * Get BMI from height (in inches) and weight (in lbs)
 */
export function calculateBMI(heightInches: number, weightLbs: number): number {
  // BMI = (weight in pounds * 703) / (height in inches)^2
  return (weightLbs * 703) / (heightInches * heightInches);
}

/**
 * Get BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 */
export function calculateBMR(
  weightLbs: number,
  heightInches: number,
  age: number,
  sex: 'male' | 'female'
): number {
  // Convert to metric
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;

  // Mifflin-St Jeor equation
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}
