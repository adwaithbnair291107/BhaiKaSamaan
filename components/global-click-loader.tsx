"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GlobalClickLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.dataset.routeLoading = active ? "true" : "false";

    return () => {
      document.body.dataset.routeLoading = "false";
    };
  }, [active]);

  useEffect(() => {
    setActive(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    let timeoutId: number | undefined;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const button = target.closest("button");
      if (button && button.hasAttribute("disabled")) {
        return;
      }

      const link = target.closest("a");
      if (link) {
        const targetAttr = link.getAttribute("target");
        if (targetAttr && targetAttr.toLowerCase() === "_blank") {
          return;
        }
      }

      if (button || link) {
        setActive(true);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => setActive(false), 2000);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!active) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-ink/10 py-2 backdrop-blur">
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm text-ink shadow-card">
        <span className="h-2 w-2 animate-pulse rounded-full bg-moss" />
        Loading...
      </div>
    </div>
  );
}
