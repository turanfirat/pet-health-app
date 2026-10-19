import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import { CalendarCheck, Clock, CheckCircle, XCircle, BarChart3, ArrowRight, Stethoscope, ClipboardList } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 })

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data))
  }, [])

  const cards = [
    { label: 'Total',     value: stats.total,     icon: BarChart3,     iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   valueColor: 'text-blue-600' },
    { label: 'Pending',   value: stats.pending,   icon: Clock,         iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500', valueColor: 'text-yellow-600' },
    { label: 'Confirmed', value: stats.confirmed, icon: CalendarCheck, iconBg: 'bg-green-50',  iconColor: 'text-green-500',  valueColor: 'text-green-600' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle,   iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', valueColor: 'text-indigo-600' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle,       iconBg: 'bg-red-50',    iconColor: 'text-red-400',    valueColor: 'text-red-500' },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Pet Health Center — System Overview</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={iconColor} strokeWidth={1.8} />
              </div>
              <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickLink to="/admin/appointments" label="Manage Appointments" icon={CalendarCheck} desc="View & update statuses" color="blue" />
          <QuickLink to="/admin/vets"         label="Veterinarians"       icon={Stethoscope}   desc="Add, edit, remove vets" color="green" />
          <QuickLink to="/admin/services"     label="Services"            icon={ClipboardList}  desc="Configure available services" color="purple" />
        </div>
      </div>
    </Layout>
  )
}

function QuickLink({ to, label, icon: Icon, desc, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   hover: 'hover:border-blue-200' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-500',  hover: 'hover:border-green-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', hover: 'hover:border-purple-200' },
  }[color]

  return (
    <Link to={to} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${colors.hover} hover:shadow-md transition-all flex items-start gap-4 group`}>
      <div className={`${colors.bg} p-2.5 rounded-xl`}>
        <Icon size={20} className={colors.icon} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-700 text-sm">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-400 mt-1 transition-colors flex-shrink-0" />
    </Link>
  )
}
