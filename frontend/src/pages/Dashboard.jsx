import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { PawPrint, CalendarCheck, CalendarClock, ArrowRight } from 'lucide-react'

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
    PENDING:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    CONFIRMED: 'bg-green-100 text-green-700 border border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border border-blue-200',
  }[s] || '')

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 mt-1">Here's a summary of your pets and upcoming appointments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Pets"
            value={pets.length}
            icon={PawPrint}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
            valueBg="text-blue-600"
          />
          <StatCard
            label="Upcoming"
            value={upcoming.length}
            icon={CalendarClock}
            iconBg="bg-green-50"
            iconColor="text-green-500"
            valueBg="text-green-600"
          />
          <StatCard
            label="All Appointments"
            value={appointments.length}
            icon={CalendarCheck}
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
            valueBg="text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">My Pets</h2>
              <Link to="/pets" className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 font-medium">
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-6">
                <PawPrint size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No pets added yet.</p>
                <Link to="/pets" className="text-blue-500 text-sm font-medium hover:underline">Add your first pet</Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pets.slice(0, 4).map(pet => (
                  <li key={pet.id} className="py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                      {petEmoji(pet.species)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{pet.name}</p>
                      <p className="text-xs text-gray-400">{pet.breed || pet.species || 'Unknown'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Upcoming Appointments</h2>
              <Link to="/appointments" className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 font-medium">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-6">
                <CalendarClock size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming appointments.</p>
                <Link to="/appointments/new" className="text-blue-500 text-sm font-medium hover:underline">Book one now</Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.slice(0, 4).map(a => (
                  <li key={a.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{a.pet?.name} — {a.service?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.appointmentDate} at {a.appointmentTime?.slice(0, 5)}</p>
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
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            <CalendarClock size={16} />
            Book New Appointment
          </Link>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, valueBg }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${valueBg}`}>{value}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>
          <Icon size={22} className={iconColor} strokeWidth={1.8} />
        </div>
      </div>
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
