import { supabase, TENANT_ID, PROJECT_ID } from './client';

// ============================================
// Types
// ============================================

export interface Food {
  id: string;
  tenantid: string;
  projectid: string;
  name: string;
  brand?: string | null;
  category?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  serving_size?: string | null;
  serving_unit?: string | null;
  is_custom: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMeal {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  food_id: string;
  meal_type: string;
  date: string;
  servings: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroceryItem {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  item_name: string;
  category?: string | null;
  quantity?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMealSuggestion {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  meal_type: string;
  meal_name: string;
  description?: string | null;
  ingredients?: any;
  instructions?: string | null;
  estimated_calories?: number | null;
  estimated_protein?: number | null;
  estimated_carbs?: number | null;
  estimated_fat?: number | null;
  is_balanced: boolean;
  source?: string | null;
  created_at: string;
}

// ============================================
// Food Queries
// ============================================

export async function searchFoods(query: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getFoodById(id: string): Promise<Food | null> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createFood(food: Partial<Food>): Promise<Food> {
  const { data, error } = await supabase
    .from('foods')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...food,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFood(id: string, updates: Partial<Food>): Promise<Food> {
  const { data, error } = await supabase
    .from('foods')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFood(id: string): Promise<void> {
  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// User Meal Queries
// ============================================

export async function getUserMealsByDate(userId: string, date: string): Promise<UserMeal[]> {
  const { data, error } = await supabase
    .from('user_meals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at');

  if (error) throw error;
  return data || [];
}

export async function getUserMealsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<UserMeal[]> {
  const { data, error } = await supabase
    .from('user_meals')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addFoodToMeal(meal: {
  userId: string;
  foodId: string;
  mealType: string;
  date: string;
  servings?: number;
  notes?: string;
}): Promise<UserMeal> {
  const { data, error } = await supabase
    .from('user_meals')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: meal.userId,
      food_id: meal.foodId,
      meal_type: meal.mealType,
      date: meal.date,
      servings: meal.servings || 1.0,
      notes: meal.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserMeal(id: string, updates: Partial<UserMeal>): Promise<UserMeal> {
  const { data, error } = await supabase
    .from('user_meals')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUserMeal(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_meals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Grocery Item Queries
// ============================================

export async function getGroceryItems(userId: string): Promise<GroceryItem[]> {
  const { data, error } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addGroceryItem(item: {
  userId: string;
  itemName: string;
  category?: string;
  quantity?: string;
}): Promise<GroceryItem> {
  const { data, error } = await supabase
    .from('grocery_items')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: item.userId,
      item_name: item.itemName,
      category: item.category,
      quantity: item.quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGroceryItem(
  id: string,
  updates: Partial<GroceryItem>
): Promise<GroceryItem> {
  const { data, error } = await supabase
    .from('grocery_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGroceryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// AI Meal Suggestion Queries
// ============================================

export async function getAIMealSuggestions(
  userId: string,
  mealType?: string
): Promise<AIMealSuggestion[]> {
  let query = supabase
    .from('ai_meal_suggestions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (mealType) {
    query = query.eq('meal_type', mealType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createAIMealSuggestion(
  suggestion: Partial<AIMealSuggestion>
): Promise<AIMealSuggestion> {
  const { data, error } = await supabase
    .from('ai_meal_suggestions')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      ...suggestion,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAIMealSuggestion(id: string): Promise<void> {
  const { error } = await supabase
    .from('ai_meal_suggestions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Helper Functions
// ============================================

export async function generateAIMealSuggestionsFromGroceries(
  userId: string,
  mealType: string
): Promise<AIMealSuggestion[]> {
  // Get user's grocery items
  const groceries = await getGroceryItems(userId);

  if (groceries.length === 0) {
    throw new Error('No grocery items found. Please add some items to your pantry first.');
  }

  const groceryList = groceries.map((item) => item.item_name).join(', ');

  // This is a placeholder - in a real app, you'd call an AI API (OpenAI, Claude, etc.)
  // For now, we'll create some mock suggestions based on the meal type
  const mockSuggestions = generateMockMealSuggestions(mealType, groceryList);

  // Save suggestions to database
  const savedSuggestions = await Promise.all(
    mockSuggestions.map((suggestion) =>
      createAIMealSuggestion({
        user_id: userId,
        meal_type: mealType,
        ...suggestion,
      })
    )
  );

  return savedSuggestions;
}

function generateMockMealSuggestions(mealType: string, groceryList: string) {
  const suggestions = {
    breakfast: [
      {
        meal_name: 'Healthy Breakfast Bowl',
        description: 'A nutritious bowl combining your available ingredients',
        ingredients: { list: groceryList.split(', ').slice(0, 4) },
        instructions: 'Combine ingredients in a bowl. Top with your favorite toppings.',
        estimated_calories: 350,
        estimated_protein: 15,
        estimated_carbs: 45,
        estimated_fat: 10,
        is_balanced: true,
        source: 'ai',
      },
      {
        meal_name: 'Quick Morning Smoothie',
        description: 'Energizing smoothie using pantry items',
        ingredients: { list: groceryList.split(', ').slice(0, 3) },
        instructions: 'Blend all ingredients until smooth. Serve chilled.',
        estimated_calories: 280,
        estimated_protein: 12,
        estimated_carbs: 38,
        estimated_fat: 8,
        is_balanced: true,
        source: 'ai',
      },
    ],
    lunch: [
      {
        meal_name: 'Balanced Lunch Plate',
        description: 'Well-rounded lunch combining protein and vegetables',
        ingredients: { list: groceryList.split(', ').slice(0, 5) },
        instructions: 'Prepare protein and vegetables separately, then combine on a plate.',
        estimated_calories: 450,
        estimated_protein: 30,
        estimated_carbs: 40,
        estimated_fat: 15,
        is_balanced: true,
        source: 'ai',
      },
    ],
    dinner: [
      {
        meal_name: 'Wholesome Dinner Meal',
        description: 'Complete dinner using available groceries',
        ingredients: { list: groceryList.split(', ').slice(0, 6) },
        instructions: 'Cook protein thoroughly, steam vegetables, and serve with sides.',
        estimated_calories: 550,
        estimated_protein: 35,
        estimated_carbs: 50,
        estimated_fat: 18,
        is_balanced: true,
        source: 'ai',
      },
    ],
    snack: [
      {
        meal_name: 'Healthy Snack',
        description: 'Quick and nutritious snack',
        ingredients: { list: groceryList.split(', ').slice(0, 2) },
        instructions: 'Combine ingredients for a simple, healthy snack.',
        estimated_calories: 150,
        estimated_protein: 8,
        estimated_carbs: 15,
        estimated_fat: 5,
        is_balanced: true,
        source: 'ai',
      },
    ],
    dessert: [
      {
        meal_name: 'Guilt-Free Dessert',
        description: 'Healthy dessert option',
        ingredients: { list: groceryList.split(', ').slice(0, 3) },
        instructions: 'Combine ingredients creatively for a balanced treat.',
        estimated_calories: 200,
        estimated_protein: 5,
        estimated_carbs: 30,
        estimated_fat: 7,
        is_balanced: true,
        source: 'ai',
      },
    ],
  };

  return suggestions[mealType as keyof typeof suggestions] || suggestions.lunch;
}
