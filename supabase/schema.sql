create extension if not exists pgcrypto;

create table if not exists public.colleges (
  slug text primary key,
  name text not null,
  city text not null,
  description text
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  college_slug text not null references public.colleges(slug) on delete cascade,
  title text not null,
  branch text,
  year text,
  category text not null,
  condition text not null default 'Good',
  price numeric(10, 2) not null check (price > 0),
  location text default 'Campus pickup',
  posted_by text not null,
  description text not null,
  image text,
  created_at timestamptz not null default now()
);

create index if not exists listings_college_slug_idx on public.listings (college_slug);
create index if not exists listings_created_at_idx on public.listings (created_at desc);
