export default function Header({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
  onGoHome,
}) {
  const locationUrl =
    "https://www.google.com/maps/search/?api=1&query=Casa%20di%20Fratelli%20Plovdiv";
  const locationLabel = t.navLocation || (language === "bg" ? "Локация" : "Location");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090705]/78 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
  type="button"
  onClick={onGoHome}
  className="group min-w-0 text-left transition hover:opacity-95"
>
  <img
    src="/casa-di-fratelli-logo.svg"
    alt={t.brand}
    className="brand-logo h-12 w-[150px] object-left md:h-16 md:w-[210px]"
  />
</button>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage("bg")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition md:px-4 md:py-2 ${
                  language === "bg"
                    ? "bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                BG
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition md:px-4 md:py-2 ${
                  language === "en"
                    ? "bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-4 md:justify-between">
          <nav className="hidden gap-7 text-sm text-stone-300 md:flex">
            <a href="#about" className="transition hover:text-[#f2d39a]">
              {t.navAbout}
            </a>
            <button
              type="button"
              onClick={onOpenMenu}
              className="transition hover:text-[#f2d39a]"
            >
              {language === "bg" ? "Меню" : "Menu"}
            </button>
            <a href="#gallery" className="transition hover:text-[#f2d39a]">
              {t.navGallery}
            </a>
            <a
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#f2d39a]"
            >
              {locationLabel}
            </a>
            <a href="#reservation" className="transition hover:text-[#f2d39a]">
              {t.navReservation}
            </a>
          </nav>

          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-3">
            <a
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={locationLabel}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#c9a56a]/35 bg-[#f6ead4]/10 px-4 py-2.5 text-sm font-semibold text-[#fff4df] shadow-[0_14px_45px_rgba(201,165,106,0.14)] transition hover:-translate-y-0.5 hover:border-[#f2d39a]/70 hover:bg-[#f2d39a]/15 hover:text-white md:px-5 md:py-3"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,244,223,0.22),transparent_36%)] opacity-0 transition group-hover:opacity-100" />
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/25">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                  <path d="M12 10h.01" />
                </svg>
              </span>
              <span className="relative">{locationLabel}</span>
            </a>

            <button
              type="button"
              onClick={onOpenMenu}
              className="ghost-button rounded-full px-4 py-2.5 text-sm font-medium md:px-5 md:py-3"
            >
              {language === "bg" ? "Меню" : "Menu"}
            </button>

            <button
              type="button"
              onClick={onOpenReservation}
              className="luxury-button col-span-2 rounded-full px-4 py-2.5 text-sm font-semibold md:col-span-1 md:px-5 md:py-3"
            >
              {t.reserveNow}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
