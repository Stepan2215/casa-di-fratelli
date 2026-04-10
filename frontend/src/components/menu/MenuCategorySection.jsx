export default function MenuCategorySection({ category }) {
  return (
    <section id={category.id} className="scroll-mt-44 md:scroll-mt-56">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold md:text-4xl">{category.title}</h2>
      </div>

      <div className="grid gap-5">
        {category.items.map((item) => (
          <div
            key={item.name}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:border-[#c9a56a]/30 hover:bg-white/[0.07]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                  {item.featured && (
                    <span className="rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d8b377]">
                      Signature
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  {item.description}
                </p>

                <div className="mt-4 text-sm text-white/45">{item.weight}</div>
              </div>

              <div className="rounded-2xl border border-[#c9a56a]/25 bg-[#c9a56a]/10 px-4 py-3 text-base font-semibold text-[#f2d3a0]">
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}