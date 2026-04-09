# BhaiKaSamaan MVP

College-first student resale marketplace with Supabase-ready database wiring.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase

## Pages included

- Home page
- College-specific marketplace page
- Listing detail page
- Seller form page

## Run locally

1. Install Node.js LTS from the official Node.js website.
2. Open a terminal in this project folder.
3. Run `npm install`
4. Copy `.env.example` to `.env.local`
5. Add your Supabase URL and anon key
6. Run the SQL in `supabase/schema.sql` inside the Supabase SQL Editor
7. Run `npm run dev`
8. Open `http://localhost:3000`

## What this version does

- Demonstrates the `one platform, many college mini marketplaces` idea
- Reads colleges and listings from Supabase
- Keeps empty-state UI if your database is still empty or env vars are missing

## Recommended next steps

1. Seed your real colleges and first listings in Supabase
2. Add student login
3. Add image upload
4. Add real listing creation
5. Add seller contact flow
