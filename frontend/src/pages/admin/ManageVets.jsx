import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { name: '', specialization: '', email: '', phone: '' }

export default function ManageVets() {
  const [vets, setVets] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/vets').then(r => setVets(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/admin/vets/${editId}`, form)
        toast.success('Vet updated')
      } else {
        await api.post('/admin/vets', form)
        toast.success('Vet added')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      load()
    } catch {
      toast.error('Failed to save vet')
    }
  }

  const handleEdit = (v) => {
    setForm({ name: v.name, specialization: v.specialization || '', email: v.email || '', phone: v.phone || '' })
    setEditId(v.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this veterinarian?')) return
    try {
      await api.delete(`/admin/vets/${id}`)
      toast.success('Vet removed')
      load()
    } catch {
      toast.error('Failed to delete vet')
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Veterinarians</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Vet
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Veterinarian' : 'Add Veterinarian'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['Name *', 'name', true], ['Specialization', 'specialization'], ['Email', 'email', false, 'email'], ['Phone', 'phone']].map(([label, key, req, type = 'text']) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} required={!!req}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
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
                {['Name', 'Specialization', 'Email', 'Phone', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vets.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{v.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.specialization}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.phone}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(v)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {vets.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No veterinarians found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
