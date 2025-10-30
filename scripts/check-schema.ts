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

async function checkSchema() {
  // Try to insert a test record to see what columns exist
  const testData = {
    tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
    projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
    user_id: 'test-user',
    weight: 150,
    unit: 'lbs',
    logged_at: new Date().toISOString()
  };

  console.log('=== WEIGHT LOGS TABLE STRUCTURE ===\n');
  console.log('Attempting test insert to discover schema...');
  
  const { data, error } = await supabase
    .from('weight_logs')
    .insert(testData)
    .select();

  if (error) {
    console.log('\nError:', error.message);
    console.log('Details:', error.details);
    console.log('Hint:', error.hint);
  } else {
    console.log('\n✅ Test insert successful!');
    console.log('Returned data:', JSON.stringify(data, null, 2));
    
    // Clean up test data
    if (data && data[0]) {
      await supabase.from('weight_logs').delete().eq('id', data[0].id);
      console.log('\n✅ Test data cleaned up');
    }
  }

  console.log('\n=== USER GOALS TABLE STRUCTURE ===\n');
  
  const goalTestData = {
    tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
    projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
    user_id: 'test-user',
    goal_type: 'cutting',
    target_weight: 140,
    current_weight: 150
  };

  const { data: goalData, error: goalError } = await supabase
    .from('user_goals')
    .insert(goalTestData)
    .select();

  if (goalError) {
    console.log('Error:', goalError.message);
    console.log('Details:', goalError.details);
  } else {
    console.log('✅ Test insert successful!');
    console.log('Returned data:', JSON.stringify(goalData, null, 2));
    
    // Clean up
    if (goalData && goalData[0]) {
      await supabase.from('user_goals').delete().eq('id', goalData[0].id);
      console.log('\n✅ Test data cleaned up');
    }
  }
}

checkSchema();
