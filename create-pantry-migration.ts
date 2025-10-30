async function createMigration() {
  const createPantrySql = `
-- ============================================
-- Migration: Create pantry_items table
-- Purpose: Store user's pantry items for meal planning and AI suggestions
-- ============================================

-- Create pantry_items table with required columns
create table if not exists public.pantry_items (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Application columns
  name text not null,
  category text default 'Other',
  quantity text,
  unit text,
  notes text,
  added_date timestamptz default now(),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints (required)
alter table public.pantry_items
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.pantry_items
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.pantry_items enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_pantry_items"
  on public.pantry_items for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_pantry_items"
  on public.pantry_items for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_pantry_items"
  on public.pantry_items for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_pantry_items"
  on public.pantry_items for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_pantry_items"
  on public.pantry_items for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_pantry_items_tenant_project
  on public.pantry_items(tenantid, projectid);
create index if not exists idx_pantry_items_category
  on public.pantry_items(category);
create index if not exists idx_pantry_items_added_date
  on public.pantry_items(added_date desc);

-- Add helpful comments
comment on table public.pantry_items is 'User pantry items for meal planning with tenant/project isolation';
comment on column public.pantry_items.tenantid is 'FK to tenants.id';
comment on column public.pantry_items.projectid is 'FK to projects.id';
comment on column public.pantry_items.name is 'Item name (e.g., "Bananas", "Chicken Breast")';
comment on column public.pantry_items.category is 'Item category (e.g., "Produce", "Protein", "Dairy", "Grains")';
comment on column public.pantry_items.quantity is 'Quantity description (e.g., "6", "2 lbs")';
comment on column public.pantry_items.unit is 'Unit of measurement (e.g., "pieces", "lbs", "oz")';
`;

  const response = await fetch('http://localhost:3006/api/supabase/migrations/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'create_pantry_items_table',
      sql: createPantrySql,
      autoApply: true
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Migration successful!');
    console.log('   File:', result.fileName);
    console.log('   Applied:', result.applied);
    console.log('   Validation passed:', result.validation?.passed);
  } else {
    console.error('❌ Migration failed:', result.error);
    if (result.validation && !result.validation.passed) {
      console.error('Validation errors:');
      result.validation.errors?.forEach((err: string) => console.error('  -', err));
    }
  }
}

createMigration();
