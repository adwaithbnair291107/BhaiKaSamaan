create extension if not exists pgcrypto;

create table if not exists public.colleges (
  slug text primary key,
  name text not null,
  city text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  college_slug text not null references public.colleges(slug) on delete cascade,
  title text not null,
  branch text,
  year text,
  category text not null,
  condition text not null,
  price integer not null check (price >= 0),
  location text not null,
  posted_by text not null,
  description text not null,
  image_url text,
  is_sold boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists listings_college_slug_idx on public.listings(college_slug);
create index if not exists listings_created_at_idx on public.listings(created_at desc);

alter table public.colleges enable row level security;
alter table public.listings enable row level security;

drop policy if exists "Public can read colleges" on public.colleges;
create policy "Public can read colleges"
on public.colleges
for select
to anon
using (true);

drop policy if exists "Public can read available listings" on public.listings;
create policy "Public can read available listings"
on public.listings
for select
to anon
using (true);

insert into public.colleges (slug, name, city, description)
values
  ('your-college', 'Your College', 'Your City', 'Start your first campus marketplace here.')
on conflict (slug) do nothing;
