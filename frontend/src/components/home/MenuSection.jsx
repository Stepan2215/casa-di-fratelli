import menuPageData from "../../data/menuPageData";

export default function MenuSection({ t, language }) {
  const data = menuPageData[language];

  const previewCategories = data.categories.slice(0, 3);

  return (
    <section id="menu" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            {t.menuTag}
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            {t.menuTitle}
          </h2>
        </div>

        <p className="max-w-xl text-stone-400">{t.menuText}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {previewCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-lg"
          >
            <h3 className="mb-6 text-2xl font-semibold text-amber-300">
              {category.title}
            </h3>

            <div className="space-y-5">
              {category.items.slice(0, 3).map((item) => (
                <div
                  key={item.name}
                  className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium text-white">
                        {item.name}
                      </div>
                      <div className="mt-1 text-sm text-stone-400">
                        {item.description}
                      </div>
                      <div className="mt-2 text-xs text-stone-500">
                        {item.weight}
                      </div>
                    </div>

                    <div className="whitespace-nowrap text-base font-semibold text-amber-300">
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}