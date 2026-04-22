"use client";

import { useRouter } from "next/navigation";

type ListingBackButtonProps = {
  fallbackHref: string;
  label: string;
};

export function ListingBackButton({ fallbackHref, label }: ListingBackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm font-semibold text-moss transition hover:text-ink"
    >
      {label}
    </button>
  );
}
