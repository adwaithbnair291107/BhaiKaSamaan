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
          <div className="absolute right-0 top-12 z-20 min-w-[260px] overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-[0_22px_50px_rgba(26,35,32,0.16)]">
            <div className="border-b border-ink/8 bg-mist/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">Signed in as</p>
              <p className="mt-2 break-all text-sm font-medium text-ink/78">{userLabel}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-[#f7f1e3]"
            >
              Sign Out
              <span aria-hidden="true" className="text-ink/35">
                →
              </span>
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
