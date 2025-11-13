# Symptom Tracking & Item Scanning Feature

## Overview

This feature allows users to log their symptoms and track items (food, products, medications) that may be related to those symptoms. The UI includes a bold black outline styling for emphasis on the scanned items section.

## Features Implemented

### 1. **Symptom Logging**
- Select multiple symptoms from categorized options
- Categories: Mood, Symptoms, Energy, Sex, Beauty
- Search functionality to quickly find symptoms
- Visual feedback with color-coded categories

### 2. **Item Scanning**
- Add items manually with name, type, and brand
- Items are displayed with bold black outline borders
- Items can be linked to symptom logs for correlation analysis
- Easy removal of items before saving

### 3. **Additional Notes**
- Optional text area for additional context
- Helps provide more detail about symptoms or items

### 4. **Data Persistence**
- Symptom logs saved to `symptom_logs` table
- Scanned items saved to `scanned_items` table
- Items are linked to symptom logs via `symptom_log_id` foreign key

## Database Schema

### Required Tables

The feature requires two database tables. A migration file has been created at:
```
/app/temp/522f48ed-1e2c-4fab-8b1f-03bcb7892df9/supabase/migrations/20251113000529_create_symptom_logs_and_scanned_items.sql
```

However, due to migration history conflicts, the tables need to be created manually. Here's what needs to be done:

#### Option 1: Manual Table Creation (Recommended)

Run the following SQL directly in your Supabase SQL editor:

```sql
-- Create symptom_logs table
create table if not exists public.symptom_logs (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,
  symptom_ids text[] not null,
  mood text,
  energy_level integer,
  notes text,
  severity integer,
  logged_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add FK constraints
alter table public.symptom_logs
  add constraint fk_symptom_logs_tenant
    foreign key (tenantid) references public.tenants(id) on delete cascade,
  add constraint fk_symptom_logs_project
    foreign key (projectid) references public.projects(id) on delete cascade;

-- Enable RLS
alter table public.symptom_logs enable row level security;

-- RLS policies
create policy "anon_select_symptom_logs" on public.symptom_logs
  for select to anon
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_select_symptom_logs" on public.symptom_logs
  for select to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_insert_symptom_logs" on public.symptom_logs
  for insert to authenticated
  with check (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_update_symptom_logs" on public.symptom_logs
  for update to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_delete_symptom_logs" on public.symptom_logs
  for delete to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

-- Create scanned_items table
create table if not exists public.scanned_items (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,
  item_name text not null,
  item_type text,
  barcode text,
  brand text,
  ingredients text[],
  allergens text[],
  notes text,
  image_url text,
  symptom_log_id uuid,
  scanned_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add FK constraints
alter table public.scanned_items
  add constraint fk_scanned_items_tenant
    foreign key (tenantid) references public.tenants(id) on delete cascade,
  add constraint fk_scanned_items_project
    foreign key (projectid) references public.projects(id) on delete cascade,
  add constraint fk_scanned_items_symptom_log
    foreign key (symptom_log_id) references public.symptom_logs(id) on delete set null;

-- Enable RLS
alter table public.scanned_items enable row level security;

-- RLS policies
create policy "anon_select_scanned_items" on public.scanned_items
  for select to anon
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_select_scanned_items" on public.scanned_items
  for select to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_insert_scanned_items" on public.scanned_items
  for insert to authenticated
  with check (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_update_scanned_items" on public.scanned_items
  for update to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

create policy "auth_delete_scanned_items" on public.scanned_items
  for delete to authenticated
  using (tenantid = (auth.jwt() ->> 'tenant_id')::text and projectid = (auth.jwt() ->> 'project_id')::uuid);

-- Create indexes
create index idx_symptom_logs_tenant_project on public.symptom_logs(tenantid, projectid);
create index idx_symptom_logs_logged_at on public.symptom_logs(logged_at desc);
create index idx_scanned_items_tenant_project on public.scanned_items(tenantid, projectid);
create index idx_scanned_items_scanned_at on public.scanned_items(scanned_at desc);
create index idx_scanned_items_symptom_log on public.scanned_items(symptom_log_id) where symptom_log_id is not null;
```

#### Option 2: Repair Migration History

If you prefer to use the migration system:

```bash
supabase migration repair --status reverted 20251028231227 20251029001456 20251029001457 20251029001458
supabase db pull
supabase db push
```

## File Structure

```
src/
├── app/
│   └── log-symptom/
│       └── page.tsx                    # Main symptom logging UI
├── lib/
│   └── supabase/
│       └── symptom-queries.ts          # Database query functions
└── components/
    └── ui/
        ├── card.tsx                     # Used throughout
        ├── button.tsx                   # Action buttons
        ├── input.tsx                    # Form inputs
        └── textarea.tsx                 # Notes field
```

## Design System

### Black Outline Styling

The scanned items section features prominent black outlines:

- **Section Card**: `border-2 border-black`
- **Icon Container**: `border-2 border-black bg-foreground`
- **Add Item Button**: `border-2 border-black`
- **Item Input Fields**: `border-2 border-black`
- **Item Cards**: `border-2 border-black bg-background`
- **Save Button**: `border-2 border-black`

This creates a bold, emphasized visual hierarchy that draws attention to the item scanning feature.

## Usage

1. **Navigate** to `/log-symptom` from the dashboard
2. **Select symptoms** from the categorized sections
3. **Add items** using the "Add Item" button in the Scanned Items section
4. **Enter details** for each item (name, type, brand)
5. **Add notes** (optional) for additional context
6. **Save** the log to store in the database

## Future Enhancements

- Barcode scanning via camera
- Image upload for items
- Allergen database integration
- Ingredient analysis
- Symptom correlation analytics
- Historical trend visualization
- Export logs to CSV/PDF

## Testing

Once the database tables are created, you can test the feature:

1. Navigate to `/log-symptom`
2. Add some symptoms
3. Add a few items
4. Save the log
5. Check the database to confirm data was saved correctly

## Notes

- The UI is fully functional and ready to use
- Database tables need to be created (see Database Schema section)
- All queries are tenant/project isolated for multi-tenancy
- Toast notifications provide user feedback
- Form resets after successful save
