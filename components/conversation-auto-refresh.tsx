"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ConversationAutoRefreshProps = {
  enabled: boolean;
  intervalMs?: number;
};

export function ConversationAutoRefresh({
  enabled,
  intervalMs = 5000
}: ConversationAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, intervalMs, router]);

  return null;
}
