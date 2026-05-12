export default function ChefHighlight({ data }) {
  const featuredItems = data.categories
    .flatMap((category) => category.items)
    .filter((item) => item.featured);

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20">
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c9a56a]/10 blur-3xl" />
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[520px] overflow-hidden lg:min-h-[620px]">
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#090705] via-[#090705]/72 to-transparent" />
          <div className="absolute left-1/2 top-8 h-[560px] w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,165,106,0.24),transparent_62%)] blur-2xl" />
          <img
            src="/chef-yurukov.jpg"
            alt="Chef Yurukov"
            className="chef-float absolute inset-x-0 bottom-0 mx-auto h-[560px] w-full max-w-[500px] object-cover object-[50%_18%] drop-shadow-[0_34px_80px_rgba(0,0,0,0.55)] lg:h-[660px]"
          />
          <div className="absolute bottom-8 left-0 right-0 mx-auto w-fit rounded-full border border-[#c9a56a]/25 bg-black/35 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[#f2d39a] backdrop-blur">
            Chef Yurukov
          </div>
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d8b377]">
            {data.chefBadge}
          </div>

          <h2 className="max-w-xl text-4xl font-semibold leading-tight text-[#fff4df] md:text-5xl">{data.chefTitle}</h2>
          <p className="mt-5 max-w-2xl leading-8 text-white/70">{data.chefText}</p>

          <div className="mt-8 grid gap-4">
            {featuredItems.map((item) => (
              <div
                key={item.name}
                className="menu-spark rounded-[26px] border border-[#c9a56a]/18 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{item.name}</h3>
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
      </div>
    </section>
  );
}
