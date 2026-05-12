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
  "Stored in BGN. The public site converts it to EUR and rounds up to the next 10 cents.";

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
      price: "Цена BGN",
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
      priceHelp: "Цената се пази в лева. Публичният сайт я обръща в евро и закръгля нагоре до 10 цента.",
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
      price: "Price BGN",
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
  startTime: "17:30",
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
  all: [...indoorTableIds, ...gardenTableIds],
};

function getValue(item, key) {
  return item?.[key] ?? item?.[key[0].toUpperCase() + key.slice(1)];
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

  for (let value = start; value <= end; value += 30) {
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

        return (
          <button
            key={tableId}
            type="button"
            onClick={() => onToggle(tableId)}
            className={`rounded-xl border px-3 py-2 text-xs transition ${
              selected
                ? "border-amber-300 bg-amber-400 text-black"
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

export default function AdminPage() {
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
  const [menuForm, setMenuForm] = React.useState(emptyMenuItem);
  const [editingMenuId, setEditingMenuId] = React.useState(null);
  const [adminReservation, setAdminReservation] = React.useState(emptyAdminReservation);
  const [tableEdits, setTableEdits] = React.useState({});
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

  React.useEffect(() => {
    loadReservations();
  }, []);

  React.useEffect(() => {
    setAdminError("");

    if (activeTab === "menu") {
      loadMenuItems();
    }

    if (activeTab === "blacklist") {
      loadBlacklist();
    }
  }, [activeTab]);

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

    setTableEdits((prev) => ({
      ...prev,
      [reservation.id]: {
        ...current,
        tableIds: current.tableIds.includes(tableId)
          ? current.tableIds.filter((id) => id !== tableId)
          : [...current.tableIds, tableId],
      },
    }));
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

  async function addToBlacklist(reservation) {
    await fetch(`${API_BASE_URL}/api/blacklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: reservation.guestName,
        phone: reservation.phone,
        email: reservation.email,
        reason: "No-show",
        notes: reservation.internalNote || reservation.notes || "",
      }),
    });

    await loadBlacklist();
  }

  async function saveMenuItem(event) {
    event.preventDefault();

    const payload = {
      ...menuForm,
      price: Number(menuForm.price || 0),
    };

    const url = editingMenuId
      ? `${API_BASE_URL}/api/menu/${editingMenuId}`
      : `${API_BASE_URL}/api/menu`;

    await fetch(url, {
      method: editingMenuId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMenuForm(emptyMenuItem);
    setEditingMenuId(null);
    setMenuMode("list");
    await loadMenuItems();
  }

  async function deleteMenuItem(id) {
    await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "DELETE",
    });

    await loadMenuItems();
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

    await fetch(`${API_BASE_URL}/api/blacklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blacklistForm),
    });

    setBlacklistForm({
      guestName: "",
      phone: "",
      email: "",
      reason: "No-show",
      notes: "",
    });

    await loadBlacklist();
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
          isBlacklisted: r.isBlacklisted,
        };
      }

      acc[key].count += 1;
      acc[key].isRegularCustomer = acc[key].isRegularCustomer || r.isRegularCustomer || acc[key].count >= 5;
      acc[key].marketingConsent = acc[key].marketingConsent || r.marketingConsent;
      acc[key].isBlacklisted = acc[key].isBlacklisted || r.isBlacklisted;

      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const a = adminText[adminLanguage];

  const tabs = [
    ["reservations", a.tabs.reservations],
    ["create", a.tabs.create],
    ["block", a.tabs.block],
    ["menu", a.tabs.menu],
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
                                <div className="mt-2 text-sm text-stone-300">{a.reservations.internal}: {r.internalNote || "—"}</div>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-amber-300">
                                  {a.reservations.flags}
                                </div>
                                <div className="mt-3 text-sm text-stone-300">Blacklist: {r.isBlacklisted ? "Yes" : "No"}</div>
                                <div className="mt-2 text-sm text-stone-300">Regular: {r.isRegularCustomer ? "Yes" : "No"}</div>
                                <div className="mt-2 text-sm text-stone-300">Marketing: {r.marketingConsent ? "Yes" : "No"}</div>
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
                                      <div className="mt-2 text-sm text-stone-300">
                                        {a.reservations.internal}: {r.internalNote || "—"}
                                      </div>
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
                      <input
                        type={key === "reservedDate" ? "date" : key === "guestCount" ? "number" : "text"}
                        value={adminReservation[key]}
                        onChange={(e) =>
                          setAdminReservation((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        required={["phone", "reservedDate", "reservedTime", "guestCount", "tableIds"].includes(key)}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                      />
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
                    <input
                      type="time"
                      step="1800"
                      value={hallBlock.startTime}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">To</label>
                    <input
                      type="time"
                      step="1800"
                      value={hallBlock.endTime}
                      onChange={(e) =>
                        setHallBlock((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
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
                }
              >
                {menuMode === "form" ? (
                  <form onSubmit={saveMenuItem} className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-semibold text-[#fff4df]">
                        {editingMenuId ? a.menu.editTitle : a.menu.addTitle}
                      </h3>
                    </div>

                    {[
                      ["nameBg", a.menu.nameBg],
                      ["nameEn", a.menu.nameEn],
                      ["weight", a.menu.weight],
                      ["price", a.menu.price],
                      ["category", a.menu.category],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="mb-2 block text-sm text-stone-400">{label}</label>
                        <input
                          type={key === "price" ? "number" : "text"}
                          step={key === "price" ? "0.01" : undefined}
                          value={menuForm[key]}
                          onChange={(e) =>
                            setMenuForm((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          required={["nameBg", "price"].includes(key)}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                        />
                        {key === "price" && (
                          <p className="mt-2 text-xs leading-5 text-stone-500">
                            {a.menu.priceHelp}
                          </p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label className="mb-2 block text-sm text-stone-400">{a.menu.descriptionBg}</label>
                      <textarea
                        value={menuForm.descriptionBg}
                        onChange={(e) =>
                          setMenuForm((prev) => ({
                            ...prev,
                            descriptionBg: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-stone-400">{a.menu.descriptionEn}</label>
                      <textarea
                        value={menuForm.descriptionEn}
                        onChange={(e) =>
                          setMenuForm((prev) => ({
                            ...prev,
                            descriptionEn: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                      />
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-300">
                      <input
                        type="checkbox"
                        checked={menuForm.isActive}
                        onChange={(e) =>
                          setMenuForm((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                      />
                      {a.menu.active}
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-300">
                      <input
                        type="checkbox"
                        checked={menuForm.notifySubscribers}
                        onChange={(e) =>
                          setMenuForm((prev) => ({
                            ...prev,
                            notifySubscribers: e.target.checked,
                          }))
                        }
                      />
                      {a.menu.notify}
                    </label>

                    <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">
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
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {menuItems.length === 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-stone-400 md:col-span-2 xl:col-span-3">
                        {a.menu.empty}
                      </div>
                    )}

                    {menuItems.map((item) => (
                      <div key={item.id || item.Id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{item.nameBg || item.NameBg}</div>
                            <div className="mt-1 text-sm text-stone-400">{item.nameEn || item.NameEn || "—"}</div>
                          </div>
                          <div className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
                            {item.price || item.Price} лв
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
                )}
              </Panel>
            )}

            {activeTab === "blacklist" && (
              <Panel title="Blacklist" subtitle="No-show клиенти и проблемни резервации.">
                <form onSubmit={saveBlacklistEntry} className="mb-8 grid gap-4 md:grid-cols-3">
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
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
                  </div>

                  <button className="rounded-2xl bg-yellow-400 px-6 py-4 font-semibold text-black md:col-span-3">
                    Add to blacklist
                  </button>
                </form>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {blacklist.map((item) => (
                    <div key={item.id || item.Id} className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                      <div className="font-semibold">{item.guestName || item.GuestName || "—"}</div>
                      <div className="mt-2 text-sm text-yellow-100/80">{item.phone || item.Phone}</div>
                      <div className="mt-1 text-sm text-yellow-100/80">{item.email || item.Email}</div>
                      <div className="mt-4 text-sm">{item.reason || item.Reason}</div>
                      <div className="mt-2 text-sm text-yellow-100/60">{item.notes || item.Notes}</div>

                      <button
                        onClick={() => deleteBlacklistEntry(item.id || item.Id)}
                        className="mt-5 rounded-xl bg-red-500 px-4 py-2 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
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
