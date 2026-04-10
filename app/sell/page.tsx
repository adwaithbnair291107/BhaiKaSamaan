import { submitListing } from "@/app/sell/actions";
import { SellForm } from "@/app/sell/sell-form";
import { SiteHeader } from "@/components/site-header";
import { categories, getColleges } from "@/lib/data";

type SellPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default async function SellPage({ searchParams }: SellPageProps) {
  const colleges = await getColleges();
  const status = searchParams?.status;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Seller Flow</p>
          <h1 className="mt-3 font-display text-5xl text-ink">Post an item in under a minute</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            This first version is static for local testing. Later we’ll connect the form to Supabase
            so real students can create listings.
          </p>

          {status === "missing" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please fill in all required fields before posting.
            </p>
          ) : null}

          {status === "price" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please enter a valid price greater than zero.
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

          {status === "image-type" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload a JPG, PNG, or WebP image.
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

          <SellForm colleges={colleges} categories={categories} action={submitListing} />
        </section>
      </main>
    </div>
  );
}
