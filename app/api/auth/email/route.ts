import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { fetch as undiciFetch } from 'undici';
import { getSupabaseEnv, isSupabaseConfigured } from '@/lib/supabase/env';

type EmailAuthRequest = {
  email?: unknown;
  password?: unknown;
  mode?: unknown;
};

const MAX_REQUEST_BYTES = 4 * 1024;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 256;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 20;
const MAX_ATTEMPTS_PER_EMAIL = 8;
const MAX_RATE_LIMIT_KEYS = 10_000;

type RateLimitEntry = { count: number; resetAt: number };

// This is deliberately a lightweight per-instance safeguard. Configure
// Supabase Auth's hosted rate limits/CAPTCHA (and a shared limiter, if needed)
// for protection across serverless instances.
const attemptsByIp = new Map<string, RateLimitEntry>();
const attemptsByEmail = new Map<string, RateLimitEntry>();

const directFetch: typeof fetch = (input, init) =>
  undiciFetch(
    input as Parameters<typeof undiciFetch>[0],
    init as Parameters<typeof undiciFetch>[1],
  ) as unknown as Promise<Response>;

function response(body: Record<string, string | boolean>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function clientIp(request: NextRequest) {
  // Vercel replaces this header at its edge. When running elsewhere, the
  // fallback keeps rate limiting useful without depending on a platform API.
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function checkLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  maximum: number,
  now: number,
) {
  const existing = store.get(key);
  if (store.size >= MAX_RATE_LIMIT_KEYS) {
    for (const [storedKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(storedKey);
    }
    if (!existing && store.size >= MAX_RATE_LIMIT_KEYS) {
      let earliestReset = now + RATE_LIMIT_WINDOW_MS;
      for (const entry of store.values()) {
        earliestReset = Math.min(earliestReset, entry.resetAt);
      }
      return earliestReset;
    }
  }

  const entry = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }
    : existing;

  if (entry.count >= maximum) return entry.resetAt;
  entry.count += 1;
  store.set(key, entry);
  return null;
}

async function readJsonBody(request: NextRequest): Promise<EmailAuthRequest> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw new Error('body-too-large');
  }

  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid-body');

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) throw new Error('body-too-large');
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const parsed: unknown = JSON.parse(new TextDecoder().decode(body));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('invalid-body');
  }
  return parsed as EmailAuthRequest;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return response({ error: 'Sign-in is not configured for this environment.' }, 503);
  }

  let payload: EmailAuthRequest;

  try {
    payload = await readJsonBody(request);
  } catch {
    return response({ error: 'Invalid request.' }, 400);
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const mode = payload.mode === 'signup' || payload.mode === 'login' ? payload.mode : null;

  if (
    !mode ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > MAX_EMAIL_LENGTH ||
    password.length < 8 ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return response(
      { error: 'Enter a valid email address and a password of at least 8 characters.' },
      400,
    );
  }

  const now = Date.now();
  const ipResetAt = checkLimit(
    attemptsByIp,
    clientIp(request),
    MAX_ATTEMPTS_PER_IP,
    now,
  );
  const emailResetAt = checkLimit(
    attemptsByEmail,
    email,
    MAX_ATTEMPTS_PER_EMAIL,
    now,
  );
  const resetAt = ipResetAt ?? emailResetAt;
  if (resetAt) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfter) } },
    );
  }

  let authResponse = response({ ok: true });
  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createServerClient(url, publishableKey, {
    global: { fetch: directFetch },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        authResponse = response({ ok: true });
        cookiesToSet.forEach(({ name, value, options }) =>
          authResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
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
      console.error('Supabase email authentication failed', {
        mode,
        status: result.error.status,
        message: result.error.message,
      });
      return response(
        { error: 'Could not complete your request. Check your details and try again.' },
        400,
      );
    }

    authResponse.headers.set('Cache-Control', 'no-store');
    return authResponse;
  } catch (error) {
    console.error('Supabase email authentication request failed', {
      mode,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return response({ error: 'Could not complete your request. Please try again.' }, 503);
  }
}
