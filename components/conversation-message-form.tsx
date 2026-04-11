"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type ConversationMessageFormProps = {
  listingId: string;
  offerId: string;
  senderRole: "buyer" | "seller";
  senderName: string;
  placeholder: string;
  buttonLabel: string;
};

export function ConversationMessageForm({
  listingId,
  offerId,
  senderRole,
  senderName,
  placeholder,
  buttonLabel
}: ConversationMessageFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim() || pending) {
      return;
    }

    setPending(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("offer_messages").insert({
      listing_id: listingId,
      offer_id: offerId,
      sender_role: senderRole,
      sender_name: senderName,
      body: body.trim()
    });

    if (insertError) {
      setError("Message could not be sent. Please try again.");
      setPending(false);
      return;
    }

    setBody("");
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
      <textarea
        name="body"
        rows={3}
        required
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="rounded-[22px] border border-ink/10 bg-white px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:ring-4 focus:ring-moss/10"
        placeholder={placeholder}
      />
      {error ? (
        <p className="text-sm text-clay">{error}</p>
      ) : null}
      <button
        type="submit"
        className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Sending..." : buttonLabel}
      </button>
    </form>
  );
}
