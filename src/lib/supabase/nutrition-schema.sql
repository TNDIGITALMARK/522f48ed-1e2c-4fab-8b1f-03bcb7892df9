-- ============================================
-- Bloom by Rooted - Nutrition & Food Tracking Schema
-- Purpose: Food lookup, meal tracking, and AI meal planning
-- ============================================

-- Foods table: Store food items with nutritional information
create table if not exists public.foods (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Food information
  name text not null,
  brand text,
  category text, -- breakfast, lunch, dinner, snack, dessert

  -- Nutritional information (per serving)
  calories integer,
  protein numeric(10,2),
  carbs numeric(10,2),
  fat numeric(10,2),
  fiber numeric(10,2),
  sugar numeric(10,2),
  sodium numeric(10,2),

  -- Serving information
  serving_size text, -- "1 cup", "100g", etc.
  serving_unit text, -- "cup", "g", "oz", etc.

  -- Metadata
  is_custom boolean default true, -- user-created vs API-sourced
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.foods
  add constraint fk_foods_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.foods
  add constraint fk_foods_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.foods enable row level security;

-- RLS policies for foods
create policy "anon_select_foods"
  on public.foods for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_foods"
  on public.foods for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_foods"
  on public.foods for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_foods"
  on public.foods for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_foods"
  on public.foods for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- User meals table: Track meals eaten by users
create table if not exists public.user_meals (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  food_id uuid not null,

  -- Meal details
  meal_type text not null, -- breakfast, lunch, dinner, snack, dessert
  date date not null default current_date,

  -- Serving information
  servings numeric(10,2) default 1.0,

  -- Metadata
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.user_meals
  add constraint fk_user_meals_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.user_meals
  add constraint fk_user_meals_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

alter table public.user_meals
  add constraint fk_user_meals_food
    foreign key (food_id)
    references public.foods(id)
    on delete cascade;

-- Enable RLS
alter table public.user_meals enable row level security;

-- RLS policies for user_meals
create policy "anon_select_user_meals"
  on public.user_meals for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_user_meals"
  on public.user_meals for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_user_meals"
  on public.user_meals for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_user_meals"
  on public.user_meals for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_user_meals"
  on public.user_meals for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Grocery items table: Track user's pantry for AI meal suggestions
create table if not exists public.grocery_items (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  item_name text not null,
  category text, -- produce, protein, dairy, grains, etc.
  quantity text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.grocery_items
  add constraint fk_grocery_items_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.grocery_items
  add constraint fk_grocery_items_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.grocery_items enable row level security;

-- RLS policies for grocery_items
create policy "anon_select_grocery_items"
  on public.grocery_items for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_grocery_items"
  on public.grocery_items for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_grocery_items"
  on public.grocery_items for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_grocery_items"
  on public.grocery_items for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_grocery_items"
  on public.grocery_items for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- AI meal suggestions table: Store AI-generated meal ideas
create table if not exists public.ai_meal_suggestions (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  meal_type text not null, -- breakfast, lunch, dinner, snack, dessert

  -- Meal information
  meal_name text not null,
  description text,
  ingredients jsonb, -- Array of ingredients used
  instructions text,

  -- Nutritional estimates
  estimated_calories integer,
  estimated_protein numeric(10,2),
  estimated_carbs numeric(10,2),
  estimated_fat numeric(10,2),

  -- Metadata
  is_balanced boolean default true,
  source text, -- 'ai', 'pinterest', 'google'
  created_at timestamptz default now()
);

-- Foreign key constraints
alter table public.ai_meal_suggestions
  add constraint fk_ai_meal_suggestions_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.ai_meal_suggestions
  add constraint fk_ai_meal_suggestions_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.ai_meal_suggestions enable row level security;

-- RLS policies for ai_meal_suggestions
create policy "anon_select_ai_meal_suggestions"
  on public.ai_meal_suggestions for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_ai_meal_suggestions"
  on public.ai_meal_suggestions for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_ai_meal_suggestions"
  on public.ai_meal_suggestions for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_ai_meal_suggestions"
  on public.ai_meal_suggestions for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_ai_meal_suggestions"
  on public.ai_meal_suggestions for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_foods_tenant_project on public.foods(tenantid, projectid);
create index if not exists idx_foods_category on public.foods(category);
create index if not exists idx_foods_name on public.foods(name);

create index if not exists idx_user_meals_tenant_project on public.user_meals(tenantid, projectid);
create index if not exists idx_user_meals_user_date on public.user_meals(user_id, date);
create index if not exists idx_user_meals_meal_type on public.user_meals(meal_type);

create index if not exists idx_grocery_items_tenant_project on public.grocery_items(tenantid, projectid);
create index if not exists idx_grocery_items_user on public.grocery_items(user_id);

create index if not exists idx_ai_meal_suggestions_tenant_project on public.ai_meal_suggestions(tenantid, projectid);
create index if not exists idx_ai_meal_suggestions_user_type on public.ai_meal_suggestions(user_id, meal_type);

-- Add comments
comment on table public.foods is 'Food items with nutritional information';
comment on table public.user_meals is 'User meal tracking with foods eaten';
comment on table public.grocery_items is 'User pantry items for AI meal planning';
comment on table public.ai_meal_suggestions is 'AI-generated meal ideas based on available groceries';
