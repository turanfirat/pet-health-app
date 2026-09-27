import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pets from './pages/Pets'
import NewAppointment from './pages/NewAppointment'
import MyAppointments from './pages/MyAppointments'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageAppointments from './pages/admin/ManageAppointments'
import ManageVets from './pages/admin/ManageVets'
import ManageServices from './pages/admin/ManageServices'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute role="OWNER" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route path="/appointments" element={<MyAppointments />} />
          </Route>

          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/appointments" element={<ManageAppointments />} />
            <Route path="/admin/vets" element={<ManageVets />} />
            <Route path="/admin/services" element={<ManageServices />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
