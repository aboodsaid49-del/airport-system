import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000/api";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
  },
};

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [form, setForm] = useState({ user_id: "", flight_id: "", seat_number: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, f, u] = await Promise.all([
        axios.get(`${API}/bookings`),
        axios.get(`${API}/flights`),
       axios.get(`${API}/passengers`),
      ]);
      setBookings(b.data);
      setFlights(f.data);
      setUsers(u.data.data);
    } catch (e) {
      showToast("Failed to load data", "error");
    }
    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async () => {
    if (!form.user_id || !form.flight_id || !form.seat_number) {
      setFormError("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, form);
      showToast("Booking added successfully!");
      setShowModal(false);
      setForm({ user_id: "", flight_id: "", seat_number: "" });
      setFormError("");
      fetchAll();
    } catch (e) {
      setFormError(e.response?.data?.error || "Error adding booking");
    }
    setSubmitting(false);
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${API}/bookings/${id}`);
      showToast("Booking cancelled");
      setShowConfirm(null);
      fetchAll();
    } catch (e) {
      showToast("Error cancelling booking", "error");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      String(b.id).includes(search) ||
      (b.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.flight_number || "").toLowerCase().includes(search.toLowerCase()) ||
      String(b.seat_number).includes(search);
    const matchStatus = filterStatus === "all" || b.booking_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
    cancelled: bookings.filter((b) => b.booking_status === "cancelled").length,
    pending: bookings.filter((b) => b.booking_status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl" />
      </div>

      <nav className="backdrop-blur-md bg-white/10 text-white px-8 py-4 flex justify-between items-center border-b border-white/20 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">✈️</div>
          <div>
            <h1 className="text-lg font-black tracking-wide leading-none">Abood EQ</h1>
            <p className="text-xs text-blue-200 leading-none">International Airport</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-black text-sm">A</div>
            <div>
              <p className="text-sm font-semibold leading-none">Abdalkader Saed EQ</p>
              <p className="text-xs text-blue-200 leading-none">Admin</p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard")} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-semibold text-sm transition">
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="relative z-10 px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black text-white mb-1">🎫 Bookings</h2>
            <p className="text-blue-300 text-sm">Manage all passenger bookings</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setFormError(""); }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            <span className="text-lg">+</span> New Booking
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: "📋", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-300" },
            { label: "Confirmed", value: stats.confirmed, icon: "✅", color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", text: "text-emerald-300" },
            { label: "Cancelled", value: stats.cancelled, icon: "❌", color: "from-red-500/20 to-red-600/10", border: "border-red-500/30", text: "text-red-300" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/30", text: "text-yellow-300" },
          ].map((s) => (
            <div key={s.label} className={`backdrop-blur-md bg-gradient-to-br ${s.color} rounded-2xl border ${s.border} p-5`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
              <div className="text-white/60 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, passenger, flight, seat..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition"
            />
          </div>
          <div className="flex gap-2">
            {["all", "confirmed", "cancelled", "pending"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm capitalize transition ${
                  filterStatus === s
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-white/60 hover:bg-white/20 border border-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/50">
              <div className="w-10 h-10 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mb-4" />
              Loading bookings...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-white/50">
              <div className="text-5xl mb-4">🎫</div>
              <p className="text-lg font-semibold">No bookings found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["ID", "Passenger", "Flight", "Seat", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-blue-300 font-semibold text-sm tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => {
                  const status = STATUS_CONFIG[booking.booking_status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition text-white">
                      <td className="px-6 py-4 text-blue-300 font-mono font-bold">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                            {(booking.full_name || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium">{booking.full_name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-sm font-mono font-semibold">
                          {booking.flight_number || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{booking.seat_number}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.booking_status !== "cancelled" ? (
                          <button
                            onClick={() => setShowConfirm(booking.id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-white/30 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-white/30 text-sm mt-4 text-right">
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">🎫 New Booking</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white text-xl transition">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-blue-300 text-sm font-semibold mb-1 block">Passenger</label>
                <select
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition"
                >
                  <option value="" className="bg-slate-800">Select passenger...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-800">{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-300 text-sm font-semibold mb-1 block">Flight</label>
                <select
                  value={form.flight_id}
                  onChange={(e) => setForm({ ...form, flight_id: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition"
                >
                  <option value="" className="bg-slate-800">Select flight...</option>
                  {flights.map((f) => (
                    <option key={f.id} value={f.id} className="bg-slate-800">{f.flight_number} — {f.destination}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-300 text-sm font-semibold mb-1 block">Seat Number</label>
                <input
                  value={form.seat_number}
                  onChange={(e) => setForm({ ...form, seat_number: e.target.value })}
                  placeholder="e.g. 12A"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              {formError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  ⚠ {formError}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-50">
                {submitting ? "Adding..." : "Add Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-black text-white mb-2">Cancel Booking?</h3>
            <p className="text-white/50 text-sm mb-6">Booking <span className="text-white font-bold">#{showConfirm}</span> will be cancelled.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">
                Keep it
              </button>
              <button onClick={() => handleCancel(showConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl font-semibold text-white shadow-2xl ${
          toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}