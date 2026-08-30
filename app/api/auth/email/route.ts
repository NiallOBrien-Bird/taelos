import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { fetch as undiciFetch } from 'undici';
import { getSupabaseEnv } from '@/lib/supabase/env';

type EmailAuthRequest = {
  email?: unknown;
  password?: unknown;
  mode?: unknown;
};

const directFetch: typeof fetch = (input, init) =>
  undiciFetch(
    input as Parameters<typeof undiciFetch>[0],
    init as Parameters<typeof undiciFetch>[1],
  ) as unknown as Promise<Response>;

export async function POST(request: NextRequest) {
  let payload: EmailAuthRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const mode = payload.mode === 'signup' || payload.mode === 'login' ? payload.mode : null;

  if (!mode || !email || password.length < 8) {
    return NextResponse.json(
      { error: 'Enter a valid email address and a password of at least 8 characters.' },
      { status: 400 },
    );
  }

  let response = NextResponse.json({ ok: true });
  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createServerClient(url, publishableKey, {
    global: { fetch: directFetch },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        response = NextResponse.json({ ok: true });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const result =
    mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: new URL('/auth/callback?next=/', request.url).toString(),
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status ?? 400 },
    );
  }

  response.headers.set('Cache-Control', 'no-store');
  return response;
}
