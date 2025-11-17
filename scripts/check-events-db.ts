import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiZmJkY2VlZTYtOGFmOS00Yzc3LTg5Y2QtNjBhMWFmMmNkNDYzIiwiaWF0IjoxNzYzMzQ0NjgzLCJleHAiOjE3NjMzNDczODN9.kXyy47hF6Wt8NM-w-RlTmHnE0Dklt_6y0osnuUwz-bc'
      }
    }
  }
);

async function checkDatabase() {
  console.log('=== CHECKING FOR EXISTING EVENT TABLES ===\n');

  // Check for common event-related table names
  const tablesToCheck = ['calendar_events', 'events', 'user_events', 'schedule_events'];

  for (const tableName of tablesToCheck) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ Table "${tableName}" exists with ${count} rows`);
    } else if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log(`❌ Table "${tableName}" does not exist`);
    } else {
      console.log(`⚠️  Table "${tableName}" - Error: ${error.message}`);
    }
  }
}

checkDatabase();
