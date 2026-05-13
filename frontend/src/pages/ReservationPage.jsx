import React from "react";
import { API_BASE_URL } from "../config/api";

const gardenTables = [
  { id: "42", x: 17, y: 22, seats: 4 },
  { id: "43", x: 17, y: 42, seats: 4 },
  { id: "44", x: 17, y: 62, seats: 4 },
  { id: "45", x: 17, y: 82, seats: 4 },
  { id: "38", x: 38, y: 24, seats: 4 },
  { id: "39", x: 38, y: 44, seats: 4 },
  { id: "40", x: 38, y: 64, seats: 4 },
  { id: "41", x: 38, y: 84, seats: 4 },
  { id: "34", x: 59, y: 24, seats: 4 },
  { id: "35", x: 59, y: 44, seats: 4 },
  { id: "36", x: 59, y: 64, seats: 4 },
  { id: "37", x: 59, y: 84, seats: 4 },
  { id: "30", x: 78, y: 22, seats: 4 },
  { id: "31", x: 78, y: 42, seats: 4 },
  { id: "32", x: 78, y: 62, seats: 4 },
  { id: "33", x: 78, y: 82, seats: 4 },
  { id: "34A", x: 58, y: 10, seats: 2, special: true },
  { id: "30A", x: 75, y: 10, seats: 2, special: true },
  { id: "45A", x: 28, y: 93, seats: 2, special: true },
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

const openTerraceTables = [
  { id: "46", x: 34, y: 40, seats: 4 },
  { id: "47", x: 66, y: 40, seats: 4 },
  { id: "48", x: 34, y: 68, seats: 2, special: true },
  { id: "49", x: 66, y: 68, seats: 2, special: true },
];

const gardenGroups = [
  ["42", "43", "44", "45"],
  ["38", "39", "40", "41"],
  ["34", "35", "36", "37"],
  ["30", "31", "32", "33"],
];

const indoorGroups = [
  ["5", "6"],
  ["20", "21", "22", "23"],
  ["28", "29"],
];

const openTerraceGroups = [
  ["46", "47"],
  ["48", "49"],
];

const gardenCellById = gardenGroups.reduce((acc, group, columnIndex) => {
  group.forEach((id, rowIndex) => {
    acc[id] = { columnIndex, rowIndex };
  });
  return acc;
}, {});

function getTablesCapacity(tables, ids) {
  return ids.reduce((sum, id) => sum + (tables.find((table) => table.id === id)?.seats || 0), 0);
}

function getEligibleIndoorGroups(requestedGuests) {
  return indoorGroups.filter((group) => getTablesCapacity(indoorTables, group) >= requestedGuests);
}

function getEligibleOpenTerraceGroups(requestedGuests) {
  return openTerraceGroups.filter((group) => getTablesCapacity(openTerraceTables, group) >= requestedGuests);
}

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

function isContinuousTerraceColumnSelection(selectedTables, nextTable) {
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

function isLogicalTerraceSelection(selectedTables, nextTable) {
  const ids = [...new Set([...selectedTables.map((table) => table.id), nextTable.id])];
  const cells = ids.map((id) => gardenCellById[id]).filter(Boolean);

  if (cells.length !== ids.length) return false;

  if (cells.length <= 4) {
    return isContinuousTerraceColumnSelection(selectedTables, nextTable);
  }

  const selectedCells = new Set(cells.map((cell) => `${cell.columnIndex}:${cell.rowIndex}`));
  const columns = [...new Set(cells.map((cell) => cell.columnIndex))].sort((a, b) => a - b);
  const rows = [...new Set(cells.map((cell) => cell.rowIndex))].sort((a, b) => a - b);

  const hasNoGaps = (values) =>
    values.every((value, index) => index === 0 || value - values[index - 1] === 1);

  if (!hasNoGaps(columns) || !hasNoGaps(rows)) return false;

  const nextCell = gardenCellById[nextTable.id];
  const touchesCurrentSelection = selectedTables.some((table) => {
    const cell = gardenCellById[table.id];
    if (!cell) return false;

    const columnDistance = Math.abs(cell.columnIndex - nextCell.columnIndex);
    const rowDistance = Math.abs(cell.rowIndex - nextCell.rowIndex);

    return columnDistance + rowDistance === 1;
  });

  if (!touchesCurrentSelection) return false;

  return cells.every((cell) => {
    const rowCells = cells
      .filter((item) => item.rowIndex === cell.rowIndex)
      .map((item) => item.columnIndex)
      .sort((a, b) => a - b);
    const columnCells = cells
      .filter((item) => item.columnIndex === cell.columnIndex)
      .map((item) => item.rowIndex)
      .sort((a, b) => a - b);

    return hasNoGaps(rowCells) && hasNoGaps(columnCells) && selectedCells.has(`${cell.columnIndex}:${cell.rowIndex}`);
  });
}

function canCombineTables(area, selectedTables, nextTable, requestedGuests) {
  if (!selectedTables.length) return true;

  if (area === "garden") {
    if (nextTable.special) return false;
    if (selectedTables.some((table) => table.special)) return false;
    return isLogicalTerraceSelection(selectedTables, nextTable);
  }

  const allowedGroups =
    area === "openTerrace"
      ? getEligibleOpenTerraceGroups(requestedGuests)
      : getEligibleIndoorGroups(requestedGuests);

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
        className={`relative h-full w-full overflow-hidden rounded-full border border-sky-200/35 bg-sky-100/[0.065] shadow-[0_0_26px_rgba(125,211,252,0.14)] backdrop-blur ${
          vertical ? "" : ""
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_36%),repeating-linear-gradient(90deg,transparent_0_18%,rgba(186,230,253,0.2)_18%_19%,transparent_19%_38%)]" />
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sky-100/35" />
        <div className="absolute bottom-1 left-3 right-3 h-px bg-white/16" />
        <div
          className={`relative flex h-full w-full items-center justify-center text-[8px] font-bold uppercase tracking-[0.28em] text-sky-100/86 ${
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
    <div className="pointer-events-none absolute bottom-1 left-1/2 z-10 w-[24%] -translate-x-1/2 text-center">
      <div className="mx-auto h-6 w-16 rounded-t-full border-x border-t border-[#d6b278]/55 bg-[radial-gradient(circle_at_50%_100%,rgba(214,178,120,0.28),transparent_62%)] shadow-[0_0_18px_rgba(214,178,120,0.16)]" />
      <div className="mx-auto h-1 w-20 rounded-full bg-[#d6b278]/55" />
      <div className="mx-auto mt-0.5 max-w-[96px] rounded-full border border-[#c9a56a]/28 bg-black/48 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-[#f2d39a] backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function SideEntry({ label }) {
  return (
    <div className="pointer-events-none absolute left-1 top-[60%] z-10 flex -translate-y-1/2 items-center">
      <div className="h-14 w-5 rounded-r-full border-y border-r border-[#d6b278]/55 bg-[radial-gradient(circle_at_0%_50%,rgba(214,178,120,0.32),transparent_68%)] shadow-[0_0_18px_rgba(214,178,120,0.16)]" />
      <div className="h-12 w-1 rounded-full bg-[#d6b278]/55" />
      <div className="ml-1 rounded-full border border-[#c9a56a]/28 bg-black/48 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-[#f2d39a] backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function IndoorPartitionWall({ label }) {
  return (
    <div className="pointer-events-none absolute right-5 top-[51%] z-10 h-4 w-[50%] -translate-y-1/2">
      <div className="relative h-full w-full rounded-full border border-stone-200/14 bg-[linear-gradient(180deg,rgba(255,244,223,0.18),rgba(63,47,34,0.78),rgba(255,244,223,0.12))] shadow-[0_0_28px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.2)]">
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-[#f2d39a]/20" />
        <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/12" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function IndoorTerraceEntry({ label }) {
  return (
    <div className="pointer-events-none absolute bottom-1 left-[25%] z-10 w-[28%] -translate-x-1/2 text-center">
      <div className="mx-auto h-6 w-16 rounded-t-full border-x border-t border-emerald-200/45 bg-[radial-gradient(circle_at_50%_100%,rgba(110,231,183,0.2),transparent_64%)] shadow-[0_0_18px_rgba(110,231,183,0.14)]" />
      <div className="mx-auto h-1 w-20 rounded-full bg-emerald-200/45" />
      <div className="mx-auto mt-0.5 max-w-[104px] rounded-full border border-emerald-200/20 bg-black/48 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-emerald-100/90 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function WallTv({ label }) {
  return (
    <div className="pointer-events-none absolute left-[4%] top-[50%] z-10">
      <div className="relative h-16 w-6 rounded-lg border border-white/18 bg-[#080706] shadow-[0_0_24px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-1 rounded-lg bg-[linear-gradient(160deg,rgba(56,189,248,0.28),rgba(255,255,255,0.08)_42%,rgba(20,184,166,0.16))]" />
        <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-white/25" />
      </div>
      <div className="mt-1 -translate-x-4 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-white/60">
        {label}
      </div>
    </div>
  );
}

function MergedTableRail({ tables, selectedIds, groups }) {
  const selectedSet = new Set(selectedIds);

  return groups
    .map((group) => {
      const selectedInGroup = group.filter((id) => selectedSet.has(id));
      if (selectedInGroup.length < 2) return null;

      const selectedTables = selectedInGroup
        .map((id) => tables.find((table) => table.id === id))
        .filter(Boolean);

      if (selectedTables.length < 2) return null;

      const x = selectedTables.reduce((sum, table) => sum + table.x, 0) / selectedTables.length;
      const minY = Math.min(...selectedTables.map((table) => table.y));
      const maxY = Math.max(...selectedTables.map((table) => table.y));

      return (
        <div
          key={group.join("-")}
          className="pointer-events-none absolute z-[4] w-9 -translate-x-1/2 rounded-[18px] border border-[#f2d39a]/38 bg-[linear-gradient(180deg,rgba(246,217,158,0.32),rgba(91,64,40,0.56),rgba(246,217,158,0.24))] shadow-[0_0_36px_rgba(201,165,106,0.24),inset_0_1px_0_rgba(255,255,255,0.2)] md:w-11"
          style={{
            left: `${x}%`,
            top: `calc(${minY}% - 24px)`,
            height: `calc(${maxY - minY}% + 48px)`,
          }}
        >
          <div className="absolute inset-1 rounded-[14px] border border-white/10" />
          <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-[#fff4df]/20" />
        </div>
      );
    })
    .filter(Boolean);
}

function MergedHorizontalTableRail({ tables, selectedIds, groups }) {
  const selectedSet = new Set(selectedIds);

  return groups
    .map((group) => {
      const selectedInGroup = group.filter((id) => selectedSet.has(id));
      if (selectedInGroup.length < 2) return null;

      const selectedTables = selectedInGroup
        .map((id) => tables.find((table) => table.id === id))
        .filter(Boolean);

      if (selectedTables.length < 2) return null;

      const y = selectedTables.reduce((sum, table) => sum + table.y, 0) / selectedTables.length;
      const minX = Math.min(...selectedTables.map((table) => table.x));
      const maxX = Math.max(...selectedTables.map((table) => table.x));

      return (
        <div
          key={group.join("-")}
          className="pointer-events-none absolute z-[4] h-10 -translate-y-1/2 rounded-[18px] border border-[#f2d39a]/38 bg-[linear-gradient(90deg,rgba(246,217,158,0.3),rgba(91,64,40,0.56),rgba(246,217,158,0.24))] shadow-[0_0_36px_rgba(201,165,106,0.24),inset_0_1px_0_rgba(255,255,255,0.2)] md:h-11"
          style={{
            left: `calc(${minX}% - 24px)`,
            top: `${y}%`,
            width: `calc(${maxX - minX}% + 48px)`,
          }}
        >
          <div className="absolute inset-1 rounded-[14px] border border-white/10" />
          <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-[#fff4df]/20" />
        </div>
      );
    })
    .filter(Boolean);
}

function GardenTable({ table, selected, reserved, onSelect, area = "garden" }) {
  const commonClass = `absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
    reserved
      ? "cursor-not-allowed scale-90 opacity-75 md:scale-100"
      : selected
      ? "scale-95 md:scale-110"
      : "scale-90 hover:scale-95 md:scale-100 md:hover:scale-105"
  }`;

  if (table.special) {
    return (
      <button
        type="button"
        disabled={reserved}
        onClick={() => onSelect(table, area)}
        className={commonClass}
        style={{ left: `${table.x}%`, top: `${table.y}%` }}
      >
        <div className="relative h-11 w-14">
          <div
            className={`absolute left-1/2 top-0 h-3.5 w-5 -translate-x-1/2 rounded-[7px] border border-[#c9a56a]/20 ${
              reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"
            }`}
          />
          <div
            className={`absolute bottom-0 left-1/2 h-3.5 w-5 -translate-x-1/2 rounded-[7px] border border-[#c9a56a]/20 ${
              reserved ? "bg-[#3b1d1d]" : "bg-[#2f241c]"
            }`}
          />
          <div
            className={`absolute left-1/2 top-1/2 flex h-8 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border text-[10px] font-semibold shadow-lg ${
              selected
                ? "border-[#d7b57f] bg-[linear-gradient(145deg,#f6d99e,#b88b4d)] text-black"
                : reserved
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-[#c9a56a]/35 bg-[linear-gradient(145deg,#4d3829,#251b15)] text-white/88"
            }`}
          >
            {table.id}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={reserved}
      onClick={() => onSelect(table, area)}
      className={commonClass}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
    >
      <div className="relative h-[64px] w-[64px]">
        {[{ x: 26, y: -2 }, { x: 26, y: 54 }, { x: -2, y: 26 }, { x: 54, y: 26 }].map(
          (chair, index) => (
            <div
              key={index}
              className={`absolute h-3.5 w-3.5 rounded-[6px] border shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_10px_rgba(0,0,0,0.22)] ${
                reserved
                  ? "border-red-400/20 bg-[#3b1d1d]"
                  : "border-[#d8b377]/30 bg-[linear-gradient(145deg,#4a382b,#211914)]"
              }`}
              style={{ left: chair.x, top: chair.y }}
            />
          )
        )}

        <div
          className={`absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[15px] text-[11px] font-semibold transition-all duration-300 ${
            selected
              ? "bg-[linear-gradient(145deg,#f6d99e,#b88b4d)] text-black shadow-[0_14px_30px_rgba(201,165,106,0.3)] ring-4 ring-[#d7b57f]/15"
              : reserved
              ? "border border-red-400/30 bg-[#4a1f1f] text-red-100"
              : "border border-[#c9a56a]/40 bg-[linear-gradient(145deg,#5a4332,#2a1f18)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_24px_rgba(0,0,0,0.28)]"
          }`}
        >
          <span className="absolute inset-1 rounded-[11px] border border-white/8" />
          {table.id}
        </div>
      </div>
    </button>
  );
}

function OpenTerraceMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.13),_transparent_34%),radial-gradient(circle_at_50%_100%,rgba(201,165,106,0.13),transparent_38%),linear-gradient(180deg,rgba(30,34,25,0.96),rgba(14,16,11,0.96))] shadow-inner md:min-h-[520px]">
      <div className="absolute inset-5 rounded-[22px] border border-[#c9a56a]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:42px_42px]" />
      <MapWindow className="left-5 right-5 top-3 h-4" label={labels.openSky} />
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-100/80 backdrop-blur">
        {labels.openTerraceTitle}
      </div>
      <MergedHorizontalTableRail tables={openTerraceTables} selectedIds={selectedIds} groups={openTerraceGroups} />

      {tables.map((table) => (
        <GardenTable
          key={table.id}
          table={table}
          selected={selectedIds.includes(table.id)}
          reserved={false}
          onSelect={onSelect}
          area="openTerrace"
        />
      ))}
    </div>
  );
}

function GardenMap({ tables, selectedIds, onSelect, labels }) {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(60,169,126,0.13),_transparent_34%),linear-gradient(180deg,rgba(34,40,28,0.96),rgba(16,18,13,0.96))] shadow-inner md:min-h-[800px]">
      <div className="absolute inset-5 rounded-[22px] border border-[#c9a56a]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:42px_42px]" />
      <MapWindow className="left-5 right-5 top-3 h-4" label={labels.windows} />
      <MapWindow className="bottom-5 left-3 top-5 w-4" label={labels.windows} vertical />
      <MapWindow className="bottom-5 right-3 top-5 w-4" label={labels.windows} vertical />
      <WallTv label={labels.tv} />
      <TerraceEntry label={labels.terraceEntrance} />
      <MergedTableRail tables={gardenTables} selectedIds={selectedIds} groups={gardenGroups} />

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
        reserved
          ? "cursor-not-allowed scale-[0.86] opacity-75 md:scale-100"
          : selected
          ? "scale-[0.92] md:scale-110"
          : "scale-[0.86] hover:scale-90 md:scale-100 md:hover:scale-105"
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
    <div className="relative min-h-[760px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(201,165,106,0.16),_transparent_34%),radial-gradient(circle_at_18%_60%,rgba(125,211,252,0.08),transparent_25%),linear-gradient(180deg,rgba(39,27,21,0.96),rgba(16,12,10,0.96))] md:min-h-[830px]">
      <div className="absolute inset-5 rounded-[22px] border border-[#c9a56a]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:42px_42px]" />
      <MapWindow className="left-3 top-5 h-[50%] w-4" label={labels.windows} vertical />
      <MapWindow className="bottom-5 left-3 top-[70%] w-4" label={labels.windows} vertical />
      <SideEntry label={labels.entrance} />
      <IndoorPartitionWall label={labels.wall} />
      <IndoorTerraceEntry label={labels.terraceEntrance} />
      <MergedTableRail tables={indoorTables} selectedIds={selectedIds} groups={indoorGroups} />

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
  const areaLabel =
    selectedArea === "garden"
      ? t.smokingSection
      : selectedArea === "openTerrace"
      ? language === "bg"
        ? "Открита тераса / Пушачи"
        : "Open terrace / Smoking"
      : t.familySection;

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
  const [largePartyNoticeOpen, setLargePartyNoticeOpen] = React.useState(false);
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
    wall: language === "bg" ? "Стена" : "Wall",
    tv: language === "bg" ? "Телевизор" : "TV",
    gardenTitle: language === "bg" ? "Тераса / Пушачи" : "Terrace / Smoking",
    gardenSubtitle: language === "bg" ? "Подходяща зона за пушачи" : "Smoking area",
    openTerraceTitle: language === "bg" ? "Открита тераса / Пушачи" : "Open terrace / Smoking",
    openTerraceSubtitle: language === "bg" ? "Малка външна зона с 4 маси" : "Small outdoor area with 4 tables",
    openSky: language === "bg" ? "Открито" : "Open air",
    indoorTitle: language === "bg" ? "Зала / Непушачи" : "Hall / Non-smoking",
    indoorSubtitle: language === "bg" ? "Комбинация от маси за 4 и 6 души" : "Mix of 4-seat and 6-seat tables",
    selectedTable: language === "bg" ? "Избрана маса" : "Selected table",
    reservationPreview: language === "bg" ? "Детайли за резервацията" : "Reservation details",
    table: language === "bg" ? "Маса" : "Table",
    capacity: language === "bg" ? "Капацитет" : "Capacity",
    reserveSelected: language === "bg" ? "Резервирай" : "Reserve",
    seats: language === "bg" ? "места" : "seats",
  };

  const zoneOptions = [
    {
      value: "indoor",
      title: labels.indoorTitle,
      subtitle: language === "bg" ? "Уютна вътрешна зала" : "Elegant indoor hall",
      capacity: "16",
    },
    {
      value: "garden",
      title: labels.gardenTitle,
      subtitle: language === "bg" ? "Покрита тераса" : "Covered terrace",
      capacity: "24+",
    },
    {
      value: "openTerrace",
      title: labels.openTerraceTitle,
      subtitle: language === "bg" ? "Свежа външна зона" : "Open air corner",
      capacity: "8",
    },
  ];

  const requestedGuests = Number(guestCount || 0);
  const canShowSearchParams = Boolean(selectedArea && reservationDate && selectedTime && guestCount);

  React.useEffect(() => {
    if (selectedArea === "indoor" && requestedGuests > 16) {
      setSelectedArea("garden");
      setSelectedTables([]);
      setLargePartyNoticeOpen(true);
    }
  }, [requestedGuests, selectedArea]);

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
    selectedArea === "garden" || selectedArea === "openTerrace"
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
      if (area === "openTerrace") {
        const eligibleOpenTerraceIds = getEligibleOpenTerraceGroups(requestedGuests).flat();
        return eligibleOpenTerraceIds.includes(table.id);
      }
      const eligibleIndoorIds = getEligibleIndoorGroups(requestedGuests).flat();
      return eligibleIndoorIds.includes(table.id);
    }

    if (isSelected) return true;

    return canCombineTables(area, selectedTables, table, requestedGuests);
  };

  const visibleGardenTables = gardenTables.filter((table) => canShowTable(table, "garden"));
  const visibleIndoorTables = indoorTables.filter((table) => canShowTable(table, "indoor"));
  const visibleOpenTerraceTables = openTerraceTables.filter((table) => canShowTable(table, "openTerrace"));

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

      if (!canCombineTables(area, prev, table, requestedGuests)) return prev;

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

  const zoneTitle =
    selectedArea === "garden"
      ? labels.gardenTitle
      : selectedArea === "openTerrace"
      ? labels.openTerraceTitle
      : labels.indoorTitle;
  const zoneSubtitle =
    selectedArea === "garden"
      ? labels.gardenSubtitle
      : selectedArea === "openTerrace"
      ? labels.openTerraceSubtitle
      : labels.indoorSubtitle;
  const zoneAccent = selectedArea === "indoor" ? t.mainLabel : t.smokeLabel;
  const zonePreviewImage = selectedArea === "indoor" ? "/restaurant-interior.webp" : "/restaurant-terrace.jpg";

  return (
    <>
      <div className="luxury-shell min-h-screen px-4 pb-0 pt-4 text-white md:p-8">
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

              <div className="mb-5 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    {language === "bg" ? "Зона" : "Area"}
                  </label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {zoneOptions.map((zone) => (
                      <button
                        key={zone.value}
                        type="button"
                        onClick={() => {
                          setSelectedArea(zone.value);
                          setSelectedTables([]);
                        }}
                        className={`rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
                          selectedArea === zone.value
                            ? "border-[#f2d39a]/55 bg-[#c9a56a]/16 shadow-[0_0_28px_rgba(201,165,106,0.16)]"
                            : "border-white/10 bg-white/[0.04] hover:border-[#c9a56a]/35 hover:bg-[#c9a56a]/8"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[#fff4df]">{zone.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-white/55">{zone.subtitle}</span>
                        <span className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#f2d39a]">
                          {language === "bg" ? "до" : "up to"} {zone.capacity}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
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
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((count) => (
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
                    {zoneTitle} · {guestCount || "—"} {t.people}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
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
                  ) : selectedArea === "openTerrace" ? (
                    <OpenTerraceMap tables={visibleOpenTerraceTables} selectedIds={selectedIds} onSelect={handleSelect} labels={labels} />
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

        {canOpenForm && !showBookingForm && (
          <div className="sticky bottom-0 z-[60] -mx-4 mt-5 border-t border-white/10 bg-[#0f0b08]/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl lg:hidden">
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
      </div>

      {largePartyNoticeOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/72 px-4 backdrop-blur-xl">
          <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-[#c9a56a]/24 bg-[radial-gradient(circle_at_top_left,rgba(201,165,106,0.22),transparent_38%),linear-gradient(145deg,rgba(31,24,19,0.98),rgba(11,9,7,0.98))] p-6 text-center text-white shadow-2xl shadow-black/50">
            <button
              type="button"
              onClick={() => setLargePartyNoticeOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
              aria-label={language === "bg" ? "Затвори" : "Close"}
            >
              ×
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/12 text-2xl text-[#f2d39a]">
              {requestedGuests}
            </div>
            <div className="section-kicker mb-3">
              {language === "bg" ? "Голяма компания" : "Large party"}
            </div>
            <h3 className="text-2xl font-semibold text-[#fff4df]">
              {language === "bg" ? "Преместихме ви към терасата" : "We moved you to the terrace"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              {language === "bg"
                ? "В залата за непушачи онлайн могат да се комбинират маси до 16 гости. За по-голяма компания може да разгледате терасата или да се свържете с администратор за събитие."
                : "The non-smoking hall can be booked online for up to 16 guests. For a larger party, view the terrace or contact an administrator to arrange an event."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setLargePartyNoticeOpen(false)}
                className="luxury-button rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                {language === "bg" ? "Виж терасата" : "View terrace"}
              </button>
              <a
                href="tel:+359888218318"
                className="ghost-button rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                {language === "bg" ? "Позвъни на администратор" : "Call administrator"}
              </a>
            </div>
          </div>
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
