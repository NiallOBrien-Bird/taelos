import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const requestedNext = requestUrl.searchParams.get('next') ?? '/';
  const next = requestedNext.startsWith('/') ? requestedNext : '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  const failure = new URL('/signup', requestUrl.origin);
  failure.searchParams.set(
    'error',
    'We could not finish signing you in. Please try again.',
  );
  return NextResponse.redirect(failure);
}
