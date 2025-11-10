# rooted Theme Customization Guide

Welcome to rooted's custom color scheme system! This guide will help you personalize your rooted experience with your own colors.

## Quick Start

### Change Your Theme in 3 Steps

1. **Visit Settings**: Go to `/settings` in your browser
2. **Choose a Preset**: Click on any of the 6 preset themes in the "Presets" tab
3. **Done!** Your theme changes instantly and is saved automatically

### Create Your Own Theme

1. **Open Theme Customizer**: Go to `/settings` or `/theme-demo`
2. **Click "Create Custom" Tab**
3. **Enter Your Colors**:
   - Primary Color: Main action color (buttons, links)
   - Background Color: Page background
4. **Click "Create Custom Theme"**
5. **Your theme is now active!**

## Understanding HSL Colors

Colors are entered in HSL format: `hue saturation% lightness%`

### Hue (0-360) - Choose Your Color
- **0-30**: Red to Orange
- **30-60**: Orange to Yellow
- **60-120**: Yellow to Green
- **120-180**: Green to Cyan
- **180-240**: Cyan to Blue
- **240-300**: Blue to Purple
- **300-360**: Purple to Red

### Saturation (0-100%) - Color Intensity
- **0%**: Completely gray (no color)
- **50%**: Moderate color intensity
- **100%**: Fully saturated, vibrant color

### Lightness (0-100%) - Brightness
- **0%**: Pure black
- **50%**: Pure color (neither dark nor light)
- **100%**: Pure white

## Example Colors

### Warm & Cozy
- Brown: `30 35% 45%`
- Beige: `42 38% 93%`
- Tan: `40 40% 75%`

### Fresh & Natural
- Sage Green: `135 30% 50%`
- Mint: `135 20% 85%`
- Forest: `120 40% 30%`

### Soft & Feminine
- Rose: `345 50% 60%`
- Blush: `345 35% 80%`
- Lavender: `280 40% 60%`

### Calm & Serene
- Sky Blue: `210 50% 60%`
- Powder Blue: `210 30% 85%`
- Navy: `210 60% 30%`

## Preset Themes

### 1. Warm Brown & Beige (Default)
Cozy, earthy tones perfect for wellness and mindfulness
- Primary: `30 35% 45%` (warm brown)
- Background: `42 38% 93%` (cream)

### 2. Minimalist Black & Cream
Pure, minimalist aesthetic with high contrast
- Primary: `0 0% 0%` (pure black)
- Background: `60 20% 98%` (off-white)

### 3. Rosy Warmth
Soft, feminine palette with warm pink tones
- Primary: `345 50% 60%` (soft rose)
- Background: `345 40% 96%` (pale rose)

### 4. Sage & Mint
Calming, natural green palette
- Primary: `135 30% 50%` (sage green)
- Background: `135 20% 96%` (pale mint)

### 5. Lavender Dream
Soothing purple and lavender tones
- Primary: `280 40% 60%` (lavender)
- Background: `280 35% 96%` (pale lavender)

### 6. Peach & Cream
Warm, inviting peach palette
- Primary: `15 60% 65%` (peach)
- Background: `15 50% 96%` (pale peach)

## Tips for Creating Beautiful Themes

### Start with Your Favorite Color
1. Find the hue (0-360) of your favorite color
2. Use moderate saturation (30-50%) for primary color
3. Use lower lightness (40-50%) for primary, higher (90-96%) for background

### Keep It Simple
- Don't worry about all the colors - most are auto-generated
- Focus on getting primary and background colors right
- Other colors will complement your choices automatically

### Test Different Lightness Values
- Too dark (below 30%): Hard to read
- Just right (40-50%): Perfect for buttons and emphasis
- Too light (above 80%): Doesn't stand out enough

### Consider the Mood
- **Warm colors (0-60)**: Energetic, cozy, inviting
- **Cool colors (180-270)**: Calm, professional, serene
- **Neutral colors (low saturation)**: Minimalist, elegant

## Where to Use Your Theme

Your custom theme applies everywhere:
- ✅ All buttons and interactive elements
- ✅ Cards and containers
- ✅ Text and headings
- ✅ Borders and dividers
- ✅ Focus states and highlights

## Managing Your Themes

### Quick Switch
Click the palette icon 🎨 in the navigation to quickly switch between presets

### Delete Custom Themes
In Settings → Presets tab → Click the trash icon on your custom themes

### Reset to Default
Simply select "Warm Brown & Beige" from the presets

## Need Inspiration?

Visit `/theme-demo` to:
- See all preset themes in action
- Try creating custom themes with live preview
- View how themes affect different UI components

## Technical Details (For Developers)

- Themes stored in localStorage: `bloom-theme-scheme`
- Custom themes: `bloom-custom-themes`
- Format: HSL with space separators (e.g., `"30 35% 45%"`)
- Real-time CSS variable updates via `:root`

## Support

Need help? Here are common issues:

**Theme not applying?**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage and revisit settings

**Colors look wrong?**
- Check HSL format: `hue saturation% lightness%`
- Ensure percentages have the `%` symbol
- Hue should be 0-360 (no %)

**Lost your custom theme?**
- Check browser localStorage hasn't been cleared
- Re-create from Settings page

---

Enjoy personalizing your rooted experience! 🌸
