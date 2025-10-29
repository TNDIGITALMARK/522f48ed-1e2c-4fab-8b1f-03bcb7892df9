import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiODk1MjdhMmMtMWQ5Yi00MjA1LWI3ZjQtMmYwY2Q5ZjUyM2UzIiwiaWF0IjoxNzYxNzcyNDg0LCJleHAiOjE3NjE3NzUxODR9.f2EZLhKbaRxVq0mqJEEKdw7jXf7AiiXdr92MwJh4IYk`
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== EXPLORING DATABASE SCHEMA ===\n');

  // Check existing tables
  const tables = ['foods', 'meals', 'meal_foods', 'user_meals', 'gardens', 'garden_items', 'friends', 'friend_requests', 'gifts', 'users'];

  for (const tableName of tables) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: ${count} rows`);
    } else {
      console.log(`❌ ${tableName}: Not found - ${error.message}`);
    }
  }
}

exploreSchema();
