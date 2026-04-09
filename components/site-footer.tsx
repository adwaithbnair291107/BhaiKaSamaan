export function SiteFooter() {
  return (
    <footer className="mt-16 bg-sky-700 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h2 className="font-display text-4xl">Built By</h2>
          <p className="mt-3 text-sm text-sky-100">Reach out for feedback, collaboration, or campus expansion.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="font-display text-2xl">Adwaith B Nair</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-semibold text-sky-100">College:</span> To be updated
              </p>
              <p>
                <span className="font-semibold text-sky-100">Instagram:</span>{" "}
                <a
                  href="https://www.instagram.com/adwaith_bnair?igsh=MWkzc2FueWsyYTV2cA=="
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-sky-200 underline-offset-4 hover:text-sky-100"
                >
                  @adwaith_bnair
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="font-display text-2xl">J M Kamalashewar</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-semibold text-sky-100">College:</span> Lovely Professional University
              </p>
              <p>
                <span className="font-semibold text-sky-100">Instagram:</span>{" "}
                <a
                  href="https://www.instagram.com/kamalashewar?igsh=MTFtcXo1c3ZvODRsZg=="
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-sky-200 underline-offset-4 hover:text-sky-100"
                >
                  @kamalashewar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
