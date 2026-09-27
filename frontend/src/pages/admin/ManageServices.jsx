import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', durationMinutes: '', price: '' }

export default function ManageServices() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/services').then(r => setServices(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, durationMinutes: Number(form.durationMinutes), price: Number(form.price) }
    try {
      if (editId) {
        await api.put(`/admin/services/${editId}`, payload)
        toast.success('Service updated')
      } else {
        await api.post('/admin/services', payload)
        toast.success('Service added')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      load()
    } catch {
      toast.error('Failed to save service')
    }
  }

  const handleEdit = (s) => {
    setForm({ name: s.name, description: s.description || '', durationMinutes: s.durationMinutes || '', price: s.price || '' })
    setEditId(s.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await api.delete(`/admin/services/${id}`)
      toast.success('Service removed')
      load()
    } catch {
      toast.error('Failed to delete service')
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Service
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Service' : 'Add Service'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                  {editId ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Description', 'Duration', 'Price', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{s.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.durationMinutes} min</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${s.price}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(s)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No services found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
