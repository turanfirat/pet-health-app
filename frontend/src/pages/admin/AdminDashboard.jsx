import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 })

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data))
  }, [])

  const cards = [
    { label: 'Total',     value: stats.total,     color: 'bg-blue-500' },
    { label: 'Pending',   value: stats.pending,   color: 'bg-yellow-500' },
    { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' },
    { label: 'Completed', value: stats.completed, color: 'bg-indigo-500' },
    { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500' },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Pet Health Center — System Overview</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {cards.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {value}
              </div>
              <p className="text-gray-600 text-sm font-medium">{label}</p>
              <p className="text-gray-400 text-xs">appointments</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickLink to="/admin/appointments" label="Manage Appointments" icon="📅" desc="View & update statuses" />
          <QuickLink to="/admin/vets"         label="Manage Veterinarians" icon="👨‍⚕️" desc="Add, edit, remove vets" />
          <QuickLink to="/admin/services"     label="Manage Services" icon="🏥" desc="Configure available services" />
        </div>
      </div>
    </Layout>
  )
}

function QuickLink({ to, label, icon, desc }) {
  return (
    <a href={to} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex items-start gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </a>
  )
}
