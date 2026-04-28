export default function BookingModal({
  t,
  language = "bg",
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
              name="guestName"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderName}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formPhone}</label>
            <input
              name="phone"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderPhone}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formEmail}</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderEmail}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formGuests}</label>
            <select
              name="guestCount"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
            >
              <option value="">{t.selectGuests}</option>
              <option value="1">{t.one}</option>
              <option value="2">{t.two}</option>
              <option value="3">{t.three}</option>
              <option value="4">{t.four}</option>
              <option value="5">{t.five}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-300">{t.formDate}</label>
            <input
              name="reservedDate"
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

          <div className="sm:col-span-2 rounded-[1.5rem] border border-amber-400/25 bg-amber-500/10 p-5">
            <label className="mb-2 block text-sm text-amber-100">
              {language === "bg" ? "Дата на раждане" : "Date of birth"}
            </label>
            <input
              name="birthDate"
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-amber-300"
            />
            <p className="mt-3 text-sm leading-6 text-amber-100/80">
              {language === "bg"
                ? "Ако споделите датата си на раждане, ви очаква приятен бонус за вашия празник."
                : "Share your birthday and a special bonus will be waiting for your celebration."}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-stone-300">
              {t.formRequests}
            </label>
            <textarea
              name="notes"
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
              placeholder={t.placeholderRequests}
            />
          </div>

          <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="flex items-start gap-3 text-sm leading-6 text-stone-300">
              <input
                name="marketingConsent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-white/20 bg-stone-900"
              />
              <span>
                {language === "bg"
                  ? "Съгласявам се да получавам нови предложения, сезонни менюта и специални оферти от Casa di Fratelli по имейл."
                  : "I agree to receive new offers, seasonal menus, and special promotions from Casa di Fratelli by email."}
              </span>
            </label>
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