-- Profiles table for mandatory gamer handle claim
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  gamer_handle text unique not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;

alter table public.profiles enable row level security;

create policy if not exists "profiles are publicly readable"
on public.profiles
for select
to anon, authenticated
using (true);

create policy if not exists "users can upsert own profile"
on public.profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('public_avatars', 'public_avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('secure_vault_ids', 'secure_vault_ids', false)
on conflict (id) do nothing;

-- secure_vault_ids bucket policies (bucket must be private)
create policy if not exists "secure vault insert own folder"
on storage.objects
for insert
to authenticated
with check (
  (auth.role() = 'authenticated')
  and (bucket_id = 'secure_vault_ids')
  and (name ~ (auth.uid()::text || '/.*'))
);

create policy if not exists "secure vault read own folder"
on storage.objects
for select
to authenticated
using (
  (auth.role() = 'authenticated')
  and (bucket_id = 'secure_vault_ids')
  and (name ~ (auth.uid()::text || '/.*'))
);

create policy if not exists "secure vault update own folder"
on storage.objects
for update
to authenticated
using (
  (auth.role() = 'authenticated')
  and (bucket_id = 'secure_vault_ids')
  and (name ~ (auth.uid()::text || '/.*'))
)
with check (
  (auth.role() = 'authenticated')
  and (bucket_id = 'secure_vault_ids')
  and (name ~ (auth.uid()::text || '/.*'))
);

create policy if not exists "secure vault delete own folder"
on storage.objects
for delete
to authenticated
using (
  (auth.role() = 'authenticated')
  and (bucket_id = 'secure_vault_ids')
  and (name ~ (auth.uid()::text || '/.*'))
);
