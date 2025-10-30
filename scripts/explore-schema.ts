import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiNzk0Yjc4ZDItMTA3OC00YjA5LWE4ZDMtM2QyNTg0YzRjMTU0IiwiaWF0IjoxNzYxNzg3NDU3LCJleHAiOjE3NjE3OTAxNTd9.rBdEbI0IAypLODANItIoEVyZs_SETFhPE5Uhb561YtQ'
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== EXPLORING DATABASE SCHEMA ===\n');

  const tables = ['user_profiles', 'users', 'health_data', 'health_metrics', 'fitness_goals'];

  for (const tableName of tables) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ '${tableName}' exists - ${count} rows`);
      const { data: sample } = await supabase.from(tableName).select('*').limit(1);
      if (sample && sample.length > 0) {
        console.log('   Columns:', Object.keys(sample[0]).join(', '));
      }
    } else {
      console.log(`❌ '${tableName}' not found`);
    }
  }
}

exploreSchema().catch(console.error);
