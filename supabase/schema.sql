create extension if not exists pgcrypto;

create table if not exists public.colleges (
  slug text primary key,
  name text not null,
  city text not null,
  description text
);

create table if not exists public.seller_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_verified boolean not null default false,
  verification_label text not null default 'User Verified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'active',
  college_slug text not null references public.colleges(slug) on delete cascade,
  title text not null,
  branch text,
  year text,
  category text not null,
  condition text not null default 'Good',
  price numeric(10, 2),
  min_price numeric(10, 2),
  expected_price numeric(10, 2),
  location text default 'Campus pickup',
  posted_by text not null,
  description text not null,
  image text,
  sold_at timestamptz,
  sold_delete_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.listings add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.listings add column if not exists status text not null default 'active';
alter table public.listings add column if not exists min_price numeric(10, 2);
alter table public.listings add column if not exists expected_price numeric(10, 2);
alter table public.listings add column if not exists price numeric(10, 2);
alter table public.listings add column if not exists sold_at timestamptz;
alter table public.listings add column if not exists sold_delete_at timestamptz;

update public.listings
set
  min_price = coalesce(min_price, price),
  expected_price = coalesce(expected_price, price)
where min_price is null or expected_price is null;

alter table public.listings alter column min_price set not null;
alter table public.listings alter column expected_price set not null;

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_user_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  buyer_contact text,
  amount numeric(10, 2) not null check (amount > 0),
  message text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.offers add column if not exists buyer_user_id uuid references auth.users(id) on delete set null;

create table if not exists public.offer_messages (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_role text not null check (sender_role in ('buyer', 'seller', 'system')),
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.offer_messages add column if not exists listing_id uuid references public.listings(id) on delete cascade;

create table if not exists public.seller_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null,
  comment text not null,
  created_at timestamptz not null default now(),
  unique (listing_id, reviewer_user_id)
);

create table if not exists public.book_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_college text not null,
  book_title text not null,
  contact_info text,
  description text not null,
  image text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'listings_min_price_positive'
  ) then
    alter table public.listings add constraint listings_min_price_positive check (min_price > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'listings_expected_price_positive'
  ) then
    alter table public.listings add constraint listings_expected_price_positive check (expected_price > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'listings_expected_gte_min'
  ) then
    alter table public.listings add constraint listings_expected_gte_min check (expected_price >= min_price);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'listings_status_valid'
  ) then
    alter table public.listings add constraint listings_status_valid check (status in ('active', 'sold'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'offers_status_valid'
  ) then
    alter table public.offers add constraint offers_status_valid check (status in ('open', 'closed', 'confirmed'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'seller_reviews_rating_range'
  ) then
    alter table public.seller_reviews add constraint seller_reviews_rating_range check (rating between 1 and 5);
  end if;
end $$;

create index if not exists listings_college_slug_idx on public.listings (college_slug);
create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists offers_listing_id_idx on public.offers (listing_id);
create index if not exists offers_buyer_user_id_idx on public.offers (buyer_user_id);
create index if not exists offer_messages_offer_id_idx on public.offer_messages (offer_id);
create index if not exists seller_reviews_listing_id_idx on public.seller_reviews (listing_id);
create index if not exists seller_reviews_seller_user_id_idx on public.seller_reviews (seller_user_id);
create index if not exists book_requests_created_at_idx on public.book_requests (created_at desc);
