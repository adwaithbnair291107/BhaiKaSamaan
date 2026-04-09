import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Campus Loop
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/" className="rounded-full px-4 py-2 text-ink/70 hover:text-ink">
            Explore
          </Link>
          <Link
            href="/sell"
            className="rounded-full bg-ink px-4 py-2 text-white hover:bg-moss"
          >
            Post Item
          </Link>
        </nav>
      </div>
    </header>
  );
}
