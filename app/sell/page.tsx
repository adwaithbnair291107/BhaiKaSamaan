import { SiteHeader } from "@/components/site-header";
import { categories, colleges } from "@/lib/data";

export default function SellPage() {
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

          <form className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                College
                <select className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none">
                  {colleges.map((college) => (
                    <option key={college.slug}>{college.name}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Category
                <select className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none">
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Title
                <input
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="HC Verma physics combo"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Price
                <input
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="850"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Branch
                <input
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="CSE / JEE / Mechanical"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Year or Program
                <input
                  className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                  placeholder="1st year / Dropper"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink">
              Description
              <textarea
                rows={5}
                className="rounded-3xl border border-ink/10 bg-mist px-4 py-3 outline-none"
                placeholder="Mention condition, edition, included extras, and pickup area."
              />
            </label>

            <div className="rounded-[24px] border border-dashed border-ink/15 bg-mist p-5 text-sm text-ink/65">
              Image upload will be connected when we add storage. For MVP testing, we’re validating the flow first.
            </div>

            <button
              type="button"
              className="w-fit rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-moss"
            >
              Save draft UI
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
