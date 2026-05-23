-- =====================================================
-- Enums
-- =====================================================
create type public.app_role as enum ('staff', 'partner');

create type public.referral_status as enum (
  'New',
  'In Review',
  'Awaiting Documents',
  'Navigator Assigned',
  'Relief Delivered',
  'Closed'
);

create type public.referral_urgency as enum ('Routine', 'Priority', 'Urgent');

-- =====================================================
-- Profiles
-- =====================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization text,
  title text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by the owner"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- =====================================================
-- User roles
-- =====================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer to avoid recursive RLS
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Staff can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'staff'));

-- =====================================================
-- Referrals
-- =====================================================
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete restrict,
  household text not null,
  primary_barrier text not null,
  zip text,
  urgency public.referral_urgency not null default 'Routine',
  status public.referral_status not null default 'New',
  navigator text,
  submitter_name text,
  submitter_org text,
  notes_intake text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.referrals enable row level security;

create policy "Partners can view their own referrals"
  on public.referrals for select
  to authenticated
  using (auth.uid() = created_by);

create policy "Staff can view all referrals"
  on public.referrals for select
  to authenticated
  using (public.has_role(auth.uid(), 'staff'));

create policy "Authenticated users can create referrals"
  on public.referrals for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Staff can update any referral"
  on public.referrals for update
  to authenticated
  using (public.has_role(auth.uid(), 'staff'));

create policy "Partners can update their own referrals"
  on public.referrals for update
  to authenticated
  using (auth.uid() = created_by);

create index referrals_created_by_idx on public.referrals(created_by);
create index referrals_status_idx on public.referrals(status);
create index referrals_updated_at_idx on public.referrals(updated_at desc);

-- =====================================================
-- Referral notes
-- =====================================================
create table public.referral_notes (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.referral_notes enable row level security;

create policy "View notes for accessible referrals"
  on public.referral_notes for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'staff')
    or exists (
      select 1 from public.referrals r
      where r.id = referral_notes.referral_id and r.created_by = auth.uid()
    )
  );

create policy "Add notes to accessible referrals"
  on public.referral_notes for insert
  to authenticated
  with check (
    auth.uid() = author_id and (
      public.has_role(auth.uid(), 'staff')
      or exists (
        select 1 from public.referrals r
        where r.id = referral_notes.referral_id and r.created_by = auth.uid()
      )
    )
  );

create index referral_notes_referral_id_idx on public.referral_notes(referral_id, created_at desc);

-- =====================================================
-- Auto-create profile + partner role on signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, organization)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'organization', '')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'partner')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- updated_at triggers
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger referrals_set_updated_at
  before update on public.referrals
  for each row execute function public.set_updated_at();