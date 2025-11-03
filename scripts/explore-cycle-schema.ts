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

async function exploreCycleSchema() {
  console.log('🔍 Exploring database schema for cycle tracking...\n');

  // Check for cycle-related tables
  const cycleTables = [
    'cycles',
    'cycle_tracking',
    'period_tracking',
    'menstrual_cycles',
    'symptoms',
    'cycle_symptoms',
    'mood_tracking',
    'period_logs',
    'cycle_data'
  ];

  console.log('Checking for existing tables:');
  for (const tableName of cycleTables) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: ${count} rows`);

      // Get sample data
      const { data } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (data && data.length > 0) {
        console.log(`   Columns:`, Object.keys(data[0]).join(', '));
      }
    }
  }

  console.log('\n✅ Schema exploration complete');
}

exploreCycleSchema().catch(console.error);
