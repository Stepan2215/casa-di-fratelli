export default function BookingModal({
  t,
  selectedTable,
  selectedSection,
  selectedTime,
  sectionLabels,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-stone-950 p-8 text-stone-100 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              {t.bookingFormTitle}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">{selectedTable.id}</h2>
            <p className="mt-4 text-stone-300">
              {t.bookingSummary}:{" "}
              <span className="font-semibold text-white">{selectedTable.id}</span> ·{" "}
              {sectionLabels[selectedSection]} · {selectedTime}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm transition hover:border-amber-300 hover:text-amber-300"
          >
            {t.closeForm}
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formName}</label>
            <input
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderName}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formPhone}</label>
            <input
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderPhone}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formEmail}</label>
            <input
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderEmail}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formGuests}</label>
            <select
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
            >
              <option value="">{t.selectGuests}</option>
              <option>{t.one}</option>
              <option>{t.two}</option>
              <option>{t.three}</option>
              <option>{t.four}</option>
              <option>{t.five}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formDate}</label>
            <input
              type="date"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formTime}</label>
            <input
              readOnly
              value={selectedTime}
              className="w-full rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-amber-100 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-stone-300">
              {t.formRequests}
            </label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderRequests}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-amber-400 px-6 py-4 font-medium text-stone-950 transition hover:scale-[1.01] sm:col-span-2"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}