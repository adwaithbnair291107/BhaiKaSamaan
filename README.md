# BhaiKaSamaan MVP

College-based student resale marketplace powered by Next.js and Supabase.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase (database via REST API from server components/actions)

## Pages included

- Home page
- College-specific marketplace page
- Listing detail page
- Seller form page

## Run locally

1. Install Node.js LTS from the official Node.js website.
2. Open a terminal in this project folder.
3. Copy `.env.example` to `.env.local`
4. Add your Supabase project URL, anon key, and service role key
5. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor
6. Run `npm install`
7. Run `npm run dev`
8. Open `http://localhost:3000`

## What this version does

- Reads colleges and listings from Supabase
- Lets students create new listings from the seller form
- Keeps all database access on the server side

## Recommended next steps

1. Add seed college data in Supabase
2. Add student login
3. Connect image upload to Supabase Storage
4. Add moderation / approval flow
5. Add WhatsApp or chat contact flow
