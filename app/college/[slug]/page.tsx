import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/lib/data";
import { getCollegeBySlug, getListingsByCollege } from "@/lib/db";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function CollegePage({ params }: PageProps) {
  const college = await getCollegeBySlug(params.slug);

  if (!college) {
    notFound();
  }

  const collegeListings = await getListingsByCollege(params.slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
          {"<- Back to all colleges"}
        </Link>

        <section className="mt-5 rounded-[32px] bg-white p-8 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-moss">College Marketplace</p>
              <h1 className="mt-3 font-display text-5xl text-ink">{college.name}</h1>
              <p className="mt-4 max-w-2xl text-lg text-ink/70">
                Listings are scoped to this college so students see relevant books, tools, and room
                essentials instead of a cluttered national feed.
              </p>
            </div>
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-sm text-ink/60">Live listings</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{collegeListings.length}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-ink/10 bg-mist px-4 py-2 text-sm text-ink/75"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {collegeListings.length > 0 ? (
            collegeListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          ) : (
            <div className="rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70">
              No listings yet for this college. Add your first real listing in Supabase to bring this page to life.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
