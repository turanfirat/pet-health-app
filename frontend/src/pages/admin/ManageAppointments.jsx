import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const statusColors = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
}

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('ALL')

  const load = () => api.get('/admin/appointments').then(r => setAppointments(r.data))
  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}/status`, { status })
      toast.success('Status updated')
      load()
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Appointments</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', ...ALL_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Pet / Owner', 'Veterinarian', 'Service', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">#{a.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{a.pet?.name}</p>
                    <p className="text-xs text-gray-400">{a.owner?.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.vet?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.service?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {a.appointmentDate}<br/>
                    <span className="text-xs text-gray-400">{a.appointmentTime?.slice(0,5)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={a.status}
                      onChange={e => handleStatus(a.id, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
