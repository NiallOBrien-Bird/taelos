import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { safeRedirectPath } from '@/lib/auth-redirect';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/signup', requestUrl.origin));
  }

  const code = requestUrl.searchParams.get('code');
  const next = safeRedirectPath(requestUrl.searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const flowId = requestUrl.searchParams.get('sb_flow_id');
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );
    if (!error) return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  const failure = new URL('/signup', requestUrl.origin);
  failure.searchParams.set('error', 'oauth_callback_failed');
  if (next !== '/') failure.searchParams.set('next', next);
  return NextResponse.redirect(failure);
}
