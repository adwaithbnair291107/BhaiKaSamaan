import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { categories, getColleges, getRecentListings } from "@/lib/data";

export default async function HomePage() {
  const [colleges, recentListings] = await Promise.all([getColleges(), getRecentListings()]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mt-8 text-center">
          <h1 className="mt-4 font-display text-5xl text-ink sm:text-7xl">BhaiKaSamaan</h1>
          <p className="mt-4 text-sm tracking-[0.24em] text-moss">Junior Ke Kaam, Kam Hai Daam.</p>
        </section>

        <section className="mt-10 grid gap-8 rounded-[32px] bg-ink px-8 py-12 text-white shadow-card lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm tracking-[0.12em] text-gold">Student resale, but local.</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">
              One platform. Many college mini marketplaces.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/78">
              Students browse only their campus, seniors clear useful stuff quickly, and juniors buy
              it for a fair price.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sell"
                className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white hover:bg-clay/90"
              >
                Post your first item
              </Link>
              <a
                href="#colleges"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse by college
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-[28px] bg-white/10 p-5">
            {[
              "Select a college first",
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
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-card"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-moss">Category</p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-ink">{category}</h3>
              </div>
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
      </main>
    </div>
  );
}
