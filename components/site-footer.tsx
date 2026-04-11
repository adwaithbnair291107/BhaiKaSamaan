import { createAdminClient } from "@/lib/supabase/admin";

async function getFooterStats() {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      totalUsers: 0,
      totalListings: 0,
      confirmedDeals: 0
    };
  }

  const [{ count: totalListings }, { count: confirmedDeals }, usersResponse] = await Promise.all([
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
  ]);

  return {
    totalUsers: usersResponse.data?.users.length ?? 0,
    totalListings: totalListings ?? 0,
    confirmedDeals: confirmedDeals ?? 0
  };
}

export async function SiteFooter() {
  const stats = await getFooterStats();

  return (
    <footer className="mt-16 bg-sky-700 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h2 className="font-display text-4xl">Built By</h2>
          <p className="mt-3 text-sm text-sky-100">Reach out for feedback, collaboration, or campus expansion.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="grid gap-6">
            <div className="min-h-[110px] rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
              <h3 className="font-display text-3xl">Adwaith B Nair</h3>
              <div className="mt-3 text-base">
                <p>
                  <span className="font-semibold text-sky-100">College:</span> To be updated
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-h-[110px] rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
                <h3 className="font-display text-3xl">J M Kamalashewar</h3>
                <div className="mt-3 text-base">
                  <p>
                    <span className="font-semibold text-sky-100">College:</span> Lovely Professional University
                  </p>
                </div>
              </div>

              <div className="min-h-[110px] rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
                <h3 className="font-display text-3xl">Aneek Singh</h3>
                <div className="mt-3 text-base">
                  <p>
                    <span className="font-semibold text-sky-100">College:</span> Lovely Professional University
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-sky-100">Platform Stats</p>
            <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex min-h-[118px] flex-col justify-between rounded-[24px] bg-white/10 px-5 py-4">
                <p className="text-sm text-sky-100">Total Users</p>
                <p className="mt-2 font-display text-4xl">{stats.totalUsers}</p>
              </div>
              <div className="flex min-h-[118px] flex-col justify-between rounded-[24px] bg-white/10 px-5 py-4">
                <p className="text-sm text-sky-100">Total Listings</p>
                <p className="mt-2 font-display text-4xl">{stats.totalListings}</p>
              </div>
              <div className="flex min-h-[118px] flex-col justify-between rounded-[24px] bg-white/10 px-5 py-4 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-sky-100">Confirmed Deals</p>
                <p className="mt-2 font-display text-4xl">{stats.confirmedDeals}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="rounded-3xl bg-white/10 p-6 text-sm backdrop-blur-sm">
            <p>
              <span className="font-semibold text-sky-100">Email:</span>{" "}
              <a
                href="mailto:bhaikasaaman@gmail.com"
                className="underline decoration-sky-200 underline-offset-4 hover:text-sky-100"
              >
                bhaikasaaman@gmail.com
              </a>
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 text-sm backdrop-blur-sm">
            <p>
              <span className="font-semibold text-sky-100">Instagram:</span>{" "}
              <a
                href="https://www.instagram.com/bhaikasaaman?igsh=b2xzbnY3NzYxcXg5"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-sky-200 underline-offset-4 hover:text-sky-100"
              >
                @bhaikasaaman
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
