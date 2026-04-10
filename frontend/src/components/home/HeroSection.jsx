export default function HeroSection({ t, onOpenReservation, onOpenMenu, language }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="relative z-10">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-amber-300">
            {t.heroTag}
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-tight md:text-7xl">
            {t.heroTitle}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-stone-300 md:text-lg">
            {t.heroText}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onOpenMenu}
              className="rounded-2xl border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-6 py-3 font-medium text-[#f2d3a0] transition hover:bg-[#c9a56a]/20"
            >
              {language === "bg" ? "Виж менюто" : "View menu"}
            </button>

            <button
              type="button"
              onClick={onOpenReservation}
              className="rounded-2xl bg-amber-400 px-6 py-3 font-medium text-stone-950 transition hover:scale-[1.02]"
            >
              {t.openTableMap}
            </button>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">4.9</div>
              <div className="text-sm text-stone-400">{t.rating}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">40+</div>
              <div className="text-sm text-stone-400">{t.dishes}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">7/7</div>
              <div className="text-sm text-stone-400">{t.openDays}</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-amber-400/10 blur-3xl" />
          <img
            src="https://69c72778a9fb0ef7c011fcd6.imgix.net/edited_0.jpg"
            alt={t.interiorAlt}
            className="relative h-[520px] w-full rounded-[2rem] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}