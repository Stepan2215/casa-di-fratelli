import React from "react";
import { API_BASE_URL } from "../config/api";

const emptyMenuItem = {
  nameBg: "",
  nameEn: "",
  descriptionBg: "",
  descriptionEn: "",
  weight: "",
  price: "",
  category: "Main",
  isActive: true,
  notifySubscribers: false,
};

const priceHelperText =
  "Stored and shown in EUR. Use the final guest-facing price.";

const adminText = {
  bg: {
    appTitle: "Restaurant CRM",
    appSubtitle: "Резервации, меню, клиенти, blacklist и маркетинг в една система.",
    refresh: "Обнови",
    language: "Език",
    stats: {
      today: "Днес",
      week: "Седмица",
      month: "Месец",
      year: "Година",
      allReservations: "Всички резервации",
      pending: "Чакащи",
      approved: "Потвърдени",
      blacklist: "Blacklist",
    },
    tabs: {
      reservations: "Резервации",
      create: "Нова резервация",
      block: "Блокирай зала",
      menu: "Меню",
      layout: "Карта",
      blacklist: "Blacklist",
      customers: "Клиенти",
    },
    reservations: {
      title: "Резервации",
      subtitle: "Компактен CRM изглед. На телефон се вижда най-важното, а детайлите се отварят с докосване.",
      search: "Търси име, телефон, имейл, маса...",
      guest: "Гост",
      date: "Дата",
      time: "Час",
      tables: "Маси",
      guests: "Гости",
      status: "Статус",
      actions: "Действия",
      approve: "Потвърди",
      cancel: "Откажи",
      noShow: "No-show",
      contact: "Контакт",
      phone: "Телефон",
      email: "Имейл",
      birthday: "Рожден ден",
      notes: "Бележки",
      client: "Клиент",
      internal: "Вътрешна",
      flags: "Маркери",
      changeTables: "Смяна на маси",
      changeTablesHint: "Запазването проверява потвърдени резервации с 60 минути буфер.",
      saveTables: "Запази масите",
      sourceAdmin: "Admin",
      sourceWebsite: "Сайт",
      open: "Детайли",
      close: "Скрий",
    },
    menu: {
      title: "Меню CMS",
      subtitle: "Списък, редакция и добавяне на ястия. Сайтът взима тези данни автоматично.",
      list: "Списък ястия",
      add: "Добави ястие",
      edit: "Редакция",
      addTitle: "Добави ново ястие",
      editTitle: "Редактирай ястие",
      nameBg: "Име BG",
      nameEn: "Име EN",
      weight: "Грамаж",
      price: "Цена EUR",
      category: "Категория",
      descriptionBg: "Състав / описание BG",
      descriptionEn: "Ingredients / description EN",
      active: "Активно в сайта",
      notify: "Изпрати към абонати",
      saveAdd: "Добави ястие",
      saveEdit: "Запази промени",
      cancelEdit: "Назад към списъка",
      delete: "Изтрий",
      empty: "Още няма ястия в CMS.",
      priceHelp: "Цената се пази и показва в евро. Въведете крайната цена за гостите.",
    },
    layout: {
      title: "Карта на ресторанта",
      subtitle: "Премествайте масите, добавяйте нови и скривайте неактивни. Сайтът използва тази карта автоматично.",
      save: "Запази картата",
      reset: "Върни оригиналната",
      add: "Добави маса",
      area: "Зона",
      seats: "Места",
      active: "Активна",
      remove: "Премахни",
      overlap: "Масите не трябва да се застъпват.",
    },
  },
  en: {
    appTitle: "Restaurant CRM",
    appSubtitle: "Reservations, menu, guests, blacklist, and marketing in one system.",
    refresh: "Refresh",
    language: "Language",
    stats: {
      today: "Today",
      week: "Week",
      month: "Month",
      year: "Year",
      allReservations: "All reservations",
      pending: "Pending",
      approved: "Approved",
      blacklist: "Blacklist",
    },
    tabs: {
      reservations: "Reservations",
      create: "Create",
      block: "Block hall",
      menu: "Menu",
      layout: "Map",
      blacklist: "Blacklist",
      customers: "Customers",
    },
    reservations: {
      title: "Reservations",
      subtitle: "Compact CRM view. Phones show the essentials, then open full details on tap.",
      search: "Search name, phone, email, table...",
      guest: "Guest",
      date: "Date",
      time: "Time",
      tables: "Tables",
      guests: "Guests",
      status: "Status",
      actions: "Actions",
      approve: "Approve",
      cancel: "Cancel",
      noShow: "No-show",
      contact: "Contact",
      phone: "Phone",
      email: "Email",
      birthday: "Birthday",
      notes: "Notes",
      client: "Client",
      internal: "Internal",
      flags: "Flags",
      changeTables: "Change tables",
      changeTablesHint: "Saving checks approved reservations with a 60 minute buffer.",
      saveTables: "Save tables",
      sourceAdmin: "Admin",
      sourceWebsite: "Website",
      open: "Details",
      close: "Hide",
    },
    menu: {
      title: "Menu CMS",
      subtitle: "Browse, edit, and add dishes. The public site pulls these items automatically.",
      list: "Dish list",
      add: "Add dish",
      edit: "Edit",
      addTitle: "Add new dish",
      editTitle: "Edit dish",
      nameBg: "Name BG",
      nameEn: "Name EN",
      weight: "Weight",
      price: "Price EUR",
      category: "Category",
      descriptionBg: "Ingredients / description BG",
      descriptionEn: "Ingredients / description EN",
      active: "Active on site",
      notify: "Notify subscribers",
      saveAdd: "Add dish",
      saveEdit: "Save changes",
      cancelEdit: "Back to list",
      delete: "Delete",
      empty: "No dishes in the CMS yet.",
      priceHelp: priceHelperText,
    },
    layout: {
      title: "Restaurant map",
      subtitle: "Move tables, add new ones, and hide inactive tables. The public site uses this map automatically.",
      save: "Save map",
      reset: "Restore original",
      add: "Add table",
      area: "Area",
      seats: "Seats",
      active: "Active",
      remove: "Remove",
      overlap: "Tables cannot overlap.",
    },
  },
};

const emptyAdminReservation = {
  guestName: "",
  phone: "",
  email: "",
  guestCount: 2,
  area: "indoor",
  reservedDate: "",
  reservedTime: "",
  tableIds: "",
  notes: "",
  internalNote: "",
};

const emptyHallBlock = {
  area: "indoor",
  reservedDate: "",
  startTime: "10:00",
  endTime: "22:00",
  note: "",
};

const indoorTableIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
];

const gardenTableIds = [
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "30A",
  "34A",
  "45A",
];

const areaTableIds = {
  indoor: indoorTableIds,
  garden: gardenTableIds,
  openTerrace: ["46", "47", "48", "49"],
  all: [...indoorTableIds, ...gardenTableIds, "46", "47", "48", "49"],
};

const adminReservationTimes = Array.from({ length: 13 }, (_, index) => {
  const hour = 10 + index;
  return `${String(hour).padStart(2, "0")}:00`;
});

const categoryDisplayNames = {
  bg: {
    salads: "Салати",
    starters: "Нещо за начало",
    "pasta-risotto": "Паста и ризото",
    mains: "Основни и рибни",
    pizza: "Пица",
    bread: "Домашен хляб",
    desserts: "Десерти",
    main: "Основни",
  },
  en: {
    salads: "Salads",
    starters: "Starters",
    "pasta-risotto": "Pasta & Risotto",
    mains: "Mains & Fish",
    pizza: "Pizza",
    bread: "Bread",
    desserts: "Desserts",
    main: "Main",
  },
};

const gardenGroups = [
  ["42", "43", "44", "45"],
  ["38", "39", "40", "41"],
  ["34", "35", "36", "37"],
  ["30", "31", "32", "33"],
];

const gardenSpecialIds = ["30A", "34A", "45A"];
const indoorCombinationGroups = [
  ["5", "6"],
  ["20", "21", "22", "23"],
  ["28", "29"],
];

function getValue(item, key) {
  return item?.[key] ?? item?.[key[0].toUpperCase() + key.slice(1)];
}

function normalizeCategory(value) {
  return String(value || "main").trim() || "main";
}

function getCategoryLabel(category, language) {
  const normalized = normalizeCategory(category);
  return categoryDisplayNames[language]?.[normalized] || normalized;
}

function isContinuousGroup(group, tableIds) {
  const indexes = tableIds
    .map((id) => group.indexOf(id))
    .sort((aIndex, bIndex) => aIndex - bIndex);

  if (indexes.some((index) => index < 0)) return false;

  for (let index = 1; index < indexes.length; index += 1) {
    if (indexes[index] - indexes[index - 1] !== 1) return false;
  }

  return true;
}

function canUseAdminTableSelection(area, tableIds) {
  const uniqueTableIds = [...new Set(tableIds.filter(Boolean))];

  if (uniqueTableIds.length <= 1) return true;

  if (area === "garden") {
    if (uniqueTableIds.some((id) => gardenSpecialIds.includes(id))) return false;
    return gardenGroups.some((group) =>
      uniqueTableIds.every((id) => group.includes(id)) && isContinuousGroup(group, uniqueTableIds)
    );
  }

  return indoorCombinationGroups.some((group) => uniqueTableIds.every((id) => group.includes(id)));
}

function buildTimeRange(startTime, endTime) {
  const toMinutes = (value) => {
    const [hours, minutes] = String(value || "").split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
  };

  const fromMinutes = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (start === null || end === null || start > end) return [];

  const times = [];

  for (let value = start; value <= end; value += 60) {
    times.push(fromMinutes(value));
  }

  return times;
}

async function readErrorMessage(response, fallback) {
  const rawText = await response.text();

  try {
    const result = rawText ? JSON.parse(rawText) : null;
    return result?.message || rawText || fallback;
  } catch {
    return rawText || fallback;
  }
}

async function fetchJsonOrEmpty(url, fallback) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Failed to load ${url}.`));
  }

  const rawText = await response.text();
  if (!rawText) return fallback;

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error(`Invalid JSON from ${url}.`);
  }
}

function TableChipSelector({ area, selectedTableIds, onToggle }) {
  const tableIds = areaTableIds[area] || indoorTableIds;

  return (
    <div className="flex flex-wrap gap-2">
      {tableIds.map((tableId) => {
        const selected = selectedTableIds.includes(tableId);
        const allowed = selected || canUseAdminTableSelection(area, [...selectedTableIds, tableId]);

        return (
          <button
            key={tableId}
            type="button"
            disabled={!allowed}
            onClick={() => onToggle(tableId)}
            className={`rounded-xl border px-3 py-2 text-xs transition ${
              selected
                ? "border-amber-300 bg-amber-400 text-black"
                : !allowed
                ? "cursor-not-allowed border-white/5 bg-black/10 text-white/25"
                : "border-white/10 bg-black/20 text-white/65 hover:border-amber-300/50 hover:text-white"
            }`}
          >
            {tableId}
          </button>
        );
      })}
    </div>
  );
}

function normalizeLayoutItem(item) {
  return {
    id: String(item.id || item.Id || "").trim(),
    area: item.area || item.Area || "indoor",
    x: Number(item.x ?? item.X ?? 50),
    y: Number(item.y ?? item.Y ?? 50),
    seats: Number(item.seats ?? item.Seats ?? 4),
    special: Boolean(item.special ?? item.Special),
    wide: Boolean(item.wide ?? item.Wide),
    isActive: item.isActive ?? item.IsActive ?? true,
  };
}

function hasLayoutOverlap(layout, candidate) {
  return layout.some((item) => {
    if (item.id === candidate.id || item.area !== candidate.area || !item.isActive || !candidate.isActive) {
      return false;
    }

    const distance = Math.hypot(item.x - candidate.x, item.y - candidate.y);
    return distance < 6;
  });
}

function AdminMapWindow({ className = "", label, vertical = false }) {
  return (
    <div className={`pointer-events-none absolute z-[3] ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-full border border-sky-200/35 bg-sky-100/[0.065] shadow-[0_0_26px_rgba(125,211,252,0.14)] backdrop-blur">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_36%),repeating-linear-gradient(90deg,transparent_0_18%,rgba(186,230,253,0.2)_18%_19%,transparent_19%_38%)]" />
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sky-100/35" />
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

function AdminMapDecor({ area }) {
  if (area === "garden") {
    return (
      <>
        <AdminMapWindow className="left-5 right-5 top-3 h-4" label="Прозорци" />
        <AdminMapWindow className="bottom-5 left-3 top-5 w-4" label="Прозорци" vertical />
        <AdminMapWindow className="bottom-5 right-3 top-5 w-4" label="Прозорци" vertical />
        <div className="pointer-events-none absolute left-[4%] top-[50%] z-[3]">
          <div className="relative h-16 w-6 rounded-lg border border-white/18 bg-[#080706] shadow-[0_0_24px_rgba(0,0,0,0.42)]">
            <div className="absolute inset-1 rounded-lg bg-[linear-gradient(160deg,rgba(56,189,248,0.28),rgba(255,255,255,0.08)_42%,rgba(20,184,166,0.16))]" />
          </div>
          <div className="mt-1 -translate-x-4 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-white/60">
            Телевизор
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-1 left-1/2 z-[3] w-[24%] -translate-x-1/2 text-center">
          <div className="mx-auto h-6 w-16 rounded-t-full border-x border-t border-[#d6b278]/55 bg-[radial-gradient(circle_at_50%_100%,rgba(214,178,120,0.28),transparent_62%)]" />
          <div className="mx-auto h-1 w-20 rounded-full bg-[#d6b278]/55" />
          <div className="mx-auto mt-0.5 max-w-[96px] rounded-full border border-[#c9a56a]/28 bg-black/48 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-[#f2d39a] backdrop-blur">
            Вход към терасата
          </div>
        </div>
      </>
    );
  }

  if (area === "openTerrace") {
    return (
      <>
        <AdminMapWindow className="left-5 right-5 top-3 h-4" label="Открито" />
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-[3] -translate-x-1/2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-100/80 backdrop-blur">
          Открита тераса
        </div>
      </>
    );
  }

  return (
    <>
      <AdminMapWindow className="left-3 top-5 h-[50%] w-4" label="Прозорци" vertical />
      <AdminMapWindow className="bottom-5 left-3 top-[70%] w-4" label="Прозорци" vertical />
      <div className="pointer-events-none absolute right-5 top-[51%] z-[3] h-4 w-[50%] -translate-y-1/2">
        <div className="relative h-full w-full rounded-full border border-stone-200/14 bg-[linear-gradient(180deg,rgba(255,244,223,0.18),rgba(63,47,34,0.78),rgba(255,244,223,0.12))] shadow-[0_0_28px_rgba(0,0,0,0.34)]">
          <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-[#f2d39a]/20" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur">
          Стена
        </div>
      </div>
      <div className="pointer-events-none absolute left-1 top-[60%] z-[3] flex -translate-y-1/2 items-center">
        <div className="h-14 w-5 rounded-r-full border-y border-r border-[#d6b278]/55 bg-[radial-gradient(circle_at_0%_50%,rgba(214,178,120,0.32),transparent_68%)]" />
        <div className="ml-1 rounded-full border border-[#c9a56a]/28 bg-black/48 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-[#f2d39a] backdrop-blur">
          Вход
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-1 left-[25%] z-[3] w-[28%] -translate-x-1/2 text-center">
        <div className="mx-auto h-6 w-16 rounded-t-full border-x border-t border-emerald-200/45 bg-[radial-gradient(circle_at_50%_100%,rgba(110,231,183,0.2),transparent_64%)]" />
        <div className="mx-auto h-1 w-20 rounded-full bg-emerald-200/45" />
        <div className="mx-auto mt-0.5 max-w-[104px] rounded-full border border-emerald-200/20 bg-black/48 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-emerald-100/90 backdrop-blur">
          Вход към терасата
        </div>
      </div>
    </>
  );
}

function TableLayoutEditor({
  text,
  layout,
  selectedArea,
  onAreaChange,
  onUpdate,
  onAdd,
  onRemove,
  onSave,
  onReset,
}) {
  const mapRef = React.useRef(null);
  const [draggingId, setDraggingId] = React.useState(null);
  const [selectedTableId, setSelectedTableId] = React.useState("");
  const areas = [
    ["indoor", "Зала / Непушачи"],
    ["garden", "Покрита тераса"],
    ["openTerrace", "Открита тераса"],
  ];
  const areaTables = layout.filter((item) => item.area === selectedArea);
  const activeAreaTables = areaTables.filter((item) => item.isActive);
  const selectedTable = areaTables.find((item) => item.id === selectedTableId) || areaTables[0];

  React.useEffect(() => {
    setSelectedTableId("");
  }, [selectedArea]);

  const moveTable = (tableId, clientX, clientY) => {
    const box = mapRef.current?.getBoundingClientRect();
    if (!box) return;

    const x = Math.min(94, Math.max(6, ((clientX - box.left) / box.width) * 100));
    const y = Math.min(94, Math.max(6, ((clientY - box.top) / box.height) * 100));
    const current = layout.find((item) => item.id === tableId);
    if (!current) return;

    const next = { ...current, x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
    if (hasLayoutOverlap(layout, next)) return;

    onUpdate(tableId, next);
  };

  return (
    <Panel
      title={text.title}
      subtitle={text.subtitle}
      right={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onAdd} className="luxury-button rounded-full px-4 py-2 text-sm">
            {text.add}
          </button>
          <button type="button" onClick={onReset} className="ghost-button rounded-full px-4 py-2 text-sm">
            {text.reset}
          </button>
          <button type="button" onClick={onSave} className="luxury-button rounded-full px-4 py-2 text-sm">
            {text.save}
          </button>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {areas.map(([area, label]) => (
              <button
                key={area}
                type="button"
                onClick={() => onAreaChange(area)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedArea === area ? "luxury-button" : "ghost-button"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            ref={mapRef}
            className={`relative min-h-[560px] overflow-hidden rounded-[26px] border border-white/10 ${
              selectedArea === "garden"
                ? "bg-[radial-gradient(circle_at_top,_rgba(60,169,126,0.13),_transparent_34%),linear-gradient(180deg,rgba(34,40,28,0.96),rgba(16,18,13,0.96))] md:min-h-[800px]"
                : selectedArea === "openTerrace"
                ? "bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.13),_transparent_34%),radial-gradient(circle_at_50%_100%,rgba(201,165,106,0.13),transparent_38%),linear-gradient(180deg,rgba(30,34,25,0.96),rgba(14,16,11,0.96))]"
                : "bg-[radial-gradient(circle_at_top,_rgba(201,165,106,0.16),_transparent_34%),radial-gradient(circle_at_18%_60%,rgba(125,211,252,0.08),transparent_25%),linear-gradient(180deg,rgba(39,27,21,0.96),rgba(16,12,10,0.96))] md:min-h-[830px]"
            }`}
            onPointerMove={(event) => {
              if (!draggingId) return;
              moveTable(draggingId, event.clientX, event.clientY);
            }}
            onPointerUp={() => setDraggingId(null)}
            onPointerCancel={() => setDraggingId(null)}
          >
            <div className="absolute inset-5 rounded-[22px] border border-[#c9a56a]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:42px_42px]" />
            <AdminMapDecor area={selectedArea} />

            {activeAreaTables.map((table) => (
              <button
                key={table.id}
                type="button"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setSelectedTableId(table.id);
                  setDraggingId(table.id);
                }}
                className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-xl border text-xs font-semibold shadow-2xl transition hover:scale-105 md:h-14 md:w-14 md:rounded-2xl md:text-sm ${
                  selectedTable?.id === table.id
                    ? "border-[#f2d39a] bg-[linear-gradient(145deg,#f6d99e,#b88b4d)] text-black"
                    : "border-[#c9a56a]/40 bg-[linear-gradient(145deg,#5a4332,#2a1f18)] text-white"
                }`}
                style={{ left: `${table.x}%`, top: `${table.y}%` }}
              >
                {table.id}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            {text.overlap}
          </div>

          <div className="max-h-[230px] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-2">
            {areaTables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedTableId(table.id)}
                className={`mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition last:mb-0 ${
                  selectedTable?.id === table.id
                    ? "border-[#f2d39a]/50 bg-[#c9a56a]/16 text-[#fff4df]"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#c9a56a]/35"
                }`}
              >
                <span className="font-semibold">{table.id}</span>
                <span className="text-xs text-white/45">{table.seats} seats · {Math.round(table.x)}, {Math.round(table.y)}</span>
              </button>
            ))}
          </div>

          {selectedTable ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#c9a56a]">Table</div>
                  <div className="mt-1 text-2xl font-semibold text-[#fff4df]">{selectedTable.id}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(selectedTable.id)}
                  className="rounded-full border border-red-300/20 px-3 py-1 text-xs text-red-200"
                >
                  {text.remove}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-white/55">
                    X
                    <input
                      type="number"
                      min="5"
                      max="95"
                      value={selectedTable.x}
                      onChange={(event) => onUpdate(selectedTable.id, { ...selectedTable, x: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs text-white/55">
                    Y
                    <input
                      type="number"
                      min="5"
                      max="95"
                      value={selectedTable.y}
                      onChange={(event) => onUpdate(selectedTable.id, { ...selectedTable, y: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs text-white/55">
                    {text.seats}
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={selectedTable.seats}
                      onChange={(event) => onUpdate(selectedTable.id, { ...selectedTable, seats: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="flex items-end gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={selectedTable.isActive}
                      onChange={(event) => onUpdate(selectedTable.id, { ...selectedTable, isActive: event.target.checked })}
                    />
                    {text.active}
                  </label>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/55">
              Select a table from the list.
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function normalizeReservation(r) {
  const tables = getValue(r, "tableIds") || getValue(r, "tables") || [];

  return {
    id: getValue(r, "id"),
    guestName: getValue(r, "guestName") || "—",
    phone: getValue(r, "phone") || "—",
    email: getValue(r, "email") || "",
    guestCount: getValue(r, "guestCount") || 0,
    area: getValue(r, "area") || "—",
    reservedDate: getValue(r, "reservedDate") || "—",
    reservedTime: getValue(r, "reservedTime") || "—",
    notes: getValue(r, "notes") || "",
    internalNote: getValue(r, "internalNote") || "",
    status: getValue(r, "status") || "Pending",
    createdAtUtc: getValue(r, "createdAtUtc"),
    birthDate: getValue(r, "birthDate"),
    marketingConsent: Boolean(getValue(r, "marketingConsent")),
    privacyConsent: Boolean(getValue(r, "privacyConsent")),
    isBlacklisted: Boolean(getValue(r, "isBlacklisted")),
    isRegularCustomer: Boolean(getValue(r, "isRegularCustomer")),
    isNoShow: Boolean(getValue(r, "isNoShow")),
    createdByAdmin: Boolean(getValue(r, "createdByAdmin")),
    tableIds: Array.isArray(tables)
      ? tables.map((x) => (typeof x === "string" ? x : x.tableCode || x.TableCode)).filter(Boolean)
      : [],
  };
}

function StatCard({ label, value, hint }) {
  return (
    <div className="luxury-panel rounded-[22px] p-5">
      <div className="text-sm text-stone-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-[#fff4df]">{value}</div>
      {hint && <div className="mt-2 text-xs text-stone-500">{hint}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "border-amber-400/25 bg-amber-400/15 text-amber-300",
    Approved: "border-emerald-400/25 bg-emerald-400/15 text-emerald-300",
    Cancelled: "border-red-400/25 bg-red-400/15 text-red-300",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

function Panel({ title, subtitle, children, right }) {
  return (
    <div className="luxury-panel rounded-[26px] p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#fff4df]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-stone-400">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function AdminPage({ onMenuChanged }) {
  const [activeTab, setActiveTab] = React.useState("reservations");
  const [adminLanguage, setAdminLanguage] = React.useState("bg");
  const [reservations, setReservations] = React.useState([]);
  const [menuItems, setMenuItems] = React.useState([]);
  const [blacklist, setBlacklist] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [expandedId, setExpandedId] = React.useState(null);
  const [menuMode, setMenuMode] = React.useState("list");
  const [selectedMenuCategory, setSelectedMenuCategory] = React.useState("");
  const [blacklistMode, setBlacklistMode] = React.useState("list");
  const [menuForm, setMenuForm] = React.useState(emptyMenuItem);
  const [editingMenuId, setEditingMenuId] = React.useState(null);
  const [adminReservation, setAdminReservation] = React.useState(emptyAdminReservation);
  const [tableEdits, setTableEdits] = React.useState({});
  const [tableLayout, setTableLayout] = React.useState([]);
  const [layoutArea, setLayoutArea] = React.useState("indoor");
  const [noteEdits, setNoteEdits] = React.useState({});
  const [hallBlock, setHallBlock] = React.useState(emptyHallBlock);
  const [adminNotice, setAdminNotice] = React.useState("");
  const [adminError, setAdminError] = React.useState("");
  const [statsPeriod, setStatsPeriod] = React.useState("today");
  const [blacklistForm, setBlacklistForm] = React.useState({
    guestName: "",
    phone: "",
    email: "",
    reason: "No-show",
    notes: "",
  });

  async function loadReservations() {
    setLoading(true);
    setAdminError("");

    try {
      const reservationsData = await fetchJsonOrEmpty(`${API_BASE_URL}/api/reservations`, []);
      setReservations(Array.isArray(reservationsData) ? reservationsData.map(normalizeReservation) : []);
    } catch (error) {
      console.error("Failed to load reservations", error);
      setAdminError(error?.message || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMenuItems() {
    try {
      const menuData = await fetchJsonOrEmpty(`${API_BASE_URL}/api/menu`, []);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
    } catch (error) {
      console.error("Failed to load menu", error);
      setAdminError(error?.message || "Failed to load menu.");
    }
  }

  async function loadBlacklist() {
    try {
      const blacklistData = await fetchJsonOrEmpty(`${API_BASE_URL}/api/blacklist`, []);
      setBlacklist(Array.isArray(blacklistData) ? blacklistData : []);
    } catch (error) {
      console.error("Failed to load blacklist", error);
      setAdminError(error?.message || "Failed to load blacklist.");
    }
  }

  async function loadTableLayout() {
    try {
      const layoutData = await fetchJsonOrEmpty(`${API_BASE_URL}/api/table-layouts`, []);
      setTableLayout(Array.isArray(layoutData) ? layoutData.map(normalizeLayoutItem) : []);
    } catch (error) {
      console.error("Failed to load table layout", error);
      setAdminError(error?.message || "Failed to load table layout.");
    }
  }

  React.useEffect(() => {
    loadReservations();
    loadBlacklist();
  }, []);

  React.useEffect(() => {
    setAdminError("");

    if (activeTab === "menu") {
      loadMenuItems();
    }

    if (activeTab === "blacklist") {
      loadBlacklist();
    }

    if (activeTab === "layout") {
      loadTableLayout();
    }
  }, [activeTab]);

  function updateTableLayoutItem(tableId, nextItem) {
    const normalized = normalizeLayoutItem(nextItem);
    if (hasLayoutOverlap(tableLayout, normalized)) {
      setAdminError(a.layout.overlap);
      return;
    }

    setAdminError("");
    setTableLayout((prev) => prev.map((item) => (item.id === tableId ? normalized : item)));
  }

  function addTableLayoutItem() {
    const areaItems = tableLayout.filter((item) => item.area === layoutArea);
    const nextNumber = Math.max(
      0,
      ...tableLayout.map((item) => Number.parseInt(String(item.id).replace(/\D/g, ""), 10)).filter(Number.isFinite)
    ) + 1;
    const candidate = {
      id: String(nextNumber),
      area: layoutArea,
      x: 50,
      y: Math.min(90, 18 + areaItems.length * 8),
      seats: 4,
      special: false,
      wide: layoutArea === "indoor",
      isActive: true,
    };

    setTableLayout((prev) => [...prev, candidate]);
  }

  function removeTableLayoutItem(tableId) {
    setTableLayout((prev) => prev.filter((item) => item.id !== tableId));
  }

  async function saveTableLayout() {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/table-layouts`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tableLayout),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to save table layout."));
      return;
    }

    setAdminNotice("Table layout saved.");
    await loadTableLayout();
  }

  async function resetTableLayout() {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/table-layouts/reset`, {
      method: "POST",
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to reset table layout."));
      return;
    }

    setAdminNotice("Table layout reset.");
    await loadTableLayout();
  }

  async function updateStatus(id, action) {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/${action}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to update reservation status."));
      return;
    }

    await loadReservations();
  }

  function getTableEdit(reservation) {
    return (
      tableEdits[reservation.id] || {
        area: reservation.area === "garden" ? "garden" : "indoor",
        tableIds: reservation.tableIds,
      }
    );
  }

  function setTableEditArea(reservation, area) {
    setTableEdits((prev) => ({
      ...prev,
      [reservation.id]: {
        area,
        tableIds: [],
      },
    }));
  }

  function toggleTableEdit(reservation, tableId) {
    const current = getTableEdit(reservation);
    const exists = current.tableIds.includes(tableId);
    const nextTableIds = exists
      ? current.tableIds.filter((id) => id !== tableId)
      : [...current.tableIds, tableId];

    if (!canUseAdminTableSelection(current.area, nextTableIds)) {
      return;
    }

    setTableEdits((prev) => ({
      ...prev,
      [reservation.id]: {
        ...current,
        tableIds: nextTableIds,
      },
    }));
  }

  function getNoteEdit(reservation) {
    return noteEdits[reservation.id] ?? reservation.internalNote ?? "";
  }

  function setNoteEdit(reservation, value) {
    setNoteEdits((prev) => ({
      ...prev,
      [reservation.id]: value,
    }));
  }

  async function saveReservationNote(reservation) {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/reservations/${reservation.id}/note`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        internalNote: getNoteEdit(reservation),
      }),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to update admin note."));
      return;
    }

    setNoteEdits((prev) => {
      const next = { ...prev };
      delete next[reservation.id];
      return next;
    });
    setAdminNotice("Admin note updated.");
    await loadReservations();
  }

  async function saveReservationTables(reservation) {
    const edit = getTableEdit(reservation);

    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/reservations/${reservation.id}/tables`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area: edit.area,
        tableIds: edit.tableIds,
      }),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Selected table is not available."));
      return;
    }

    setTableEdits((prev) => {
      const next = { ...prev };
      delete next[reservation.id];
      return next;
    });
    setAdminNotice("Tables updated.");
    await loadReservations();
  }

  async function saveBlacklistPayload(payload) {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/blacklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to add to blacklist."));
      return false;
    }

    await loadBlacklist();
    setAdminNotice("Added to blacklist.");
    return true;
  }

  async function addToBlacklist(reservation) {
    await saveBlacklistPayload({
      guestName: reservation.guestName,
      phone: reservation.phone,
      email: reservation.email,
      reason: "No-show",
      notes: reservation.internalNote || reservation.notes || "",
    });
  }

  async function addCustomerToBlacklist(customer) {
    await saveBlacklistPayload({
      guestName: customer.guestName || "",
      phone: customer.phone || "",
      email: customer.email || "",
      reason: "Manual review",
      notes: `Added from Customers tab. Reservations: ${customer.count}`,
    });
  }

  async function saveMenuItem(event) {
    event.preventDefault();
    setAdminNotice("");
    setAdminError("");

    const payload = {
      ...menuForm,
      price: Number(menuForm.price || 0),
    };

    const url = editingMenuId
      ? `${API_BASE_URL}/api/menu/${editingMenuId}`
      : `${API_BASE_URL}/api/menu`;

    const response = await fetch(url, {
      method: editingMenuId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to save menu item."));
      return;
    }

    setMenuForm(emptyMenuItem);
    setEditingMenuId(null);
    setMenuMode("list");
    setAdminNotice(editingMenuId ? "Menu item updated." : "Menu item created.");
    await loadMenuItems();
    await onMenuChanged?.();
  }

  async function deleteMenuItem(id) {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to delete menu item."));
      return;
    }

    setAdminNotice("Menu item deleted.");
    await loadMenuItems();
    await onMenuChanged?.();
  }

  async function seedMenuItems() {
    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/menu/seed`, {
      method: "POST",
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to seed menu items."));
      return;
    }

    const result = await response.json();
    await loadMenuItems();
    await onMenuChanged?.();
    setMenuMode("list");
    setAdminNotice(`Menu ready. Added ${result.created ?? result.Created ?? 0}, total ${result.total ?? result.Total ?? "—"}.`);
  }

  async function createAdminReservation(event) {
    event.preventDefault();

    const payload = {
      ...adminReservation,
      email: adminReservation.email || "",
      guestCount: Number(adminReservation.guestCount || 0),
      tableIds: adminReservation.tableIds
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      createdByAdmin: true,
    };

    setAdminNotice("");
    setAdminError("");

    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to create reservation."));
      return;
    }

    setAdminReservation(emptyAdminReservation);
    setAdminNotice("Reservation created.");
    await loadReservations();
    setActiveTab("reservations");
  }

  async function createHallBlock(event) {
    event.preventDefault();

    const times = buildTimeRange(hallBlock.startTime, hallBlock.endTime);

    setAdminNotice("");
    setAdminError("");

    if (!hallBlock.reservedDate || times.length === 0) {
      setAdminError("Choose a valid date and time range.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/reservations/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservedDate: hallBlock.reservedDate,
        area: hallBlock.area,
        times,
        tableIds: areaTableIds[hallBlock.area] || indoorTableIds,
        note: hallBlock.note,
      }),
    });

    if (!response.ok) {
      setAdminError(await readErrorMessage(response, "Failed to block tables."));
      return;
    }

    setHallBlock(emptyHallBlock);
    setAdminNotice(`Blocked ${times.length} time slots.`);
    await loadReservations();
    setActiveTab("reservations");
  }

  async function saveBlacklistEntry(event) {
    event.preventDefault();

    const saved = await saveBlacklistPayload(blacklistForm);
    if (!saved) return;

    setBlacklistForm({
      guestName: "",
      phone: "",
      email: "",
      reason: "No-show",
      notes: "",
    });
    setBlacklistMode("list");
  }

  async function deleteBlacklistEntry(id) {
    await fetch(`${API_BASE_URL}/api/blacklist/${id}`, {
      method: "DELETE",
    });

    await loadBlacklist();
  }

  function isInStatsPeriod(dateValue) {
  if (!dateValue) return false;

  const reservationDate = new Date(dateValue);
  const now = new Date();

  const start = new Date(now);

  if (statsPeriod === "today") {
    start.setHours(0, 0, 0, 0);
  }

  if (statsPeriod === "week") {
    start.setDate(now.getDate() - 7);
  }

  if (statsPeriod === "month") {
    start.setMonth(now.getMonth() - 1);
  }

  if (statsPeriod === "year") {
    start.setFullYear(now.getFullYear() - 1);
  }

  return reservationDate >= start;
}

const statsReservations = reservations.filter((r) =>
  isInStatsPeriod(r.reservedDate)
);

  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const haystack = `${r.guestName} ${r.phone} ${r.email} ${r.tableIds.join(" ")} ${r.reservedDate}`.toLowerCase();

    return matchesStatus && haystack.includes(search.toLowerCase());
  });

const pendingCount = statsReservations.filter((r) => r.status === "Pending").length;
const approvedCount = statsReservations.filter((r) => r.status === "Approved").length;
  const blacklistCount = blacklist.length;
  const blacklistKeys = new Set(
    blacklist.flatMap((entry) => [
      String(entry.phone || entry.Phone || "").trim().toLowerCase(),
      String(entry.email || entry.Email || "").trim().toLowerCase(),
    ]).filter(Boolean)
  );

  const customers = Object.values(
    reservations.reduce((acc, r) => {
      const key = r.email || r.phone;
      if (!key || key === "—") return acc;

      if (!acc[key]) {
        acc[key] = {
          guestName: r.guestName,
          phone: r.phone,
          email: r.email,
          count: 0,
          lastReservation: r.reservedDate,
          isRegularCustomer: false,
          marketingConsent: r.marketingConsent,
          isBlacklisted:
            r.isBlacklisted ||
            blacklistKeys.has(String(r.phone || "").trim().toLowerCase()) ||
            blacklistKeys.has(String(r.email || "").trim().toLowerCase()),
        };
      }

      acc[key].count += 1;
      acc[key].isRegularCustomer = acc[key].isRegularCustomer || r.isRegularCustomer || acc[key].count >= 5;
      acc[key].marketingConsent = acc[key].marketingConsent || r.marketingConsent;
      acc[key].isBlacklisted =
        acc[key].isBlacklisted ||
        r.isBlacklisted ||
        blacklistKeys.has(String(r.phone || "").trim().toLowerCase()) ||
        blacklistKeys.has(String(r.email || "").trim().toLowerCase());

      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const a = adminText[adminLanguage];

  const menuCategories = React.useMemo(() => {
    const grouped = new Map();

    menuItems.forEach((item) => {
      const category = normalizeCategory(item.category || item.Category);

      if (!grouped.has(category)) {
        grouped.set(category, {
          id: category,
          label: getCategoryLabel(category, adminLanguage),
          count: 0,
          activeCount: 0,
          items: [],
        });
      }

      const group = grouped.get(category);
      group.count += 1;
      if ((item.isActive ?? item.IsActive ?? true) === true) {
        group.activeCount += 1;
      }
      group.items.push(item);
    });

    return Array.from(grouped.values()).sort((first, second) =>
      first.label.localeCompare(second.label, adminLanguage === "bg" ? "bg" : "en")
    );
  }, [adminLanguage, menuItems]);

  React.useEffect(() => {
    if (menuMode !== "list") return;

    if (menuCategories.length === 0) {
      if (selectedMenuCategory) setSelectedMenuCategory("");
      return;
    }

    if (!selectedMenuCategory || !menuCategories.some((category) => category.id === selectedMenuCategory)) {
      setSelectedMenuCategory(menuCategories[0].id);
    }
  }, [menuCategories, menuMode, selectedMenuCategory]);

  const selectedCategoryData =
    menuCategories.find((category) => category.id === selectedMenuCategory) || menuCategories[0];
  const selectedCategoryItems = selectedCategoryData?.items || [];
  const categoryOptions = menuCategories.length
    ? menuCategories
    : Object.keys(categoryDisplayNames[adminLanguage]).map((category) => ({
        id: category,
        label: getCategoryLabel(category, adminLanguage),
        count: 0,
        activeCount: 0,
        items: [],
      }));

  const tabs = [
    ["reservations", a.tabs.reservations],
    ["create", a.tabs.create],
    ["block", a.tabs.block],
    ["menu", a.tabs.menu],
    ["layout", a.tabs.layout],
    ["blacklist", a.tabs.blacklist],
    ["customers", a.tabs.customers],
  ];

  async function refreshActiveTab() {
    if (activeTab === "menu") {
      await loadMenuItems();
      return;
    }

    if (activeTab === "blacklist") {
      await loadBlacklist();
      return;
    }

    if (activeTab === "layout") {
      await loadTableLayout();
      return;
    }

    await loadReservations();
  }

  return (
    <div className="luxury-shell min-h-screen text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8">
        <div className="luxury-panel mb-8 rounded-[28px] p-6 md:p-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <img
              src="/casa-di-fratelli-logo.svg"
              alt="Casa di Fratelli"
              className="brand-logo mb-5 h-16 w-[220px] object-left"
            />
            <p className="section-kicker">
              Casa di Fratelli Admin OS
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#fff4df] md:text-5xl">
              {a.appTitle}
            </h1>
            <p className="mt-3 text-stone-400">
              {a.appSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
              {["bg", "en"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setAdminLanguage(lang)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    adminLanguage === lang ? "luxury-button" : "text-white/70 hover:text-white"
                  }`}
                  aria-label={`${a.language}: ${lang.toUpperCase()}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={refreshActiveTab}
              className="ghost-button rounded-full px-5 py-3 text-sm font-semibold"
            >
              {a.refresh}
            </button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
  {[
    ["today", a.stats.today],
    ["week", a.stats.week],
    ["month", a.stats.month],
    ["year", a.stats.year],
  ].map(([key, label]) => (
    <button
      key={key}
      onClick={() => setStatsPeriod(key)}
      className={`rounded-full px-4 py-2 text-sm transition ${
        statsPeriod === key
          ? "luxury-button"
          : "ghost-button"
      }`}
    >
      {label}
    </button>
  ))}
</div>
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label={a.stats.allReservations} value={statsReservations.length} />
          <StatCard label={a.stats.pending} value={pendingCount} />
          <StatCard label={a.stats.approved} value={approvedCount} />
          <StatCard label={a.stats.blacklist} value={blacklistCount} />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-2 rounded-[22px] border border-white/10 bg-black/20 p-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-2xl px-4 py-3 text-center text-sm transition ${
                activeTab === key
             ? "luxury-button"
              : "ghost-button text-white/80"
          }`}
            >
              {label}
            </button>
          ))}
        </div>

        {adminError && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {adminError}
          </div>
        )}

        {adminNotice && (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {adminNotice}
          </div>
        )}

        {loading ? (
          <Panel title="Loading">Loading...</Panel>
        ) : (
          <>
            {activeTab === "reservations" && (
              <Panel
                title={a.reservations.title}
                subtitle={a.reservations.subtitle}
                right={
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={a.reservations.search}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-amber-300"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-amber-300"
                    >
                      <option>All</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                }
              >
                <div className="grid gap-3 lg:hidden">
                  {filteredReservations.map((r) => {
                    const expanded = expandedId === r.id;
                    const tableEdit = getTableEdit(r);

                    return (
                      <article
                        key={r.id}
                        className={`rounded-[24px] border p-4 transition ${
                          r.isBlacklisted
                            ? "border-yellow-400/25 bg-yellow-500/10"
                            : r.isRegularCustomer
                            ? "border-emerald-400/20 bg-emerald-500/10"
                            : "border-white/10 bg-white/[0.04]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : r.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-lg font-semibold text-white">{r.guestName}</div>
                              <div className="mt-1 text-xs text-stone-500">
                                #{r.id} · {r.createdByAdmin ? a.reservations.sourceAdmin : a.reservations.sourceWebsite}
                              </div>
                            </div>
                            <StatusBadge status={r.status} />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                            <div className="rounded-2xl bg-black/20 p-3">
                              <div className="text-xs text-stone-500">{a.reservations.date}</div>
                              <div className="mt-1 text-white">{r.reservedDate}</div>
                            </div>
                            <div className="rounded-2xl bg-black/20 p-3">
                              <div className="text-xs text-stone-500">{a.reservations.time}</div>
                              <div className="mt-1 text-white">{r.reservedTime}</div>
                            </div>
                            <div className="rounded-2xl bg-black/20 p-3">
                              <div className="text-xs text-stone-500">{a.reservations.guests}</div>
                              <div className="mt-1 text-white">{r.guestCount}</div>
                            </div>
                            <div className="rounded-2xl bg-black/20 p-3">
                              <div className="text-xs text-stone-500">{a.reservations.tables}</div>
                              <div className="mt-1 truncate text-white">{r.tableIds.join(", ")}</div>
                            </div>
                          </div>

                          <div className="mt-3 text-right text-xs uppercase tracking-[0.22em] text-[#d8b377]">
                            {expanded ? a.reservations.close : a.reservations.open}
                          </div>
                        </button>

                        {expanded && (
                          <div className="mt-4 border-t border-white/10 pt-4">
                            <div className="grid gap-3 md:grid-cols-3">
                              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-amber-300">
                                  {a.reservations.contact}
                                </div>
                                <div className="mt-3 text-sm text-stone-300">{a.reservations.phone}: {r.phone}</div>
                                <div className="mt-2 text-sm text-stone-300">{a.reservations.email}: {r.email || "—"}</div>
                                <div className="mt-2 text-sm text-stone-300">{a.reservations.birthday}: {r.birthDate || "—"}</div>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-amber-300">
                                  {a.reservations.notes}
                                </div>
                                <div className="mt-3 text-sm text-stone-300">{a.reservations.client}: {r.notes || "—"}</div>
                                <label className="mt-3 block text-xs text-stone-500">{a.reservations.internal}</label>
                                <textarea
                                  value={getNoteEdit(r)}
                                  onChange={(event) => setNoteEdit(r, event.target.value)}
                                  rows={3}
                                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                                  placeholder={adminLanguage === "bg" ? "Вътрешна бележка за екипа..." : "Internal note for the team..."}
                                />
                                <button
                                  type="button"
                                  onClick={() => saveReservationNote(r)}
                                  className="ghost-button mt-3 rounded-xl px-4 py-2 text-xs font-semibold"
                                >
                                  {adminLanguage === "bg" ? "Запази бележка" : "Save note"}
                                </button>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-amber-300">
                                  {a.reservations.flags}
                                </div>
                                <div className="mt-3 text-sm text-stone-300">Blacklist: {r.isBlacklisted ? "Yes" : "No"}</div>
                                <div className="mt-2 text-sm text-stone-300">Regular: {r.isRegularCustomer ? "Yes" : "No"}</div>
                                <div className="mt-2 text-sm text-stone-300">Marketing: {r.marketingConsent ? "Yes" : "No"}</div>
                                <div className="mt-2 text-sm text-stone-300">Privacy: {r.privacyConsent ? "Yes" : "No"}</div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                onClick={() => updateStatus(r.id, "approve")}
                                disabled={r.status === "Approved"}
                                className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                              >
                                {a.reservations.approve}
                              </button>
                              <button
                                onClick={() => updateStatus(r.id, "cancel")}
                                disabled={r.status === "Cancelled"}
                                className="rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                              >
                                {a.reservations.cancel}
                              </button>
                              <button
                                onClick={() => addToBlacklist(r)}
                                className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs font-medium text-yellow-200"
                              >
                                {a.reservations.noShow}
                              </button>
                            </div>

                            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                              <div className="text-xs uppercase tracking-[0.22em] text-amber-300">
                                {a.reservations.changeTables}
                              </div>
                              <p className="mt-2 text-sm text-stone-400">{a.reservations.changeTablesHint}</p>
                              <div className="mt-4 flex flex-col gap-2 md:flex-row">
                                <select
                                  value={tableEdit.area}
                                  onChange={(e) => setTableEditArea(r, e.target.value)}
                                  disabled={r.status === "Cancelled"}
                                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-amber-300 disabled:opacity-40"
                                >
                                  <option value="indoor">Hall / Non-smoking</option>
                                  <option value="garden">Terrace / Smoking</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => saveReservationTables(r)}
                                  disabled={r.status === "Cancelled" || tableEdit.tableIds.length === 0}
                                  className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
                                >
                                  {a.reservations.saveTables}
                                </button>
                              </div>
                              <div className="mt-4">
                                <TableChipSelector
                                  area={tableEdit.area}
                                  selectedTableIds={tableEdit.tableIds}
                                  onToggle={(tableId) => toggleTableEdit(r, tableId)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[950px] text-left text-sm">
                    <thead className="text-stone-400">
                      <tr className="border-b border-white/10">
                        <th className="p-4">{a.reservations.guest}</th>
                        <th className="p-4">{a.reservations.date}</th>
                        <th className="p-4">{a.reservations.time}</th>
                        <th className="p-4">{a.reservations.tables}</th>
                        <th className="p-4">{a.reservations.guests}</th>
                        <th className="p-4">{a.reservations.status}</th>
                        <th className="p-4">{a.reservations.actions}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredReservations.map((r) => {
                        const expanded = expandedId === r.id;
                        const tableEdit = getTableEdit(r);

                        return (
                          <React.Fragment key={r.id}>
                            <tr
                              className={`border-b border-white/10 transition ${
                                r.isBlacklisted
                                  ? "bg-yellow-500/10"
                                  : r.isRegularCustomer
                                  ? "bg-emerald-500/10"
                                  : "hover:bg-white/[0.03]"
                              }`}
                            >
                              <td className="p-4">
                                <button
                                  onClick={() => setExpandedId(expanded ? null : r.id)}
                                  className="text-left"
                                >
                                  <div className="font-medium text-white">{r.guestName}</div>
                                  <div className="mt-1 text-xs text-stone-500">
                                    #{r.id} · {r.createdByAdmin ? a.reservations.sourceAdmin : a.reservations.sourceWebsite}
                                  </div>
                                </button>
                              </td>

                              <td className="p-4">{r.reservedDate}</td>
                              <td className="p-4">{r.reservedTime}</td>
                              <td className="p-4">{r.tableIds.join(", ")}</td>
                              <td className="p-4">{r.guestCount}</td>
                              <td className="p-4">
                                <StatusBadge status={r.status} />
                              </td>

                              <td className="p-4">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => updateStatus(r.id, "approve")}
                                    disabled={r.status === "Approved"}
                                    className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                                  >
                                    {a.reservations.approve}
                                  </button>

                                  <button
                                    onClick={() => updateStatus(r.id, "cancel")}
                                    disabled={r.status === "Cancelled"}
                                    className="rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                                  >
                                    {a.reservations.cancel}
                                  </button>

                                  <button
                                    onClick={() => addToBlacklist(r)}
                                    className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs font-medium text-yellow-200"
                                  >
                                    {a.reservations.noShow}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {expanded && (
                              <tr className="border-b border-white/10 bg-black/20">
                                <td colSpan={7} className="p-5">
                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                        {a.reservations.contact}
                                      </div>
                                      <div className="mt-3 text-sm text-stone-300">
                                        {a.reservations.phone}: {r.phone}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        {a.reservations.email}: {r.email || "—"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        {a.reservations.birthday}: {r.birthDate || "—"}
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                        {a.reservations.notes}
                                      </div>
                                      <div className="mt-3 text-sm text-stone-300">
                                        {a.reservations.client}: {r.notes || "—"}
                                      </div>
                                      <label className="mt-3 block text-xs text-stone-500">{a.reservations.internal}</label>
                                      <textarea
                                        value={getNoteEdit(r)}
                                        onChange={(event) => setNoteEdit(r, event.target.value)}
                                        rows={3}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                                        placeholder={adminLanguage === "bg" ? "Вътрешна бележка за екипа..." : "Internal note for the team..."}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => saveReservationNote(r)}
                                        className="ghost-button mt-3 rounded-xl px-4 py-2 text-xs font-semibold"
                                      >
                                        {adminLanguage === "bg" ? "Запази бележка" : "Save note"}
                                      </button>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                        {a.reservations.flags}
                                      </div>
                                      <div className="mt-3 text-sm text-stone-300">
                                        Blacklist: {r.isBlacklisted ? "Yes" : "No"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Regular: {r.isRegularCustomer ? "Yes" : "No"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Marketing: {r.marketingConsent ? "Yes" : "No"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Privacy: {r.privacyConsent ? "Yes" : "No"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                      <div>
                                        <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                          {a.reservations.changeTables}
                                        </div>
                                        <p className="mt-2 text-sm text-stone-400">
                                          {a.reservations.changeTablesHint}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 sm:flex-row">
                                        <select
                                          value={tableEdit.area}
                                          onChange={(e) => setTableEditArea(r, e.target.value)}
                                          disabled={r.status === "Cancelled"}
                                          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-amber-300 disabled:opacity-40"
                                        >
                                          <option value="indoor">Hall / Non-smoking</option>
                                          <option value="garden">Terrace / Smoking</option>
                                        </select>

                                        <button
                                          type="button"
                                          onClick={() => saveReservationTables(r)}
                                          disabled={r.status === "Cancelled" || tableEdit.tableIds.length === 0}
                                          className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
                                        >
                                          {a.reservations.saveTables}
                                        </button>
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <TableChipSelector
                                        area={tableEdit.area}
                                        selectedTableIds={tableEdit.tableIds}
                                        onToggle={(tableId) => toggleTableEdit(r, tableId)}
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {activeTab === "create" && (
              <Panel
                title="Create reservation"
                subtitle="Бърза резервация по телефон. Email може да остане празен."
              >
                <form onSubmit={createAdminReservation} className="grid gap-4 md:grid-cols-3">
                  {[
                    ["guestName", "Guest name"],
                    ["phone", "Phone"],
                    ["email", "Email optional"],
                    ["reservedDate", "Date"],
                    ["reservedTime", "Time"],
                    ["guestCount", "Guests"],
                    ["tableIds", "Tables comma separated"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-2 block text-sm text-stone-400">{label}</label>
                      {key === "reservedTime" ? (
                        <select
                          value={adminReservation.reservedTime}
                          onChange={(e) =>
                            setAdminReservation((prev) => ({
                              ...prev,
                              reservedTime: e.target.value,
                            }))
                          }
                          required
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        >
                          <option value="">Select time</option>
                          {adminReservationTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={key === "reservedDate" ? "date" : key === "guestCount" ? "number" : "text"}
                          value={adminReservation[key]}
                          onChange={(e) =>
                            setAdminReservation((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          required={["phone", "reservedDate", "guestCount", "tableIds"].includes(key)}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        />
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">Area</label>
                    <select
                      value={adminReservation.area}
                      onChange={(e) =>
                        setAdminReservation((prev) => ({
                          ...prev,
                          area: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    >
                      <option value="indoor">Hall / Non-smoking</option>
                      <option value="garden">Terrace / Smoking</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="mb-2 block text-sm text-stone-400">Internal note</label>
                    <textarea
                      value={adminReservation.internalNote}
                      onChange={(e) =>
                        setAdminReservation((prev) => ({
                          ...prev,
                          internalNote: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
                  </div>

                  <button className="rounded-2xl bg-amber-400 px-6 py-4 font-semibold text-black md:col-span-3">
                    Create reservation
                  </button>
                </form>
              </Panel>
            )}

            {activeTab === "block" && (
              <Panel
                title="Block hall"
                subtitle="Затваря избраната зона за ден или диапазон от часове. Създава approved блокиращи резервации."
              >
                <form onSubmit={createHallBlock} className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm text-stone-400">Area</label>
                    <select
                      value={hallBlock.area}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          area: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    >
                      <option value="indoor">Hall / Non-smoking</option>
                      <option value="garden">Terrace / Smoking</option>
                      <option value="all">Whole restaurant</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">Date</label>
                    <input
                      type="date"
                      value={hallBlock.reservedDate}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          reservedDate: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">From</label>
                    <select
                      value={hallBlock.startTime}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    >
                      {adminReservationTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">To</label>
                    <select
                      value={hallBlock.endTime}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    >
                      {adminReservationTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="mb-2 block text-sm text-stone-400">Note</label>
                    <textarea
                      value={hallBlock.note}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Private event, maintenance, full buyout..."
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-white/30 focus:border-amber-300"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-300 md:col-span-4">
                    {buildTimeRange(hallBlock.startTime, hallBlock.endTime).length} slots ·{" "}
                    {(areaTableIds[hallBlock.area] || indoorTableIds).length} tables
                  </div>

                  <button className="rounded-2xl bg-amber-400 px-6 py-4 font-semibold text-black md:col-span-4">
                    Block selected area
                  </button>
                </form>
              </Panel>
            )}

            {activeTab === "menu" && (
              <Panel
                title={a.menu.title}
                subtitle={a.menu.subtitle}
                right={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={seedMenuItems}
                      className="ghost-button rounded-full px-4 py-2 text-sm font-semibold"
                    >
                      {adminLanguage === "bg" ? "Запълни от менюто на сайта" : "Seed from site menu"}
                    </button>

                    <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
                      {[
                        ["list", a.menu.list],
                        ["form", editingMenuId ? a.menu.edit : a.menu.add],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            if (key === "form" && menuMode !== "form") {
                              setEditingMenuId(null);
                              setMenuForm(emptyMenuItem);
                            }
                            setMenuMode(key);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            menuMode === key ? "luxury-button" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                }
              >
                {menuMode === "form" ? (
                  <form onSubmit={saveMenuItem} className="space-y-5">
                    <div className="rounded-[26px] border border-white/10 bg-black/20 p-5 md:p-6">
                      <div className="mb-5">
                        <div className="section-kicker">
                          {editingMenuId
                            ? adminLanguage === "bg" ? "Редакция" : "Edit"
                            : adminLanguage === "bg" ? "Ново ястие" : "New dish"}
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#fff4df]">
                          {editingMenuId ? a.menu.editTitle : a.menu.addTitle}
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-stone-400">{a.menu.nameBg}</label>
                          <input
                            value={menuForm.nameBg}
                            onChange={(e) => setMenuForm((prev) => ({ ...prev, nameBg: e.target.value }))}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-stone-400">{a.menu.nameEn}</label>
                          <input
                            value={menuForm.nameEn}
                            onChange={(e) => setMenuForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-stone-400">{a.menu.weight}</label>
                          <input
                            value={menuForm.weight}
                            onChange={(e) => setMenuForm((prev) => ({ ...prev, weight: e.target.value }))}
                            placeholder={adminLanguage === "bg" ? "напр. 350 гр" : "e.g. 350 g"}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-stone-400">{a.menu.price}</label>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#f2d39a]">
                              €
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={menuForm.price}
                              onChange={(e) => setMenuForm((prev) => ({ ...prev, price: e.target.value }))}
                              required
                              className="w-full rounded-2xl border border-white/10 bg-black/20 px-9 py-3 outline-none focus:border-amber-300"
                            />
                          </div>
                          <p className="mt-2 text-xs leading-5 text-stone-500">
                            {a.menu.priceHelp}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                          <div className="section-kicker">{a.menu.category}</div>
                          <h4 className="mt-2 text-xl font-semibold text-[#fff4df]">
                            {adminLanguage === "bg" ? "Избери секция" : "Choose section"}
                          </h4>
                        </div>
                        <div className="text-sm text-stone-500">
                          {adminLanguage === "bg" ? "Или създай нова секция по-долу" : "Or create a new section below"}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {categoryOptions.map((category) => {
                          const selected = normalizeCategory(menuForm.category) === category.id;

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => setMenuForm((prev) => ({ ...prev, category: category.id }))}
                              className={`rounded-2xl border p-4 text-left transition ${
                                selected
                                  ? "border-[#c9a56a]/50 bg-[#c9a56a]/15"
                                  : "border-white/10 bg-black/20 hover:border-[#c9a56a]/35"
                              }`}
                            >
                              <div className="font-semibold text-[#fff4df]">{category.label}</div>
                              <div className="mt-1 text-xs text-stone-500">
                                {category.count} {adminLanguage === "bg" ? "ястия" : "dishes"}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
                        <label className="mb-2 block text-sm text-stone-400">
                          {adminLanguage === "bg" ? "Нова секция" : "New section"}
                        </label>
                        <input
                          value={
                            categoryOptions.some((category) => category.id === normalizeCategory(menuForm.category))
                              ? ""
                              : menuForm.category
                          }
                          onChange={(e) => setMenuForm((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder={adminLanguage === "bg" ? "например: Напитки" : "for example: Drinks"}
                          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-amber-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-stone-400">{a.menu.descriptionBg}</label>
                        <textarea
                          value={menuForm.descriptionBg}
                          onChange={(e) => setMenuForm((prev) => ({ ...prev, descriptionBg: e.target.value }))}
                          rows={5}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-stone-400">{a.menu.descriptionEn}</label>
                        <textarea
                          value={menuForm.descriptionEn}
                          onChange={(e) => setMenuForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                          rows={5}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-300">
                        <input
                          type="checkbox"
                          checked={menuForm.isActive}
                          onChange={(e) => setMenuForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        {a.menu.active}
                      </label>

                      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-300">
                        <input
                          type="checkbox"
                          checked={menuForm.notifySubscribers}
                          onChange={(e) => setMenuForm((prev) => ({ ...prev, notifySubscribers: e.target.checked }))}
                        />
                        {a.menu.notify}
                      </label>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      <button className="luxury-button rounded-2xl px-6 py-4 font-semibold">
                        {editingMenuId ? a.menu.saveEdit : a.menu.saveAdd}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMenuId(null);
                          setMenuForm(emptyMenuItem);
                          setMenuMode("list");
                        }}
                        className="ghost-button rounded-2xl px-6 py-4 font-semibold"
                      >
                        {a.menu.cancelEdit}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5">
                    {menuItems.length === 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-stone-400">
                        <div>{a.menu.empty}</div>
                        <button
                          type="button"
                          onClick={seedMenuItems}
                          className="luxury-button mt-4 rounded-2xl px-5 py-3 text-sm font-semibold"
                        >
                          {adminLanguage === "bg" ? "Добави всички базови ястия" : "Add all base dishes"}
                        </button>
                      </div>
                    )}

                    {menuCategories.length > 0 && (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {menuCategories.map((category) => {
                          const selected = selectedCategoryData?.id === category.id;

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => setSelectedMenuCategory(category.id)}
                              className={`menu-spark rounded-[24px] border p-5 text-left transition ${
                                selected
                                  ? "border-[#c9a56a]/45 bg-[#c9a56a]/15 shadow-xl shadow-black/20"
                                  : "border-white/10 bg-white/[0.04] hover:border-[#c9a56a]/30 hover:bg-white/[0.07]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-lg font-semibold text-[#fff4df]">
                                    {category.label}
                                  </div>
                                  <div className="mt-2 text-sm text-stone-400">
                                    {category.count} {adminLanguage === "bg" ? "ястия" : "dishes"}
                                  </div>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  selected
                                    ? "bg-[#c9a56a] text-black"
                                    : "border border-white/10 bg-black/20 text-stone-300"
                                }`}>
                                  {category.activeCount}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {selectedCategoryData && (
                      <div className="rounded-[26px] border border-white/10 bg-black/20 p-4 md:p-5">
                        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                          <div>
                            <div className="section-kicker">
                              {adminLanguage === "bg" ? "Отворена секция" : "Open section"}
                            </div>
                            <h3 className="mt-2 text-2xl font-semibold text-[#fff4df]">
                              {selectedCategoryData.label}
                            </h3>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-stone-300">
                            {selectedCategoryData.count} {adminLanguage === "bg" ? "позиции" : "items"}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {selectedCategoryItems.map((item) => (
                      <div key={item.id || item.Id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{item.nameBg || item.NameBg}</div>
                            <div className="mt-1 text-sm text-stone-400">{item.nameEn || item.NameEn || "—"}</div>
                          </div>
                          <div className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
                            €{Number(item.price || item.Price || 0).toFixed(2)}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-stone-300">
                            {item.category || item.Category || "Main"}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-stone-300">
                            {item.weight || item.Weight || "—"}
                          </span>
                          <span className={`rounded-full border px-3 py-1 ${
                            (item.isActive ?? item.IsActive ?? true)
                              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                              : "border-red-400/25 bg-red-400/10 text-red-200"
                          }`}>
                            {(item.isActive ?? item.IsActive ?? true) ? "Active" : "Hidden"}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-stone-300">
                          {item.descriptionBg || item.DescriptionBg || "—"}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-stone-500">
                          {item.descriptionEn || item.DescriptionEn || "—"}
                        </p>

                        <div className="mt-5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMenuId(item.id || item.Id);
                              setMenuForm({
                                nameBg: item.nameBg || item.NameBg || "",
                                nameEn: item.nameEn || item.NameEn || "",
                                descriptionBg: item.descriptionBg || item.DescriptionBg || "",
                                descriptionEn: item.descriptionEn || item.DescriptionEn || "",
                                weight: item.weight || item.Weight || "",
                                price: item.price || item.Price || "",
                                category: item.category || item.Category || "Main",
                                isActive: item.isActive ?? item.IsActive ?? true,
                                notifySubscribers: false,
                              });
                              setMenuMode("form");
                            }}
                            className="ghost-button rounded-xl px-4 py-2 text-sm"
                          >
                            {a.menu.edit}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteMenuItem(item.id || item.Id)}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                          >
                            {a.menu.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            )}

            {activeTab === "layout" && (
              <TableLayoutEditor
                text={a.layout}
                layout={tableLayout}
                selectedArea={layoutArea}
                onAreaChange={setLayoutArea}
                onUpdate={updateTableLayoutItem}
                onAdd={addTableLayoutItem}
                onRemove={removeTableLayoutItem}
                onSave={saveTableLayout}
                onReset={resetTableLayout}
              />
            )}

            {activeTab === "blacklist" && (
              <Panel
                title="Blacklist"
                subtitle="No-show клиенти и проблемни резервации."
                right={
                  <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
                    {[
                      ["list", adminLanguage === "bg" ? "Списък" : "List"],
                      ["form", adminLanguage === "bg" ? "Добави ръчно" : "Add manually"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setBlacklistMode(key)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          blacklistMode === key ? "luxury-button" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                }
              >
                {blacklistMode === "form" ? (
                  <form onSubmit={saveBlacklistEntry} className="grid gap-4 md:grid-cols-3">
                    {[
                      ["guestName", "Guest name"],
                      ["phone", "Phone"],
                      ["email", "Email"],
                      ["reason", "Reason"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="mb-2 block text-sm text-stone-400">{label}</label>
                        <input
                          value={blacklistForm[key]}
                          onChange={(e) =>
                            setBlacklistForm((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          required={["guestName", "phone", "reason"].includes(key)}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        />
                      </div>
                    ))}

                    <div className="md:col-span-3">
                      <label className="mb-2 block text-sm text-stone-400">Notes</label>
                      <textarea
                        value={blacklistForm.notes}
                        onChange={(e) =>
                          setBlacklistForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                      />
                    </div>

                    <div className="flex flex-col gap-3 md:col-span-3 md:flex-row">
                      <button className="rounded-2xl bg-yellow-400 px-6 py-4 font-semibold text-black">
                        Add to blacklist
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlacklistMode("list")}
                        className="ghost-button rounded-2xl px-6 py-4 font-semibold"
                      >
                        Back to list
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {blacklist.length === 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-stone-400">
                        {adminLanguage === "bg" ? "Blacklist е празен." : "Blacklist is empty."}
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {blacklist.map((item) => (
                        <div key={item.id || item.Id} className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                          <div className="font-semibold">{item.guestName || item.GuestName || "—"}</div>
                          <div className="mt-2 text-sm text-yellow-100/80">{item.phone || item.Phone}</div>
                          <div className="mt-1 text-sm text-yellow-100/80">{item.email || item.Email || "—"}</div>
                          <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-black/15 p-3 text-sm">
                            {item.reason || item.Reason}
                          </div>
                          <div className="mt-2 text-sm text-yellow-100/60">{item.notes || item.Notes}</div>

                          <button
                            type="button"
                            onClick={() => deleteBlacklistEntry(item.id || item.Id)}
                            className="mt-5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            {activeTab === "customers" && (
              <Panel title="Customers" subtitle="Автоматично изведено от резервациите.">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="text-stone-400">
                      <tr className="border-b border-white/10">
                        <th className="p-4">Guest</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Reservations</th>
                        <th className="p-4">Flags</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((c) => (
                        <tr key={c.email || c.phone} className="border-b border-white/10">
                          <td className="p-4">{c.guestName}</td>
                          <td className="p-4">{c.phone}</td>
                          <td className="p-4">{c.email || "—"}</td>
                          <td className="p-4">{c.count}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {c.isRegularCustomer && (
                                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
                                  Regular
                                </span>
                              )}
                              {c.marketingConsent && (
                                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-300">
                                  Marketing
                                </span>
                              )}
                              {c.isBlacklisted && (
                                <span className="rounded-full bg-red-400/15 px-3 py-1 text-xs text-red-300">
                                  Blacklist
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => addCustomerToBlacklist(c)}
                              disabled={c.isBlacklisted}
                              className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-200 disabled:opacity-40"
                            >
                              {c.isBlacklisted ? "Blacklisted" : "Add blacklist"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}
          </>
        )}
      </div>
    </div>
  );
}
