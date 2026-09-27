import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STEPS = ['Pet', 'Vet', 'Service', 'Date & Time']

export default function NewAppointment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [pets, setPets] = useState([])
  const [vets, setVets] = useState([])
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ petId: '', vetId: '', serviceId: '', appointmentDate: '', appointmentTime: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/pets').then(r => setPets(r.data))
    api.get('/vets').then(r => setVets(r.data))
    api.get('/services').then(r => setServices(r.data))
  }, [])

  const select = (field, id) => setForm(f => ({...f, [field]: id}))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/appointments', {
        ...form,
        petId: Number(form.petId),
        vetId: Number(form.vetId),
        serviceId: Number(form.serviceId),
      })
      toast.success('Appointment booked!')
      navigate('/appointments')
    } catch {
      toast.error('Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const canNext = [
    !!form.petId,
    !!form.vetId,
    !!form.serviceId,
    !!form.appointmentDate && !!form.appointmentTime,
  ]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>

        {/* Steps indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <p className={`ml-2 text-sm font-medium ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</p>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {step === 0 && (
            <SelectStep title="Select Your Pet" items={pets} selected={form.petId} onSelect={id => select('petId', id)}
              renderItem={p => <><p className="font-medium">{p.name}</p><p className="text-sm text-gray-400">{p.breed || p.species}</p></>}
            />
          )}
          {step === 1 && (
            <SelectStep title="Select Veterinarian" items={vets} selected={form.vetId} onSelect={id => select('vetId', id)}
              renderItem={v => <><p className="font-medium">{v.name}</p><p className="text-sm text-gray-400">{v.specialization}</p></>}
            />
          )}
          {step === 2 && (
            <SelectStep title="Select Service" items={services} selected={form.serviceId} onSelect={id => select('serviceId', id)}
              renderItem={s => (
                <>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-400">{s.durationMinutes} min · ${s.price}</p>
                </>
              )}
            />
          )}
          {step === 3 && (
            <div>
              <h2 className="font-semibold text-gray-700 mb-4">Choose Date & Time</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.appointmentDate}
                    onChange={e => setForm(f => ({...f, appointmentDate: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.appointmentTime}
                    onChange={e => setForm(f => ({...f, appointmentTime: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.notes}
                    onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                    placeholder="Any special notes for the vet..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">← Back</button>
              : <div />}
            {step < 3
              ? <button
                  disabled={!canNext[step]}
                  onClick={() => setStep(s => s + 1)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  Next →
                </button>
              : <button
                  disabled={!canNext[3] || loading}
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function SelectStep({ title, items, selected, onSelect, renderItem }) {
  return (
    <div>
      <h2 className="font-semibold text-gray-700 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`text-left p-4 rounded-lg border-2 transition ${
                selected == item.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
