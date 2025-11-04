const sql = `-- ============================================
-- Migration: Create social connection features
-- Purpose: User connections, friend requests, social posts, and interactions
-- Tables: friends, friend_requests, social_posts, post_likes, post_comments
-- ============================================

-- ============================================
-- FRIENDS TABLE (bidirectional friendships)
-- ============================================
create table if not exists public.friends (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  user_id text not null,
  friend_id text not null,
  created_at timestamptz default now(),

  constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade,

  -- Ensure no duplicate friendships
  constraint unique_friendship unique (user_id, friend_id)
);

-- Indexes for performance
create index if not exists idx_friends_tenant_project on public.friends(tenantid, projectid);
create index if not exists idx_friends_user_id on public.friends(user_id);
create index if not exists idx_friends_friend_id on public.friends(friend_id);

-- Enable RLS
alter table public.friends enable row level security;

-- RLS Policies
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

create policy "auth_delete_friends"
  on public.friends for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Comments
comment on table public.friends is 'Bidirectional friend connections between users';
comment on column public.friends.user_id is 'User who initiated or accepted friendship';
comment on column public.friends.friend_id is 'Friend user ID';

-- ============================================
-- FRIEND REQUESTS TABLE
-- ============================================
create table if not exists public.friend_requests (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  sender_id text not null,
  receiver_id text not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade,

  -- Ensure no duplicate requests
  constraint unique_friend_request unique (sender_id, receiver_id, status)
);

-- Indexes
create index if not exists idx_friend_requests_tenant_project on public.friend_requests(tenantid, projectid);
create index if not exists idx_friend_requests_sender on public.friend_requests(sender_id);
create index if not exists idx_friend_requests_receiver on public.friend_requests(receiver_id);
create index if not exists idx_friend_requests_status on public.friend_requests(status);

-- Enable RLS
alter table public.friend_requests enable row level security;

-- RLS Policies
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
  );

-- Comments
comment on table public.friend_requests is 'Friend requests sent between users';
comment on column public.friend_requests.sender_id is 'User who sent the friend request';
comment on column public.friend_requests.receiver_id is 'User who received the friend request';
comment on column public.friend_requests.status is 'Request status: pending, accepted, rejected';

-- ============================================
-- SOCIAL POSTS TABLE
-- ============================================
create table if not exists public.social_posts (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  author_id text not null,
  content text,
  image_url text,
  post_type text default 'text' check (post_type in ('text', 'photo', 'canvas_journal')),
  canvas_data jsonb,
  visibility text default 'friends' check (visibility in ('public', 'friends', 'private')),
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade
);

-- Indexes
create index if not exists idx_social_posts_tenant_project on public.social_posts(tenantid, projectid);
create index if not exists idx_social_posts_author on public.social_posts(author_id);
create index if not exists idx_social_posts_created on public.social_posts(created_at desc);
create index if not exists idx_social_posts_type on public.social_posts(post_type);

-- Enable RLS
alter table public.social_posts enable row level security;

-- RLS Policies
create policy "anon_select_posts"
  on public.social_posts for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_posts"
  on public.social_posts for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_posts"
  on public.social_posts for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_posts"
  on public.social_posts for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_posts"
  on public.social_posts for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Comments
comment on table public.social_posts is 'Social posts shared by users (text, photos, canvas journals)';
comment on column public.social_posts.author_id is 'User who created the post';
comment on column public.social_posts.post_type is 'Type: text, photo, or canvas_journal';
comment on column public.social_posts.canvas_data is 'JSON data for canvas journal posts';
comment on column public.social_posts.visibility is 'Who can see the post: public, friends, private';

-- ============================================
-- POST LIKES TABLE
-- ============================================
create table if not exists public.post_likes (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  post_id uuid not null,
  user_id text not null,
  created_at timestamptz default now(),

  constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade,
  constraint fk_post foreign key (post_id) references public.social_posts(id) on delete cascade,

  constraint unique_post_like unique (post_id, user_id)
);

-- Indexes
create index if not exists idx_post_likes_tenant_project on public.post_likes(tenantid, projectid);
create index if not exists idx_post_likes_post on public.post_likes(post_id);
create index if not exists idx_post_likes_user on public.post_likes(user_id);

-- Enable RLS
alter table public.post_likes enable row level security;

-- RLS Policies
create policy "anon_select_likes"
  on public.post_likes for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_likes"
  on public.post_likes for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_likes"
  on public.post_likes for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_likes"
  on public.post_likes for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Comments
comment on table public.post_likes is 'User likes on social posts';

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
create table if not exists public.post_comments (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  post_id uuid not null,
  author_id text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint fk_tenant foreign key (tenantid) references public.tenants(id) on delete cascade,
  constraint fk_project foreign key (projectid) references public.projects(id) on delete cascade,
  constraint fk_post foreign key (post_id) references public.social_posts(id) on delete cascade
);

-- Indexes
create index if not exists idx_post_comments_tenant_project on public.post_comments(tenantid, projectid);
create index if not exists idx_post_comments_post on public.post_comments(post_id);
create index if not exists idx_post_comments_author on public.post_comments(author_id);
create index if not exists idx_post_comments_created on public.post_comments(created_at desc);

-- Enable RLS
alter table public.post_comments enable row level security;

-- RLS Policies
create policy "anon_select_comments"
  on public.post_comments for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_comments"
  on public.post_comments for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_comments"
  on public.post_comments for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_comments"
  on public.post_comments for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_comments"
  on public.post_comments for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Comments
comment on table public.post_comments is 'Comments on social posts';
comment on column public.post_comments.post_id is 'Post being commented on';
comment on column public.post_comments.author_id is 'User who wrote the comment';
`;

async function main() {
  const response = await fetch('http://localhost:3006/api/supabase/migrations/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'create_social_connection_features',
      sql: sql,
      autoApply: true
    })
  });

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
