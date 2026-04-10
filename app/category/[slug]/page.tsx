import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import {
  categoryBrowseConfig,
  getListingsByCategoryBrowse,
  type CategoryBrowseSlug
} from "@/lib/data";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    subdivision?: string;
  };
};

export default async function CategoryBrowsePage({ params, searchParams }: PageProps) {
  const slug = params.slug as CategoryBrowseSlug;
  const category = categoryBrowseConfig[slug];

  if (!category) {
    notFound();
  }

  const activeSubdivision = searchParams?.subdivision?.trim() || "";
  const listings = await getListingsByCategoryBrowse(slug, activeSubdivision || undefined);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
          {"<- Back to home"}
        </Link>

        <section className="mt-5 rounded-[32px] bg-white p-8 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-moss">Category Browse</p>
              <h1 className="mt-3 font-display text-5xl text-ink">{category.label}</h1>
              <p className="mt-4 max-w-2xl text-lg text-ink/70">{category.description}</p>
            </div>
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-sm text-ink/60">Live listings</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{listings.length}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/category/${slug}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                !activeSubdivision
                  ? "border-moss bg-moss text-white"
                  : "border-ink/10 bg-mist text-ink/75 hover:border-moss hover:text-ink"
              }`}
            >
              All
            </Link>
            {category.subdivisions.map((subdivision) => (
              <Link
                key={subdivision}
                href={`/category/${slug}?subdivision=${encodeURIComponent(subdivision)}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeSubdivision === subdivision
                    ? "border-moss bg-moss text-white"
                    : "border-ink/10 bg-mist text-ink/75 hover:border-moss hover:text-ink"
                }`}
              >
                {subdivision}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {listings.length > 0 ? (
            listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          ) : (
            <div className="rounded-[28px] border border-dashed border-ink/20 bg-white p-8 text-ink/70">
              No products found in this subdivision yet.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
