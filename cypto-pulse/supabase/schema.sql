create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  coin_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, coin_id)
);

alter table public.user_favorites enable row level security;

create policy "user_favorites_select_own"
on public.user_favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "user_favorites_insert_own"
on public.user_favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_favorites_delete_own"
on public.user_favorites
for delete
to authenticated
using (auth.uid() = user_id);
