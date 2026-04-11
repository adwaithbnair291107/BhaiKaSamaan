export async function SiteFooter() {
  return (
    <footer className="site-footer mt-16 bg-sky-700 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h2 className="font-display text-4xl">Built By</h2>
          <p className="mt-3 text-sm text-sky-100">Reach out for feedback, collaboration, or campus expansion.</p>
        </div>

        <div className="mt-8 grid gap-6">
          <div className="flex min-h-[110px] flex-col justify-center rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
            <h3 className="font-display text-2xl">Adwaith B Nair</h3>
            <div className="mt-3 text-base">
              <p>
                <span className="font-semibold text-sky-100">College:</span> To be updated
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[110px] flex-col justify-center rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
              <h3 className="font-display text-2xl">J M Kamalashewar</h3>
              <div className="mt-3 text-base">
                <p>
                  <span className="font-semibold text-sky-100">College:</span> Lovely Professional University
                </p>
              </div>
            </div>

            <div className="flex min-h-[110px] flex-col justify-center rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
              <h3 className="font-display text-2xl">Aneek Singh</h3>
              <div className="mt-3 text-base">
                <p>
                  <span className="font-semibold text-sky-100">College:</span> Lovely Professional University
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
