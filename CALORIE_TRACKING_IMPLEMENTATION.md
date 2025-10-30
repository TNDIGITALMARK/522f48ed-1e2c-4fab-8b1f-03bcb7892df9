# AI-Powered Calorie Tracking System

## Implementation Summary

A comprehensive fitness tracking system with intelligent calorie management has been successfully implemented.

## Features Implemented

### 1. Multi-Unit Height Input System
- **Component**: `src/components/fitness/HeightInput.tsx`
- **Capabilities**:
  - Supports feet & inches, inches only, and centimeters
  - Real-time conversion between units
  - Intuitive UI with unit selector buttons
  - Validates height ranges (4-8 feet)

### 2. AI Calorie Calculation Engine
- **Library**: `lib/ai-calorie-system.ts`
- **Features**:
  - **BMR Calculation**: Uses Mifflin-St Jeor equation for accurate basal metabolic rate
  - **TDEE Calculation**: Adjusts for activity level (sedentary to very active)
  - **Goal-Based Targets**: Automatically calculates daily calorie targets based on:
    - Weight loss goals (safe deficit, minimum 1200/1500 cal)
    - Weight gain goals (controlled surplus)
    - Weight maintenance
  - **Smart Adjustment Algorithm**:
    - Monitors last 7 days of eating patterns
    - Detects overeating/undereating trends
    - Automatically adjusts future days to compensate
    - Keeps users on track for weekly goals
  - **Weekly Summary**: Tracks overall progress and adherence

### 3. User Profile Setup
- **Page**: `src/app/fitness-setup/page.tsx`
- **Two-Step Process**:
  - **Step 1 - Personal Info**: Age, sex, height (multi-unit), weight, activity level
  - **Step 2 - Fitness Goals**: Goal type, target weight, weekly rate (lbs/week)
- **Validation**: Ensures all required fields are completed
- **Storage**: Uses localStorage for client-side persistence

### 4. Calorie Dashboard
- **Component**: `src/components/fitness/CalorieDashboard.tsx`
- **Features**:
  - Today's calorie progress with visual indicators
  - Target, consumed, and remaining calories
  - AI adjustment notifications when applied
  - Meal logging interface
  - Weekly summary with status indicators
  - Color-coded feedback (on track / needs adjustment)

### 5. Integration Points
- **Dashboard Link**: Added AI Calorie Tracking card to main dashboard
- **Dedicated Page**: `/calorie-tracking` for full tracking interface
- **Setup Flow**: `/fitness-setup` for initial profile configuration

## How The AI System Works

### Initial Setup
1. User enters height (feet/inches/cm), weight, age, sex, activity level
2. User sets goal: lose/gain/maintain weight and weekly target
3. System calculates:
   - BMR (Basal Metabolic Rate)
   - TDEE (Total Daily Energy Expenditure)  
   - Daily calorie target adjusted for goal

### Daily Tracking
1. User logs meals throughout the day
2. Dashboard shows progress toward daily target
3. System tracks consumed vs. target calories

### Smart AI Adjustments
1. **Monitoring**: System reviews last 7 days of data
2. **Analysis**: Calculates average daily deviation from targets
3. **Adjustment**: If deviation > 100 calories:
   - Spreads compensation over next 7 days
   - Example: Overate by 700 calories this week → Reduce future days by 100 cal/day
   - Example: Underate by 700 calories → Increase future days by 100 cal/day
4. **Safety Bounds**: Ensures adjustments stay within healthy ranges

### Weekly Goal Tracking
- Compares total weekly calories consumed vs. target
- Shows if user is "on track" (within 300 cal/day average)
- Provides feedback for course correction

## Technical Architecture

### Data Flow
```
User Input → Height Conversions → BMR Calculation → TDEE Calculation → Daily Target
                                                                            ↓
Daily Tracking ← Smart Adjustment ← Weekly Analysis ← Meal Logging
```

### Storage Strategy
- **localStorage**: Client-side persistence for:
  - User profile
  - Fitness goals
  - Daily tracking data (keyed by date)
- **Future Enhancement**: Sync to Supabase database when migrations are available

### Calculation Formulas

**BMR (Mifflin-St Jeor)**:
- Men: 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- Women: 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

**TDEE**:
- Sedentary: BMR × 1.2
- Light: BMR × 1.375
- Moderate: BMR × 1.55
- Active: BMR × 1.725
- Very Active: BMR × 1.9

**Daily Target**:
- Weight Loss: TDEE - (weekly_goal_lbs × 3500 / 7)
- Weight Gain: TDEE + (weekly_goal_lbs × 3500 / 7)
- Maintain: TDEE

## Key Files

- `lib/ai-calorie-system.ts` - Core AI calorie logic
- `lib/height-conversions.ts` - Multi-unit height system
- `src/components/fitness/HeightInput.tsx` - Height input component
- `src/components/fitness/CalorieDashboard.tsx` - Tracking dashboard
- `src/app/fitness-setup/page.tsx` - Profile setup wizard
- `src/app/calorie-tracking/page.tsx` - Full tracking interface

## Usage Flow

1. **Setup**: Navigate to `/fitness-setup` or click "Set Up Fitness Profile" on dashboard
2. **Enter Data**: Complete 2-step wizard with personal info and goals
3. **Track**: Visit `/calorie-tracking` or use dashboard widgets
4. **Log Meals**: Add calorie counts as you eat throughout the day
5. **Monitor**: Check daily progress and AI adjustments
6. **Review**: View weekly summary to stay accountable

## Benefits

- **Personalized**: Targets based on individual metrics
- **Intelligent**: AI adjusts to keep you on track automatically
- **Flexible**: Supports multiple height/weight units
- **Visual**: Clear progress indicators and feedback
- **Safe**: Built-in guardrails prevent unhealthy restrictions
- **Comprehensive**: Tracks daily, weekly, and long-term progress
