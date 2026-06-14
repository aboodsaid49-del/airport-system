import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Flights from './pages/Flights'
import Bookings from './pages/Bookings'
import Passengers from './pages/Passengers'        // ← أضف هاد
import Airports from './pages/Airports'
import Airlines from './pages/Airlines'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/passengers" element={<Passengers />} />  {/* ← أضف هاد */}
        <Route path="/airports" element={<Airports />} />
        <Route path="/airlines" element={<Airlines />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App