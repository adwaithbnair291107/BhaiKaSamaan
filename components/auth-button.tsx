"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type AuthButtonProps = {
  isSignedIn: boolean;
  userLabel?: string;
};

export function AuthButton({ isSignedIn, userLabel }: AuthButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const badgeLabel = (userLabel?.trim().charAt(0) || "U").toUpperCase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

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
    setIsMenuOpen(false);
    router.refresh();
  }

  if (isSignedIn) {
    return (
      <div ref={menuRef} className="relative">
        <button
          type="button"
          title={userLabel}
          aria-label={userLabel}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-mist text-sm font-semibold text-ink transition hover:bg-white"
        >
          {badgeLabel}
        </button>

        {isMenuOpen ? (
          <div className="absolute right-0 top-12 z-20 min-w-[220px] rounded-[22px] border border-ink/10 bg-white p-3 shadow-card">
            <p className="px-3 py-2 text-sm text-ink/65">{userLabel}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 w-full rounded-2xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-mist"
            >
              Sign Out
            </button>
          </div>
        ) : null}
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
