import { galleryImages } from "../../data/restaurantData";

export default function GallerySection({ t }) {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
          {t.galleryTag}
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          {t.galleryTitle}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {galleryImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`${t.galleryAlt} ${idx + 1}`}
            className="h-80 w-full rounded-[2rem] object-cover shadow-xl"
          />
        ))}
      </div>
    </section>
  );
}