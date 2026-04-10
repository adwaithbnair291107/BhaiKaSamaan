"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type AuthButtonProps = {
  isSignedIn: boolean;
  userLabel?: string;
};

export function AuthButton({ isSignedIn, userLabel }: AuthButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname || "/")}`
      }
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-ink/60 sm:inline">{userLabel}</span>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-mist"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-mist"
    >
      Sign In
    </button>
  );
}
