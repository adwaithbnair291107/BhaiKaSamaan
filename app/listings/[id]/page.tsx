import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { submitOffer } from "@/app/sell/actions";
import { SiteHeader } from "@/components/site-header";
import { getListing } from "@/lib/data";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    offer?: string;
  };
};

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const isDataUrl = listing.image.startsWith("data:");
  const listingPlace = listing.location || listing.city;
  const isCompetitiveListing = listing.collegeSlug === "competitive-exams";
  const offerStatus = searchParams?.offer;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isCompetitiveListing ? (
          <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
            {"<- Back to explore"}
          </Link>
        ) : (
          <Link href={`/college/${listing.collegeSlug}`} className="text-sm font-semibold text-moss hover:text-ink">
            {`<- Back to ${listing.collegeName}`}
          </Link>
        )}

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[340px] overflow-hidden rounded-[32px] bg-white shadow-card">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
              unoptimized={isDataUrl}
            />
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">{listing.category}</p>
            <h1 className="mt-3 font-display text-4xl text-ink">{listing.title}</h1>
            <p className="mt-4 text-3xl font-semibold text-clay">Rs. {listing.expectedPrice}</p>
            <p className="mt-2 text-sm text-ink/60">Buyer-facing price. Offers at or above the seller minimum get forwarded.</p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-ink/75">
              <span className="rounded-full bg-mist px-4 py-2">{listing.collegeName}</span>
              {listing.branch ? <span className="rounded-full bg-mist px-4 py-2">{listing.branch}</span> : null}
              {listing.year ? <span className="rounded-full bg-mist px-4 py-2">{listing.year}</span> : null}
              <span className="rounded-full bg-mist px-4 py-2">{listing.condition}</span>
            </div>

            <div className="mt-8 space-y-4 text-sm text-ink/72">
              <p>
                <span className="font-semibold text-ink">{listing.location ? "Location:" : "City:"}</span>{" "}
                {listingPlace}
              </p>
              <p>
                <span className="font-semibold text-ink">Seller:</span> {listing.postedBy}
              </p>
              <p>
                <span className="font-semibold text-ink">Posted:</span> {listing.postedAgo}
              </p>
            </div>

            <p className="mt-8 leading-7 text-ink/80">{listing.description}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">Buyer Action</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Connect or make an offer</h2>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              Leave the amount at the posted price if you want to buy at the seller's expected price. If you ask for less, the offer only goes through when it still meets the hidden minimum.
            </p>

            {offerStatus === "sent" ? (
              <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
                Your offer was sent to the seller queue.
              </p>
            ) : null}

            {offerStatus === "low" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Amount asked is too low for this product.
              </p>
            ) : null}

            {offerStatus === "missing" || offerStatus === "invalid" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Please enter a valid buyer name and offer amount.
              </p>
            ) : null}

            <form action={submitOffer} className="mt-6 grid gap-5">
              <input type="hidden" name="listingId" value={listing.id} />

              <label className="grid gap-2 text-sm font-medium text-ink">
                Buyer Name
                <input
                  name="buyerName"
                  required
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Contact Info
                <input
                  name="buyerContact"
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Phone, email, or Instagram"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Offer Amount
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    required
                    defaultValue={listing.expectedPrice}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>

                <div className="rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] px-5 py-4 text-sm text-ink/65">
                  Posted price: Rs. {listing.expectedPrice}
                  <br />
                  Offers below the seller minimum are blocked.
                </div>
              </div>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Message to Seller
                <textarea
                  name="message"
                  rows={4}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Why this price works for you, pickup timing, or any question"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss">
                  Send Offer
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">What Happens Next</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Seller decision flow</h2>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              Offers that meet the seller minimum are now stored in the app. The next step is a seller-side inbox where they can accept, reject, or reply to offers.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-ink/10 bg-[#f7f1e3] p-5 text-sm text-ink/72">
                Buyer sees only the expected price on the listing.
              </div>
              <div className="rounded-[24px] border border-ink/10 bg-[#f7f1e3] p-5 text-sm text-ink/72">
                If the buyer submits an amount below the hidden minimum, the app blocks the offer immediately.
              </div>
              <div className="rounded-[24px] border border-ink/10 bg-[#f7f1e3] p-5 text-sm text-ink/72">
                Valid offers are stored in Supabase for seller review.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
