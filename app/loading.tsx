"use client";

export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-ink/10 py-2 backdrop-blur">
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm text-ink shadow-card">
        <span className="h-2 w-2 animate-pulse rounded-full bg-moss" />
        Loading...
      </div>
    </div>
  );
}
