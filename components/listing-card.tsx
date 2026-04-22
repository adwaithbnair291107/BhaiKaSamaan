import Image from "next/image";
import Link from "next/link";
import { COMPETITIVE_EXAMS_LABEL, COMPETITIVE_EXAMS_SLUG, type Listing } from "@/lib/data";

export function ListingCard({ listing }: { listing: Listing }) {
  const isDataUrl = listing.image.startsWith("data:");
  const listingPlace = listing.location || listing.city;
  const isCompetitiveListing = listing.collegeSlug === COMPETITIVE_EXAMS_SLUG;
  const listingSubtitle = isCompetitiveListing ? COMPETITIVE_EXAMS_LABEL : listing.collegeName;
  const listingHeader = isCompetitiveListing ? listing.title : listing.category;
  const listingTitle = isCompetitiveListing ? listing.category : listing.title;
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-card transition hover:-translate-y-1"
    >
      <div className="relative h-52">
        <Image src={listing.image} alt={listing.title} fill className="object-cover" unoptimized={isDataUrl} />
        {listing.status === "sold" ? (
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Closed
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-moss">{listingHeader}</p>
            <p className="mt-1 text-sm text-ink/55">{listingSubtitle}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{listingTitle}</h3>
            {listing.sellerVerified ? (
              <p className="mt-3 inline-flex rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
                {listing.sellerVerificationLabel}
              </p>
            ) : null}
          </div>
          <p className="rounded-full bg-gold/25 px-3 py-1 text-sm font-semibold text-ink">
            Rs. {listing.expectedPrice}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-ink/75">
          {listing.branch ? <span className="rounded-full bg-mist px-3 py-1">{listing.branch}</span> : null}
          {listing.year ? <span className="rounded-full bg-mist px-3 py-1">{listing.year}</span> : null}
          <span className="rounded-full bg-mist px-3 py-1">{listing.condition}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-ink/60">
          <span>{listingPlace}</span>
          <span>Listed {listing.postedAgo}</span>
        </div>

        <div className="text-sm text-ink/55">
          {listing.interestCount} people viewed this
        </div>
      </div>
    </Link>
  );
}
