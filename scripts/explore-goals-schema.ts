import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiZmJkY2VlZTYtOGFmOS00Yzc3LTg5Y2QtNjBhMWFmMmNkNDYzIiwiaWF0IjoxNzYzMzQ0NjgzLCJleHAiOjE3NjMzNDczODN9.kXyy47hF6Wt8NM-w-RlTmHnE0Dklt_6y0osnuUwz-bc`
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== Exploring Database Schema ===\n');

  // Check for tables related to goals, events, schedules
  const tablesToCheck = ['goals', 'events', 'schedules', 'calendar_events', 'tasks', 'plans', 'daily_goals', 'weekly_goals', 'monthly_goals'];

  for (const tableName of tablesToCheck) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: ${count} rows`);
    } else {
      console.log(`❌ ${tableName}: does not exist`);
    }
  }

  console.log('\n=== Existing Tables ===\n');
  // Check what tables exist
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (tables) {
    console.log('Available tables:');
    tables.forEach((t: any) => console.log(`  - ${t.table_name}`));
  }
}

exploreSchema();
