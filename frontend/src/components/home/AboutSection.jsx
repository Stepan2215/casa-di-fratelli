export default function AboutSection({ t }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            {t.aboutTag}
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            {t.aboutTitle}
          </h2>
          <p className="mt-5 leading-8 text-stone-300">{t.aboutText}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {t.features.map(([title, text]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-white/10 bg-stone-900 p-6"
            >
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}