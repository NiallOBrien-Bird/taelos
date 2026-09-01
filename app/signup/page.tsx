'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, CheckIcon, LockKeyholeIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { safeRedirectPath } from '@/lib/auth-redirect';

type AuthMode = 'signup' | 'login';

export default function SignupPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      queueMicrotask(() => {
        setError(
          oauthError === 'oauth_callback_failed'
            ? 'We could not finish signing you in. Please try again.'
            : 'The sign-in provider could not complete your request. Please try again.',
        );
      });
    }

    if (!configured) return;
    void (async () => {
      const { data } = await createClient().auth.getUser();
      if (data.user) {
        router.replace(safeRedirectPath(params.get('next')));
      }
    })();
  }, [configured, router]);

  const callbackUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const callback = new URL('/auth/callback', window.location.origin);
    callback.searchParams.set('next', safeRedirectPath(params.get('next')));
    return callback.toString();
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const authResponse = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode }),
      });
      const responseBody = await authResponse.text();
      let result: { error?: string } = {};

      try {
        result = JSON.parse(responseBody) as { error?: string };
      } catch {
        if (!authResponse.ok) {
          setError('The sign-in service returned an unexpected response. Please try again.');
          return;
        }
      }

      if (!authResponse.ok) {
        setError(result.error ?? 'Could not complete your request. Please try again.');
      } else if (mode === 'signup') {
        setMessage(
          'Check your email to confirm your account, then you can start using TÆLOS.',
        );
      } else {
        const params = new URLSearchParams(window.location.search);
        router.replace(safeRedirectPath(params.get('next')));
      }
    } catch {
      setError('Could not reach the sign-in service. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const continueWith = async (provider: 'google' | 'github') => {
    if (!configured) return;
    setBusy(true);
    setError('');
    try {
      const { error: oauthError } = await createClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl() },
      });
      if (oauthError) {
        setError(oauthError.message);
        setBusy(false);
      }
    } catch {
      setError('Could not reach the sign-in service. Please try again.');
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story" aria-labelledby="auth-story-title">
        <Link className="auth-brand" href="/signup" aria-label="TÆLOS home">
          <span className="auth-brand-mark" aria-hidden="true">
            <img src="/favicon.svg?v=3" alt="" />
          </span>
          <strong>TÆLOS</strong>
        </Link>
        <div className="auth-story-copy">
          <p className="auth-kicker">A quieter way to make progress</p>
          <h1 id="auth-story-title">Give every task a clear next step.</h1>
          <p>
            TÆLOS keeps your work, deadlines, and daily momentum in one calm
            place.
          </p>
          <ul>
            <li>
              <CheckIcon /> Plan what matters without the clutter
            </li>
            <li>
              <CheckIcon /> Pick up anywhere with secure cloud sync
            </li>
            <li>
              <CheckIcon /> Keep your data private to your account
            </li>
          </ul>
        </div>
        <p className="auth-story-foot">
          Built for steady progress, not busywork.
        </p>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark" aria-hidden="true">
              <img src="/favicon.svg?v=3" alt="" />
            </span>
            TÆLOS
          </div>
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Sign in
            </button>
          </div>

          <header>
            <span className="auth-lock">
              <LockKeyholeIcon />
            </span>
            <h2 id="auth-title">
              {mode === 'signup' ? 'Start with TÆLOS' : 'Welcome back'}
            </h2>
            <p>
              {mode === 'signup'
                ? 'Create your account and make today feel manageable.'
                : 'Sign in to get back to your tasks.'}
            </p>
          </header>

          {!configured && (
            <output className="auth-notice">
              The app is ready. Connect the Supabase project to enable account
              creation.
            </output>
          )}

          <div className="auth-socials">
            <button
              type="button"
              disabled={busy || !configured}
              onClick={() => void continueWith('google')}
            >
              <span className="auth-google">G</span> Continue with Google
            </button>
            <button
              type="button"
              disabled={busy || !configured}
              onClick={() => void continueWith('github')}
            >
              <span className="auth-github">GH</span> Continue with GitHub
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={submit}>
            <label>
              <span>Email</span>
              <input
                className="auth-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                placeholder="At least 8 characters"
                required
              />
            </label>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            {message && <output className="auth-success">{message}</output>}
            <button
              className="auth-submit"
              type="submit"
              disabled={busy || !configured}
            >
              {busy
                ? 'Please wait…'
                : mode === 'signup'
                  ? 'Create my account'
                  : 'Sign in'}
              {!busy && <ArrowRightIcon />}
            </button>
          </form>

          <p className="auth-terms">
            By continuing, you agree to keep making progress at your own pace.
          </p>
        </div>
      </section>
    </main>
  );
}
