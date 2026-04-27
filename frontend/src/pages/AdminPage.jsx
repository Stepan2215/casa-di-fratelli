import React from "react";
import { API_BASE_URL } from "../config/api";


export default function AdminPage() {
  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function loadReservations() {
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

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            Casa di Fratelli
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Admin Reservations</h1>
          <p className="mt-3 text-stone-400">
            Управление резервациями ресторана
          </p>
        </div>

        {loading ? (
          <div className="text-stone-400">Loading...</div>
        ) : reservations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-stone-300">
            Пока нет резерваций.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-white/10 text-stone-300">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Гость</th>
                  <th className="p-4">Телефон</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Время</th>
                  <th className="p-4">Столы</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id || r.Id} className="border-t border-white/10">
                    <td className="p-4">{r.id || r.Id}</td>
                    <td className="p-4">{r.guestName || r.GuestName}</td>
                    <td className="p-4">{r.phone || r.Phone}</td>
                    <td className="p-4">{r.reservedDate || r.ReservedDate}</td>
                    <td className="p-4">{r.reservedTime || r.ReservedTime}</td>
                    <td className="p-4">
                      {(r.tableIds || r.TableIds || []).join(", ")}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-300">
                        {r.status || r.Status}
                      </span>
                    </td>
                    <td className="flex gap-2 p-4">
                      <button
                        onClick={() => updateStatus(r.id || r.Id, "approve")}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(r.id || r.Id, "cancel")}
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}