'use client';

import { LogOutIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const signOut = async () => {
    await createClient().auth.signOut();
    window.location.assign('/signup');
  };

  return (
    <button
      className="tm-sign-out"
      type="button"
      onClick={signOut}
      title="Sign out"
    >
      <LogOutIcon />
      <span>Sign out</span>
    </button>
  );
}
