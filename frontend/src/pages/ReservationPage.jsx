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

const gardenOrder = [
  "42", "43", "44", "45",
  "38", "39", "40", "41",
  "34", "35", "36", "37",
  "30", "31", "32", "33",
];

const reservationTimes = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const reservedGardenIds = new Set([]);
const reservedIndoorIds = new Set([]);

function languageSafe(t, key, fallback) {
  return t?.[key] || fallback;
}

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

function isContinuousTerraceSelection(selectedTables, nextTable) {
  const ids = [...selectedTables.map((table) => table.id), nextTable.id].filter((id) =>
    gardenOrder.includes(id)
  );

  const uniqueIds = [...new Set(ids)];
  const indexes = uniqueIds.map((id) => gardenOrder.indexOf(id)).sort((a, b) => a - b);

  if (!indexes.length) return true;

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
    <div className="rounded-[28px] border border-[#c9a56a]/20 bg-gradient-to-b from-[#1d1510] to-[#120d0a] p-5 shadow-2xl shadow-black/30 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
        <div className="rounded-full border border-[#c9a56a]/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#c9a56a]">
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
              className={`absolute h-4 w-4 rounded-full border shadow-inner ${
                reserved ? "border-red-400/20 bg-[#3b1d1d]" : "border-[#c9a56a]/25 bg-[#2f241c]"
              }`}
              style={{ left: chair.x, top: chair.y }}
            />
          )
        )}

        <div
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
            selected
              ? "bg-[#d7b57f] text-black shadow-lg ring-4 ring-[#d7b57f]/15"
              : reserved
              ? "border border-red-400/30 bg-[#4a1f1f] text-red-100"
              : "border border-[#c9a56a]/35 bg-[#3a2c22] text-white"
          }`}
        >
          {table.id}
        </div>
      </div>
    </button>
  );
}

function GardenMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[570px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(201,165,106,0.13),_transparent_38%),linear-gradient(180deg,rgba(49,37,25,0.95),rgba(24,18,13,0.95))]">
      <div className="absolute inset-5 rounded-[22px] border border-dashed border-[#c9a56a]/15" />
      <div className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-white/35">
        {labels.perimeter}
      </div>
      <div className="absolute left-[47%] top-[79%] w-[20%] text-center text-[10px] uppercase tracking-[0.22em] text-[#d6b278]">
        {labels.entrance}
      </div>

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
          className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`}
          style={{ left: i * 18 + 10, top: -8 }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`bottom-${i}`}
          className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`}
          style={{ left: i * 18 + 10, top: 36 }}
        />
      ))}
    </>
  );
}

function FourSeatChairs({ reserved }) {
  return (
    <>
      <div className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: "50%", top: -8, transform: "translateX(-50%)" }} />
      <div className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: "50%", top: 36, transform: "translateX(-50%)" }} />
      <div className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ left: 0, top: 14 }} />
      <div className={`absolute h-3 w-3 rounded-full ${reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"}`} style={{ right: 0, top: 14 }} />
    </>
  );
}

function IndoorTable({ table, selected, reserved, onSelect }) {
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
              ? "bg-[#d7b57f] text-black shadow-lg ring-4 ring-[#d7b57f]/15"
              : reserved
              ? "border border-red-400/30 bg-[#4a1f1f] text-red-100"
              : "border border-[#c9a56a]/35 bg-[#3a2c22] text-white"
          }`}
        >
          {table.id}
        </div>

        <div className="mt-2 text-center text-[10px] text-white/45">{table.seats} seats</div>
      </div>
    </button>
  );
}

function IndoorMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(201,165,106,0.12),_transparent_34%),linear-gradient(180deg,rgba(46,34,24,0.96),rgba(20,15,12,0.96))]">
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
  totalSeats,
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
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm">
      <div className="h-full overflow-y-auto overscroll-contain px-4 py-6">
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-stone-950 p-5 text-stone-100 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                {selectedTables.length > 1
                  ? languageSafe(t, "groupBookingTitle", "Group reservation")
                  : t.bookingFormTitle}
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                {selectedTables.length > 1
                  ? `${languageSafe(t, "selectedTables", "Selected tables")}: ${selectedTables.map((table) => table.id).join(", ")}`
                  : `${t.selectedTable}: ${selectedTables[0]?.id}`}
              </h2>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-stone-300">
                  {areaLabel} · {guestCount} {t.people} · {reservationDate} · {selectedTime}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm transition hover:border-amber-300 hover:text-amber-300"
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

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-stone-300">{t.formEmail}</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
                placeholder={t.placeholderEmail}
              />
            </div>

            <div className="sm:col-span-2 rounded-[1.5rem] border border-amber-400/25 bg-amber-500/10 p-5">
              <label className="mb-2 block text-sm text-amber-100">
                {language === "bg" ? "Дата на раждане" : "Date of birth"}
              </label>
              <input
                name="birthDate"
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-amber-300 [color-scheme:dark]"
              />
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
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-300"
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
                  : "bg-[#c9a56a] text-black transition hover:scale-[1.01]"
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
  const [bookingMode, setBookingMode] = React.useState("single");
  const [selectedArea, setSelectedArea] = React.useState("indoor");
  const [selectedTables, setSelectedTables] = React.useState([]);
  const [showBookingForm, setShowBookingForm] = React.useState(false);
  const [blockedSlots, setBlockedSlots] = React.useState([]);
  const timeSelectionRef = React.useRef(null);

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
  const guests = Number(guestCount || 0);

  const shouldUseGroup =
    (selectedArea === "garden" && guests > 4) ||
    (selectedArea === "indoor" && guests >= 7);

  if (shouldUseGroup && bookingMode !== "group") {
    setBookingMode("group");
    setSelectedTables([]);
  }

  if (!shouldUseGroup && bookingMode === "group" && guests > 0) {
    setBookingMode("single");
    setSelectedTables([]);
  }
}, [guestCount, selectedArea, bookingMode]);

  React.useEffect(() => {
    if (reservationDate && selectedTime && isPastTimeForDate(reservationDate, selectedTime)) {
      setSelectedTime("");
      setSelectedTables([]);
    }
  }, [reservationDate, selectedTime]);

  const labels = {
    perimeter: language === "bg" ? "Периметър" : "Garden perimeter",
    entrance: language === "bg" ? "Вход" : "Entrance",
    gardenTitle: language === "bg" ? "Градина / Пушачи" : "Garden / Smoking",
    gardenSubtitle: language === "bg" ? "Всички маси са за 4 души" : "All tables seat 4 guests",
    indoorTitle: language === "bg" ? "Вътре / Непушачи" : "Indoor / Non-smoking",
    indoorSubtitle: language === "bg" ? "Комбинация от маси за 4 и 6 души" : "Mix of 4-seat and 6-seat tables",
    selectedTable: language === "bg" ? "Избрана маса" : "Selected table",
    selectedTables: language === "bg" ? "Избрани маси" : "Selected tables",
    reservationPreview: language === "bg" ? "Детайли за резервацията" : "Reservation details",
    area: language === "bg" ? "Зона" : "Area",
    table: language === "bg" ? "Маса" : "Table",
    capacity: language === "bg" ? "Капацитет" : "Capacity",
    reserveSelected: language === "bg" ? "Резервирай" : "Reserve",
    groupMode: language === "bg" ? "Групова резервация" : "Group booking",
    singleMode: language === "bg" ? "Една маса" : "Single table",
    groupHint:
      language === "bg"
        ? "Първо изберете дата, час и брой гости. След това ще покажем подходящите свободни маси."
        : "First select date, time, and number of guests. Then we will show suitable available tables.",
  };

  const canShowSearchParams = Boolean(reservationDate && selectedTime && guestCount);
  const requestedGuests = Number(guestCount || 0);
  const forceGroupMode =
  (selectedArea === "garden" && requestedGuests > 4) ||
  (selectedArea === "indoor" && requestedGuests >= 7);

  const selectedDateBlockedSlots = blockedSlots.filter((slot) => {
    const slotDate = slot.reservedDate || slot.ReservedDate;
    const slotTime = slot.reservedTime || slot.ReservedTime;

    return slotDate === reservationDate && slotTime === selectedTime;
  });

  const blockedTableIds = new Set(
    selectedDateBlockedSlots.flatMap((slot) => slot.tableIds || slot.TableIds || [])
  );

const canShowTable = (table, area) => {
  if (!canShowSearchParams) return false;
  if (blockedTableIds.has(table.id)) return false;
  if (area !== selectedArea) return false;

  if (bookingMode === "single") {
    return table.seats >= requestedGuests && table.seats <= requestedGuests + 2;
  }

  if (selectedTables.length === 0) {
    if (area === "garden") return !table.special;
    return true;
  }

  if (totalSeats >= requestedGuests) {
    return selectedTables.some((selected) => selected.id === table.id);
  }

  const isAlreadySelected = selectedTables.some((selected) => selected.id === table.id);
  if (isAlreadySelected) return true;

  return canCombineTables(area, selectedTables, table);
};

const visibleGardenTables = gardenTables.filter((table) =>
  canShowTable(table, "garden")
);

const visibleIndoorTables = indoorTables.filter((table) =>
  canShowTable(table, "indoor")
);

  const handleSelect = (table, area) => {
    if (!canShowSearchParams) return;

    const isReserved = area === "garden" ? reservedGardenIds.has(table.id) : reservedIndoorIds.has(table.id);
    if (isReserved) return;

    if (bookingMode === "single") {
      setSelectedArea(area);
      setSelectedTables([table]);
    } else {
      if (area !== selectedArea) {
        setSelectedArea(area);
        setSelectedTables([table]);
      } else {
        setSelectedTables((prev) => {
          const exists = prev.some((item) => item.id === table.id);

          if (exists) {
            return prev.filter((item) => item.id !== table.id);
          }

          if (!canCombineTables(area, prev, table)) return prev;

          return [...prev, table];
        });
      }
    }

    if (bookingMode === "single" && window.innerWidth < 1024) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  };

  const selectedIds = selectedTables.map((table) => table.id);
  const totalSeats = selectedTables.reduce((sum, table) => sum + table.seats, 0);
  const hasEnoughSeats = totalSeats >= requestedGuests;
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
      setSubmitSuccess(language === "bg" ? "Резервацията беше изпратена успешно." : "Reservation submitted successfully.");
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
      setSubmitError(language === "bg" ? "Възникна проблем при връзката със сървъра." : "There was a problem connecting to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0f0b08] p-6 text-white md:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c9a56a]">
                Luxury reservation map
              </div>
              <h1 className="text-4xl font-serif md:text-6xl">Casa di Fratelli</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                {language === "bg"
                  ? "Изберете дата, час и брой гости, след което ще видите подходящите свободни маси."
                  : "Select date, time and number of guests, then view suitable available tables."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <button type="button" onClick={() => setLanguage("bg")} className={`rounded-full px-4 py-2 ${language === "bg" ? "bg-[#c9a56a] text-black" : "border border-white/15 bg-white/5 text-white"}`}>
                BG
              </button>

              <button type="button" onClick={() => setLanguage("en")} className={`rounded-full px-4 py-2 ${language === "en" ? "bg-[#c9a56a] text-black" : "border border-white/15 bg-white/5 text-white"}`}>
                EN
              </button>

              <button type="button" onClick={onBack} className="rounded-full border border-white/15 px-4 py-2 hover:border-[#c9a56a]/40 hover:text-[#d8b377]">
                {t.backToSite}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#c9a56a]/20 bg-white/5 p-4">
            <button
              type="button"
              disabled={!canShowSearchParams || forceGroupMode}
              onClick={() => {
                setBookingMode("single");
                setSelectedTables([]);
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                bookingMode === "single"
                  ? "bg-[#c9a56a] text-black"
                  : "border border-white/10 bg-white/5 text-white/80"
              } ${!canShowSearchParams || forceGroupMode ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {labels.singleMode}
            </button>

            <button
              type="button"
              
              onClick={() => {
                setBookingMode("group");
                setSelectedTables([]);
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                bookingMode === "group"
                  ? "bg-[#c9a56a] text-black"
                  : "border border-white/10 bg-white/5 text-white/80"
              } ${!canShowSearchParams ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {labels.groupMode}
            </button>

            <div className="ml-0 flex flex-wrap gap-2 md:ml-2">
              <button
                type="button"
                
                onClick={() => {
                  setSelectedArea("garden");
                  setSelectedTables([]);
                }}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedArea === "garden"
                    ? "bg-[#c9a56a] text-black"
                    : "border border-white/10 bg-white/5 text-white/80"
                }`}
              >
                {language === "bg" ? "Тераса / Пушачи" : "Terrace / Smoking"}
              </button>

              <button
                type="button"
                disabled={!canShowSearchParams}
                onClick={() => {
                  setSelectedArea("indoor");
                  setSelectedTables([]);
                }}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedArea === "indoor"
                    ? "bg-[#c9a56a] text-black"
                    : "border border-white/10 bg-white/5 text-white/80"
                } ${!canShowSearchParams ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {language === "bg" ? "Зала / Непушачи" : "Hall / Non-smoking"}
              </button>
            </div>

            <div className="text-sm text-white/65">{labels.groupHint}</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_1.15fr_0.95fr]">
            <div ref={timeSelectionRef} className="order-first rounded-[28px] border border-[#c9a56a]/20 bg-gradient-to-b from-[#201711] to-[#120d0a] p-5 shadow-2xl shadow-black/30 md:p-6 lg:col-start-3 lg:row-start-1">
              <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[#c9a56a]">
                {labels.reservationPreview}
              </div>

              <h3 className="mb-4 text-2xl font-serif">
                {language === "bg" ? "Данни за посещението" : "Visit details"}
              </h3>

              <div className="mb-5 grid gap-3">
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
                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a56a] [color-scheme:dark]"
                  />
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
                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a56a] [color-scheme:dark]"
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
                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a56a] [color-scheme:dark]"
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

              {forceGroupMode && (
                <div className="mb-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {language === "bg"
                    ? "За 7 или повече гости автоматично използваме групова резервация."
                    : "For 7 or more guests, group booking is selected automatically."}
                </div>
              )}

              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1411]">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="Restaurant zone preview" className="absolute inset-0 h-full w-full object-cover opacity-60" />
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
                className={`mt-6 w-full rounded-2xl py-3 font-medium transition-transform ${
                  !canOpenForm
                    ? "cursor-not-allowed bg-white/10 text-white/40"
                    : "bg-[#c9a56a] text-black hover:scale-[1.01]"
                }`}
              >
                {!canShowSearchParams
                  ? language === "bg"
                    ? "Избери дата, час и гости"
                    : "Choose date, time and guests"
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
  selectedArea === "garden" ? (
    <div className="lg:col-span-2">
      <ZoneCard
        title={labels.gardenTitle}
        subtitle={labels.gardenSubtitle}
        accent={t.smokeLabel}
      >
        <GardenMap
          tables={visibleGardenTables}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          labels={labels}
        />
      </ZoneCard>
    </div>
  ) : (
    <div className="lg:col-span-2">
      <ZoneCard
        title={labels.indoorTitle}
        subtitle={labels.indoorSubtitle}
        accent={t.mainLabel}
      >
        <IndoorMap
          tables={visibleIndoorTables}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          labels={labels}
        />
      </ZoneCard>
    </div>
  )
) : (
              <div className="lg:col-span-2 flex min-h-[520px] items-center justify-center rounded-[28px] border border-[#c9a56a]/20 bg-white/5 p-8 text-center">
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#c9a56a]">
                    {language === "bg" ? "Първа стъпка" : "First step"}
                  </div>
                  <h2 className="text-2xl font-serif">
                    {language === "bg"
                      ? "Изберете дата, час и брой гости"
                      : "Select date, time and number of guests"}
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