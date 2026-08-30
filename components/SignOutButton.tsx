'use client';

import { LogOutIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const signOut = async () => {
    await createClient().auth.signOut();
    window.location.assign('/signup');
  };

  return (
    <button
      className={`tm-sign-out${compact ? ' is-compact' : ''}`}
      type="button"
      onClick={signOut}
      title="Sign out"
      aria-label="Sign out"
    >
      <LogOutIcon />
      <span>Sign out</span>
    </button>
  );
}
