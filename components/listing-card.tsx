import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/data";

export function ListingCard({ listing }: { listing: Listing }) {
  const isDataUrl = listing.image.startsWith("data:");
  const listingPlace = listing.location || listing.city;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-card transition hover:-translate-y-1"
    >
      <div className="relative h-52">
        <Image src={listing.image} alt={listing.title} fill className="object-cover" unoptimized={isDataUrl} />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-moss">{listing.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{listing.title}</h3>
          </div>
          <p className="rounded-full bg-gold/25 px-3 py-1 text-sm font-semibold text-ink">
            Rs. {listing.expectedPrice}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-ink/75">
          <span className="rounded-full bg-mist px-3 py-1">{listing.collegeName}</span>
          {listing.branch ? <span className="rounded-full bg-mist px-3 py-1">{listing.branch}</span> : null}
          {listing.year ? <span className="rounded-full bg-mist px-3 py-1">{listing.year}</span> : null}
          <span className="rounded-full bg-mist px-3 py-1">{listing.condition}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-ink/60">
          <span>{listingPlace}</span>
          <span>{listing.postedAgo}</span>
        </div>
      </div>
    </Link>
  );
}
