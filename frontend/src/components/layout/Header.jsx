export default function Header({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
  onGoHome,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <button
  type="button"
  onClick={onGoHome}
  className="min-w-0 text-left transition hover:opacity-90"
>
  <div className="truncate text-lg font-semibold tracking-[0.06em] md:text-2xl">
    {t.brand}
  </div>
  <div className="truncate text-[10px] uppercase tracking-[0.25em] text-stone-400 md:text-xs md:tracking-[0.35em]">
    {t.subtitle}
  </div>
  <div className="mt-1 text-[9px] uppercase tracking-[0.28em] text-red-400 md:text-[10px] md:tracking-[0.4em]">
    By Sul N’ Mir
  </div>
</button>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 md:rounded-2xl">
              <button
                type="button"
                onClick={() => setLanguage("bg")}
                className={`rounded-lg px-2.5 py-1.5 text-xs transition md:rounded-xl md:px-3 md:py-2 md:text-sm ${
                  language === "bg"
                    ? "bg-amber-400 text-stone-950"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                BG
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-lg px-2.5 py-1.5 text-xs transition md:rounded-xl md:px-3 md:py-2 md:text-sm ${
                  language === "en"
                    ? "bg-amber-400 text-stone-950"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-4 md:justify-between">
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#about" className="transition hover:text-amber-300">
              {t.navAbout}
            </a>
            <button
              type="button"
              onClick={onOpenMenu}
              className="transition hover:text-amber-300"
            >
              {language === "bg" ? "Меню" : "Menu"}
            </button>
            <a href="#gallery" className="transition hover:text-amber-300">
              {t.navGallery}
            </a>
            <a href="#reservation" className="transition hover:text-amber-300">
              {t.navReservation}
            </a>
          </nav>

          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-3">
            <button
              type="button"
              onClick={onOpenMenu}
              className="rounded-xl border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2.5 text-sm font-medium text-[#f2d3a0] transition hover:bg-[#c9a56a]/20 md:rounded-2xl md:px-5 md:py-3"
            >
              {language === "bg" ? "Меню" : "Menu"}
            </button>

            <button
              type="button"
              onClick={onOpenReservation}
              className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-medium text-stone-950 shadow-lg transition hover:scale-[1.02] md:rounded-2xl md:px-5 md:py-3"
            >
              {t.reserveNow}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}