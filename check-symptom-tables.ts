import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiYTQyNTU0ZTktMzYxNC00MzkyLWIzZGEtMDRjMTBkNDZhNzQwIiwiaWF0IjoxNzYyOTkxOTc1LCJleHAiOjE3NjI5OTQ2NzV9.OZRZaytPtyG6IpYhfdYQgq59GM7-kLQWjMWB4o-C0wI`
      }
    }
  }
);

async function checkTables() {
  console.log('Checking if symptom_logs table exists...');
  
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('symptom_logs table does not exist. Error:', error.message);
  } else {
    console.log('symptom_logs table exists!');
  }
  
  const { data: data2, error: error2 } = await supabase
    .from('scanned_items')
    .select('*')
    .limit(1);
  
  if (error2) {
    console.log('scanned_items table does not exist. Error:', error2.message);
  } else {
    console.log('scanned_items table exists!');
  }
}

checkTables();
