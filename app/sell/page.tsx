import { submitListing } from "@/app/sell/actions";
import { SellForm } from "@/app/sell/sell-form";
import { AuthButton } from "@/components/auth-button";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { categories, getColleges, getListingsByUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type SellPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default async function SellPage({ searchParams }: SellPageProps) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const colleges = await getColleges();
  const status = searchParams?.status;
  const sellerListings = user ? await getListingsByUser(user.id) : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Seller Flow</p>
          <h1 className="mt-3 font-display text-5xl text-ink">Post an item in under a minute</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            Sign in with Google to post your item, upload photos, and manage your listing from any device.
          </p>

          {status === "missing" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please fill in all required fields before posting.
            </p>
          ) : null}

          {status === "auth" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please sign in with Google before posting a listing.
            </p>
          ) : null}

          {status === "price" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please enter a valid price greater than zero.
            </p>
          ) : null}

          {status === "price-range" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Expected price must be greater than or equal to minimum price.
            </p>
          ) : null}

          {status === "location" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please enter a location for competitive exam listings.
            </p>
          ) : null}

          {status === "image-size" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload an image smaller than 2 MB.
            </p>
          ) : null}

          {status === "image-count" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload no more than 3 images.
            </p>
          ) : null}

          {status === "image-total-size" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Total image size is too large. Keep all 3 images together under 6 MB.
            </p>
          ) : null}

          {status === "image-type" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload a JPG, PNG, or WebP image.
            </p>
          ) : null}

          {status === "error" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              The listing could not be posted. Please try again, and if you uploaded images, retry with smaller files.
            </p>
          ) : null}

          <div className="hidden">
          <form action={submitListing} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                College
                <select
                  name="collegeSlug"
                  required
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your college
                  </option>
                  {colleges.map((college) => (
                    <option key={college.slug} value={college.slug}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Category
                <select
                  name="category"
                  required
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Title
                <input
                  name="title"
                  required
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="Engineering maths set / JEE PYQ bundle"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Price
                <input
                  name="price"
                  required
                  type="number"
                  min="1"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="850"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Branch
                <input
                  name="branch"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="CSE / Mechanical / JEE / NEET"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Year or Program
                <input
                  name="year"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="1st year / Dropper"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Seller Name
                <input
                  name="postedBy"
                  required
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="Adwaith / Hostel senior / Class rep"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Pickup Location
                <input
                  name="location"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="Main gate / Hostel block / Library canteen"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Condition
                <select
                  name="condition"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  defaultValue="Good"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Needs Review">Needs Review</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Image URL
                <input
                  name="image"
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink">
              Description
              <textarea
                name="description"
                required
                rows={5}
                className="rounded-3xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                placeholder="Mention condition, edition, included extras, and pickup area."
              />
            </label>

            <div className="rounded-[24px] border border-dashed border-ink/15 bg-mist p-5 text-sm text-ink/65">
              Image upload will be connected when we add storage. For MVP testing, we’re validating the flow first.
            </div>

            <div className="rounded-[24px] border border-dashed border-ink/15 bg-mist p-5 text-sm text-ink/65">
              The image field currently accepts a direct URL. We can connect Supabase Storage after
              this database step is live.
            </div>

            <button
              type="submit"
              className="w-fit rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-moss"
            >
              Post to marketplace
            </button>
          </form>
          </div>

          {user ? (
            <>
              {sellerListings.length > 0 ? (
                <section className="mt-8 rounded-[28px] border border-ink/10 bg-[#f7f1e3] p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-moss">Your Listings</p>
                      <h2 className="mt-2 text-2xl font-semibold text-ink">Open any post and edit it</h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-ink/68">
                      The edit form shows on the individual listing page for the same Google account that created it.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {sellerListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex flex-col gap-4 rounded-[24px] border border-ink/10 bg-white p-5 shadow-[0_14px_40px_rgba(26,35,32,0.06)] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-ink">{listing.title}</p>
                          <p className="mt-1 text-sm text-ink/62">
                            Rs. {listing.expectedPrice} • {listing.postedAgo}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
                          >
                            Open listing
                          </Link>
                          <Link
                            href={`/listings/${listing.id}#seller-controls`}
                            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                          >
                            Edit listing
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <SellForm colleges={colleges} categories={categories} action={submitListing} />
            </>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-ink/15 bg-[#f7f1e3] p-6">
              <p className="text-lg font-semibold text-ink">Sign in to sell</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">
                Use your Google account to create listings and manage them later from any device.
              </p>
              <div className="mt-5">
                <AuthButton isSignedIn={false} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
