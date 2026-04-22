"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

type ConversationAutoRefreshProps = {
  enabled: boolean;
  intervalMs?: number;
};

export function ConversationAutoRefresh({
  enabled,
  intervalMs = 2000
}: ConversationAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId =
      intervalMs > 0
        ? window.setInterval(() => {
            if (document.visibilityState === "visible") {
              startTransition(() => {
                router.refresh();
              });
            }
          }, intervalMs)
        : null;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        startTransition(() => {
          router.refresh();
        });
      }
    };

    const handleFocus = () => {
      startTransition(() => {
        router.refresh();
      });
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, intervalMs, router]);

  return null;
}
