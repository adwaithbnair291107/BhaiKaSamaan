import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveListingChanges, submitOffer } from "@/app/sell/actions";
import { AuthButton } from "@/components/auth-button";
import { SiteHeader } from "@/components/site-header";
import { COMPETITIVE_EXAMS_LABEL, COMPETITIVE_EXAMS_SLUG, getListing } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    offer?: string;
    manage?: string;
  };
};

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const isDataUrl = listing.image.startsWith("data:");
  const listingPlace = listing.location || listing.city;
  const isCompetitiveListing = listing.collegeSlug === COMPETITIVE_EXAMS_SLUG;
  const offerStatus = searchParams?.offer;
  const manageStatus = searchParams?.manage;
  const canManageListing = Boolean(user && listing.userId === user.id);

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
          <div className="grid gap-4">
            <div className="relative min-h-[340px] overflow-hidden rounded-[32px] bg-white shadow-card">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                unoptimized={isDataUrl}
              />
            </div>

            {listing.images.length > 1 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {listing.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative h-28 overflow-hidden rounded-[24px] bg-white shadow-card">
                    <Image
                      src={image}
                      alt={`${listing.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={image.startsWith("data:")}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">{listing.category}</p>
            {isCompetitiveListing ? (
              <p className="mt-2 text-sm text-ink/55">{COMPETITIVE_EXAMS_LABEL}</p>
            ) : null}
            <h1 className="mt-3 font-display text-4xl text-ink">{listing.title}</h1>
            <p className="mt-4 text-3xl font-semibold text-clay">Rs. {listing.expectedPrice}</p>
            <p className="mt-2 text-sm text-ink/60">Buyer-facing price. Offers at or above the seller minimum get forwarded.</p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-ink/75">
              <span className="rounded-full bg-mist px-4 py-2">
                {isCompetitiveListing ? COMPETITIVE_EXAMS_LABEL : listing.collegeName}
              </span>
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

            {canManageListing ? (
              <div className="mt-8 rounded-[24px] border border-moss/20 bg-moss/5 px-5 py-4 text-sm text-moss">
                <p>Seller access is enabled for this signed-in account. You can edit this listing below from any device.</p>
                <a href="#seller-controls" className="mt-3 inline-flex rounded-full bg-moss px-4 py-2 font-semibold text-white transition hover:bg-ink">
                  Jump to edit form
                </a>
              </div>
            ) : null}
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

            {offerStatus === "auth" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Please sign in with Google before sending an offer.
              </p>
            ) : null}

            {user ? (
              <form action={submitOffer} className="mt-6 grid gap-5">
                <input type="hidden" name="listingId" value={listing.id} />

                <label className="grid gap-2 text-sm font-medium text-ink">
                  Buyer Name
                  <input
                    name="buyerName"
                    required
                    defaultValue={user.user_metadata?.full_name ?? user.email ?? ""}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                    placeholder="Your name"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-ink">
                  Contact Info
                  <input
                    name="buyerContact"
                    defaultValue={user.email ?? ""}
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
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] p-5">
                <p className="text-sm leading-6 text-ink/68">
                  Sign in with Google to make an offer and track your buying activity from any device.
                </p>
                <div className="mt-4">
                  <AuthButton isSignedIn={false} />
                </div>
              </div>
            )}
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

        {canManageListing ? (
          <section id="seller-controls" className="mt-8 rounded-[32px] bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.26em] text-moss">Seller Controls</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Edit your listing</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
              This edit access is tied to your Google account, so you can manage the listing from any device after signing in.
            </p>

            {manageStatus === "saved" ? (
              <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
                Listing changes saved.
              </p>
            ) : null}

            {manageStatus === "denied" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                This signed-in account does not own that listing.
              </p>
            ) : null}

            {manageStatus === "auth" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Please sign in with Google to manage your listing.
              </p>
            ) : null}

            {manageStatus === "missing" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Please fill in all required seller fields before saving.
              </p>
            ) : null}

            {manageStatus === "price" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Please enter valid prices greater than zero.
              </p>
            ) : null}

            {manageStatus === "range" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                Expected price must be greater than or equal to minimum price.
              </p>
            ) : null}

            {manageStatus === "error" ? (
              <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                We could not save the listing changes right now. Please try again.
              </p>
            ) : null}

            <form action={saveListingChanges} className="mt-6 grid gap-5">
              <input type="hidden" name="listingId" value={listing.id} />

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Title
                  <input
                    name="title"
                    required
                    defaultValue={listing.title}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-ink">
                  Seller Name
                  <input
                    name="postedBy"
                    required
                    defaultValue={listing.postedBy}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Expected Price
                  <input
                    name="expectedPrice"
                    type="number"
                    min="1"
                    required
                    defaultValue={listing.expectedPrice}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-ink">
                  Minimum Price
                  <input
                    name="minPrice"
                    type="number"
                    min="1"
                    required
                    defaultValue={listing.minPrice}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Condition
                  <select
                    name="condition"
                    defaultValue={listing.condition}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Used">Used</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-ink">
                  Location
                  <input
                    name="location"
                    defaultValue={listing.location ?? ""}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Description
                <textarea
                  name="description"
                  required
                  rows={5}
                  defaultValue={listing.description}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>

              <button className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss">
                Save Changes
              </button>
            </form>
          </section>
        ) : null}
      </main>
    </div>
  );
}
