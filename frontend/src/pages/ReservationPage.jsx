import React from "react";
import { API_BASE_URL } from "../config/api";

const gardenTables = [
  { id: "42", x: 10, y: 22, seats: 4 },
  { id: "43", x: 10, y: 42, seats: 4 },
  { id: "44", x: 10, y: 62, seats: 4 },
  { id: "45", x: 10, y: 82, seats: 4 },
  { id: "38", x: 33, y: 24, seats: 4 },
  { id: "39", x: 33, y: 44, seats: 4 },
  { id: "40", x: 33, y: 64, seats: 4 },
  { id: "41", x: 33, y: 84, seats: 4 },
  { id: "34", x: 62, y: 24, seats: 4 },
  { id: "35", x: 62, y: 44, seats: 4 },
  { id: "36", x: 62, y: 64, seats: 4 },
  { id: "37", x: 62, y: 84, seats: 4 },
  { id: "30", x: 85, y: 22, seats: 4 },
  { id: "31", x: 85, y: 42, seats: 4 },
  { id: "32", x: 85, y: 62, seats: 4 },
  { id: "33", x: 85, y: 82, seats: 4 },
  { id: "34A", x: 60, y: 8, seats: 4, special: true },
  { id: "30A", x: 82, y: 8, seats: 4, special: true },
  { id: "45A", x: 24, y: 94, seats: 4, special: true },
];

const indoorTables = [
  { id: "1", x: 83, y: 12, seats: 4, wide: true },
  { id: "2", x: 83, y: 22, seats: 4, wide: true },
  { id: "3", x: 83, y: 32, seats: 4, wide: true },
  { id: "4", x: 83, y: 42, seats: 4, wide: true },
  { id: "5", x: 51, y: 22, seats: 6, wide: true },
  { id: "6", x: 51, y: 35, seats: 6, wide: true },
  { id: "7", x: 16, y: 10, seats: 4, wide: true },
  { id: "8", x: 16, y: 20, seats: 6, wide: true },
  { id: "9", x: 16, y: 30, seats: 6, wide: true },
  { id: "10", x: 16, y: 40, seats: 6, wide: true },
  { id: "11", x: 16, y: 50, seats: 6, wide: true },
  { id: "20", x: 82, y: 60, seats: 4, wide: true },
  { id: "21", x: 82, y: 70, seats: 4, wide: true },
  { id: "22", x: 82, y: 80, seats: 4, wide: true },
  { id: "23", x: 82, y: 90, seats: 4, wide: true },
  { id: "24", x: 53, y: 65, seats: 6, wide: true },
  { id: "25", x: 54, y: 78, seats: 6 },
  { id: "26", x: 55, y: 90, seats: 4, wide: true },
  { id: "27", x: 35, y: 92, seats: 4, wide: true },
  { id: "28", x: 16, y: 90, seats: 6, wide: true },
  { id: "29", x: 16, y: 80, seats: 6, wide: true },
];

const gardenGroups = [
  ["42", "43", "44", "45"],
  ["38", "39", "40", "41"],
  ["34", "35", "36", "37"],
  ["30", "31", "32", "33"],
];

const groupableIndoorIds = ["5", "6", "20", "21", "22", "23", "28", "29"];

const reservationTimes = Array.from({ length: 13 }, (_, index) => {
  const hour = 10 + index;
  return `${String(hour).padStart(2, "0")}:00`;
});

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isPastTimeForDate(dateValue, timeValue) {
  if (!dateValue || !timeValue) return false;

  const today = getTodayInputValue();
  if (dateValue !== today) return false;

  const now = new Date();
  const [hours, minutes] = timeValue.split(":").map(Number);
  const selected = new Date();
  selected.setHours(hours, minutes, 0, 0);

  return selected <= now;
}

function isWithinReservationBuffer(firstTime, secondTime) {
  const toMinutes = (value) => {
    const [hours, minutes] = String(value || "").split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
  };

  const first = toMinutes(firstTime);
  const second = toMinutes(secondTime);

  if (first === null || second === null) return firstTime === secondTime;

  return Math.abs(first - second) < 60;
}

function isContinuousTerraceSelection(selectedTables, nextTable) {
  const ids = [...selectedTables.map((table) => table.id), nextTable.id];

  const matchingGroup = gardenGroups.find((group) =>
    ids.every((id) => group.includes(id))
  );

  if (!matchingGroup) return false;

  const indexes = [...new Set(ids)]
    .map((id) => matchingGroup.indexOf(id))
    .sort((a, b) => a - b);

  for (let i = 1; i < indexes.length; i += 1) {
    if (indexes[i] - indexes[i - 1] !== 1) return false;
  }

  return true;
}

function canCombineTables(area, selectedTables, nextTable) {
  if (!selectedTables.length) return true;

  if (area === "garden") {
    if (nextTable.special) return false;
    if (selectedTables.some((table) => table.special)) return false;
    return isContinuousTerraceSelection(selectedTables, nextTable);
  }

  const allowedGroups = [
    ["5", "6"],
    ["20", "21", "22", "23"],
    ["28", "29"],
  ];

  const currentIds = selectedTables.map((table) => table.id);
  const nextIds = [...currentIds, nextTable.id];

  return allowedGroups.some((group) => nextIds.every((id) => group.includes(id)));
}

function ZoneCard({ title, subtitle, accent, children }) {
  return (
    <div className="luxury-panel rounded-[28px] p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#fff4df]">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
        <div className="rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#f2d39a]">
          {accent}
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 pb-2">
      <span className="text-white/55">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

function MapWindow({ className = "", label, vertical = false }) {
  return (
    <div className={`pointer-events-none absolute z-10 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-sky-200/35 bg-sky-100/[0.08] shadow-[0_0_34px_rgba(125,211,252,0.16)] backdrop-blur ${
          vertical ? "h-44 w-10" : "h-10 w-44"
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_36%),repeating-linear-gradient(90deg,transparent_0_22%,rgba(186,230,253,0.24)_22%_23%,transparent_23%_46%)]" />
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sky-100/35" />
        <div className="absolute bottom-1 left-2 right-2 h-px bg-white/20" />
        <div
          className={`relative flex h-full w-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.24em] text-sky-100/90 ${
            vertical ? "-rotate-90 whitespace-nowrap" : ""
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function TerraceEntry({ label }) {
  return (
    <div className="pointer-events-none absolute left-[47%] top-[78%] z-10 w-[24%] text-center">
      <div className="mx-auto mb-2 h-10 w-24 rounded-t-full border-x border-t border-[#d6b278]/50 bg-[radial-gradient(circle_at_50%_100%,rgba(214,178,120,0.25),transparent_62%)] shadow-[0_0_24px_rgba(214,178,120,0.14)]" />
      <div className="rounded-full border border-[#c9a56a]/28 bg-black/28 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#f2d39a] backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function WallTv({ label }) {
  return (
    <div className="pointer-events-none absolute left-[3%] top-[49%] z-10">
      <div className="relative h-20 w-8 rounded-xl border border-white/18 bg-[#080706] shadow-[0_0_30px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-1 rounded-lg bg-[linear-gradient(160deg,rgba(56,189,248,0.28),rgba(255,255,255,0.08)_42%,rgba(20,184,166,0.16))]" />
        <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-white/25" />
      </div>
      <div className="mt-2 -translate-x-3 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white/60">
        {label}
      </div>
    </div>
  );
}

function GardenTable({ table, selected, reserved, onSelect }) {
  const commonClass = `absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
    reserved ? "cursor-not-allowed opacity-75" : selected ? "scale-110" : "hover:scale-105"
  }`;

  if (table.special) {
    return (
      <button
        type="button"
        disabled={reserved}
        onClick={() => onSelect(table, "garden")}
        className={commonClass}
        style={{ left: `${table.x}%`, top: `${table.y}%` }}
      >
        <div
          className={`rounded-xl border px-3 py-2 text-xs font-medium shadow-lg ${
            selected
              ? "border-[#d7b57f] bg-[#d7b57f]/22 text-[#f7ddb2]"
              : reserved
              ? "border-red-400/30 bg-red-500/10 text-red-200"
              : "border-white/15 bg-white/5 text-white/80"
          }`}
        >
          {table.id}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={reserved}
      onClick={() => onSelect(table, "garden")}
      className={commonClass}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
    >
      <div className="relative h-[80px] w-[80px]">
        {[{ x: 32, y: -4 }, { x: 32, y: 68 }, { x: -4, y: 32 }, { x: 68, y: 32 }].map(
          (chair, index) => (
            <div
              key={index}
              className={`absolute h-4 w-4 rounded-[7px] border shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_5px_12px_rgba(0,0,0,0.24)] ${
                reserved
                  ? "border-red-400/20 bg-[#3b1d1d]"
                  : "border-[#d8b377]/30 bg-[linear-gradient(145deg,#4a382b,#211914)]"
              }`}
              style={{ left: chair.x, top: chair.y }}
            />
          )
        )}

        <div
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] text-xs font-semibold transition-all duration-300 ${
            selected
              ? "bg-[linear-gradient(145deg,#f6d99e,#b88b4d)] text-black shadow-[0_14px_30px_rgba(201,165,106,0.3)] ring-4 ring-[#d7b57f]/15"
              : reserved
              ? "border border-red-400/30 bg-[#4a1f1f] text-red-100"
              : "border border-[#c9a56a]/40 bg-[linear-gradient(145deg,#5a4332,#2a1f18)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_24px_rgba(0,0,0,0.28)]"
          }`}
        >
          <span className="absolute inset-1 rounded-[14px] border border-white/8" />
          {table.id}
        </div>
      </div>
    </button>
  );
}

function GardenMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[570px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(60,169,126,0.13),_transparent_34%),linear-gradient(180deg,rgba(34,40,28,0.96),rgba(16,18,13,0.96))] shadow-inner">
      <div className="absolute inset-5 rounded-[22px] border border-[#c9a56a]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:42px_42px]" />
      <MapWindow className="left-1/2 top-4 -translate-x-1/2" label={labels.windows} />
      <MapWindow className="left-4 top-1/2 -translate-y-1/2" label={labels.windows} vertical />
      <MapWindow className="right-4 top-1/2 -translate-y-1/2" label={labels.windows} vertical />
      <WallTv label={labels.tv} />
      <TerraceEntry label={labels.terraceEntrance} />

      {tables.map((table) => (
        <GardenTable
          key={table.id}
          table={table}
          selected={selectedIds.includes(table.id)}
          reserved={false}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function SixSeatChairs({ reserved }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={`top-${i}`}
          className={`absolute h-3 w-4 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`}
          style={{ left: i * 18 + 10, top: -8 }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`bottom-${i}`}
          className={`absolute h-3 w-4 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`}
          style={{ left: i * 18 + 10, top: 36 }}
        />
      ))}
    </>
  );
}

function FourSeatChairs({ reserved }) {
  return (
    <>
      <div className={`absolute h-3 w-4 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: "50%", top: -8, transform: "translateX(-50%)" }} />
      <div className={`absolute h-3 w-4 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: "50%", top: 36, transform: "translateX(-50%)" }} />
      <div className={`absolute h-4 w-3 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: 0, top: 14 }} />
      <div className={`absolute h-4 w-3 rounded-[6px] border border-[#c9a56a]/20 ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ right: 0, top: 14 }} />
    </>
  );
}

function IndoorTable({ table, selected, reserved, onSelect, labels }) {
  return (
    <button
      type="button"
      disabled={reserved}
      onClick={() => onSelect(table, "indoor")}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        reserved ? "cursor-not-allowed opacity-75" : selected ? "scale-110" : "hover:scale-105"
      }`}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
    >
      <div className="relative flex min-w-[70px] flex-col items-center">
        {table.seats === 6 && <SixSeatChairs reserved={reserved} />}
        {table.seats === 4 && <FourSeatChairs reserved={reserved} />}

        <div
          className={`flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
            table.wide ? "h-[40px] w-[70px]" : "h-[40px] w-[50px]"
          } ${
            selected
              ? "bg-[linear-gradient(145deg,#f6d99e,#b88b4d)] text-black shadow-lg ring-4 ring-[#d7b57f]/15"
              : reserved
              ? "border border-red-400/30 bg-[#4a1f1f] text-red-100"
              : "border border-[#c9a56a]/35 bg-[linear-gradient(145deg,#5a4332,#2a1f18)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_22px_rgba(0,0,0,0.26)]"
          }`}
        >
          {table.id}
        </div>

        <div className="mt-2 text-center text-[10px] text-white/45">
  {table.seats} {labels.seats}
</div>
      </div>
    </button>
  );
}

function IndoorMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(201,165,106,0.14),_transparent_34%),linear-gradient(180deg,rgba(39,27,21,0.96),rgba(16,12,10,0.96))]">
      <div className="absolute inset-5 rounded-[22px] border border-dashed border-[#c9a56a]/15" />
      <div className="absolute left-[16%] top-[88%] w-[18%] text-center text-[10px] uppercase tracking-[0.22em] text-[#d6b278]">
        {labels.entrance}
      </div>

      {tables.map((table) => (
        <IndoorTable
          key={table.id}
          table={table}
          selected={selectedIds.includes(table.id)}
          reserved={false}
          onSelect={onSelect}
          labels={labels}
        />
      ))}
    </div>
  );
}

function BookingModal({
  t,
  language,
  selectedTables,
  selectedArea,
  selectedTime,
  reservationDate,
  guestCount,
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) {
  const areaLabel = selectedArea === "garden" ? t.smokingSection : t.familySection;

  return (
    <div className="fixed inset-0 z-[70] bg-black/78 backdrop-blur-md">
      <div className="h-full overflow-y-auto overscroll-contain px-4 py-6">
        <div className="luxury-panel mx-auto w-full max-w-2xl rounded-[28px] p-5 text-stone-100 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">
                {t.bookingFormTitle}
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#fff4df]">
                {selectedTables.length > 1
                  ? `${language === "bg" ? "Маси" : "Tables"}: ${selectedTables.map((table) => table.id).join(", ")}`
                  : `${t.selectedTable}: ${selectedTables[0]?.id}`}
              </h2>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-sm text-stone-300">
                  {areaLabel} · {guestCount} {t.people} · {reservationDate} · {selectedTime}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ghost-button rounded-full px-4 py-2 text-sm"
            >
              {t.closeForm}
            </button>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-stone-300">{t.formName}</label>
              <input
                name="guestName"
                required
                className="quiet-input w-full rounded-2xl px-4 py-3"
                placeholder={t.placeholderName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-stone-300">{t.formPhone}</label>
              <input
                name="phone"
                required
                className="quiet-input w-full rounded-2xl px-4 py-3"
                placeholder={t.placeholderPhone}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-stone-300">{t.formEmail}</label>
              <input
                name="email"
                type="email"
                required
                className="quiet-input w-full rounded-2xl px-4 py-3"
                placeholder={t.placeholderEmail}
              />
            </div>

            <div className="sm:col-span-2 rounded-[1.5rem] border border-amber-400/25 bg-amber-500/10 p-5">
              <label className="mb-2 block text-sm text-amber-100">
                {language === "bg" ? "Дата на раждане (опционално)" : "Date of birth (optional)"}
              </label>
              <div className="relative">
                <input
                  name="birthDate"
                  type="date"
                  className="quiet-input w-full max-w-full rounded-2xl px-4 py-3 pr-12 [color-scheme:dark]"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a56a]/25 bg-[#c9a56a]/10 text-xs text-[#f2d39a]">
                  {language === "bg" ? "Д" : "D"}
                </div>
              </div>
              <p className="mt-3 text-sm text-amber-100/80">
                {language === "bg"
                  ? "Очаква ви приятен бонус за вашия рожден ден."
                  : "A special birthday bonus is waiting for you."}
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-stone-300">
                {t.formRequests}
              </label>
              <textarea
                name="notes"
                rows={4}
                className="quiet-input w-full rounded-2xl px-4 py-3"
                placeholder={t.placeholderRequests}
              />
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="flex items-start gap-3 text-sm text-stone-300">
                <input name="marketingConsent" type="checkbox" className="mt-1" />
                <span>
                  {language === "bg"
                    ? "Съгласявам се да получавам нови предложения и оферти по имейл."
                    : "I agree to receive offers and promotions by email."}
                </span>
              </label>
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4">
              <label className="flex items-start gap-3 text-sm leading-6 text-stone-200">
                <input name="privacyConsent" type="checkbox" required className="mt-1" />
                <span>
                  {language === "bg"
                    ? "Съгласявам се Casa di Fratelli да обработи данните ми за целите на резервацията. Политика за поверителност: използваме данните само за потвърждение, обслужване на резервацията и, ако сте отметнали, за оферти."
                    : "I agree that Casa di Fratelli may process my data for this reservation. Privacy policy: we use the data only to confirm and manage the reservation and, if checked, to send offers."}
                </span>
              </label>
            </div>

            {submitError && (
              <div className="sm:col-span-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="sm:col-span-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {submitSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-2xl px-6 py-4 font-medium sm:col-span-2 ${
                isSubmitting
                  ? "cursor-not-allowed bg-white/10 text-white/40"
                  : "luxury-button"
              }`}
            >
              {isSubmitting
                ? language === "bg"
                  ? "Изпращане..."
                  : "Submitting..."
                : t.submit}
            </button>
          </form>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage({ t, language, setLanguage, onBack }) {
  const today = React.useMemo(() => getTodayInputValue(), []);

  const [reservationDate, setReservationDate] = React.useState("");
  const [guestCount, setGuestCount] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState("indoor");
  const [selectedTables, setSelectedTables] = React.useState([]);
  const [showBookingForm, setShowBookingForm] = React.useState(false);
  const [blockedSlots, setBlockedSlots] = React.useState([]);
  const timeSelectionRef = React.useRef(null);
  const mapSectionRef = React.useRef(null);

  React.useEffect(() => {
    async function loadBlockedSlots() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reservations/blocked-slots`);
        const data = await response.json();
        setBlockedSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load blocked slots", error);
      }
    }

    loadBlockedSlots();
    const intervalId = setInterval(loadBlockedSlots, 10000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    if (reservationDate && selectedTime && isPastTimeForDate(reservationDate, selectedTime)) {
      setSelectedTime("");
      setSelectedTables([]);
    }
  }, [reservationDate, selectedTime]);

  const labels = {
    perimeter: language === "bg" ? "Периметър" : "Garden perimeter",
    entrance: language === "bg" ? "Вход" : "Entrance",
    terraceEntrance: language === "bg" ? "Вход към терасата" : "Entrance to terrace",
    windows: language === "bg" ? "Прозорци" : "Windows",
    tv: language === "bg" ? "Телевизор" : "TV",
    gardenTitle: language === "bg" ? "Тераса / Пушачи" : "Terrace / Smoking",
    gardenSubtitle: language === "bg" ? "Подходяща зона за пушачи" : "Smoking area",
    indoorTitle: language === "bg" ? "Зала / Непушачи" : "Hall / Non-smoking",
    indoorSubtitle: language === "bg" ? "Комбинация от маси за 4 и 6 души" : "Mix of 4-seat and 6-seat tables",
    selectedTable: language === "bg" ? "Избрана маса" : "Selected table",
    reservationPreview: language === "bg" ? "Детайли за резервацията" : "Reservation details",
    table: language === "bg" ? "Маса" : "Table",
    capacity: language === "bg" ? "Капацитет" : "Capacity",
    reserveSelected: language === "bg" ? "Резервирай" : "Reserve",
    seats: language === "bg" ? "места" : "seats",
  };

  const requestedGuests = Number(guestCount || 0);
  const canShowSearchParams = Boolean(selectedArea && reservationDate && selectedTime && guestCount);

  React.useEffect(() => {
  if (canShowSearchParams && window.innerWidth < 1024) {
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  }
}, [canShowSearchParams]);


  const bookingMode =
    selectedArea === "garden"
      ? requestedGuests > 4
        ? "group"
        : "single"
      : requestedGuests >= 7
      ? "group"
      : "single";

  const selectedDateBlockedSlots = blockedSlots.filter((slot) => {
    const slotDate = slot.reservedDate || slot.ReservedDate;
    const slotTime = slot.reservedTime || slot.ReservedTime;

    return slotDate === reservationDate && isWithinReservationBuffer(slotTime, selectedTime);
  });

  const blockedTableIds = new Set(
    selectedDateBlockedSlots.flatMap((slot) => slot.tableIds || slot.TableIds || [])
  );

  const selectedIds = selectedTables.map((table) => table.id);
  const totalSeats = selectedTables.reduce((sum, table) => sum + table.seats, 0);
  const hasEnoughSeats = totalSeats >= requestedGuests;
  const shouldHideUnselectedTables = bookingMode === "group" && selectedTables.length > 0 && hasEnoughSeats;

  const canShowTable = (table, area) => {
    if (!canShowSearchParams) return false;
    if (area !== selectedArea) return false;
    if (blockedTableIds.has(table.id)) return false;

    const isSelected = selectedTables.some((selected) => selected.id === table.id);

    if (shouldHideUnselectedTables) {
      return isSelected;
    }

if (bookingMode === "single") {
  if (requestedGuests <= 2) return table.seats <= 4;
  return table.seats >= requestedGuests && table.seats <= requestedGuests + 2;
}

    if (selectedTables.length === 0) {
      if (area === "garden") return !table.special;
      return groupableIndoorIds.includes(table.id);
    }

    if (isSelected) return true;

    return canCombineTables(area, selectedTables, table);
  };

  const visibleGardenTables = gardenTables.filter((table) => canShowTable(table, "garden"));
  const visibleIndoorTables = indoorTables.filter((table) => canShowTable(table, "indoor"));

  const handleSelect = (table, area) => {
    if (!canShowSearchParams) return;
    if (blockedTableIds.has(table.id)) return;

    if (bookingMode === "single") {
      setSelectedArea(area);
      setSelectedTables([table]);

      if (window.innerWidth < 1024) {
        setTimeout(() => {
          timeSelectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
      }

      return;
    }

    setSelectedArea(area);

    setSelectedTables((prev) => {
      const exists = prev.some((item) => item.id === table.id);

      if (exists) {
        return prev.filter((item) => item.id !== table.id);
      }

      const currentSeats = prev.reduce((sum, item) => sum + item.seats, 0);
      if (currentSeats >= requestedGuests) return prev;

      if (!canCombineTables(area, prev, table)) return prev;

      return [...prev, table];
    });
  };

  const canOpenForm = canShowSearchParams && selectedTables.length > 0 && hasEnoughSeats;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      guestName: String(formData.get("guestName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      birthDate: String(formData.get("birthDate") || "") || null,
      marketingConsent: formData.get("marketingConsent") === "on",
      privacyConsent: formData.get("privacyConsent") === "on",
      guestCount: Number(guestCount || 0),
      area: selectedArea,
      reservedTime: selectedTime,
      reservedDate: reservationDate,
      notes: String(formData.get("notes") || ""),
      tableIds: selectedTables.map((table) => table.id),
    };

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let result = null;

      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        const backendMessage =
          result?.message ||
          rawText ||
          (language === "bg"
            ? "Възникна проблем при изпращането на резервацията."
            : "There was a problem submitting the reservation.");

        setSubmitSuccess("");
        setSubmitError(backendMessage);
        return;
      }

      setSubmitError("");
      setSubmitSuccess(
        language === "bg"
          ? "Резервацията беше изпратена успешно."
          : "Reservation submitted successfully."
      );

      form?.reset?.();

      setTimeout(() => {
        setShowBookingForm(false);
        setSelectedTables([]);
        setSubmitSuccess("");
        setSubmitError("");
      }, 1200);
    } catch (error) {
      console.error(error);
      setSubmitSuccess("");
      setSubmitError(
        language === "bg"
          ? "Възникна проблем при връзката със сървъра."
          : "There was a problem connecting to the server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const zoneTitle = selectedArea === "garden" ? labels.gardenTitle : labels.indoorTitle;
  const zoneSubtitle = selectedArea === "garden" ? labels.gardenSubtitle : labels.indoorSubtitle;
  const zoneAccent = selectedArea === "garden" ? t.smokeLabel : t.mainLabel;
  const zonePreviewImage = selectedArea === "garden" ? "/restaurant-terrace.jpg" : "/restaurant-interior.webp";

  return (
    <>
      <div className="luxury-shell min-h-screen p-4 text-white md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="luxury-panel rounded-[28px] p-5 md:p-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <img
                src="/casa-di-fratelli-logo.svg"
                alt="Casa di Fratelli"
                className="brand-logo mb-4 h-16 w-[220px] object-left"
              />
              <div className="section-kicker mb-3">
                Luxury reservation map
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-[#fff4df] md:text-6xl">Casa di Fratelli</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                {language === "bg"
                  ? "Изберете зона, дата, час и брой гости, след което ще видите подходящите свободни маси."
                  : "Select area, date, time and number of guests, then view suitable available tables."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <button type="button" onClick={() => setLanguage("bg")} className={`rounded-full px-4 py-2 ${language === "bg" ? "bg-[#c9a56a] text-black" : "border border-white/15 bg-white/5 text-white"}`}>
                BG
              </button>

              <button type="button" onClick={() => setLanguage("en")} className={`rounded-full px-4 py-2 ${language === "en" ? "bg-[#c9a56a] text-black" : "border border-white/15 bg-white/5 text-white"}`}>
                EN
              </button>

              <button type="button" onClick={onBack} className="ghost-button rounded-full px-4 py-2">
                {t.backToSite}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            <div ref={timeSelectionRef} className="luxury-panel order-first rounded-[28px] p-5 md:p-6 lg:order-last">
              <div className="section-kicker mb-2">
                {labels.reservationPreview}
              </div>

              <h3 className="mb-4 text-2xl font-semibold text-[#fff4df]">
                {language === "bg" ? "Данни за посещението" : "Visit details"}
              </h3>

              <div className="mb-5 grid gap-3">
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    {language === "bg" ? "Зона" : "Area"}
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value);
                      setSelectedTables([]);
                    }}
                    className="quiet-input w-full cursor-pointer rounded-2xl px-4 py-3 [color-scheme:dark]"
                  >
                    <option value="indoor">
                      {language === "bg" ? "Зала / Непушачи" : "Hall / Non-smoking"}
                    </option>
                    <option value="garden">
                      {language === "bg" ? "Тераса / Пушачи" : "Terrace / Smoking"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    {language === "bg" ? "Дата" : "Date"}
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={reservationDate}
                    onChange={(e) => {
                      setReservationDate(e.target.value);
                      setSelectedTime("");
                      setSelectedTables([]);
                    }}
                    className="quiet-input w-full cursor-pointer rounded-2xl px-4 py-3 [color-scheme:dark]"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      [today, language === "bg" ? "Днес" : "Today"],
                      [
                        (() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
                        })(),
                        language === "bg" ? "Утре" : "Tomorrow",
                      ],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setReservationDate(value);
                          setSelectedTime("");
                          setSelectedTables([]);
                        }}
                        className={`rounded-xl px-3 py-2 text-sm transition ${
                          reservationDate === value
                            ? "luxury-button"
                            : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-[#c9a56a]/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    {language === "bg" ? "Час" : "Time"}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      setSelectedTables([]);
                    }}
                    className="quiet-input w-full cursor-pointer rounded-2xl px-4 py-3 [color-scheme:dark]"
                  >
                    <option value="">{language === "bg" ? "Избери час" : "Select time"}</option>
                    {reservationTimes.map((time) => (
                      <option
                        key={time}
                        value={time}
                        disabled={isPastTimeForDate(reservationDate, time)}
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    {language === "bg" ? "Брой гости" : "Guests"}
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(e.target.value);
                      setSelectedTables([]);
                    }}
                    className="quiet-input w-full cursor-pointer rounded-2xl px-4 py-3 [color-scheme:dark]"
                  >
                    <option value="">{language === "bg" ? "Избери" : "Select"}</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {bookingMode === "group" && (
                <div className="mb-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {language === "bg"
                    ? "За този брой гости ще изберем комбинирани маси."
                    : "For this number of guests, combined tables will be used."}
                </div>
              )}

              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1411] shadow-2xl shadow-black/25">
                <img src={zonePreviewImage} alt="Restaurant zone preview" className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-center opacity-55 blur-[1px] transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.25em] text-[#d8b377]">
                    {canShowSearchParams
                      ? language === "bg"
                        ? "Свободни маси"
                        : "Available tables"
                      : language === "bg"
                      ? "Първо изберете детайли"
                      : "Select details first"}
                  </div>
                  <div className="text-2xl font-serif">
                    {selectedTables.length
                      ? selectedTables.map((table) => table.id).join(", ")
                      : language === "bg"
                      ? "Няма избрана маса"
                      : "No table selected"}
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    {selectedArea === "garden" ? t.smokingSection : t.familySection} · {guestCount || "—"} {t.people}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <InfoRow label={language === "bg" ? "Зона" : "Area"} value={selectedArea === "garden" ? t.smokingSection : t.familySection} />
                <InfoRow label={language === "bg" ? "Дата" : "Date"} value={reservationDate || "—"} />
                <InfoRow label={language === "bg" ? "Час" : "Time"} value={selectedTime || "—"} />
                <InfoRow label={labels.table} value={selectedTables.length ? selectedTables.map((table) => table.id).join(", ") : "—"} />
                <InfoRow label={labels.capacity} value={`${totalSeats || 0} / ${guestCount || 0} ${t.people}`} />
              </div>

              {!hasEnoughSeats && selectedTables.length > 0 && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {language === "bg"
                    ? "Избраните маси не са достатъчни за броя гости."
                    : "Selected tables are not enough for the number of guests."}
                </div>
              )}

              <button
                type="button"
                disabled={!canOpenForm}
                onClick={() => {
                  setSubmitError("");
                  setSubmitSuccess("");
                  setShowBookingForm(true);
                }}
                className={`mt-6 hidden w-full rounded-2xl lg:block py-3 font-medium transition-transform ${
                  !canOpenForm
                    ? "cursor-not-allowed bg-white/10 text-white/40"
                    : "luxury-button"
                }`}
              >
                {!canShowSearchParams
                  ? language === "bg"
                    ? "Избери зона, дата, час и гости"
                    : "Choose area, date, time and guests"
                  : !selectedTables.length
                  ? language === "bg"
                    ? "Избери маса"
                    : "Choose table"
                  : !hasEnoughSeats
                  ? language === "bg"
                    ? "Избери още маси"
                    : "Choose more tables"
                  : labels.reserveSelected}
              </button>
            </div>

            {canShowSearchParams ? (
              <div ref={mapSectionRef}>
                <ZoneCard title={zoneTitle} subtitle={zoneSubtitle} accent={zoneAccent}>
                  {selectedArea === "garden" ? (
                    <GardenMap tables={visibleGardenTables} selectedIds={selectedIds} onSelect={handleSelect} labels={labels} />
                  ) : (
                    <IndoorMap tables={visibleIndoorTables} selectedIds={selectedIds} onSelect={handleSelect} labels={labels} />
                  )}
                </ZoneCard>
              </div>
            ) : (
              <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-[#c9a56a]/20 bg-white/5 p-8 text-center">
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#c9a56a]">
                    {language === "bg" ? "Първа стъпка" : "First step"}
                  </div>
                  <h2 className="text-2xl font-serif">
                    {language === "bg"
                      ? "Изберете зона, дата, час и брой гости"
                      : "Select area, date, time and number of guests"}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
                    {language === "bg"
                      ? "След това ще покажем само подходящите свободни маси."
                      : "Then we will show only suitable available tables."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {canOpenForm && !showBookingForm && (
  <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-[#0f0b08]/95 p-4 shadow-2xl backdrop-blur lg:hidden">
    <button
      type="button"
      onClick={() => {
        setSubmitError("");
        setSubmitSuccess("");
        setShowBookingForm(true);
      }}
      className="w-full rounded-2xl bg-[#c9a56a] py-4 font-semibold text-black"
    >
      {language === "bg"
        ? `Резервирай маса ${selectedTables.map((table) => table.id).join(", ")}`
        : `Reserve table ${selectedTables.map((table) => table.id).join(", ")}`}
    </button>
  </div>
)}

      {showBookingForm && canOpenForm && (
        <BookingModal
          t={t}
          language={language}
          selectedTables={selectedTables}
          selectedArea={selectedArea}
          selectedTime={selectedTime}
          reservationDate={reservationDate}
          guestCount={guestCount}
          totalSeats={totalSeats}
          onClose={() => {
            setShowBookingForm(false);
            setSubmitError("");
            setSubmitSuccess("");
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />
      )}
    </>
  );
}
