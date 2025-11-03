/**
 * Theme Utility Functions
 * Convert between color formats and apply themes
 */

import { ColorScheme } from './types';

/**
 * Apply a color scheme to the document root
 */
export function applyColorScheme(scheme: ColorScheme) {
  const root = document.documentElement;

  Object.entries(scheme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
}

/**
 * Get current color scheme from CSS variables
 */
export function getCurrentColorScheme(): Partial<ColorScheme['colors']> {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    primary: computedStyle.getPropertyValue('--primary').trim(),
    primaryForeground: computedStyle.getPropertyValue('--primary-foreground').trim(),
    secondary: computedStyle.getPropertyValue('--secondary').trim(),
    secondaryForeground: computedStyle.getPropertyValue('--secondary-foreground').trim(),
    background: computedStyle.getPropertyValue('--background').trim(),
    foreground: computedStyle.getPropertyValue('--foreground').trim(),
    card: computedStyle.getPropertyValue('--card').trim(),
    cardForeground: computedStyle.getPropertyValue('--card-foreground').trim(),
    accent: computedStyle.getPropertyValue('--accent').trim(),
    accentForeground: computedStyle.getPropertyValue('--accent-foreground').trim(),
    muted: computedStyle.getPropertyValue('--muted').trim(),
    mutedForeground: computedStyle.getPropertyValue('--muted-foreground').trim(),
    border: computedStyle.getPropertyValue('--border').trim(),
    input: computedStyle.getPropertyValue('--input').trim(),
    ring: computedStyle.getPropertyValue('--ring').trim(),
    destructive: computedStyle.getPropertyValue('--destructive').trim(),
    destructiveForeground: computedStyle.getPropertyValue('--destructive-foreground').trim(),
    popover: computedStyle.getPropertyValue('--popover').trim(),
    popoverForeground: computedStyle.getPropertyValue('--popover-foreground').trim(),
  };
}

/**
 * Convert HSL string to RGB
 */
export function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  const [h, s, l] = hsl.split(' ').map((v, i) => {
    const num = parseFloat(v.replace('%', ''));
    return i === 0 ? num : num / 100;
  });

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert RGB to HSL string format
 */
export function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Generate a complementary color scheme from a base color
 */
export function generateComplementaryScheme(baseHsl: string): Partial<ColorScheme['colors']> {
  const [h, s, l] = baseHsl.split(' ').map((v, i) => {
    const num = parseFloat(v.replace('%', ''));
    return i === 0 ? num : num / 100;
  });

  // Generate complementary colors
  const complementaryH = (h + 180) % 360;
  const analogousH1 = (h + 30) % 360;
  const analogousH2 = (h - 30 + 360) % 360;

  return {
    primary: `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`,
    secondary: `${analogousH1} ${Math.round(s * 0.8 * 100)}% ${Math.round(l * 1.2 * 100)}%`,
    accent: `${complementaryH} ${Math.round(s * 0.9 * 100)}% ${Math.round(l * 100)}%`,
    muted: `${analogousH2} ${Math.round(s * 0.5 * 100)}% ${Math.round(l * 1.3 * 100)}%`,
    background: `${h} ${Math.round(s * 0.3 * 100)}% 96%`,
    foreground: `${h} ${Math.round(s * 0.4 * 100)}% 15%`,
  };
}

/**
 * Validate HSL color string format
 */
export function isValidHSL(hsl: string): boolean {
  const pattern = /^\d+\s+\d+%\s+\d+%$/;
  return pattern.test(hsl.trim());
}

/**
 * Create a color scheme name from primary color
 */
export function generateSchemeName(primaryHsl: string): string {
  const [h] = primaryHsl.split(' ').map((v) => parseFloat(v.replace('%', '')));

  if (h >= 0 && h < 30) return 'Red Palette';
  if (h >= 30 && h < 60) return 'Orange Palette';
  if (h >= 60 && h < 90) return 'Yellow Palette';
  if (h >= 90 && h < 150) return 'Green Palette';
  if (h >= 150 && h < 210) return 'Cyan Palette';
  if (h >= 210 && h < 270) return 'Blue Palette';
  if (h >= 270 && h < 330) return 'Purple Palette';
  return 'Pink Palette';
}
