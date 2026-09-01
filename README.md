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

## Google and GitHub sign-in

The app uses Supabase Auth's PKCE flow. Both providers must be enabled in the
linked Supabase project before their buttons will work.

The provider callback URL is:

```text
https://kesvvxhujcxdiooyijnu.supabase.co/auth/v1/callback
```

1. In Google Auth Platform, create a **Web application** OAuth client. Add
   `https://www.taelos.xyz` as an authorized JavaScript origin and the provider
   callback URL above as an authorized redirect URI. In Data Access, enable the
   `openid`, email, and profile scopes.
2. In GitHub Developer Settings, create an **OAuth App** with
   `https://www.taelos.xyz` as its homepage and the provider callback URL above
   as its authorization callback URL.
3. In Supabase Dashboard → Authentication → Providers, enable Google and
   GitHub and save each provider's client ID and client secret.
4. In Supabase Dashboard → Authentication → URL Configuration, keep
   `https://www.taelos.xyz` as the Site URL and add
   `https://www.taelos.xyz/auth/callback` plus any local/preview callback URLs
   the app uses.

Provider client secrets belong only in Google/GitHub and Supabase settings;
never add them to `NEXT_PUBLIC_*` variables or commit them to this repository.

Vercel automatically uses `npm run build`; no `vercel.json` is required.
