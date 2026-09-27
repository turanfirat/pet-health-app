import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ownerLinks = [
  { to: '/dashboard',        label: 'Dashboard' },
  { to: '/pets',             label: 'My Pets' },
  { to: '/appointments/new', label: 'Book Appointment' },
  { to: '/appointments',     label: 'My Appointments' },
]

const adminLinks = [
  { to: '/admin',                 label: 'Dashboard' },
  { to: '/admin/appointments',    label: 'Appointments' },
  { to: '/admin/vets',            label: 'Veterinarians' },
  { to: '/admin/services',        label: 'Services' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'ADMIN' ? adminLinks : ownerLinks

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 pt-6">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
