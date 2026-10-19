import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
            className="flex items-center gap-2.5 text-gray-800 font-bold text-lg tracking-tight hover:opacity-80 transition"
          >
            <span className="text-2xl">🐾</span>
            <span>PetHealth <span className="text-blue-600">Center</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400 leading-tight capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
