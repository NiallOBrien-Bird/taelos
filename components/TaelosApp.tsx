'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { taskRepository } from '@/lib/task-repository';
import '@/app/taelos.css';

type Host = { theme: string; flush(): Promise<void>; refresh(): Promise<void> };

/** The Taelos interface: a plain-DOM UI mounted over the user's tasks in Supabase. */
export default function TaelosApp() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let host: Host | undefined;
    let cancelled = false;
    const flush = () => { void host?.flush(); };
    // Hidden: save now. Back in view (e.g. reopening the PWA): pick up changes made elsewhere.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
      else void host?.refresh();
    };

    (async () => {
      let SignedOut: (new (...args: never[]) => Error) | undefined;
      try {
        const [{ createHost, SignedOutError }, { mountTaelos }] = await Promise.all([
          import('@/lib/taelos-ui/host.js'),
          import('@/lib/taelos-ui/app.js'),
        ]);
        SignedOut = SignedOutError;
        const created = await createHost(taskRepository, {
          signOut: async () => {
            await createClient().auth.signOut();
            window.location.assign('/signup');
          },
        });
        if (cancelled || !ref.current) return;
        host = created;
        ref.current.dataset.theme = created.theme;
        cleanup = mountTaelos(ref.current, created);
        setStatus('ready');
      } catch (error) {
        // The app shell can be served from the offline cache, so a signed-out
        // visitor only finds out here: send them to sign in.
        if (SignedOut && error instanceof SignedOut) { window.location.replace('/signup'); return; }
        console.error('Taelos: failed to load', error);
        if (!cancelled) setStatus('error');
      }
    })();

    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      flush();
      cleanup?.();
    };
  }, []);

  return (
    <>
      {status !== 'ready' && (
        <div className="taelos-boot" role="status">
          {status === 'loading' ? 'Loading…' : (
            <span>Couldn’t load your tasks. <a href="" style={{ color: 'inherit' }}>Try again</a> or open the <a href="/classic" style={{ color: 'inherit' }}>classic view</a>.</span>
          )}
        </div>
      )}
      <div ref={ref} hidden={status !== 'ready'} />
    </>
  );
}
