const migrationSQL = `
-- ============================================
-- Migration: Create weight tracking and goals tables
-- Purpose: Enable users to log weight and set fitness goals
-- Tables: public.weight_logs, public.user_goals
-- ============================================

-- Weight Logs Table
create table if not exists public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,
  
  -- User tracking
  user_id text not null,
  
  -- Weight data
  weight numeric(6,2) not null,
  unit text not null default 'lbs' check (unit in ('lbs', 'kg')),
  
  -- Notes and context
  notes text,
  
  -- Timestamps
  logged_at timestamptz not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints (required)
alter table public.weight_logs
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.weight_logs
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.weight_logs enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_weight_logs"
  on public.weight_logs for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_weight_logs"
  on public.weight_logs for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_weight_logs"
  on public.weight_logs for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_weight_logs"
  on public.weight_logs for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_weight_logs"
  on public.weight_logs for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes for performance
create index if not exists idx_weight_logs_tenant_project
  on public.weight_logs(tenantid, projectid);
create index if not exists idx_weight_logs_user_id
  on public.weight_logs(user_id);
create index if not exists idx_weight_logs_logged_at
  on public.weight_logs(logged_at desc);

-- Comments
comment on table public.weight_logs is 'User weight tracking with tenant/project isolation';
comment on column public.weight_logs.tenantid is 'FK to tenants.id';
comment on column public.weight_logs.projectid is 'FK to projects.id';

-- User Goals Table
create table if not exists public.user_goals (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,
  
  -- User tracking
  user_id text not null,
  
  -- Goal data
  goal_type text not null check (goal_type in ('cutting', 'bulking', 'maintaining')),
  current_weight numeric(6,2),
  target_weight numeric(6,2),
  weight_unit text not null default 'lbs' check (weight_unit in ('lbs', 'kg')),
  
  -- Additional goal details
  target_date timestamptz,
  weekly_goal numeric(4,2), -- pounds per week change
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  
  -- Status
  is_active boolean default true,
  
  -- Timestamps
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints (required)
alter table public.user_goals
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.user_goals
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.user_goals enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_user_goals"
  on public.user_goals for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_user_goals"
  on public.user_goals for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_user_goals"
  on public.user_goals for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_user_goals"
  on public.user_goals for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_user_goals"
  on public.user_goals for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes for performance
create index if not exists idx_user_goals_tenant_project
  on public.user_goals(tenantid, projectid);
create index if not exists idx_user_goals_user_id
  on public.user_goals(user_id);
create index if not exists idx_user_goals_active
  on public.user_goals(is_active) where is_active = true;

-- Comments
comment on table public.user_goals is 'User fitness goals with tenant/project isolation';
comment on column public.user_goals.tenantid is 'FK to tenants.id';
comment on column public.user_goals.projectid is 'FK to projects.id';
comment on column public.user_goals.goal_type is 'Fitness goal: cutting, bulking, or maintaining';
`;

async function createMigration() {
  console.log('Creating weight tracking migration...\n');
  
  const response = await fetch('http://localhost:3006/api/supabase/migrations/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'create_weight_tracking_system',
      sql: migrationSQL,
      autoApply: true
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Migration successful!');
    console.log('   File:', result.fileName);
    console.log('   Applied:', result.applied);
    if (result.validation) {
      console.log('   Validation passed:', result.validation.passed);
    }
  } else {
    console.error('❌ Migration failed:', result.error);
    if (result.validation && !result.validation.passed) {
      console.error('Validation errors:');
      result.validation.errors.forEach((err: string) => console.error('  -', err));
    }
    if (result.steps) {
      console.error('Failed steps:', result.steps);
    }
  }
}

createMigration();
