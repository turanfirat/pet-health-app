import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    api.get('/pets').then(r => setPets(r.data))
    api.get('/appointments').then(r => setAppointments(r.data))
  }, [])

  const upcoming = appointments.filter(a =>
    a.status !== 'CANCELLED' && a.status !== 'COMPLETED' &&
    new Date(`${a.appointmentDate}T${a.appointmentTime}`) >= new Date()
  )

  const statusColor = (s) => ({
    PENDING:   'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }[s] || '')

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 mb-6">Here's a summary of your pets and upcoming appointments.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Pets" value={pets.length} color="bg-blue-500" />
          <StatCard label="Upcoming" value={upcoming.length} color="bg-green-500" />
          <StatCard label="All Appointments" value={appointments.length} color="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">My Pets</h2>
              <Link to="/pets" className="text-blue-600 text-sm hover:underline">Manage →</Link>
            </div>
            {pets.length === 0 ? (
              <p className="text-gray-400 text-sm">No pets added yet. <Link to="/pets" className="text-blue-500">Add one!</Link></p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pets.slice(0, 4).map(pet => (
                  <li key={pet.id} className="py-2.5 flex items-center gap-3">
                    <span className="text-2xl">{petEmoji(pet.species)}</span>
                    <div>
                      <p className="font-medium text-sm">{pet.name}</p>
                      <p className="text-xs text-gray-400">{pet.breed || pet.species || 'Unknown'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Upcoming Appointments</h2>
              <Link to="/appointments" className="text-blue-600 text-sm hover:underline">View all →</Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-gray-400 text-sm">No upcoming appointments. <Link to="/appointments/new" className="text-blue-500">Book one!</Link></p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.slice(0, 4).map(a => (
                  <li key={a.id} className="py-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{a.pet?.name} — {a.service?.name}</p>
                        <p className="text-xs text-gray-400">{a.appointmentDate} at {a.appointmentTime?.slice(0,5)}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="mt-6">
          <Link
            to="/appointments/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            + Book New Appointment
          </Link>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold`}>
        {value}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  )
}

function petEmoji(species) {
  const s = (species || '').toLowerCase()
  if (s.includes('cat')) return '🐱'
  if (s.includes('dog')) return '🐶'
  if (s.includes('bird')) return '🐦'
  if (s.includes('rabbit')) return '🐰'
  return '🐾'
}
