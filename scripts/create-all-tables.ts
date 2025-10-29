import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyOTgwOCwiZXhwIjoyMDc2MjA1ODA4fQ.eKOEX9uZJO03gMxYWLq7XwTESCwGJkBkGRiHpHH_FLo',
  {
    db: { schema: 'public' },
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function createTables() {
  console.log('Creating database tables...\n');

  // Foods table
  const { error: foodsError } = await supabase.rpc('exec_sql', {
    sql: `
      create table if not exists public.foods (
        id uuid primary key default uuid_generate_v4(),
        tenantid text not null,
        projectid uuid not null,
        name text not null,
        brand text,
        category text,
        calories integer,
        protein numeric(10,2),
        carbs numeric(10,2),
        fat numeric(10,2),
        fiber numeric(10,2),
        sugar numeric(10,2),
        sodium numeric(10,2),
        serving_size text,
        serving_unit text,
        is_custom boolean default true,
        created_by uuid,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
    `
  });

  if (foodsError) {
    console.error('Error creating foods table:', foodsError);
  } else {
    console.log('✅ Foods table created');
  }
}

createTables();
