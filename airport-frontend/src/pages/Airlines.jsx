import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000/api";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

const airlineColor = (code) => {
  const colors = {
    RJ: "from-green-500 to-emerald-600",
    EK: "from-red-500 to-rose-600",
    QR: "from-purple-500 to-violet-600",
    TK: "from-red-600 to-red-700",
    LH: "from-yellow-500 to-amber-600",
    BA: "from-blue-600 to-blue-700",
    AF: "from-blue-500 to-indigo-600",
    MS: "from-teal-500 to-cyan-600",
    SV: "from-green-600 to-green-700",
    SQ: "from-yellow-600 to-orange-600",
    JL: "from-red-500 to-red-600",
    QF: "from-red-600 to-orange-600",
    AC: "from-red-500 to-rose-500",
    KL: "from-blue-500 to-sky-600",
    AA: "from-blue-700 to-blue-800",
  };
  return colors[code] || "from-blue-500 to-cyan-500";
};

export default function Airlines() {
  const navigate = useNavigate();
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", country: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchAirlines(); }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/airlines`);
      setAirlines(res.data);
    } catch (e) {
      showToast("Failed to load airlines", "error");
    }
    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async () => {
    if (!form.name || !form.code || !form.country) {
      setFormError("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/airlines`, form);
      showToast("Airline added successfully!");
      setShowModal(false);
      setForm({ name: "", code: "", country: "" });
      setFormError("");
      fetchAirlines();
    } catch (e) {
      setFormError(e.response?.data?.error || "Error adding airline");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/airlines/${id}`);
      showToast("Airline deleted");
      setShowConfirm(null);
      fetchAirlines();
    } catch (e) {
      showToast("Error deleting airline", "error");
    }
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const countries = ["All", ...new Set(airlines.map(a => a.country))];

  const filtered = airlines
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q);
      const matchCountry = filterCountry === "All" || a.country === filterCountry;
      return matchSearch && matchCountry;
    })
    .sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase?.() ?? "";
      const valB = b[sortBy]?.toLowerCase?.() ?? "";
      return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navbar */}
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-5xl font-black text-white mb-2">🛫 Airlines</h2>
            <p className="text-blue-300">Manage all airline companies worldwide</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setFormError(""); }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            <span className="text-lg">+</span> Add Airline
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🛫", label: "Total Airlines", value: airlines.length, color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-300" },
            { icon: "🌍", label: "Countries", value: new Set(airlines.map(a => a.country)).size, color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/30", text: "text-cyan-300" },
            { icon: "🔍", label: "Showing", value: filtered.length, color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/30", text: "text-purple-300" },
          ].map((s) => (
            <div key={s.label} className={`backdrop-blur-md bg-gradient-to-br ${s.color} rounded-2xl border ${s.border} p-5 hover:scale-105 transition-all`}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className={`text-4xl font-black ${s.text} mb-1`}>
                <AnimatedNumber value={s.value} />
              </div>
              <div className="text-white/60 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, country..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition"
            />
          </div>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition"
          >
            {countries.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`px-4 py-3 rounded-xl font-semibold text-sm transition ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white/10 text-white/60 border border-white/20"}`}>⊞ Grid</button>
            <button onClick={() => setViewMode("table")} className={`px-4 py-3 rounded-xl font-semibold text-sm transition ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-white/10 text-white/60 border border-white/20"}`}>☰ Table</button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/50">
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mb-4" />
            <p className="text-lg">Loading airlines...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/50">
            <div className="text-6xl mb-4">🛫</div>
            <p className="text-xl font-semibold">No airlines found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((airline) => (
              <div key={airline.id} className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/40">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${airlineColor(airline.code)} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                    {airline.code}
                  </div>
                  <button
                    onClick={() => setShowConfirm(airline.id)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition opacity-0 group-hover:opacity-100"
                  >🗑</button>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-3">{airline.name}</h3>
                <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
                  <span>🌍</span><span>{airline.country}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/30 text-xs">ID: #{airline.id}</span>
                  <span className="text-emerald-400 text-xs font-semibold">✈️ Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {[
                    { label: "ID", key: "id" },
                    { label: "Code", key: "code" },
                    { label: "Airline Name", key: "name" },
                    { label: "Country", key: "country" },
                    { label: "Actions", key: null },
                  ].map((h) => (
                    <th
                      key={h.label}
                      onClick={() => h.key && handleSort(h.key)}
                      className={`px-6 py-4 text-blue-300 font-semibold text-sm tracking-wider ${h.key ? "cursor-pointer hover:text-white transition" : ""}`}
                    >
                      {h.label} {h.key && sortBy === h.key && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((airline) => (
                  <tr key={airline.id} className="border-b border-white/10 hover:bg-white/5 transition text-white">
                    <td className="px-6 py-4 text-blue-300 font-mono font-bold">#{airline.id}</td>
                    <td className="px-6 py-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${airlineColor(airline.code)} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                        {airline.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{airline.name}</td>
                    <td className="px-6 py-4 text-blue-200">🌍 {airline.country}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setShowConfirm(airline.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-white/30 text-sm mt-4 text-right">
          Showing {filtered.length} of {airlines.length} airlines
        </p>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">🛫 Add Airline</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white text-xl transition">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Airline Name", key: "name", placeholder: "e.g. Royal Jordanian" },
                { label: "IATA Code", key: "code", placeholder: "e.g. RJ" },
                { label: "Country", key: "country", placeholder: "e.g. Jordan" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-blue-300 text-sm font-semibold mb-1 block">{field.label}</label>
                  <input
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>
              ))}
              {formError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  ⚠ {formError}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-50">
                {submitting ? "Adding..." : "Add Airline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-black text-white mb-2">Delete Airline?</h3>
            <p className="text-white/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">Cancel</button>
              <button onClick={() => handleDelete(showConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl font-semibold text-white shadow-2xl ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}