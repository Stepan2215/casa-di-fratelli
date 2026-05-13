import React from "react";

function LocationIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
      <path d="M12 10h.01" />
    </svg>
  );
}

export default function Header({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
  onGoHome,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const locationUrl =
    "https://www.google.com/maps/search/?api=1&query=Casa%20di%20Fratelli%20Plovdiv";
  const locationLabel = t.navLocation || (language === "bg" ? "Локация" : "Location");
  const menuLabel = language === "bg" ? "Меню" : "Menu";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openMenuPage = () => {
    closeMobileMenu();
    onOpenMenu();
  };

  const openReservationPage = () => {
    closeMobileMenu();
    onOpenReservation();
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    closeMobileMenu();
  };

  const mobileLinkClass =
    "flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-[#fff4df] transition active:scale-[0.98] hover:border-[#c9a56a]/35 hover:bg-[#c9a56a]/10";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090705]/82 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              onGoHome();
            }}
            className="group min-w-0 text-left transition hover:opacity-95"
          >
            <img
              src="/casa-di-fratelli-logo.svg"
              alt={t.brand}
              className="brand-logo h-11 w-[142px] object-left md:h-16 md:w-[210px]"
            />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-inner">
              <button
                type="button"
                onClick={() => changeLanguage("bg")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  language === "bg"
                    ? "bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                BG
              </button>
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  language === "en"
                    ? "bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <a
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={locationLabel}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a56a]/35 bg-[#c9a56a]/12 text-[#f2d39a] shadow-[0_10px_30px_rgba(201,165,106,0.14)] transition active:scale-95"
            >
              <LocationIcon />
            </a>

            <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-inner">
              {["bg", "en"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeLanguage(code)}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    language === code
                      ? "bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/20"
                      : "text-stone-300"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] text-[#fff4df] shadow-inner transition active:scale-95"
            >
              <span
                className={`h-[1.5px] w-4 rounded-full bg-current transition ${
                  mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-4 rounded-full bg-current transition ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-4 rounded-full bg-current transition ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between gap-3 md:flex">
          <nav className="flex gap-7 text-sm text-stone-300">
            <a href="#about" className="transition hover:text-[#f2d39a]">
              {t.navAbout}
            </a>
            <button
              type="button"
              onClick={onOpenMenu}
              className="transition hover:text-[#f2d39a]"
            >
              {menuLabel}
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

          <div className="flex items-center gap-3">
            <a
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={locationLabel}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#c9a56a]/35 bg-[#f6ead4]/10 px-5 py-3 text-sm font-semibold text-[#fff4df] shadow-[0_14px_45px_rgba(201,165,106,0.14)] transition hover:-translate-y-0.5 hover:border-[#f2d39a]/70 hover:bg-[#f2d39a]/15 hover:text-white"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,244,223,0.22),transparent_36%)] opacity-0 transition group-hover:opacity-100" />
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a56a] text-stone-950 shadow-lg shadow-[#c9a56a]/25">
                <LocationIcon className="h-3.5 w-3.5" />
              </span>
              <span className="relative">{locationLabel}</span>
            </a>

            <button
              type="button"
              onClick={onOpenMenu}
              className="ghost-button rounded-full px-5 py-3 text-sm font-medium"
            >
              {menuLabel}
            </button>

            <button
              type="button"
              onClick={onOpenReservation}
              className="luxury-button rounded-full px-5 py-3 text-sm font-semibold"
            >
              {t.reserveNow}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileMenuOpen ? "mt-3 max-h-[440px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="rounded-[26px] border border-white/10 bg-[#15110d]/92 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <a href="#about" onClick={closeMobileMenu} className={mobileLinkClass}>
              {t.navAbout}
              <span className="text-[#c9a56a]">01</span>
            </a>
            <button
              type="button"
              onClick={openMenuPage}
              className={`${mobileLinkClass} mt-2 w-full text-left`}
            >
              <span>{menuLabel}</span>
              <span className="text-[#c9a56a]">02</span>
            </button>
            <a href="#gallery" onClick={closeMobileMenu} className={`${mobileLinkClass} mt-2`}>
              {t.navGallery}
              <span className="text-[#c9a56a]">03</span>
            </a>
            <a
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closeMobileMenu}
              className={`${mobileLinkClass} mt-2`}
            >
              <span className="inline-flex items-center gap-2">
                <LocationIcon className="h-4 w-4 text-[#c9a56a]" />
                {locationLabel}
              </span>
              <span className="text-[#c9a56a]">04</span>
            </a>
            <button
              type="button"
              onClick={openReservationPage}
              className="luxury-button mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              {t.reserveNow}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
