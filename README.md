# TÆLOS

A personal task manager built with Next.js and Supabase.

Production: [www.taelos.xyz](https://www.taelos.xyz/)

## Local setup

1. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key.
2. Run `npm install`.
3. Run `npm run dev`.

## Deploy to Vercel

1. Push this repository to GitHub and import it in Vercel.
2. Add these environment variables in Vercel for Production, Preview, and Development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. In Supabase Authentication URL Configuration, add your Vercel production URL and preview URL pattern to the allowed redirect URLs.
4. Apply the SQL migration in `supabase/migrations` to your Supabase project if it has not already been applied.

Vercel automatically uses `npm run build`; no `vercel.json` is required.
