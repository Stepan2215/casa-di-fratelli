import React from "react";
import { API_BASE_URL } from "../config/api";

const getValue = (item, key) => item[key] ?? item[key[0].toUpperCase() + key.slice(1)];

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-400/15 text-amber-300 border-amber-400/25",
    Approved: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
    Cancelled: "bg-red-400/15 text-red-300 border-red-400/25",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl">
      <div className="text-sm text-stone-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  async function loadReservations() {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`);
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load reservations", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, action) {
    await fetch(`${API_BASE_URL}/api/reservations/${id}/${action}`, {
      method: "PATCH",
    });

    await loadReservations();
  }

  React.useEffect(() => {
    loadReservations();
  }, []);

  const normalized = reservations.map((r) => ({
    id: getValue(r, "id"),
    guestName: getValue(r, "guestName"),
    phone: getValue(r, "phone"),
    email: getValue(r, "email"),
    guestCount: getValue(r, "guestCount"),
    reservedDate: getValue(r, "reservedDate"),
    reservedTime: getValue(r, "reservedTime"),
    tableIds: getValue(r, "tableIds") || [],
    status: getValue(r, "status") || "Pending",
    notes: getValue(r, "notes"),
    birthDate: getValue(r, "birthDate"),
    marketingConsent: getValue(r, "marketingConsent"),
  }));

  const filtered = normalized.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const searchText = `${r.guestName} ${r.phone} ${r.email} ${r.tableIds.join(" ")} ${r.reservedDate}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = normalized.filter((r) => r.status === "Pending").length;
  const approvedCount = normalized.filter((r) => r.status === "Approved").length;
  const cancelledCount = normalized.filter((r) => r.status === "Cancelled").length;

  return (
    <div className="min-h-screen bg-[#0f0b08] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              Casa di Fratelli CRM
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Резервации</h1>
            <p className="mt-3 text-stone-400">
              Управление на заявки, потвърждения и анулации.
            </p>
          </div>

          <button
            onClick={loadReservations}
            className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-5 py-3 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20"
          >
            Refresh
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Всички" value={normalized.length} />
          <StatCard label="Pending" value={pendingCount} />
          <StatCard label="Approved" value={approvedCount} />
          <StatCard label="Cancelled" value={cancelledCount} />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Търси по име, телефон, email, маса..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-amber-300 md:max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Approved", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  statusFilter === status
                    ? "bg-amber-400 text-black"
                    : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-stone-300">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-stone-300">
            Няма резервации по тези критерии.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-white/10 text-stone-300">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Гост</th>
                    <th className="p-4">Контакт</th>
                    <th className="p-4">Дата</th>
                    <th className="p-4">Време</th>
                    <th className="p-4">Маса</th>
                    <th className="p-4">Гости</th>
                    <th className="p-4">Рожден ден</th>
                    <th className="p-4">Оферти</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4">Действие</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-white/10 align-top">
                      <td className="p-4 text-white/55">#{r.id}</td>

                      <td className="p-4">
                        <div className="font-medium text-white">{r.guestName}</div>
                        {r.notes && (
                          <div className="mt-1 max-w-[220px] text-xs text-stone-400">
                            {r.notes}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div>{r.phone}</div>
                        <div className="mt-1 text-xs text-stone-400">{r.email}</div>
                      </td>

                      <td className="p-4">{r.reservedDate}</td>
                      <td className="p-4">{r.reservedTime}</td>
                      <td className="p-4">{r.tableIds.join(", ")}</td>
                      <td className="p-4">{r.guestCount}</td>
                      <td className="p-4">{r.birthDate || "—"}</td>
                      <td className="p-4">{r.marketingConsent ? "Да" : "Не"}</td>

                      <td className="p-4">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(r.id, "approve")}
                            disabled={r.status === "Approved"}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => updateStatus(r.id, "cancel")}
                            disabled={r.status === "Cancelled"}
                            className="rounded-xl bg-red-500 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}