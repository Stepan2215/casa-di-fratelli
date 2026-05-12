export default function Header({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
  onGoHome,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090705]/78 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
  type="button"
  onClick={onGoHome}
  className="group min-w-0 text-left transition hover:opacity-95"
>
  <div className="truncate text-lg font-semibold tracking-[0.06em] text-[#fff4df] md:text-2xl">
    {t.brand}
  </div>
  <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-stone-400 md:text-[10px]">
    <span>{t.subtitle}</span>
    <span className="h-1 w-1 rounded-full bg-[#c9a56a]" />
    <span className="text-[#d8b377]">By Sul N' Mir</span>
  </div>
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
            <a href="#reservation" className="transition hover:text-[#f2d39a]">
              {t.navReservation}
            </a>
          </nav>

          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-3">
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
              className="luxury-button rounded-full px-4 py-2.5 text-sm font-semibold md:px-5 md:py-3"
            >
              {t.reserveNow}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
