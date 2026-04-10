export default function ChefHighlight({ data }) {
  const featuredItems = data.categories
    .flatMap((category) => category.items)
    .filter((item) => item.featured);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="mb-4 inline-flex rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d8b377]">
            {data.chefBadge}
          </div>

          <h2 className="text-3xl font-semibold md:text-4xl">{data.chefTitle}</h2>
          <p className="mt-5 leading-8 text-white/70">{data.chefText}</p>
        </div>

        <div className="grid gap-5">
          {featuredItems.map((item) => (
            <div
              key={item.name}
              className="rounded-[2rem] border border-[#c9a56a]/20 bg-gradient-to-br from-[#1d1510] to-[#120d0a] p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-white">{item.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                    {item.description}
                  </p>
                </div>
                <div className="rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2 text-sm font-medium text-[#f2d3a0]">
                  {item.price}
                </div>
              </div>

              <div className="mt-4 text-sm text-white/50">{item.weight}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}