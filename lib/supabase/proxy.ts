import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv, isSupabaseConfigured } from './env';

const publicPaths = new Set([
  '/signup',
  '/offline',
  '/auth/callback',
  '/api/auth/email',
]);

function unauthorizedResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = '/signup';
  signInUrl.search = '';

  if (request.method === 'GET' || request.method === 'HEAD') {
    const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    if (next !== '/') signInUrl.searchParams.set('next', next);
  }

  return NextResponse.redirect(signInUrl);
}

export async function updateSession(request: NextRequest) {
  const isPublicPath = publicPaths.has(request.nextUrl.pathname);

  if (!isSupabaseConfigured()) {
    // The task app must never become publicly accessible because auth was
    // accidentally omitted from an environment.
    return isPublicPath
      ? NextResponse.next({ request })
      : unauthorizedResponse(request);
  }

  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  let claims: { sub?: string } | undefined;
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error) return isPublicPath ? response : unauthorizedResponse(request);
    claims = data?.claims;
  } catch {
    // Auth verification failures must not expose protected routes.
    return isPublicPath ? response : unauthorizedResponse(request);
  }

  if (!isPublicPath && !claims?.sub) {
    return unauthorizedResponse(request);
  }

  return response;
}
