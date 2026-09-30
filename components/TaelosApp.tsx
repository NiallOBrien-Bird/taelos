'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { taskRepository } from '@/lib/task-repository';
import '@/app/taelos.css';

type Host = { theme: string; flush(): Promise<void> };

/** The Taelos interface: a plain-DOM UI mounted over the user's tasks in Supabase. */
export default function TaelosApp() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let host: Host | undefined;
    let cancelled = false;
    const flush = () => { void host?.flush(); };
    const onHidden = () => { if (document.visibilityState === 'hidden') flush(); };

    (async () => {
      try {
        const [{ createHost }, { mountTaelos }] = await Promise.all([
          import('@/lib/taelos-ui/host.js'),
          import('@/lib/taelos-ui/app.js'),
        ]);
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
        console.error('Taelos: failed to load', error);
        if (!cancelled) setStatus('error');
      }
    })();

    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHidden);
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
