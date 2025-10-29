# Food Quiz & Apple Health Sync Implementation

## Overview

This implementation adds two major features to the Bloom nutrition tracking system:

1. **Comprehensive Food Quiz** - A multi-step quiz covering all major food groups
2. **Apple Health Integration** - Sync step count and activity data for personalized nutrition

## Features Implemented

### 🍽️ Food Quiz System

#### Components Created:
- **`/src/components/food-quiz.tsx`** - Interactive quiz component with 6 food groups
- **`/src/app/nutrition/quiz/page.tsx`** - Quiz landing and completion pages
- **`/src/app/nutrition/personalized/page.tsx`** - AI-generated personalized meal plans

#### Food Groups Covered:
1. **Proteins** (8 items) - Chicken, Fish, Eggs, Tofu, Legumes, Greek Yogurt, Nuts, Seeds
2. **Vegetables** (8 items) - Leafy Greens, Broccoli, Carrots, Bell Peppers, Tomatoes, Cauliflower, Zucchini, Sweet Potato
3. **Fruits** (8 items) - Berries, Apples, Bananas, Citrus, Grapes, Melon, Stone Fruits, Tropical
4. **Whole Grains** (8 items) - Oats, Brown Rice, Quinoa, Whole Wheat, Barley, Pasta, Buckwheat, Millet
5. **Dairy & Alternatives** (8 items) - Milk, Yogurt, Cheese, Almond Milk, Oat Milk, Coconut Milk, Soy Milk, Kefir
6. **Healthy Fats** (8 items) - Avocado, Olive Oil, Nuts, Seeds, Fatty Fish, Coconut Oil, Nut Butters, Dark Chocolate

#### Quiz Features:
- ✅ Progress tracking (X of 6 steps)
- ✅ Visual selection with emojis and icons
- ✅ Back/forward navigation
- ✅ Selection summary on each page
- ✅ Completion screen with statistics
- ✅ Skip option for flexibility

### 🏃 Apple Health Sync

#### Components Created:
- **`/src/components/apple-health-sync.tsx`** - Health data sync component
- **`/lib/health-data.ts`** - Health data service layer

#### Health Metrics Tracked:
- **Daily Steps** - With goal tracking and progress
- **Active Minutes** - Movement duration
- **Distance** - Kilometers walked
- **Calories Burned** - Active energy expenditure
- **Heart Rate** - Optional metric

#### Features:
- ✅ Connection flow with simulated sync
- ✅ Real-time sync button
- ✅ Last sync timestamp
- ✅ Activity-based nutrition adjustments
- ✅ Visual metrics dashboard
- ✅ Progress bars for goals
- ✅ Activity insights and recommendations

### 🤖 AI Meal Plan Integration

#### Service Layer:
- **`/lib/food-preferences.ts`** - Food preference management and AI meal generation

#### Functionality:
- ✅ Load user food preferences
- ✅ Generate cycle-specific meal suggestions
- ✅ Create personalized grocery lists
- ✅ Calculate nutrition totals
- ✅ Bloom Score integration
- ✅ Phase-based recommendations

#### Cycle-Specific Recommendations:
- **Menstrual Phase** - Iron-rich, comfort foods, magnesium
- **Follicular Phase** - High energy, lean proteins, complex carbs
- **Ovulatory Phase** - Antioxidants, fiber, light proteins
- **Luteal Phase** - B vitamins, magnesium, complex carbs

## File Structure

```
src/
├── app/
│   └── nutrition/
│       ├── page.tsx                    # Main nutrition page (updated)
│       ├── quiz/
│       │   └── page.tsx                # Food quiz flow
│       └── personalized/
│           └── page.tsx                # AI-generated meal plans
├── components/
│   ├── food-quiz.tsx                   # Quiz component
│   └── apple-health-sync.tsx           # Health sync component
└── lib/
    ├── food-preferences.ts             # Food preference service
    ├── health-data.ts                  # Health data service
    └── supabase/
        └── client.ts                   # Supabase client setup
```

## Data Flow

### Quiz Flow:
1. User navigates to `/nutrition/quiz`
2. Takes quiz selecting preferred foods from each group
3. Preferences saved to localStorage (and prepared for Supabase)
4. Redirects to `/nutrition/personalized`
5. AI generates meal plan based on preferences + cycle phase

### Health Sync Flow:
1. User clicks "Connect Apple Health"
2. Simulated connection (production would use HealthKit)
3. Health data synced and displayed
4. Manual sync available via "Sync Now" button
5. Activity level affects calorie recommendations

## Database Schema (Prepared)

### Tables Ready for Supabase:

#### `quiz_responses`
- Stores completed quiz responses
- JSONB field for flexible preference storage
- Tenant/project isolated with RLS

#### `food_preferences`
- Structured food group preferences
- Supports allergies and dietary restrictions
- User-specific with full RLS

#### `health_data`
- Time-series health metrics
- Supports multiple data types
- Source tracking (Apple Health, manual, etc.)

## Usage

### Taking the Food Quiz:
```typescript
// Navigate to quiz
router.push('/nutrition/quiz');

// Or from nutrition page
<Button onClick={() => router.push('/nutrition/quiz')}>
  Take Quiz
</Button>
```

### Connecting Apple Health:
```typescript
// Component automatically handles connection
<AppleHealthSync
  onConnect={() => console.log('Connected!')}
  onSync={() => console.log('Synced!')}
/>
```

### Loading Preferences:
```typescript
import { loadFoodPreferences, hasFoodPreferences } from '@/lib/food-preferences';

// Check if user has completed quiz
if (hasFoodPreferences()) {
  const prefs = loadFoodPreferences();
  // Use preferences...
}
```

### Generating Meal Plan:
```typescript
import { generateMealSuggestions } from '@/lib/food-preferences';

const mealPlan = generateMealSuggestions({
  preferences: userPrefs,
  cyclePhase: 'follicular',
  calorieTarget: 2000
});
```

## Integration Points

### Current Integrations:
- ✅ Main nutrition page (`/nutrition`)
- ✅ Navigation system
- ✅ Bloom design system
- ✅ Existing UI components

### Ready for Integration:
- ⏳ Supabase database (tables prepared, RLS configured)
- ⏳ User authentication (uses localStorage for now)
- ⏳ Cycle tracking (hardcoded to 'follicular' for demo)
- ⏳ Native HealthKit (simulated for web)

## Production Considerations

### To Enable Supabase:
1. Uncomment database save calls in `food-preferences.ts`
2. Uncomment health data saves in `health-data.ts`
3. Run migrations for quiz and health tables
4. Update user authentication to pass real user IDs

### To Enable Apple Health (iOS):
1. Add HealthKit framework to iOS app
2. Request permissions for step count, distance, calories
3. Replace simulated sync with real HealthKit queries
4. Set up background sync

### Security:
- ✅ All components use RLS-protected patterns
- ✅ Tenant/project isolation prepared
- ✅ User-specific data scoping
- ⚠️ Production needs proper authentication

## Testing

### Test the Quiz:
1. Navigate to `/nutrition`
2. Click "Take Quiz" button
3. Select foods from each category
4. Complete all 6 groups
5. View personalized meal plan

### Test Apple Health:
1. Navigate to `/nutrition`
2. Click "Apple Health" tab
3. Click "Connect" button
4. View health metrics dashboard
5. Click "Sync Now" to update data

## Design System Compliance

All components follow the Bloom design system:
- ✅ Playfair Display headings
- ✅ Inter body text
- ✅ Sage green, terracotta, pink color palette
- ✅ Rounded corners (20-24px radius)
- ✅ Soft shadows and transitions
- ✅ Generous spacing and breathing room
- ✅ Warm, organic aesthetic

## Future Enhancements

### Potential Additions:
- Recipe details and cooking instructions
- Meal swap suggestions
- Weekly meal prep automation
- Integration with grocery delivery APIs
- Barcode scanning for nutrition facts
- Photo food logging
- Social sharing of meal plans
- Nutritionist consultations

## Support

For questions or issues with this implementation, refer to:
- Component source code (well-commented)
- Design system documentation in `globals.css`
- Supabase setup in `lib/supabase/client.ts`
