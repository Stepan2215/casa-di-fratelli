export default function AwardsSection({ language }) {
  const awards =
    language === "bg"
      ? [
          ["Любимо място за срещи", "Уютна атмосфера, авторска кухня и обслужване с внимание към детайла."],
          ["Signature кухня", "Италиански вкус, премиални продукти и предложения by Chef Yurukov."],
          ["Гостите ни избират", "Вечери, празници и семейни поводи, които се помнят."],
        ]
      : [
          ["Favorite meeting place", "Warm atmosphere, signature cuisine, and service with attention to detail."],
          ["Signature cuisine", "Italian flavor, premium ingredients, and selections by Chef Yurukov."],
          ["Chosen by guests", "Dinners, celebrations, and family moments made memorable."],
        ];

  return (
    <section id="awards" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">{language === "bg" ? "Награди" : "Awards"}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[#fff4df] md:text-5xl">
            {language === "bg" ? "Малки признания за големи вечери." : "Small honors for memorable evenings."}
          </h2>
        </div>
        <div className="max-w-md text-sm leading-7 text-white/60">
          {language === "bg"
            ? "Секция за отличия, препоръки и специални моменти на Casa di Fratelli."
            : "A place for recognitions, recommendations, and special Casa di Fratelli moments."}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {awards.map(([title, text], index) => (
          <article
            key={title}
            className="luxury-panel menu-spark rounded-[26px] p-6 transition hover:-translate-y-1"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a56a]/25 bg-[#c9a56a]/10 text-sm font-semibold text-[#f2d39a]">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/62">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
