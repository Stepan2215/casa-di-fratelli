export default function ReservationPreviewSection({ t, onOpenReservation }) {
  return (
    <section id="reservation" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            {t.reservationTag}
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            {t.reservationTitle}
          </h2>
          <p className="mt-5 max-w-md leading-8 text-stone-300">
            {t.reservationText}
          </p>

          <div className="mt-8 space-y-4 text-stone-300">
            <div>
              <span className="font-semibold text-white">{t.address}:</span>{" "}
              ж.к. Христо Смирненски Западен, Vechernica 9, 4000 Пловдив
            </div>
            <div>
              <span className="font-semibold text-white">{t.phone}:</span>{" "}
              088 821 8318
            </div>
            <div>
              <span className="font-semibold text-white">{t.hours}:</span>{" "}
              {t.hoursValue}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-stone-900 p-8 shadow-xl">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-4 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-300">
              VIP Booking UX
            </div>

            <h3 className="text-2xl font-semibold">{t.reservationMapTitle}</h3>
            <p className="mt-4 leading-8 text-stone-300">{t.reservationMapText}</p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {t.smokingSection}
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {t.familySection}
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {t.terraceSection}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenReservation}
              className="mt-8 w-full rounded-2xl bg-amber-400 px-6 py-4 font-medium text-stone-950 transition hover:scale-[1.01]"
            >
              {t.openTableMap}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}