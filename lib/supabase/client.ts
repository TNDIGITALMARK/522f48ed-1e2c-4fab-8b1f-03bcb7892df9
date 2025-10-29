import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IkY3b2lBbmJna0ZPNEtheGZ0ZDZFSTZhRDNXWDIiLCJwcm9qZWN0X2lkIjoiNTIyZjQ4ZWQtMWUyYy00ZmFiLThiMWYtMDNiY2I3ODkyZGY5IiwianRpIjoiODk1MjdhMmMtMWQ5Yi00MjA1LWI3ZjQtMmYwY2Q5ZjUyM2UzIiwiaWF0IjoxNzYxNzcyNDg0LCJleHAiOjE3NjE3NzUxODR9.f2EZLhKbaRxVq0mqJEEKdw7jXf7AiiXdr92MwJh4IYk`
      }
    }
  }
);

// Constants for tenant and project
export const TENANT_ID = 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2';
export const PROJECT_ID = '522f48ed-1e2c-4fab-8b1f-03bcb7892df9';
