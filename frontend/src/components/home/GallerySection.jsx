import { galleryImages } from "../../data/restaurantData";

export default function GallerySection({ t }) {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
        <p className="section-kicker">
          {t.galleryTag}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#fff4df] md:text-5xl">
          {t.galleryTitle}
        </h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#c9a56a]/45 to-transparent md:max-w-sm" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {galleryImages.map((src, idx) => (
          <div
            key={src}
            className={`${idx === 1 ? "md:translate-y-8" : ""} reveal-fade group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/25`}
          >
            <img
              src={src}
              alt={`${t.galleryAlt} ${idx + 1}`}
              className="h-80 w-full rounded-[18px] object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
