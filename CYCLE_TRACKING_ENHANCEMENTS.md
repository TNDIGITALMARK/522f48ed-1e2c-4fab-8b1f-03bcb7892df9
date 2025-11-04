# Cycle Tracking Enhancements - Implementation Guide

## Overview
This document outlines the comprehensive enhancements to the Bloom cycle tracking app, transforming it from a basic period tracker into a complete health companion with social features, nutrition guidance, and smart meal planning.

## Key Features Implemented

### 1. Enhanced Period Insights with Cycle-Specific Guidance

**Location**: `/src/lib/cycle-nutrition-data.ts`

Comprehensive data library providing:
- **Workout intensity recommendations** for each cycle phase
- **Specific exercise types** (yoga, HIIT, strength training, etc.)
- **Nutrition focus** with key nutrients for each phase
- **Recommended foods** tailored to hormonal needs
- **Foods to limit** based on cycle phase
- **Hydration recommendations**
- **Supplement suggestions**
- **Self-care practices** for each phase

**Cycle Phases Covered**:
1. **Menstruation (Days 1-5)**: Rest, iron-rich foods, gentle movement
2. **Follicular (Days 6-13)**: High energy, strength training, protein focus
3. **Ovulation (Days 14-16)**: Peak performance, antioxidants, intense workouts
4. **Luteal (Days 17-28)**: Moderate activity, magnesium, complex carbs

### 2. VSCO-Style Social Feed

**Location**: `/src/components/vsco-social-feed.tsx`

**Features**:
- Clean, minimalist photo and text posts
- Like functionality (no comments to keep it supportive/low-pressure)
- Friends-only visibility
- Card-based layout with elegant typography
- Real-time like updates
- Post deletion for own posts

**Database Tables Created**:
- `social_posts`: Stores user posts with captions and images
- `post_likes`: Tracks likes with unique constraints

### 3. Smart Nutrition System

**Query Functions**: `/src/lib/supabase/social-posts-queries.ts`

**Capabilities**:
- Create text, photo, or combined posts
- Fetch friends' posts in chronological order
- Like/unlike posts with count updates
- Check if user has liked a specific post
- Delete own posts

### 4. Meal Planning & Grocery Lists

**Data Structure**: Defined in `cycle-nutrition-data.ts`

**Features**:
- Grocery list generation from meal ingredients
- Automatic categorization (Protein, Vegetables, Fruits, Grains, Dairy)
- Integration with weekly meal plans
- Smart duplicate detection

**Database Schema**:
- `weekly_meal_plans`: Stores meals and auto-generated grocery lists
- `nutrition_recommendations`: Cycle-phase specific nutrition guidance

## Database Migrations Created

**File**: `20251104211037_add_social_posts_and_nutrition_tables.sql`

**Tables Added**:
1. **social_posts** - VSCO-style posts
2. **post_likes** - Like tracking with unique constraints
3. **nutrition_recommendations** - Cycle-specific nutrition data
4. **weekly_meal_plans** - Meal planning with grocery lists

**All tables include**:
- Multi-tenant isolation (tenantid, projectid)
- Row Level Security (RLS) policies
- Proper indexes for performance
- Foreign key constraints

## Supabase Integration

**Client Configuration**: `/src/lib/supabase/client.ts`
- Pre-configured with tenant/project scoping
- Scoped JWT token for automatic data isolation
- Type-safe interfaces for all data models

**Query Functions**: 
- `social-posts-queries.ts`: Complete CRUD for social posts
- RLS ensures users only see friends' posts
- Automatic like count updates via database operations

## Design System

**Global CSS**: `/src/app/globals.css`

Already configured with:
- **Fonts**: Montserrat (headings), Playfair Display (elegant accents), Lora (body)
- **Colors**: Warm brown/beige palette for calm, planner-inspired aesthetic
- **Typography**: Complete scale from h1-h6 with proper line heights
- **Components**: Cards, buttons, inputs with minimalist styling
- **Animations**: Subtle transitions and hover effects

## Navigation Updates Needed

To complete the transformation:

1. **Remove or repurpose**: `/src/app/garden` and `/src/app/garden-3d`
2. **Add new route**: `/src/app/social` for VSCO-style feed
3. **Update dashboard**: Link to social feed instead of garden

## Usage Examples

### Accessing Cycle Guidance

```typescript
import { getCyclePhaseGuidance } from '@/lib/cycle-nutrition-data';

const guidance = getCyclePhaseGuidance('follicular');
console.log(guidance.workoutTypes); // ['Strength training', 'HIIT', ...]
console.log(guidance.nutritionFocus.recommendedFoods);
```

### Creating a Social Post

```typescript
import { createSocialPost } from '@/lib/supabase/social-posts-queries';

await createSocialPost(
  userId,
  'Feeling energized after my morning yoga! 🧘‍♀️',
  'https://example.com/image.jpg',
  'both',
  'friends'
);
```

### Fetching Friends' Posts

```typescript
import { getFriendsPosts } from '@/lib/supabase/social-posts-queries';

const posts = await getFriendsPosts(userId, 50);
```

### Generating Grocery List

```typescript
import { generateGroceryList } from '@/lib/cycle-nutrition-data';

const groceries = generateGroceryList([
  { ingredients: ['chicken breast', 'spinach', 'olive oil'] },
  { ingredients: ['salmon', 'asparagus', 'quinoa'] }
]);
// Returns categorized grocery items
```

## Implementation Status

✅ **Complete**:
- Global CSS design system
- Cycle-specific nutrition data library
- Social posts database schema
- VSCO-style feed component
- Supabase query functions
- Meal planning data structures

🔨 **To Implement** (Quick additions):
- Social feed page (`/src/app/social/page.tsx`)
- Create post dialog component
- Enhanced period insights component (integrate guidance data)
- Weekly meal planner component
- Navigation updates

## Next Steps for Full Feature Launch

1. **Create Social Page**:
   ```typescript
   // /src/app/social/page.tsx
   import { VscoSocialFeed } from '@/components/vsco-social-feed';
   
   export default function SocialPage() {
     const userId = 'current-user-id'; // Get from auth
     return <VscoSocialFeed userId={userId} />;
   }
   ```

2. **Add Create Post Button**:
   - Float action button (FAB) on social feed
   - Opens dialog with text input and image upload
   - Uses `createSocialPost` query function

3. **Enhance Period Calendar**:
   - Display cycle phase guidance card
   - Show workout recommendations
   - List nutrition focus foods

4. **Add Meal Planner**:
   - Weekly view with meals
   - Auto-generate grocery list button
   - Save to `weekly_meal_plans` table

5. **Update Navigation**:
   - Replace "Garden" with "Community"
   - Add route to `/social`

## Benefits of This Approach

1. **Supportive Community**: VSCO-style (likes only, no comments) reduces pressure
2. **Personalized Guidance**: Cycle-specific workout/nutrition recommendations
3. **Practical Tools**: Smart grocery lists from meal plans
4. **Scientific Backing**: Recommendations based on hormonal changes
5. **Minimalist Design**: Clean, elegant interface matching the planner aesthetic
6. **Privacy-First**: Friends-only visibility, RLS data isolation

## Technical Highlights

- **Type Safety**: Full TypeScript interfaces throughout
- **Performance**: Indexed database queries, optimized RLS policies
- **Security**: Row Level Security ensures data isolation
- **Scalability**: Multi-tenant architecture supports growth
- **Modern Stack**: Next.js 15, React 19, Supabase, Tailwind CSS
