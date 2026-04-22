import Image from "next/image";
import Link from "next/link";
import { submitBookRequest } from "@/app/sell/actions";
import { FormSubmitButton } from "@/components/form-submit-button";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { categoryBrowseConfig, getClosedListings, getColleges, getRecentBookRequests, getRecentListings } from "@/lib/data";

type HomePageProps = {
  searchParams?: {
    request?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [colleges, recentListings, recentBookRequests, closedListings] = await Promise.all([
    getColleges(),
    getRecentListings(),
    getRecentBookRequests(),
    getClosedListings()
  ]);
  const requestStatus = searchParams?.request;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <section className="mt-2 text-center">
          <h1 className="font-display text-5xl leading-[0.92] text-ink sm:text-7xl">BhaiKaSamaan</h1>
          <p className="mt-2 text-sm tracking-[0.24em] text-moss">Junior Ke Kaam, Kam Hai Daam.</p>
        </section>

        <section className="mt-6 grid gap-8 rounded-[32px] bg-ink px-8 py-12 text-white shadow-card lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm tracking-[0.12em] text-gold">Student resale, but local.</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">
              A campus-first marketplace for buying and selling books with trusted student verification.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/78">
              Starting with books, expanding to all student essentials.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sell"
                className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white hover:bg-clay/90"
              >
                Post your first item
              </Link>
              <Link
                href="#request-book"
                className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/20"
              >
                Request a Book
              </Link>
            </div>
            <p className="mt-5 max-w-2xl text-sm text-white/68">
              Didn&apos;t find your book? Request it from your campus.
            </p>
          </div>

          <div className="grid gap-4 rounded-[28px] bg-white/10 p-5">
            {[
              "Choose your college to see relevant listings",
              "See only relevant listings",
              "Filter by branch, year, and category",
              "Connect with the seller locally"
            ].map((step, index) => (
              <div key={step} className="rounded-[22px] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Step {index + 1}</p>
                <p className="mt-2 text-lg font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div>
            <div>
              <h2 className="font-display text-5xl text-ink sm:text-6xl">Categories</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {Object.entries(categoryBrowseConfig).map(([slug, category]) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-card"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-moss">Category</p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-ink">{category.label}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section id="colleges" className="mt-14">
          <div>
            <div>
              <h2 className="font-display text-5xl text-ink sm:text-6xl">Colleges</h2>
            </div>
          </div>

          {colleges.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {colleges.map((college) => (
                <Link
                  key={college.slug}
                  href={`/college/${college.slug}`}
                  className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-card transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">{college.name}</h3>
                      <p className="mt-1 text-sm text-ink/60">{college.city}</p>
                    </div>
                    <span className="rounded-full bg-gold/25 px-3 py-2 text-sm font-semibold text-ink">
                      {college.activeListings} live
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-ink/72">{college.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70 shadow-card">
              No colleges added yet. We can add your real college list next instead of using demo data.
            </div>
          )}
        </section>

        <section className="mt-16">
          <div>
            <div>
              <h2 className="font-display text-5xl text-ink sm:text-6xl">Live Listings</h2>
            </div>
          </div>

          {recentListings.length > 0 ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70 shadow-card">
              No live listings yet. Post the first item from the seller flow and it will appear here for buyers.
            </div>
          )}
        </section>

        <section id="request-book" className="mt-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[32px] bg-ink p-8 text-white shadow-card">
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Request Area</p>
              <h2 className="mt-3 font-display text-4xl">Need a book that is not listed yet?</h2>
              <p className="mt-4 text-sm leading-6 text-white/72">
                Share your requirement and let students across your campus see exactly what you are looking for.
              </p>

              {requestStatus === "sent" ? (
                <p className="mt-6 rounded-2xl bg-moss/15 px-4 py-3 text-sm text-white">
                  Your book request is live now.
                </p>
              ) : null}

              {requestStatus === "missing" ? (
                <p className="mt-6 rounded-2xl bg-clay/15 px-4 py-3 text-sm text-white">
                  Please fill in your name, college, book title, and requirement details.
                </p>
              ) : null}

              {requestStatus === "image-size" ? (
                <p className="mt-6 rounded-2xl bg-clay/15 px-4 py-3 text-sm text-white">
                  Please upload an image smaller than 2 MB.
                </p>
              ) : null}

              {requestStatus === "image-count" ? (
                <p className="mt-6 rounded-2xl bg-clay/15 px-4 py-3 text-sm text-white">
                  Please upload only one reference image for a book request.
                </p>
              ) : null}

              {requestStatus === "image-type" ? (
                <p className="mt-6 rounded-2xl bg-clay/15 px-4 py-3 text-sm text-white">
                  Please upload a JPG, PNG, or WebP image.
                </p>
              ) : null}

              {requestStatus === "error" ? (
                <p className="mt-6 rounded-2xl bg-clay/15 px-4 py-3 text-sm text-white">
                  We could not save your request right now. Please try again.
                </p>
              ) : null}

              <form action={submitBookRequest} className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-medium text-white">
                  Book Name
                  <input
                    name="bookTitle"
                    required
                    className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:bg-white/15"
                    placeholder="Example: HC Verma Concepts of Physics"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-white">
                    Your Name
                    <input
                      name="requesterName"
                      required
                      className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:bg-white/15"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-white">
                    College / Campus
                    <input
                      name="requesterCollege"
                      required
                      className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:bg-white/15"
                      placeholder="Example: Lovely Professional University"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-white">
                  Contact Info
                  <input
                    name="contactInfo"
                    className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:bg-white/15"
                    placeholder="Phone, email, or Instagram"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-white">
                  Requirement Details
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:bg-white/15"
                    placeholder="Mention edition, author, condition, budget, or why you need it."
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-white">
                  Reference Photo
                  <input
                    name="imageFiles"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] text-white outline-none"
                  />
                </label>

                <FormSubmitButton
                  idleLabel="Post Book Request"
                  pendingLabel="Posting..."
                  className="w-fit rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold/90 disabled:opacity-60"
                />
              </form>
            </div>

            <div className="grid gap-5 content-start">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-moss">Requirement Board</p>
                <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">Student Requests</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
                  Anyone can browse these requests and reach out if they have the exact book or a close match.
                </p>
              </div>

              {recentBookRequests.length > 0 ? (
                <div className="grid gap-5">
                  {recentBookRequests.map((request) => (
                    <article
                      key={request.id}
                      className="grid gap-5 rounded-[28px] border border-ink/10 bg-white p-5 shadow-card md:grid-cols-[0.34fr_0.66fr]"
                    >
                      {request.image ? (
                        <div className="relative min-h-[180px] overflow-hidden rounded-[24px] bg-[#f7f1e3]">
                          <Image
                            src={request.image}
                            alt={request.bookTitle}
                            fill
                            className="object-cover"
                            unoptimized={request.image.startsWith("data:")}
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[180px] items-center justify-center rounded-[24px] bg-[#f7f1e3] px-6 text-center text-sm text-ink/55">
                          No photo shared yet
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-moss">{request.requesterCollege}</p>
                            <h3 className="mt-2 text-2xl font-semibold text-ink">{request.bookTitle}</h3>
                          </div>
                          <span className="rounded-full bg-gold/20 px-3 py-2 text-sm font-semibold text-ink">
                            Requested {request.postedAgo}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-ink/75">{request.description}</p>

                        <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink/65">
                          <span className="rounded-full bg-mist px-3 py-2">Asked by {request.requesterName}</span>
                          {request.contactInfo ? (
                            <span className="rounded-full bg-mist px-3 py-2">{request.contactInfo}</span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70 shadow-card">
                  No requests yet. The first request posted from the form will appear here.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div>
            <div>
              <h2 className="font-display text-5xl text-ink sm:text-6xl">Closed Listings</h2>
            </div>
          </div>

          {closedListings.length > 0 ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {closedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70 shadow-card">
              No closed listings yet. Closed listings will appear here after a deal is confirmed.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
