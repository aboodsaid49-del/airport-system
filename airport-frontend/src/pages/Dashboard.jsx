import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ flights: 0, bookings: 0, passengers: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flights, bookings, passengers] = await Promise.all([
          axios.get('https://airport-system-production.up.railway.app/api/flights'),
          axios.get('https://airport-system-production.up.railway.app/api/bookings'),
          axios.get('https://airport-system-production.up.railway.app/api/passengers'),
        ])
        setStats({
          flights: flights.data.length,
          bookings: bookings.data.length,
          passengers: passengers.data.length,
        })
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { title: 'Flights', icon: '✈️', color: 'bg-blue-500', path: '/flights' },
    { title: 'Bookings', icon: '🎫', color: 'bg-green-500', path: '/bookings' },
    { title: 'Passengers', icon: '👤', color: 'bg-purple-500', path: '/passengers' },
    { title: 'Airports', icon: '🏢', color: 'bg-orange-500', path: '/airports' },
    { title: 'Airlines', icon: '🛩️', color: 'bg-red-500', path: '/airlines' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/10 text-white px-8 py-4 flex justify-between items-center border-b border-white/20">
  <div className="flex items-center gap-3">
    {/* Logo */}
  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">
  ✈️
</div>
    <div>
      <h1 className="text-xl font-black tracking-wide leading-none">Abood EQ</h1>
      <p className="text-xs text-blue-200 leading-none">International Airport</p>
    </div>
  </div>
  <div className="flex items-center gap-4">
    {/* Avatar */}
    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-white text-sm shadow-lg">A</div>
      <div>
        <p className="text-sm font-semibold leading-none">Abdalkader Saed EQ</p>
        <p className="text-xs text-blue-200 leading-none">Admin</p>
      </div>
    </div>
    <button
      onClick={() => { localStorage.removeItem('token'); navigate('/') }}
      className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-semibold transition border border-white/30">
      Logout
    </button>
  </div>
</nav>

      {/* Welcome */}
      <div className="bg-blue-600 text-white px-8 py-10">
        <h2 className="text-3xl font-bold mb-1">Welcome Back, Abdalkader 👋</h2>
        <p className="text-blue-100">Manage your Abood EQ International Airport from here</p>
      </div>

      {/* Stats */}
      <div className="px-8 py-6 grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 text-3xl w-14 h-14 rounded-full flex items-center justify-center">✈️</div>
          <div>
            <p className="text-gray-500 text-sm">Total Flights</p>
            <p className="text-3xl font-bold text-gray-800">{stats.flights}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 text-3xl w-14 h-14 rounded-full flex items-center justify-center">🎫</div>
          <div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800">{stats.bookings}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 text-3xl w-14 h-14 rounded-full flex items-center justify-center">👤</div>
          <div>
            <p className="text-gray-500 text-sm">Total Passengers</p>
            <p className="text-3xl font-bold text-gray-800">{stats.passengers}</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="px-8 py-4">
        <h3 className="text-xl font-bold text-gray-700 mb-6">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className={`${card.color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
