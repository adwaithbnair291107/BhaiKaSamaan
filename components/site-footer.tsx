export function SiteFooter() {
  return (
    <footer className="mt-16 bg-sky-700 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-sky-100">Maker</p>
          <h2 className="mt-2 font-display text-3xl">Adwaith B Nair</h2>
          <p className="mt-3 text-sm text-sky-100">Built for student resale, with the college name to be added soon.</p>
        </div>

        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold text-sky-100">College:</span> To be updated
          </p>
          <p>
            <span className="font-semibold text-sky-100">Email:</span>{" "}
            <a href="mailto:adwaithbnair3621@gmail.com" className="underline decoration-sky-200 underline-offset-4 hover:text-sky-100">
              adwaithbnair3621@gmail.com
            </a>
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
    </footer>
  );
}
