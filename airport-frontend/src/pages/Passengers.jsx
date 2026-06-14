import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://airport-system-production.up.railway.app/api";

const nationalityFlag = (nat = "") => {
  const map = {
    Saudi: "🇸", Jordan: "🇯🇴", Palestine: "🇵🇸", Egypt: "🇪🇬",
    UAE: "🇦🇪", Kuwait: "🇰🇼", Iraq: "🇮🇶", Syria: "🇸🇾",
    Lebanon: "🇱🇧", Morocco: "🇲🇦", USA: "🇺🇸", UK: "🇬🇧",
    Germany: "🇩🇪", France: "🇫🇷", India: "🇮🇳", Pakistan: "🇵🇰",
  };
  return map[nat] || "🌍";
};

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s === "confirmed") return { bg: "#e8f5e9", text: "#2e7d32", dot: "#43a047" };
  if (s === "cancelled") return { bg: "#ffebee", text: "#c62828", dot: "#ef5350" };
  return { bg: "#fff3e0", text: "#e65100", dot: "#ffa726" };
};

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "24px 28px",
      display: "flex", alignItems: "center", gap: 18,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      borderTop: `4px solid ${accent}`, minWidth: 180, flex: 1,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function PassengerModal({ passenger, onClose }) {
  if (!passenger) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,10,30,0.55)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580,
        maxHeight: "85vh", overflowY: "auto", padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #1a237e, #3949ab)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, color: "#fff", fontWeight: 700, flexShrink: 0,
          }}>
            {passenger.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: "#1a1a2e" }}>{passenger.name}</h2>
            <div style={{ color: "#777", fontSize: 13, marginTop: 2 }}>
              {nationalityFlag(passenger.nationality)} {passenger.nationality} · {passenger.passport_id}
            </div>
          </div>
          <button onClick={onClose} style={{
            marginLeft: "auto", background: "#f5f5f5", border: "none",
            borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            fontSize: 18, color: "#555",
          }}>✕</button>
        </div>
        <div style={{
          background: "#f8f9ff", borderRadius: 12, padding: "16px 20px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Email</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 3 }}>{passenger.email || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Phone</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 3 }}>{passenger.phone || "—"}</div>
          </div>
        </div>
        <h3 style={{ fontSize: 15, color: "#1a1a2e", marginBottom: 12 }}>
          ✈️ Flight Bookings ({passenger.bookings?.length || 0})
        </h3>
        {!passenger.bookings?.length ? (
          <div style={{
            textAlign: "center", padding: "32px", color: "#bbb",
            background: "#fafafa", borderRadius: 12, fontSize: 14,
          }}>No bookings found</div>
        ) : (
          passenger.bookings.map((b) => {
            const sc = statusColor(b.status);
            return (
              <div key={b.booking_id} style={{
                border: "1px solid #eee", borderRadius: 12, padding: "14px 16px",
                marginBottom: 10, display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #1a237e, #3949ab)",
                  borderRadius: 10, padding: "10px 14px", color: "#fff", textAlign: "center",
                  minWidth: 68,
                }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>FLIGHT</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{b.flight_number}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                    {b.origin} → {b.destination}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                    {b.departure_time ? new Date(b.departure_time).toLocaleString() : "—"}
                  </div>
                  {b.seat_number && (
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                      Seat: <strong>{b.seat_number}</strong>
                    </div>
                  )}
                </div>
                <div style={{
                  background: sc.bg, color: sc.text, borderRadius: 20,
                  padding: "4px 12px", fontSize: 12, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                  {b.status}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function PassengersPage() {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterNat, setFilterNat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", passport_id: "", nationality: "", email: "", phone: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/passengers`),
        fetch(`${API_BASE}/passengers/stats/summary`),
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      if (pData.success) setPassengers(pData.data);
      if (sData.success) setStats(sData.data);
    } catch (e) {
      setError("Failed to connect to server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassenger = async () => {
    if (!addForm.name || !addForm.passport_id || !addForm.nationality) {
      setAddError("Name, Passport ID, and Nationality are required");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch(`${API_BASE}/passengers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setAddForm({ name: "", passport_id: "", nationality: "", email: "", phone: "" });
        fetchAll();
      } else {
        setAddError(data.message || "Error adding passenger");
      }
    } catch (e) {
      setAddError("Server error, please try again");
    } finally {
      setAddLoading(false);
    }
  };

  const nationalities = ["All", ...new Set(passengers.map((p) => p.nationality).filter(Boolean))];

  const filtered = passengers.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name?.toLowerCase().includes(q) ||
      p.passport_id?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.nationality?.toLowerCase().includes(q);
    const matchNat = filterNat === "All" || p.nationality === filterNat;
    return matchSearch && matchNat;
  });

  return (
    <div>
      <nav className="backdrop-blur-md bg-white/10 text-white px-8 py-4 flex justify-between items-center border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">✈️</div>
          <div>
            <h1 className="text-xl font-black tracking-wide leading-none">Abood EQ</h1>
            <p className="text-xs text-blue-200 leading-none">International Airport</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-semibold">
          ← Dashboard
        </button>
      </nav>

      <div style={{ minHeight: "100vh", background: "#f0f2f8", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)",
          padding: "28px 36px 32px", color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase" }}>Airport Management</div>
              <h1 style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 700 }}>👤 Passengers</h1>
              <a href="/dashboard" style={{
                display: "inline-block", marginTop: 8,
                color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none",
              }}>← Back to Dashboard</a>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowAddModal(true); setAddError(""); }} style={{
                background: "#fff", border: "none", color: "#1a237e", borderRadius: 10,
                padding: "10px 20px", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", gap: 8, fontWeight: 700,
              }}>➕ Add Passenger</button>
              <button onClick={fetchAll} style={{
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff", borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                fontSize: 14, display: "flex", alignItems: "center", gap: 8,
              }}>🔄 Refresh</button>
            </div>
          </div>
          {stats && (
            <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
              <StatCard icon="🧑‍✈️" label="Total Passengers" value={stats.total_passengers ?? "—"} accent="#3949ab" />
              <StatCard icon="🎫" label="Total Bookings" value={stats.total_bookings ?? "—"} accent="#00897b" />
              <StatCard icon="🌍" label="Nationalities" value={stats.nationalities ?? "—"} accent="#f57c00" />
            </div>
          )}
        </div>

        <div style={{ padding: "28px 36px" }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 24,
          }}>
            <input
              placeholder="🔍  Search by name, passport, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 200, border: "1px solid #e0e0e0",
                borderRadius: 10, padding: "10px 14px", fontSize: 14,
                outline: "none", background: "#fafafa",
              }}
            />
            <select value={filterNat} onChange={(e) => setFilterNat(e.target.value)}
              style={{
                border: "1px solid #e0e0e0", borderRadius: 10,
                padding: "10px 14px", fontSize: 14, background: "#fafafa",
                cursor: "pointer", outline: "none",
              }}>
              {nationalities.map((n) => <option key={n}>{n}</option>)}
            </select>
            <div style={{ fontSize: 13, color: "#888" }}>
              {filtered.length} passenger{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {error && (
            <div style={{
              background: "#ffebee", color: "#c62828", borderRadius: 12,
              padding: "16px 20px", marginBottom: 20, fontSize: 14,
            }}>⚠️ {error}</div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "#888" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✈️</div>
              Loading passengers…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, color: "#bbb", background: "#fff", borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              No passengers found
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {filtered.map((p) => (
                <div key={p.passport_id} onClick={() => setSelected(p)} style={{
                  background: "#fff", borderRadius: 16, padding: "20px 22px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s", borderLeft: "4px solid #3949ab",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(57,73,171,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "linear-gradient(135deg, #1a237e, #3949ab)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: 20, flexShrink: 0,
                    }}>
                      {p.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{nationalityFlag(p.nationality)} {p.nationality}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>🪪 <span style={{ fontFamily: "monospace" }}>{p.passport_id}</span></div>
                  {p.email && <div style={{ fontSize: 12, color: "#666", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>✉️ {p.email}</div>}
                  {p.phone && <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>📞 {p.phone}</div>}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0f0f0", paddingTop: 12, marginTop: 4 }}>
                    <div style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
                      ✈️ {p.total_bookings} flight{p.total_bookings != 1 ? "s" : ""}
                    </div>
                    <div style={{ fontSize: 12, color: "#3949ab", fontWeight: 500 }}>View details →</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <PassengerModal passenger={selected} onClose={() => setSelected(null)} />

        {showAddModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(10,10,30,0.55)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(3px)",
          }} onClick={() => setShowAddModal(false)}>
            <div style={{
              background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
              padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 20, color: "#1a1a2e" }}>➕ Add Passenger</h2>
                <button onClick={() => setShowAddModal(false)} style={{
                  background: "#f5f5f5", border: "none", borderRadius: "50%",
                  width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#555",
                }}>✕</button>
              </div>
              {[
                { label: "Full Name *", key: "name", placeholder: "e.g. Ahmad Ali" },
                { label: "Passport ID *", key: "passport_id", placeholder: "e.g. A1234567" },
                { label: "Nationality *", key: "nationality", placeholder: "e.g. Saudi" },
                { label: "Email", key: "email", placeholder: "e.g. ahmad@email.com" },
                { label: "Phone", key: "phone", placeholder: "e.g. +966501234567" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input
                    value={addForm[f.key]}
                    onChange={e => setAddForm({ ...addForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", border: "1px solid #e0e0e0", borderRadius: 10,
                      padding: "10px 14px", fontSize: 14, outline: "none",
                      boxSizing: "border-box", background: "#fafafa",
                    }}
                  />
                </div>
              ))}
              {addError && (
                <div style={{
                  background: "#ffebee", color: "#c62828", borderRadius: 10,
                  padding: "10px 14px", fontSize: 13, marginBottom: 14,
                }}>⚠️ {addError}</div>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowAddModal(false)} style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  border: "1px solid #e0e0e0", background: "#f5f5f5",
                  cursor: "pointer", fontWeight: 600, fontSize: 14,
                }}>Cancel</button>
                <button onClick={handleAddPassenger} disabled={addLoading} style={{
                  flex: 1, padding: "12px", borderRadius: 10, border: "none",
                  background: addLoading ? "#9fa8da" : "linear-gradient(135deg, #1a237e, #3949ab)",
                  color: "#fff", cursor: addLoading ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: 15,
                }}>
                  {addLoading ? "Adding..." : "Add Passenger"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
