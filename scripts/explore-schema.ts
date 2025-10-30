import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiOWVkZmY4MTItZDM0Yi00M2Y5LTg2OWUtMGYzYjI2NDEyMWNjIiwiaWF0IjoxNzYxNzgzNTc1LCJleHAiOjE3NjE3ODYyNzV9.VUDcdNMAqVAci1euC1ucauivLmWXfKy0VW-fXE5PYNc'
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== DATABASE SCHEMA EXPLORATION ===\n');

  const tablesToCheck = [
    'weight_logs',
    'user_goals',
    'health_metrics',
    'fitness_goals',
    'users',
    'profiles',
    'user_profiles'
  ];

  for (const tableName of tablesToCheck) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: ${count} rows (table exists)`);
    } else {
      console.log(`❌ ${tableName}: ${error.message}`);
    }
  }

  console.log('\nDone!');
}

exploreSchema();
