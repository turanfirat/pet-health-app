import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { name: '', species: '', breed: '', age: '', weight: '', medicalNotes: '' }

export default function Pets() {
  const [pets, setPets] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/pets').then(r => setPets(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/pets/${editId}`, form)
        toast.success('Pet updated!')
      } else {
        await api.post('/pets', form)
        toast.success('Pet added!')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      load()
    } catch {
      toast.error('Failed to save pet')
    }
  }

  const handleEdit = (pet) => {
    setForm({ name: pet.name, species: pet.species || '', breed: pet.breed || '', age: pet.age || '', weight: pet.weight || '', medicalNotes: pet.medicalNotes || '' })
    setEditId(pet.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this pet?')) return
    try {
      await api.delete(`/pets/${id}`)
      toast.success('Pet removed')
      load()
    } catch {
      toast.error('Failed to delete pet')
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Pets</h1>
          <button
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add Pet
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit Pet' : 'Add New Pet'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name *" value={form.name} onChange={v => setForm({...form, name: v})} required />
              <Field label="Species" value={form.species} onChange={v => setForm({...form, species: v})} placeholder="Dog, Cat, Bird..." />
              <Field label="Breed" value={form.breed} onChange={v => setForm({...form, breed: v})} />
              <Field label="Age (years)" type="number" value={form.age} onChange={v => setForm({...form, age: v})} />
              <Field label="Weight (kg)" type="number" step="0.1" value={form.weight} onChange={v => setForm({...form, weight: v})} />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.medicalNotes}
                  onChange={e => setForm({...form, medicalNotes: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                  {editId ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {pets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🐾</div>
            <p>No pets yet. Add your first pet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{pet.name}</h3>
                    <p className="text-sm text-gray-500">{[pet.breed, pet.species].filter(Boolean).join(' · ')}</p>
                    {(pet.age || pet.weight) && (
                      <p className="text-xs text-gray-400 mt-1">
                        {pet.age ? `${pet.age} yrs` : ''}{pet.age && pet.weight ? ' · ' : ''}{pet.weight ? `${pet.weight} kg` : ''}
                      </p>
                    )}
                    {pet.medicalNotes && <p className="text-xs text-gray-400 mt-1 italic">{pet.medicalNotes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(pet)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                    <button onClick={() => handleDelete(pet.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
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

function Field({ label, value, onChange, type = 'text', required = false, placeholder = '', step }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
