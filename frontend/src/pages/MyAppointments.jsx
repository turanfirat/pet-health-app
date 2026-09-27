import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import toast from 'react-hot-toast'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('ALL')

  const load = () => api.get('/appointments').then(r => setAppointments(r.data))
  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await api.patch(`/appointments/${id}/cancel`)
      toast.success('Appointment cancelled')
      load()
    } catch {
      toast.error('Could not cancel appointment')
    }
  }

  const filtered = filter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === filter)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <Link to="/appointments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Book New
          </Link>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📅</div>
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{a.pet?.name}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-600 text-sm">{a.service?.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">Dr. {a.vet?.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {a.appointmentDate} at {a.appointmentTime?.slice(0, 5)}
                    </p>
                    {a.notes && <p className="text-xs text-gray-400 italic mt-1">{a.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                      <button onClick={() => handleCancel(a.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
