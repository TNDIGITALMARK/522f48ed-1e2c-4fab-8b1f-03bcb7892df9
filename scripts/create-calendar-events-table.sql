-- ============================================
-- Manual Script: Create calendar_events table
-- Purpose: Store user calendar events with color-coded categories
-- Run this in Supabase SQL Editor if migration fails
-- ============================================

-- Create calendar_events table with required multi-tenant columns
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenantid TEXT NOT NULL,
  projectid UUID NOT NULL,

  -- Event details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('school', 'work', 'personal')),
  color TEXT NOT NULL, -- Hex color code for visual coordination

  -- Date and time
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints (required)
ALTER TABLE public.calendar_events
  ADD CONSTRAINT fk_tenant
    FOREIGN KEY (tenantid)
    REFERENCES public.tenants(id)
    ON DELETE CASCADE;

ALTER TABLE public.calendar_events
  ADD CONSTRAINT fk_project
    FOREIGN KEY (projectid)
    REFERENCES public.projects(id)
    ON DELETE CASCADE;

-- Enable RLS (required)
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (required - separate per operation)
CREATE POLICY "anon_select_calendar_events"
  ON public.calendar_events FOR SELECT TO anon
  USING (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );

CREATE POLICY "auth_select_calendar_events"
  ON public.calendar_events FOR SELECT TO authenticated
  USING (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );

CREATE POLICY "auth_insert_calendar_events"
  ON public.calendar_events FOR INSERT TO authenticated
  WITH CHECK (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );

CREATE POLICY "auth_update_calendar_events"
  ON public.calendar_events FOR UPDATE TO authenticated
  USING (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  WITH CHECK (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );

CREATE POLICY "auth_delete_calendar_events"
  ON public.calendar_events FOR DELETE TO authenticated
  USING (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_tenant_project
  ON public.calendar_events(tenantid, projectid);
CREATE INDEX IF NOT EXISTS idx_calendar_events_category
  ON public.calendar_events(category);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date
  ON public.calendar_events(start_date);

-- Add helpful comments
COMMENT ON TABLE public.calendar_events IS 'User calendar events with color-coded categories';
COMMENT ON COLUMN public.calendar_events.tenantid IS 'FK to tenants.id';
COMMENT ON COLUMN public.calendar_events.projectid IS 'FK to projects.id';
COMMENT ON COLUMN public.calendar_events.category IS 'Event category: school, work, or personal';
COMMENT ON COLUMN public.calendar_events.color IS 'Hex color code for visual coordination';
