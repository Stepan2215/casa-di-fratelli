export default function AboutSection({ t }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <div className="luxury-panel rounded-[28px] p-8 md:p-10">
          <p className="section-kicker">
            {t.aboutTag}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#fff4df] md:text-5xl">
            {t.aboutTitle}
          </h2>
          <p className="mt-5 leading-8 text-stone-300">{t.aboutText}</p>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#c9a56a]/40 to-transparent" />

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-[#f2d39a]">10:00</div>
              <div className="mt-1 text-stone-400">Open daily</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-[#b9e2c7]">Online</div>
              <div className="mt-1 text-stone-400">Table map</div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {t.features.map(([title, text], index) => (
            <div
              key={title}
              className={`rounded-[24px] border p-6 transition hover:-translate-y-1 ${
                index === 1
                  ? "border-emerald-300/15 bg-emerald-400/10"
                  : index === 2
                  ? "border-red-300/15 bg-red-500/10"
                  : "border-white/10 bg-white/[0.055]"
              }`}
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a56a]/25 bg-[#c9a56a]/10 text-sm font-semibold text-[#f2d39a]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold text-[#fff4df]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
