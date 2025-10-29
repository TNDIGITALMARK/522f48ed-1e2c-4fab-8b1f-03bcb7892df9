-- ============================================
-- Bloom by Rooted - Wellness Database Schema
-- Purpose: Store user wellness data with multi-tenant isolation
-- ============================================

-- User Profiles Table
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_email text not null,
  full_name text,
  date_of_birth date,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles
  add constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  add constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade;

alter table public.user_profiles enable row level security;

create policy "anon_select_user_profiles" on public.user_profiles for select to anon
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_all_user_profiles" on public.user_profiles for all to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid)
  with check (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

-- Daily Wellness Logs
create table if not exists public.daily_wellness_logs (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  log_date date not null,

  -- Cycle tracking
  cycle_day integer,
  cycle_phase text,

  -- Mood and energy
  mood_rating integer check (mood_rating between 1 and 10),
  energy_level text,

  -- Sleep
  sleep_hours decimal(4,2),
  sleep_quality text,

  -- Daily rituals
  meditation_minutes integer default 0,
  steps_count integer default 0,
  water_glasses integer default 0,

  -- Nutrition
  calories_consumed integer,

  -- Notes
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.daily_wellness_logs
  add constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  add constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade;

alter table public.daily_wellness_logs enable row level security;

create policy "anon_select_daily_wellness" on public.daily_wellness_logs for select to anon
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_all_daily_wellness" on public.daily_wellness_logs for all to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid)
  with check (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

-- Wellness Goals
create table if not exists public.wellness_goals (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  goal_type text not null,
  target_value integer not null,
  current_value integer default 0,

  start_date date not null,
  end_date date,

  completed boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.wellness_goals
  add constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  add constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade;

alter table public.wellness_goals enable row level security;

create policy "anon_select_wellness_goals" on public.wellness_goals for select to anon
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_all_wellness_goals" on public.wellness_goals for all to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid)
  with check (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

-- Indexes for performance
create index if not exists idx_daily_wellness_user_date on public.daily_wellness_logs(user_id, log_date);
create index if not exists idx_wellness_goals_user on public.wellness_goals(user_id);
create index if not exists idx_user_profiles_email on public.user_profiles(user_email);

-- Comments
comment on table public.user_profiles is 'User profile information for wellness tracking';
comment on table public.daily_wellness_logs is 'Daily wellness metrics and tracking data';
comment on table public.wellness_goals is 'User-defined wellness goals and progress';
