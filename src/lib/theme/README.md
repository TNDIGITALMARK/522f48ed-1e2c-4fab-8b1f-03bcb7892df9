# Bloom Theme System

A comprehensive color scheme customization system with brown/beige defaults and user-created themes.

## Features

- **Brown/Beige Default Theme**: Warm, earthy tones as the core palette
- **6 Preset Themes**: Curated color schemes ready to use
- **Custom Theme Creation**: Users can create unlimited custom color schemes
- **Real-time Preview**: Instant visual feedback when changing themes
- **Persistent Storage**: Themes saved to localStorage and auto-applied on load
- **HSL Color Format**: Easy-to-understand color values

## Default Themes

1. **Warm Brown & Beige** (Default) - Cozy brown and beige palette
2. **Minimalist Black & Cream** - Pure minimalist aesthetic
3. **Rosy Warmth** - Soft rose and warm pink tones
4. **Sage & Mint** - Calming sage green and mint palette
5. **Lavender Dream** - Soft lavender and purple tones
6. **Peach & Cream** - Warm peach with creamy accents

## Usage

### Basic Setup

The theme system is already integrated into the app layout:

```tsx
import { CustomThemeProvider } from '@/lib/theme/provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}
```

### Using the Theme Hook

```tsx
import { useCustomTheme } from '@/lib/theme';

function MyComponent() {
  const { currentScheme, applyPreset, createCustomScheme } = useCustomTheme();

  return (
    <div>
      <p>Current theme: {currentScheme?.name}</p>
      <button onClick={() => applyPreset('brownBeige')}>
        Use Brown/Beige
      </button>
    </div>
  );
}
```

### Theme Customizer Component

Drop-in component for full theme customization:

```tsx
import { ThemeCustomizer } from '@/components/theme-customizer';

export default function SettingsPage() {
  return <ThemeCustomizer />;
}
```

### Quick Theme Switcher

Dropdown menu for quick theme switching:

```tsx
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function Navigation() {
  return (
    <nav>
      <ThemeSwitcher />
    </nav>
  );
}
```

## Creating Custom Themes

### Programmatically

```tsx
import { useCustomTheme, type ColorScheme } from '@/lib/theme';

const myTheme: ColorScheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  description: 'A beautiful custom palette',
  colors: {
    primary: '30 35% 45%',        // HSL: hue saturation% lightness%
    primaryForeground: '60 20% 98%',
    secondary: '40 40% 75%',
    // ... other colors
  },
};

const { createCustomScheme } = useCustomTheme();
createCustomScheme(myTheme);
```

### Via UI

Users can create themes using the ThemeCustomizer component:

1. Go to Settings page or Theme Demo page
2. Click "Create Custom" tab
3. Enter HSL values for primary and background colors
4. Other colors are automatically generated
5. Click "Create Custom Theme"

## HSL Color Format

Colors are stored in HSL (Hue, Saturation, Lightness) format: `h s% l%`

- **Hue (0-360)**: Color wheel position
  - Red: 0, Orange: 30, Yellow: 60, Green: 120, Cyan: 180, Blue: 240, Purple: 280
- **Saturation (0-100%)**: Color intensity
  - 0% = grayscale, 100% = fully saturated
- **Lightness (0-100%)**: Brightness
  - 0% = black, 50% = pure color, 100% = white

Example: `30 35% 45%` = warm brown color

## Utility Functions

```tsx
import {
  applyColorScheme,
  hslToRgb,
  generateComplementaryScheme,
  isValidHSL,
} from '@/lib/theme/utils';

// Apply a scheme to the document
applyColorScheme(myScheme);

// Convert HSL to RGB
const rgb = hslToRgb('30 35% 45%'); // { r: 155, g: 112, b: 74 }

// Generate complementary colors from a base
const colors = generateComplementaryScheme('30 35% 45%');

// Validate HSL string
if (isValidHSL('30 35% 45%')) {
  // Valid format
}
```

## Storage

Themes are stored in localStorage:

- **Active Theme ID**: `bloom-theme-scheme`
- **Custom Themes**: `bloom-custom-themes` (JSON array)

## Pages

- `/settings` - Full theme customization with ThemeCustomizer
- `/theme-demo` - Demo page showcasing the theme system

## Color Variables

All themes use CSS custom properties that update in real-time:

```css
:root {
  --primary: 30 35% 45%;
  --background: 42 38% 93%;
  --foreground: 25 30% 20%;
  /* ... and more */
}
```

Use in components:

```tsx
<div className="bg-primary text-primary-foreground">
  Styled with theme colors
</div>
```

## Brown/Beige Default

The default theme uses warm, earthy tones:

- Primary: Warm brown `30 35% 45%`
- Background: Cream `42 38% 93%`
- Cards: Latte `35 35% 88%`
- Text: Dark mocha `25 30% 20%`
- Borders: Soft beige `35 25% 82%`

This creates a cozy, minimalist aesthetic perfect for wellness and lifestyle apps.
