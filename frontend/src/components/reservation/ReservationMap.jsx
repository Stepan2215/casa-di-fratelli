import TableButton from "./TableButton";
import TimeChip from "./TimeChip";
import { tables, sectionMeta } from "../../data/tablesData";

function WindowMarker({ className = "", label = "Прозорец", vertical = false }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 flex items-center justify-center ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-sky-200/40 bg-sky-200/10 shadow-[0_0_30px_rgba(125,211,252,0.25)] backdrop-blur-sm ${
          vertical ? "h-48 w-12" : "h-12 w-48"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-sky-100/10 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-sky-100/30" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-sky-100/30" />

        <div
          className={`relative flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-100/90 ${
            vertical ? "-rotate-90 whitespace-nowrap" : ""
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function ReservationMap({
  t,
  selectedSection,
  setSelectedSection,
  selectedTable,
  setSelectedTable,
  selectedTime,
  setSelectedTime,
  onBack,
  onOpenForm,
}) {
  const visibleTables = tables.filter((table) => table.section === selectedSection);

  const sectionLabels = {
    smoking: t.smokingSection,
    main: t.familySection,
    terrace: t.terraceSection,
  };

  const sectionDescriptions = {
    smoking: t.smokingDesc,
    main: t.familyDesc,
    terrace: t.terraceDesc,
  };

  const sectionBadgeText = {
    smoking: t.smokeLabel,
    main: t.mainLabel,
    terrace: t.terraceLabel,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              {t.reservationTag}
            </p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t.reservationMapTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-stone-300">{t.reservationMapText}</p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:border-amber-300 hover:text-amber-300"
          >
            {t.backToSite}
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {["smoking", "main", "terrace"].map((key) => {
            const active = selectedSection === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedSection(key);
                  setSelectedTable(null);
                  setSelectedTime("");
                }}
                className={`rounded-[2rem] border p-6 text-left transition ${
                  active
                    ? "border-amber-300 bg-white/10 shadow-2xl"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div
                  className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${sectionMeta[key].badge}`}
                >
                  {sectionBadgeText[key]}
                </div>
                <h3 className="text-2xl font-semibold">{sectionLabels[key]}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  {sectionDescriptions[key]}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl">
            <div
              className={`relative min-h-[520px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${sectionMeta[selectedSection].gradient}`}
            >
              <WindowMarker className="left-8 top-6" />
              <WindowMarker className="right-8 top-6" />
              <WindowMarker className="left-4 top-1/2 -translate-y-1/2" vertical />
              <WindowMarker className="right-4 top-1/2 -translate-y-1/2" vertical />

              <div className="pointer-events-none absolute inset-x-12 top-24 z-0 h-px bg-gradient-to-r from-transparent via-sky-100/20 to-transparent" />
              <div className="pointer-events-none absolute inset-y-16 left-24 z-0 w-px bg-gradient-to-b from-transparent via-sky-100/15 to-transparent" />

              {visibleTables.map((table) => (
                <TableButton
                  key={table.id}
                  table={table}
                  isSelected={selectedTable?.id === table.id}
                  onClick={(currentTable) => {
                    setSelectedTable(currentTable);
                    setSelectedTime("");
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-stone-900 p-6 shadow-2xl">
            {!selectedTable ? (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-semibold">{sectionLabels[selectedSection]}</h3>
              </div>
            ) : (
              <div>
                <h3 className="text-3xl font-semibold">{selectedTable.id}</h3>

                <div className="mt-8">
                  <h4 className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-300">
                    {t.freeSlots}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedTable.free.map((time) => (
                      <TimeChip
                        key={time}
                        time={time}
                        active={selectedTime === time}
                        onClick={() => setSelectedTime(time)}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenForm}
                  disabled={!selectedTime}
                  className="mt-10 w-full rounded-2xl bg-amber-400 px-6 py-4 font-medium text-stone-950"
                >
                  {selectedTime ? t.reserveSelected : t.chooseTimeFirst}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}