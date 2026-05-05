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

function getValue(item, key) {
  return item?.[key] ?? item?.[key[0].toUpperCase() + key.slice(1)];
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
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl">
      <div className="text-sm text-stone-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
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
    <div className="rounded-[2rem] border border-white/10 bg-[#15100c] p-5 shadow-2xl md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
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
  const [reservations, setReservations] = React.useState([]);
  const [menuItems, setMenuItems] = React.useState([]);
  const [blacklist, setBlacklist] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [expandedId, setExpandedId] = React.useState(null);
  const [menuForm, setMenuForm] = React.useState(emptyMenuItem);
  const [editingMenuId, setEditingMenuId] = React.useState(null);
  const [adminReservation, setAdminReservation] = React.useState(emptyAdminReservation);
  const [statsPeriod, setStatsPeriod] = React.useState("today");
  const [blacklistForm, setBlacklistForm] = React.useState({
    guestName: "",
    phone: "",
    email: "",
    reason: "No-show",
    notes: "",
  });

  async function loadAll() {
    setLoading(true);

    try {
      const [reservationsResponse, menuResponse, blacklistResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/reservations`),
        fetch(`${API_BASE_URL}/api/menu`),
        fetch(`${API_BASE_URL}/api/blacklist`),
      ]);

      const reservationsData = await reservationsResponse.json();
      const menuData = await menuResponse.json();
      const blacklistData = await blacklistResponse.json();

      setReservations(Array.isArray(reservationsData) ? reservationsData.map(normalizeReservation) : []);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setBlacklist(Array.isArray(blacklistData) ? blacklistData : []);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
  }, []);

  async function updateStatus(id, action) {
    await fetch(`${API_BASE_URL}/api/reservations/${id}/${action}`, {
      method: "PATCH",
    });

    await loadAll();
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

    await loadAll();
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
    await loadAll();
  }

  async function deleteMenuItem(id) {
    await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "DELETE",
    });

    await loadAll();
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

    await fetch(`${API_BASE_URL}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setAdminReservation(emptyAdminReservation);
    await loadAll();
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

    await loadAll();
  }

  async function deleteBlacklistEntry(id) {
    await fetch(`${API_BASE_URL}/api/blacklist/${id}`, {
      method: "DELETE",
    });

    await loadAll();
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

  const tabs = [
    ["reservations", "Reservations"],
    ["create", "Create"],
    ["menu", "Menu"],
    ["blacklist", "Blacklist"],
    ["customers", "Customers"],
  ];

  return (
    <div className="min-h-screen bg-[#0f0b08] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              Casa di Fratelli Admin OS
            </p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Restaurant CRM
            </h1>
            <p className="mt-3 text-stone-400">
              Резервации, меню, клиенти, blacklist и маркетинг в една система.
            </p>
          </div>

          <button
            onClick={loadAll}
            className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-5 py-3 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20"
          >
            Refresh
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
  {[
    ["today", "Today"],
    ["week", "Week"],
    ["month", "Month"],
    ["year", "Year"],
  ].map(([key, label]) => (
    <button
      key={key}
      onClick={() => setStatsPeriod(key)}
      className={`rounded-full px-4 py-2 text-sm transition ${
        statsPeriod === key
          ? "bg-amber-400 text-black"
          : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  ))}
</div>
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="All reservations" value={statsReservations.length} />
          <StatCard label="Pending" value={pendingCount} />
          <StatCard label="Approved" value={approvedCount} />
          <StatCard label="Blacklist" value={blacklistCount} />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-2xl px-4 py-3 text-center text-sm transition ${
                activeTab === key
             ? "bg-amber-400 text-black"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <Panel title="Loading">Loading...</Panel>
        ) : (
          <>
            {activeTab === "reservations" && (
              <Panel
                title="Reservations"
                subtitle="Основен екран с компактна таблица и детайли при отваряне."
                right={
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, phone, email, table..."
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
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-left text-sm">
                    <thead className="text-stone-400">
                      <tr className="border-b border-white/10">
                        <th className="p-4">Guest</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Tables</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredReservations.map((r) => {
                        const expanded = expandedId === r.id;

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
                                    #{r.id} {r.createdByAdmin ? "· Admin" : "· Website"}
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
                                    Approve
                                  </button>

                                  <button
                                    onClick={() => updateStatus(r.id, "cancel")}
                                    disabled={r.status === "Cancelled"}
                                    className="rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    onClick={() => addToBlacklist(r)}
                                    className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs font-medium text-yellow-200"
                                  >
                                    No-show
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
                                        Contact
                                      </div>
                                      <div className="mt-3 text-sm text-stone-300">
                                        Phone: {r.phone}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Email: {r.email || "—"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Birthday: {r.birthDate || "—"}
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                        Notes
                                      </div>
                                      <div className="mt-3 text-sm text-stone-300">
                                        Client: {r.notes || "—"}
                                      </div>
                                      <div className="mt-2 text-sm text-stone-300">
                                        Internal: {r.internalNote || "—"}
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                      <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                                        Flags
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

            {activeTab === "menu" && (
              <Panel
                title="Menu CMS"
                subtitle="Редакция на меню и изпращане на нови предложения към абонати."
              >
                <form onSubmit={saveMenuItem} className="mb-8 grid gap-4 md:grid-cols-2">
                  {[
                    ["nameBg", "Name BG"],
                    ["nameEn", "Name EN"],
                    ["weight", "Weight"],
                    ["price", "Price"],
                    ["category", "Category"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-2 block text-sm text-stone-400">{label}</label>
                      <input
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
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">Description BG</label>
                    <textarea
                      value={menuForm.descriptionBg}
                      onChange={(e) =>
                        setMenuForm((prev) => ({
                          ...prev,
                          descriptionBg: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-400">Description EN</label>
                    <textarea
                      value={menuForm.descriptionEn}
                      onChange={(e) =>
                        setMenuForm((prev) => ({
                          ...prev,
                          descriptionEn: e.target.value,
                        }))
                      }
                      rows={3}
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
                    Active
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
                    Notify subscribers
                  </label>

                  <button className="rounded-2xl bg-amber-400 px-6 py-4 font-semibold text-black md:col-span-2">
                    {editingMenuId ? "Update menu item" : "Add menu item"}
                  </button>
                </form>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {menuItems.map((item) => (
                    <div key={item.id || item.Id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold">{item.nameBg || item.NameBg}</div>
                          <div className="mt-1 text-sm text-stone-400">{item.category || item.Category}</div>
                        </div>
                        <div className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
                          {item.price || item.Price} лв
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-stone-300">
                        {item.descriptionBg || item.DescriptionBg}
                      </p>

                      <div className="mt-4 text-sm text-stone-500">
                        {item.weight || item.Weight}
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
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
                          }}
                          className="rounded-xl border border-white/10 px-4 py-2 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteMenuItem(item.id || item.Id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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