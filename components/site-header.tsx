import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          BhaiKaSamaan
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/" className="rounded-full px-4 py-2 text-ink/70 hover:text-ink">
            Buyer
          </Link>
          <Link
            href="/sell"
            className="rounded-full bg-ink px-4 py-2 text-white hover:bg-moss"
          >
            Seller
          </Link>
          <AuthButton isSignedIn={Boolean(user)} userLabel={user?.email ?? "Signed in"} />
        </nav>
      </div>
    </header>
  );
}
