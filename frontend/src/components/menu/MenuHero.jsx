import { chefImage } from "../../data/restaurantData";

export default function MenuHero({ data, onOpenReservation, language }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,165,106,0.18),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d8b377]">
            {data.heroBadge}
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-tight md:text-7xl">
            {data.heroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            {data.heroText}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onOpenReservation}
              className="rounded-2xl bg-[#c9a56a] px-6 py-3 font-medium text-black transition hover:scale-[1.02]"
            >
              {language === "bg" ? "Резервирай маса" : "Reserve table"}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-[#c9a56a]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <img
              src={chefImage}
              alt="Chef"
              className="h-[560px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="mb-2 text-xs uppercase tracking-[0.3em] text-[#d8b377]">
                {language === "bg" ? "Шеф готвач" : "Chef portrait"}
              </div>
              <div className="text-3xl font-serif text-white">Chef Yurukov</div>
              <div className="mt-2 text-sm text-white/70">
                {language === "bg"
                  ? "Авторски ястия, премиални продукти и стилно поднасяне."
                  : "Signature dishes, premium ingredients, and refined presentation."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}