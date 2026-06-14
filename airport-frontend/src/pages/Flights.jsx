import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Flights() {
  const [flights, setFlights] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/api/flights')
      .then(res => setFlights(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/10 text-white px-8 py-4 flex justify-between items-center border-b border-white/20">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">✈️</div>
    <div>
      <h1 className="text-xl font-black tracking-wide leading-none">Abood EQ</h1>
      <p className="text-xs text-blue-200 leading-none">International Airport</p>
    </div>
  </div>
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-white text-sm shadow-lg">A</div>
      <div>
        <p className="text-sm font-semibold leading-none">Abdalkader Saed EQ</p>
        <p className="text-xs text-blue-200 leading-none">Admin</p>
      </div>
    </div>
    <button onClick={() => navigate('/dashboard')} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-semibold transition border border-white/30">← Dashboard</button>
  </div>
</nav>

      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-1">✈️ Flights</h2>
            <p className="text-blue-300">Manage all flights from here</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/30">
            + Add Flight
          </button>
        </div>

        {/* Table */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-4 text-blue-300 font-semibold">ID</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">Flight No</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">From</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">To</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">Date</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">Status</th>
                <th className="px-6 py-4 text-blue-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-white/50 text-lg">No flights found ✈️</td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id} className="border-b border-white/10 hover:bg-white/10 transition text-white">
                    <td className="px-6 py-4 text-white/70">{flight.id}</td>
                    <td className="px-6 py-4 font-bold text-blue-300">{flight.flight_number}</td>
                    <td className="px-6 py-4">{flight.origin}</td>
                    <td className="px-6 py-4">{flight.destination}</td>
                    <td className="px-6 py-4 text-white/70">{flight.departure_time}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">{flight.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1 rounded-full text-sm hover:bg-red-500/40 transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Flights