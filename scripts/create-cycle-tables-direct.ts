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

async function verifyTables() {
  console.log('✅ Verifying cycle tracking tables exist...\n');

  // Test cycle_tracking table
  const { error: cycleError, count: cycleCount } = await supabase
    .from('cycle_tracking')
    .select('*', { count: 'exact', head: true });

  if (!cycleError) {
    console.log(`✅ cycle_tracking table: ${cycleCount} rows`);
  } else {
    console.log(`❌ cycle_tracking error:`, cycleError.message);
  }

  // Test cycle_symptoms table
  const { error: symptomsError, count: symptomsCount } = await supabase
    .from('cycle_symptoms')
    .select('*', { count: 'exact', head: true });

  if (!symptomsError) {
    console.log(`✅ cycle_symptoms table: ${symptomsCount} rows`);
  } else {
    console.log(`❌ cycle_symptoms error:`, symptomsError.message);
  }

  // Test cycle_insights table
  const { error: insightsError, count: insightsCount } = await supabase
    .from('cycle_insights')
    .select('*', { count: 'exact', head: true });

  if (!insightsError) {
    console.log(`✅ cycle_insights table: ${insightsCount} rows`);
  } else {
    console.log(`❌ cycle_insights error:`, insightsError.message);
  }

  console.log('\n✅ Table verification complete');
}

verifyTables().catch(console.error);
