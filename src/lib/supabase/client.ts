import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hfndfmtxhqvubnfiwzlz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiODk1MjdhMmMtMWQ5Yi00MjA1LWI3ZjQtMmYwY2Q5ZjUyM2UzIiwiaWF0IjoxNzYxNzcyNDg0LCJleHAiOjE3NjE3NzUxODR9.f2EZLhKbaRxVq0mqJEEKdw7jXf7AiiXdr92MwJh4IYk`,
    },
  },
});

export const TENANT_ID = 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2';
export const PROJECT_ID = '522f48ed-1e2c-4fab-8b1f-03bcb7892df9';

// Food database types
export interface ServingSize {
  unit: string;
  amount: number;
  grams: number;
  label: string;
}

export interface FoodItem {
  id: string;
  tenantid: string;
  projectid: string;
  name: string;
  brand?: string | null;
  category: string;
  description?: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  serving_sizes: ServingSize[];
  default_serving_size?: ServingSize | null;
  bloom_score?: number | null;
  is_custom: boolean;
  added_by?: string | null;
  verified: boolean;
  source?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMealEntry {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  food_id: string;
  meal_type: string;
  meal_date: string;
  serving_size: ServingSize;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
