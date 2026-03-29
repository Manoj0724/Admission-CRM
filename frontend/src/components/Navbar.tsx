import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { LogOut, GraduationCap } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6" />
        <span className="font-bold text-lg">Admission CRM</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Admin Links */}
        {user?.role === 'ADMIN' && (
          <Link to="/masters" className="hover:text-blue-200 text-sm">
            Masters
          </Link>
        )}

        {/* Officer Links */}
        {(user?.role === 'ADMIN' || user?.role === 'ADMISSION_OFFICER') && (
          <>
            <Link to="/applicants" className="hover:text-blue-200 text-sm">
              Applicants
            </Link>
            <Link to="/admissions" className="hover:text-blue-200 text-sm">
              Admissions
            </Link>
          </>
        )}

        {/* Dashboard for all */}
        <Link to="/dashboard" className="hover:text-blue-200 text-sm">
          Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200">{user?.name}</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
            {user?.role?.replace('_', ' ')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:text-blue-200 hover:bg-blue-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar