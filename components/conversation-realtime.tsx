"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type ConversationRealtimeProps = {
  listingId: string;
  enabled: boolean;
};

export function ConversationRealtime({ listingId, enabled }: ConversationRealtimeProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`listing-${listingId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offer_messages", filter: `listing_id=eq.${listingId}` },
        () => {
          startTransition(() => {
            router.refresh();
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers", filter: `listing_id=eq.${listingId}` },
        () => {
          startTransition(() => {
            router.refresh();
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, listingId, router]);

  return null;
}
