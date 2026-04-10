import { createHmac } from "crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

function getSellerAccessSecret() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "bhaika-samaan-seller-access";
}

export function getSellerAccessCookieName(listingId: string) {
  return `seller-listing-${listingId}`;
}

export function signSellerAccess(listingId: string) {
  return createHmac("sha256", getSellerAccessSecret()).update(listingId).digest("hex");
}

export function hasSellerAccess(cookieStore: Pick<ReadonlyRequestCookies, "get">, listingId: string) {
  const cookieValue = cookieStore.get(getSellerAccessCookieName(listingId))?.value;
  return cookieValue === signSellerAccess(listingId);
}
