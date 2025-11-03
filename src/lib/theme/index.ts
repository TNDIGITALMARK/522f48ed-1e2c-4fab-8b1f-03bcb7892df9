/**
 * Bloom Theme System
 * Custom color scheme management with brown/beige defaults
 */

export { CustomThemeProvider, useCustomTheme } from './provider';
export { DEFAULT_THEMES, type ColorScheme, type ThemePreset } from './types';
export {
  applyColorScheme,
  getCurrentColorScheme,
  hslToRgb,
  rgbToHsl,
  generateComplementaryScheme,
  isValidHSL,
  generateSchemeName,
} from './utils';
