import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getListing } from "@/lib/data";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ListingDetailPage({ params }: PageProps) {
  const listing = getListing(params.id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href={`/college/${listing.collegeSlug}`} className="text-sm font-semibold text-moss hover:text-ink">
          ← Back to {listing.collegeName}
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[340px] overflow-hidden rounded-[32px] bg-white shadow-card">
            <Image src={listing.image} alt={listing.title} fill className="object-cover" />
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">{listing.category}</p>
            <h1 className="mt-3 font-display text-4xl text-ink">{listing.title}</h1>
            <p className="mt-4 text-3xl font-semibold text-clay">Rs. {listing.price}</p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-ink/75">
              <span className="rounded-full bg-mist px-4 py-2">{listing.collegeName}</span>
              {listing.branch ? <span className="rounded-full bg-mist px-4 py-2">{listing.branch}</span> : null}
              {listing.year ? <span className="rounded-full bg-mist px-4 py-2">{listing.year}</span> : null}
              <span className="rounded-full bg-mist px-4 py-2">{listing.condition}</span>
            </div>

            <div className="mt-8 space-y-4 text-sm text-ink/72">
              <p>
                <span className="font-semibold text-ink">Pickup:</span> {listing.location}
              </p>
              <p>
                <span className="font-semibold text-ink">Seller:</span> {listing.postedBy}
              </p>
              <p>
                <span className="font-semibold text-ink">Posted:</span> {listing.postedAgo}
              </p>
            </div>

            <p className="mt-8 leading-7 text-ink/80">{listing.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss">
                Contact Seller
              </button>
              <button className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink hover:bg-mist">
                Mark Interest
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
