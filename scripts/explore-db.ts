import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiNzcwYWEzMWMtMDI1Ny00ODhkLTlkNjMtMzhhOGUyZGQ4Y2I1IiwiaWF0IjoxNzYyMTMyNjA1LCJleHAiOjE3NjIxMzUzMDV9.Cwf_k_04ySDfi5OXiLT5Dni8X44H4n-YRfOHUOvG490`
      }
    }
  }
);

async function exploreDatabase() {
  console.log('=== EXPLORING DATABASE SCHEMA ===\n');

  // Check common table names
  const tablesToCheck = [
    'users',
    'user_profiles',
    'events',
    'goals',
    'todos',
    'workouts',
    'nutrition_plans',
    'calendar_events',
    'health_profiles',
    'meal_plans',
    'exercises',
    'user_health_data'
  ];

  for (const tableName of tablesToCheck) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: ${count} rows`);

      // Sample one row to see structure
      const { data: sample } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (sample && sample.length > 0) {
        console.log(`   Columns: ${Object.keys(sample[0]).join(', ')}`);
      }
    }
  }
}

exploreDatabase();
