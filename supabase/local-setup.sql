-- 1. Refresh Profiles Table with new fields
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  gamer_handle text unique not null,
  full_name text,
  age int,
  gender text,
  dob date,
  phone_number text,
  bio text,
  avatar_url text,
  verification_level int default 1,
  is_verified boolean default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists age int;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists dob date;
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists verification_level int default 1;
alter table public.profiles add column if not exists is_verified boolean default false;

-- 2. Enable Security
alter table public.profiles enable row level security;

-- 3. Profiles Policies
create policy if not exists "Public profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy if not exists "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy if not exists "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- 4. Storage Policies for Private Vault (secure_vault_ids)
-- Make sure you create bucket secure_vault_ids in Supabase dashboard as private.
insert into storage.buckets (id, name, public)
values ('secure_vault_ids', 'secure_vault_ids', false)
on conflict (id) do nothing;

drop policy if exists "secure vault access own folder" on storage.objects;

create policy "secure vault access own folder"
on storage.objects for all
to authenticated
using (
  bucket_id = 'secure_vault_ids'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'secure_vault_ids'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Optional public avatar bucket (for navbar avatar and profile picture)
insert into storage.buckets (id, name, public)
values ('public_avatars', 'public_avatars', true)
on conflict (id) do nothing;
