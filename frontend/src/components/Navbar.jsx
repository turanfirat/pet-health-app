import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-xl font-bold tracking-wide">
            🐾 PetHealth Center
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-100">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
