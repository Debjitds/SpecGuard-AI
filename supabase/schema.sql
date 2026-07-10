-- ============================================================================
-- SpecGuard AI — Supabase schema
-- ----------------------------------------------------------------------------
-- Creates the single denormalised `projects` table that backs the full
-- workspace (PRD content, analysis results, review items, versions, exports).
-- Row Level Security keeps every project scoped to its owner.
--
-- Run via:  Supabase Studio → SQL Editor → paste → Run
--           or:  supabase db push
-- ============================================================================

-- Optional: enable UUID generation if not already available.
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id              text primary key,
  owner_id        uuid not null references auth.users (id) on delete cascade,
  name            text not null default 'Untitled project',
  description     text,
  demo_key        text,
  prd_content     text not null default '',
  prd_file_name   text,
  current_version text not null default 'v1.0',
  -- analysis + timeline are JSONB so the workspace evolves without migrations.
  analysis        jsonb,
  versions        jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Helpful indexes for the dashboard queries.
create index if not exists projects_owner_id_idx
  on public.projects (owner_id);

create index if not exists projects_updated_at_idx
  on public.projects (owner_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security — a user can only see & mutate their own projects.
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Owners can view their projects" on public.projects;
create policy "Owners can view their projects"
  on public.projects for select
  using (auth.uid() = owner_id);

drop policy if exists "Owners can insert their projects" on public.projects;
create policy "Owners can insert their projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their projects" on public.projects;
create policy "Owners can update their projects"
  on public.projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete their projects" on public.projects;
create policy "Owners can delete their projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();
