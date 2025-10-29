-- ============================================
-- Bloom by Rooted - Social & Garden System Schema
-- Purpose: Friend system, garden building, gifts, and garden visits
-- ============================================

-- Friend requests table
create table if not exists public.friend_requests (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  requester_id uuid not null, -- User who sent the request
  recipient_id uuid not null, -- User who received the request

  status text not null default 'pending', -- pending, accepted, declined

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.friend_requests
  add constraint fk_friend_requests_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.friend_requests
  add constraint fk_friend_requests_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.friend_requests enable row level security;

-- RLS policies
create policy "anon_select_friend_requests"
  on public.friend_requests for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_friend_requests"
  on public.friend_requests for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_friend_requests"
  on public.friend_requests for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_friend_requests"
  on public.friend_requests for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_friend_requests"
  on public.friend_requests for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Friends table (accepted friendships)
create table if not exists public.friends (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null,
  friend_id uuid not null,

  created_at timestamptz default now()
);

-- Foreign key constraints
alter table public.friends
  add constraint fk_friends_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.friends
  add constraint fk_friends_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.friends enable row level security;

-- RLS policies
create policy "anon_select_friends"
  on public.friends for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_friends"
  on public.friends for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_friends"
  on public.friends for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_friends"
  on public.friends for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_friends"
  on public.friends for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Gardens table: User's personal garden
create table if not exists public.gardens (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id uuid not null unique, -- One garden per user
  garden_name text not null default 'My Garden',

  -- Garden stats
  level integer default 1,
  xp integer default 0,
  coins integer default 0,

  -- Garden size (grid dimensions)
  grid_width integer default 10,
  grid_height integer default 10,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.gardens
  add constraint fk_gardens_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.gardens
  add constraint fk_gardens_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.gardens enable row level security;

-- RLS policies
create policy "anon_select_gardens"
  on public.gardens for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_gardens"
  on public.gardens for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_gardens"
  on public.gardens for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_gardens"
  on public.gardens for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_gardens"
  on public.gardens for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Garden items table: Buildings, plants, decorations in the garden
create table if not exists public.garden_items (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  garden_id uuid not null,

  -- Item details
  item_type text not null, -- plant, building, decoration
  item_name text not null, -- "Rose Bush", "Greenhouse", "Fence", etc.

  -- Position in grid
  grid_x integer not null,
  grid_y integer not null,
  width integer default 1, -- How many grid cells wide
  height integer default 1, -- How many grid cells tall

  -- Growth/state
  growth_stage integer default 0, -- For plants: 0-4 (seed to fully grown)
  is_harvested boolean default false,

  -- Metadata
  placed_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.garden_items
  add constraint fk_garden_items_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.garden_items
  add constraint fk_garden_items_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

alter table public.garden_items
  add constraint fk_garden_items_garden
    foreign key (garden_id)
    references public.gardens(id)
    on delete cascade;

-- Enable RLS
alter table public.garden_items enable row level security;

-- RLS policies
create policy "anon_select_garden_items"
  on public.garden_items for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_garden_items"
  on public.garden_items for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_garden_items"
  on public.garden_items for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_garden_items"
  on public.garden_items for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_garden_items"
  on public.garden_items for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Gifts table: Gifts sent between friends
create table if not exists public.gifts (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  sender_id uuid not null,
  recipient_id uuid not null,

  -- Gift details
  gift_type text not null, -- seeds, coins, decoration, boost
  gift_name text not null,
  gift_value integer not null, -- Coins value or item ID
  message text,

  -- Status
  is_claimed boolean default false,

  created_at timestamptz default now(),
  claimed_at timestamptz
);

-- Foreign key constraints
alter table public.gifts
  add constraint fk_gifts_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.gifts
  add constraint fk_gifts_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.gifts enable row level security;

-- RLS policies
create policy "anon_select_gifts"
  on public.gifts for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_gifts"
  on public.gifts for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_gifts"
  on public.gifts for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_gifts"
  on public.gifts for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_gifts"
  on public.gifts for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Garden visits table: Track when friends visit each other's gardens
create table if not exists public.garden_visits (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  visitor_id uuid not null, -- Friend who visited
  garden_id uuid not null, -- Garden that was visited

  visited_at timestamptz default now()
);

-- Foreign key constraints
alter table public.garden_visits
  add constraint fk_garden_visits_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.garden_visits
  add constraint fk_garden_visits_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

alter table public.garden_visits
  add constraint fk_garden_visits_garden
    foreign key (garden_id)
    references public.gardens(id)
    on delete cascade;

-- Enable RLS
alter table public.garden_visits enable row level security;

-- RLS policies
create policy "anon_select_garden_visits"
  on public.garden_visits for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_garden_visits"
  on public.garden_visits for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_garden_visits"
  on public.garden_visits for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_garden_visits"
  on public.garden_visits for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_garden_visits"
  on public.garden_visits for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_friend_requests_tenant_project on public.friend_requests(tenantid, projectid);
create index if not exists idx_friend_requests_recipient on public.friend_requests(recipient_id, status);
create index if not exists idx_friend_requests_requester on public.friend_requests(requester_id, status);

create index if not exists idx_friends_tenant_project on public.friends(tenantid, projectid);
create index if not exists idx_friends_user on public.friends(user_id);
create index if not exists idx_friends_friend on public.friends(friend_id);

create index if not exists idx_gardens_tenant_project on public.gardens(tenantid, projectid);
create index if not exists idx_gardens_user on public.gardens(user_id);

create index if not exists idx_garden_items_tenant_project on public.garden_items(tenantid, projectid);
create index if not exists idx_garden_items_garden on public.garden_items(garden_id);
create index if not exists idx_garden_items_position on public.garden_items(garden_id, grid_x, grid_y);

create index if not exists idx_gifts_tenant_project on public.gifts(tenantid, projectid);
create index if not exists idx_gifts_recipient on public.gifts(recipient_id, is_claimed);
create index if not exists idx_gifts_sender on public.gifts(sender_id);

create index if not exists idx_garden_visits_tenant_project on public.garden_visits(tenantid, projectid);
create index if not exists idx_garden_visits_garden on public.garden_visits(garden_id);

-- Add comments
comment on table public.friend_requests is 'Friend connection requests between users';
comment on table public.friends is 'Accepted friendships';
comment on table public.gardens is 'User personal gardens (Clash of Clans/Hay Day style)';
comment on table public.garden_items is 'Items placed in gardens (plants, buildings, decorations)';
comment on table public.gifts is 'Gifts sent between friends';
comment on table public.garden_visits is 'Track friend garden visits';
