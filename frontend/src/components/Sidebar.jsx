import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  PawPrint,
  CalendarPlus,
  CalendarCheck,
  ClipboardList,
  Stethoscope,
  Settings,
} from 'lucide-react'

const ownerLinks = [
  { to: '/dashboard',        label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/pets',             label: 'My Pets',           icon: PawPrint },
  { to: '/appointments/new', label: 'Book Appointment',  icon: CalendarPlus },
  { to: '/appointments',     label: 'My Appointments',   icon: CalendarCheck },
]

const adminLinks = [
  { to: '/admin',              label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments',   icon: CalendarCheck },
  { to: '/admin/vets',         label: 'Veterinarians',  icon: Stethoscope },
  { to: '/admin/services',     label: 'Services',       icon: ClipboardList },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'ADMIN' ? adminLinks : ownerLinks

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 pt-6 flex flex-col">
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400">
            <Settings size={14} />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
