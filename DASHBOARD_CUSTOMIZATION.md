# Dashboard Customization Feature

## Overview

The dashboard now includes a powerful customization system that allows users to personalize their wellness experience based on their specific health and wellness goals.

## Features

### 🎯 Wellness Goal Selection

Users can select from six different wellness goal categories:

1. **Fitness & Movement** - Track workouts, activity, and physical strength
2. **Nutrition & Diet** - Monitor meals, calories, and nutritional goals
3. **Mental Wellness** - Focus on meditation, mindfulness, and emotional health
4. **Sleep & Recovery** - Optimize rest, sleep patterns, and recovery
5. **Cycle Tracking** - Hormone health and menstrual cycle awareness
6. **Holistic Balance** - Balanced approach across all wellness areas

### 🎨 Personalized Dashboard

The dashboard dynamically adapts based on selected goals:

- **Today's Focus Card**: Shows personalized tips and recommendations aligned with selected goals
- **Goal Indicators**: Small icons appear beneath the greeting showing active wellness goals
- **Smart Defaults**: If no goals are selected, defaults to "Holistic Balance"

### 💾 Persistent Settings

- User preferences are saved to localStorage
- Settings persist across browser sessions
- Real-time updates when goals are changed
- Cross-tab synchronization support

## User Experience

### Accessing Settings

At the bottom of the dashboard page, users will find:
- A subtle border separator
- "Personalize your wellness dashboard" text
- "Customize Dashboard" button with settings icon

### Customization Flow

1. Click "Customize Dashboard" button
2. Modal opens showing all wellness goal options
3. Click goal cards to select/deselect (multiple selections allowed)
4. Selected goals show:
   - Blue border and background highlight
   - Checkmark icon
   - Primary color styling
5. Click "Save Preferences" to apply changes
6. Toast notification confirms successful save
7. Dashboard immediately updates with new personalized content

## Technical Implementation

### Components

**`/src/components/dashboard-settings.tsx`**
- Main settings dialog component
- Handles goal selection logic
- Manages localStorage persistence
- Triggers custom events for real-time updates

**`/src/hooks/use-wellness-goals.ts`**
- Custom React hook for accessing wellness goals
- Provides `goals`, `hasGoal()`, and `isGoalActive()` utilities
- Listens for changes via custom events and storage events
- Handles loading states

### Integration

**Dashboard Page** (`/src/app/dashboard/page.tsx`)
- Imports and uses `useWellnessGoals` hook
- Displays goal indicators in header
- Renders personalized "Today's Focus" content
- Shows settings button at bottom

### Data Structure

```typescript
interface WellnessGoal {
  id: string;           // 'fitness', 'nutrition', 'mental', 'sleep', 'cycle', 'holistic'
  name: string;         // Display name
  description: string;  // Goal description
  icon: ReactComponent; // Lucide icon component
  color: string;        // HSL color value
}
```

### Storage

Goals are stored in localStorage as:
```json
{
  "wellness-goals": ["fitness", "nutrition", "mental"]
}
```

### Events

Custom event dispatched on goal changes:
```javascript
window.dispatchEvent(new CustomEvent('wellness-goals-changed', {
  detail: { goals: ['fitness', 'nutrition'] }
}));
```

## Extending the Feature

### Adding New Wellness Goals

1. Add new goal to `WELLNESS_GOALS` array in `dashboard-settings.tsx`
2. Import corresponding icon from `lucide-react`
3. Add icon mapping to `GOAL_ICONS` in dashboard page
4. Add personalized content block in "Today's Focus" card

Example:
```typescript
{
  id: 'hydration',
  name: 'Hydration',
  description: 'Track daily water intake and hydration levels',
  icon: Droplet,
  color: 'hsl(200 70% 60%)',
}
```

### Customizing Goal Content

Edit the "Today's Focus" card in `/src/app/dashboard/page.tsx`:

```tsx
{goals.includes('your-goal-id') && (
  <div className="p-3 bg-background/50 rounded-lg">
    <h3 className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
      <YourIcon className="w-3.5 h-3.5" />
      Your Title
    </h3>
    <p className="text-xs text-muted-foreground">
      Your personalized message here.
    </p>
  </div>
)}
```

## Design Philosophy

- **User-Centric**: Goals are optional and flexible - users can select multiple or none
- **Non-Intrusive**: Settings button at bottom doesn't clutter the main interface
- **Immediate Feedback**: Changes apply instantly without page reload
- **Visual Clarity**: Selected goals are clearly indicated with color and checkmarks
- **Accessible**: Clear labels, descriptions, and semantic HTML structure

## Future Enhancements

Potential improvements for future iterations:

1. **Goal-Based Widget Visibility**: Hide/show specific dashboard widgets based on goals
2. **Goal Progress Tracking**: Track progress toward each wellness goal over time
3. **Smart Recommendations**: AI-powered suggestions based on goal combinations
4. **Goal Scheduling**: Set different goals for different days/times
5. **Community Goals**: Connect with others pursuing similar wellness goals
6. **Export/Import**: Share goal configurations between devices
7. **Analytics**: Dashboard showing goal-related insights and patterns

## Files Modified/Created

### New Files
- `/src/components/dashboard-settings.tsx` - Main settings component
- `/src/hooks/use-wellness-goals.ts` - Custom hook for goal management
- `/DASHBOARD_CUSTOMIZATION.md` - This documentation

### Modified Files
- `/src/app/dashboard/page.tsx` - Integrated settings and personalized content
- No changes to `/src/app/globals.css` - Already properly configured

## Testing Checklist

- [x] Settings modal opens and closes correctly
- [x] Goal selection/deselection works
- [x] Multiple goals can be selected
- [x] Settings persist after page refresh
- [x] Dashboard updates immediately after saving
- [x] Goal indicators show in header
- [x] Today's Focus card shows relevant content
- [x] Toast notification appears on save
- [x] Default "holistic" goal applies when nothing selected
- [x] Responsive design works on mobile and desktop

## Conclusion

This feature empowers users to take control of their wellness journey by customizing their dashboard to reflect their unique health priorities and goals.
