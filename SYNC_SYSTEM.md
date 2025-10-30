# 🔄 Smart Data Synchronization System

## Overview

The app now features a **centralized data synchronization system** that ensures all pages work together seamlessly. When you update data anywhere in the app, it automatically propagates and updates everywhere else in real-time.

## 🎯 Key Features

### ✅ Automatic Data Sync
- **Update once, reflect everywhere**: Change your weight in the profile page → Dashboard and nutrition automatically update
- **Real-time updates**: Changes appear instantly across all open pages/tabs
- **No manual refresh needed**: Everything stays in sync automatically

### ✅ Smart Tracking & Regulation
- **Calorie calculations**: Update your height/weight/goals → Calorie targets recalculate automatically
- **Nutrition tracking**: Add meals in nutrition → Weekly totals update → Dashboard reflects progress
- **Wellness metrics**: Log water/steps/meditation → All dashboards update in real-time

### ✅ Cross-Page Intelligence
- **Dashboard ↔ Profile**: Physical attributes (height, weight, age) sync bidirectionally
- **Dashboard ↔ Nutrition**: Calorie goals and meal tracking stay perfectly aligned
- **Profile ↔ Nutrition**: Activity level and goals automatically adjust calorie targets

## 📁 Architecture

### Core Components

#### 1. **User Profile Store** (`src/lib/user-profile-store.ts`)
The single source of truth for all user data:
- Physical attributes (height, weight, age)
- Fitness goals (goal type, target weight, activity level)
- Wellness metrics (water, steps, meditation, sleep)
- Nutrition targets (calories, macros)
- Nutrition history (meals, daily totals)

#### 2. **React Hooks** (`src/hooks/use-user-profile.ts`)
Easy-to-use hooks for React components:
- `useUserProfile()` - Access and update profile data
- `useNutritionData()` - Track meals and calories
- `useCalorieRecommendation()` - Get auto-calculated calorie targets
- `useDashboardData()` - Combined hook for dashboard (all-in-one)
- `useMetricSync()` - Sync specific metrics across pages

#### 3. **Event-Driven Updates**
- LocalStorage events for cross-tab sync
- Custom events for same-page updates
- Listener system for component notifications

## 🚀 How It Works

### Example: Updating Weight in Profile

```typescript
// In Profile Page
const { updatePhysical } = useUserProfile('user-id');

// User updates their weight
updatePhysical({
  weight: 155,
  weightUnit: 'lbs'
});

// What happens automatically:
// ✅ Weight saved to centralized store
// ✅ Weight log added to tracking history
// ✅ Calorie targets recalculated based on new weight
// ✅ Dashboard updates to show new weight
// ✅ Nutrition page updates calorie goals
// ✅ All open tabs/windows update in real-time
```

### Example: Adding a Meal in Nutrition

```typescript
// In Nutrition Page
const { addMeal } = useNutritionData('user-id');

// User adds breakfast
addMeal('breakfast', {
  name: 'Oatmeal with Berries',
  calories: 320,
  protein: 12,
  carbs: 58,
  fat: 5
});

// What happens automatically:
// ✅ Meal saved to today's nutrition data
// ✅ Daily totals recalculated (calories, protein, carbs, fat)
// ✅ Weekly totals updated
// ✅ Dashboard shows updated calorie progress
// ✅ Nutrition page reflects new meal
// ✅ Progress bars update across all pages
```

### Example: Logging Water in Dashboard

```typescript
// In Dashboard
const { updateWellness } = useDashboardData('user-id');

// User clicks "Add Glass"
updateWellness({
  waterConsumed: profile.waterConsumed + 1
});

// What happens automatically:
// ✅ Water count incremented in store
// ✅ Dashboard hydration card updates
// ✅ Profile page shows new water intake
// ✅ Any wellness widgets update
// ✅ Progress bars reflect new progress
```

## 📝 Usage Examples

### Dashboard Page

```typescript
import { useDashboardData } from '@/hooks/use-user-profile';

export default function DashboardPage() {
  const {
    profile,
    updateWellness,
    calorieRecommendation,
    todaysNutrition,
    weeklyNutritionData
  } = useDashboardData('user-id');

  // All data is automatically synced!
  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>

      {/* Show calorie recommendation (auto-calculated) */}
      <p>Daily Target: {calorieRecommendation?.dailyCalories} cal</p>

      {/* Show today's nutrition (synced from nutrition page) */}
      <p>Consumed: {todaysNutrition?.totalCalories || 0} cal</p>

      {/* Update water - syncs everywhere */}
      <button onClick={() => updateWellness({ waterConsumed: profile.waterConsumed + 1 })}>
        Add Water
      </button>
    </div>
  );
}
```

### Profile Page

```typescript
import { useUserProfile } from '@/hooks/use-user-profile';

export default function ProfilePage() {
  const { profile, updatePhysical, updateGoals } = useUserProfile('user-id');

  const handleSave = () => {
    // Update physical attributes - syncs to dashboard and nutrition
    updatePhysical({
      weight: 155,
      height: { value: 67, unit: 'in' },
      age: 30
    });

    // Update fitness goals - recalculates calories everywhere
    updateGoals({
      goalType: 'cutting',
      targetWeight: 145,
      weeklyWeightGoal: 1.0,
      activityLevel: 'moderate'
    });
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form fields... */}
      <button type="submit">Save (Syncs Everywhere!)</button>
    </form>
  );
}
```

### Nutrition Page

```typescript
import { useNutritionData, useCalorieRecommendation } from '@/hooks/use-user-profile';

export default function NutritionPage() {
  const { addMeal, todaysNutrition, getWeeklySummary } = useNutritionData('user-id');
  const calorieTarget = useCalorieRecommendation('user-id');

  const handleAddMeal = () => {
    // Add meal - updates dashboard and weekly totals
    addMeal('lunch', {
      name: 'Grilled Chicken Salad',
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 18
    });
  };

  return (
    <div>
      {/* Show calorie target (synced from profile) */}
      <p>Daily Target: {calorieTarget?.dailyCalories} cal</p>

      {/* Show today's progress (synced across pages) */}
      <p>Consumed: {todaysNutrition?.totalCalories || 0} cal</p>

      {/* Add meal button */}
      <button onClick={handleAddMeal}>Add Lunch</button>
    </div>
  );
}
```

## 🔧 Technical Details

### Data Flow

```
User Action (any page)
    ↓
Update Function (hook)
    ↓
User Profile Store
    ↓
├─ Save to localStorage
├─ Recalculate dependent data (calories, macros)
├─ Trigger storage events (cross-tab sync)
└─ Notify all listeners
    ↓
All Components Update Automatically
```

### Storage Schema

**User Profile**: `bloom_user_profile_{userId}`
```json
{
  "userId": "user-001",
  "height": { "value": 67, "unit": "in" },
  "weight": 155,
  "weightUnit": "lbs",
  "age": 30,
  "sex": "female",
  "activityLevel": "moderate",
  "goalType": "cutting",
  "targetWeight": 145,
  "weeklyWeightGoal": 1.0,
  "dailyCalories": 1650,
  "weeklyCalories": 11550,
  "proteinGrams": 155,
  "carbsGrams": 150,
  "fatGrams": 46,
  "waterGoal": 8,
  "waterConsumed": 6,
  "stepsGoal": 10000,
  "stepsCompleted": 7500,
  "meditationGoal": 15,
  "meditationCompleted": 10,
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

**Nutrition Data**: `bloom_nutrition_data_{userId}`
```json
[
  {
    "date": "2024-01-15",
    "meals": {
      "breakfast": {
        "name": "Oatmeal with Berries",
        "calories": 320,
        "protein": 12,
        "carbs": 58,
        "fat": 5
      },
      "lunch": { /* ... */ },
      "dinner": { /* ... */ }
    },
    "totalCalories": 1650,
    "totalProtein": 140,
    "totalCarbs": 180,
    "totalFat": 45,
    "waterIntake": 6
  }
]
```

## ✨ Benefits

### For Users
- **Seamless Experience**: No need to enter data multiple times
- **Always Accurate**: Data is consistent across all pages
- **Smart Calculations**: Calories and macros automatically adjust to your goals
- **Real-Time Feedback**: See progress update instantly

### For Developers
- **Single Source of Truth**: One centralized store for all data
- **Easy Integration**: Simple hooks for any component
- **Type-Safe**: Full TypeScript support
- **Maintainable**: Clear data flow and event system

## 🎓 Key Concepts

### Automatic Calorie Recalculation
When you update:
- Weight → Calories recalculate based on new BMR
- Height → Calories recalculate based on new BMR
- Age → Calories recalculate based on new BMR
- Activity Level → Calories adjust for new TDEE
- Goal Type → Calories adjust for cutting/bulking/maintaining
- Target Weight → Calories adjust to reach goal

### Cross-Page Synchronization
- **Dashboard** displays data from Profile and Nutrition
- **Profile** updates propagate to Dashboard and Nutrition
- **Nutrition** meal tracking reflects on Dashboard
- All pages stay in perfect sync automatically

### Real-Time Updates
- Changes in one tab/window reflect in all others
- Components re-render automatically when data changes
- No manual refresh or reload needed

## 🚦 Getting Started

1. **Use the hooks in your component**:
```typescript
import { useDashboardData } from '@/hooks/use-user-profile';

const { profile, updateWellness } = useDashboardData('your-user-id');
```

2. **Read data from profile**:
```typescript
<p>Weight: {profile.weight} {profile.weightUnit}</p>
<p>Daily Calories: {profile.dailyCalories}</p>
```

3. **Update data** (syncs everywhere):
```typescript
updateWellness({ waterConsumed: profile.waterConsumed + 1 });
```

4. **That's it!** Everything syncs automatically 🎉

## 📚 Complete Hook API

### `useUserProfile(userId)`
Returns:
- `profile` - Full user profile
- `updateProfile(updates)` - Update any profile field
- `updatePhysical(updates)` - Update height/weight/age
- `updateGoals(updates)` - Update fitness goals
- `updateWellness(updates)` - Update daily metrics
- `syncFromWeightTracking()` - Sync from weight logs

### `useNutritionData(userId)`
Returns:
- `todaysNutrition` - Today's meals and totals
- `weeklyData` - Last 7 days of nutrition
- `addMeal(type, meal)` - Add meal to today
- `getWeeklySummary()` - Get weekly totals

### `useCalorieRecommendation(userId)`
Returns:
- Calorie recommendation object (auto-calculated)

### `useDashboardData(userId)`
Returns:
- Everything from `useUserProfile`
- Everything from `useNutritionData`
- `calorieRecommendation` - Auto-calculated targets

## 🎉 Result

Your app now has **intelligent data synchronization** where:
- ✅ Dashboard, Profile, and Nutrition work together seamlessly
- ✅ Updates in one place automatically reflect everywhere
- ✅ Calorie targets automatically adjust to user attributes
- ✅ Meal tracking integrates with fitness goals
- ✅ Everything stays perfectly in sync, always
