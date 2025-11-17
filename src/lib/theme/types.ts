/**
 * Custom Theme System
 * Allows users to create their own color schemes
 */

export interface ColorScheme {
  id: string;
  name: string;
  description?: string;
  colors: {
    // Primary colors
    primary: string; // HSL format: "h s% l%"
    primaryForeground: string;

    // Secondary colors
    secondary: string;
    secondaryForeground: string;

    // Background colors
    background: string;
    foreground: string;

    // Card colors
    card: string;
    cardForeground: string;

    // Accent colors
    accent: string;
    accentForeground: string;

    // Muted colors
    muted: string;
    mutedForeground: string;

    // Border colors
    border: string;
    input: string;
    ring: string;

    // Destructive colors
    destructive: string;
    destructiveForeground: string;

    // Popover colors
    popover: string;
    popoverForeground: string;
  };
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_THEMES: Record<string, ColorScheme> = {
  brownBeige: {
    id: 'brown-beige-v8', // Updated to v8 - synchronized with globals.css :root values
    name: 'Rooted Earth Tones',
    description: 'Sage green, olive, brown, and navy palette with pure white background',
    isDefault: true,
    colors: {
      // SYNCHRONIZED WITH globals.css :root section (lines 70-142)
      primary: '80 12% 37%', // --primary: 80 12% 37% (Medium olive green #5A604D)
      primaryForeground: '0 0% 100%', // --primary-foreground: 0 0% 100%
      secondary: '100 15% 67%', // --secondary: 100 15% 67% (Light sage green #A8B8A5)
      secondaryForeground: '25 11% 21%', // --secondary-foreground: 25 11% 21%
      background: '0 0% 100%', // --background: 0 0% 100% (Pure white #FFFFFF)
      foreground: '25 11% 21%', // --foreground: 25 11% 21% (Dark brown text #3E3530)
      card: '100 20% 95%', // --card: 100 20% 95% (Light sage-tinted cards)
      cardForeground: '25 11% 21%', // --card-foreground: 25 11% 21%
      accent: '215 43% 21%', // --accent: 215 43% 21% (Deep navy accent #1E2F4D)
      accentForeground: '0 0% 100%', // --accent-foreground: 0 0% 100%
      muted: '100 15% 88%', // --muted: 100 15% 88% (Light sage for muted elements)
      mutedForeground: '80 12% 35%', // --muted-foreground: 80 12% 35%
      border: '100 15% 82%', // --border: 100 15% 82% (Soft sage border)
      input: '100 15% 82%', // --input: 100 15% 82%
      ring: '80 12% 37%', // --ring: 80 12% 37% (Olive green focus ring)
      destructive: '10 45% 48%', // --destructive: 10 45% 48% (Earth red)
      destructiveForeground: '0 0% 100%', // --destructive-foreground: 0 0% 100%
      popover: '100 20% 95%', // --popover: 100 20% 95%
      popoverForeground: '25 11% 21%', // --popover-foreground: 25 11% 21%
    },
  },
  minimalistNeutral: {
    id: 'minimalist-neutral',
    name: 'Minimalist Black & Cream',
    description: 'Pure minimalist aesthetic with black and cream',
    colors: {
      primary: '0 0% 0%',
      primaryForeground: '60 20% 98%',
      secondary: '0 0% 29%',
      secondaryForeground: '60 20% 98%',
      background: '60 20% 98%',
      foreground: '0 0% 0%',
      card: '38 44% 93%',
      cardForeground: '0 0% 0%',
      accent: '135 20% 75%',
      accentForeground: '0 0% 0%',
      muted: '40 35% 74%',
      mutedForeground: '0 0% 20%',
      border: '40 15% 87%',
      input: '40 15% 87%',
      ring: '0 0% 0%',
      destructive: '12 50% 55%',
      destructiveForeground: '60 20% 98%',
      popover: '60 20% 99%',
      popoverForeground: '0 0% 0%',
    },
  },
  rosyWarm: {
    id: 'rosy-warm',
    name: 'Rosy Warmth',
    description: 'Soft rose and warm pink tones',
    colors: {
      primary: '345 50% 60%',
      primaryForeground: '60 20% 98%',
      secondary: '345 35% 80%',
      secondaryForeground: '345 30% 20%',
      background: '345 40% 96%',
      foreground: '345 30% 15%',
      card: '345 35% 92%',
      cardForeground: '345 30% 15%',
      accent: '345 45% 70%',
      accentForeground: '60 20% 98%',
      muted: '345 25% 85%',
      mutedForeground: '345 20% 35%',
      border: '345 20% 88%',
      input: '345 20% 88%',
      ring: '345 50% 60%',
      destructive: '12 50% 55%',
      destructiveForeground: '60 20% 98%',
      popover: '345 40% 98%',
      popoverForeground: '345 30% 15%',
    },
  },
  sageMint: {
    id: 'sage-mint',
    name: 'Sage & Mint',
    description: 'Calming sage green and mint palette',
    colors: {
      primary: '135 30% 50%',
      primaryForeground: '60 20% 98%',
      secondary: '135 25% 75%',
      secondaryForeground: '135 30% 20%',
      background: '135 20% 96%',
      foreground: '135 25% 15%',
      card: '135 18% 92%',
      cardForeground: '135 25% 15%',
      accent: '135 35% 60%',
      accentForeground: '60 20% 98%',
      muted: '135 15% 85%',
      mutedForeground: '135 20% 35%',
      border: '135 15% 88%',
      input: '135 15% 88%',
      ring: '135 30% 50%',
      destructive: '12 50% 55%',
      destructiveForeground: '60 20% 98%',
      popover: '135 20% 98%',
      popoverForeground: '135 25% 15%',
    },
  },
  lavenderDream: {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Soft lavender and purple tones',
    colors: {
      primary: '280 40% 60%',
      primaryForeground: '60 20% 98%',
      secondary: '280 30% 80%',
      secondaryForeground: '280 35% 20%',
      background: '280 35% 96%',
      foreground: '280 30% 15%',
      card: '280 28% 92%',
      cardForeground: '280 30% 15%',
      accent: '280 45% 70%',
      accentForeground: '60 20% 98%',
      muted: '280 20% 85%',
      mutedForeground: '280 25% 35%',
      border: '280 18% 88%',
      input: '280 18% 88%',
      ring: '280 40% 60%',
      destructive: '12 50% 55%',
      destructiveForeground: '60 20% 98%',
      popover: '280 35% 98%',
      popoverForeground: '280 30% 15%',
    },
  },
  peachCream: {
    id: 'peach-cream',
    name: 'Peach & Cream',
    description: 'Warm peach with creamy accents',
    colors: {
      primary: '15 60% 65%',
      primaryForeground: '60 20% 98%',
      secondary: '15 45% 80%',
      secondaryForeground: '15 40% 20%',
      background: '15 50% 96%',
      foreground: '15 35% 15%',
      card: '15 45% 92%',
      cardForeground: '15 35% 15%',
      accent: '15 65% 70%',
      accentForeground: '60 20% 98%',
      muted: '15 35% 85%',
      mutedForeground: '15 30% 35%',
      border: '15 30% 88%',
      input: '15 30% 88%',
      ring: '15 60% 65%',
      destructive: '12 50% 55%',
      destructiveForeground: '60 20% 98%',
      popover: '15 50% 98%',
      popoverForeground: '15 35% 15%',
    },
  },
};

export type ThemePreset = keyof typeof DEFAULT_THEMES;
