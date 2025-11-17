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

async function inspectTables() {
  console.log('=== Inspecting Table Structures ===\n');

  const tablesToInspect = ['goals', 'events', 'schedules', 'daily_goals', 'weekly_goals', 'monthly_goals', 'plans', 'tasks'];

  for (const tableName of tablesToInspect) {
    console.log(`\n--- ${tableName.toUpperCase()} ---`);

    // Get column information
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (error || !columns || columns.length === 0) {
      console.log(`  ❌ Could not fetch schema or table does not exist`);
      continue;
    }

    console.log(`  Columns:`);
    columns.forEach((col: any) => {
      console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
    });

    // Get sample data
    const { data: samples } = await supabase
      .from(tableName)
      .select('*')
      .limit(2);

    if (samples && samples.length > 0) {
      console.log(`  Sample data:`, JSON.stringify(samples[0], null, 2).substring(0, 200));
    } else {
      console.log(`  No data yet`);
    }
  }
}

inspectTables();
