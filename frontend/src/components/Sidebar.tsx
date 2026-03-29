import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  GraduationCap, LayoutDashboard, Building2,
  Users, BookOpen, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      to: '/masters',
      icon: <Building2 className="h-5 w-5" />,
      label: 'Master Setup'
    }] : []),
    ...(user?.role !== 'MANAGEMENT' ? [{
      to: '/applicants',
      icon: <Users className="h-5 w-5" />,
      label: 'Applicants'
    }, {
      to: '/admissions',
      icon: <BookOpen className="h-5 w-5" />,
      label: 'Admissions'
    }] : []),
    {
      to: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard'
    },
  ]

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm fixed left-0 top-0 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm">Admission CRM</div>
                <div className="text-xs text-gray-400">Management System</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      {/* User Info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-4 p-3 bg-blue-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{user?.name}</div>
                <div className="text-xs text-blue-600 font-medium">
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Items */}
      <nav className="flex-1 px-3 mt-6 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && (
              <ChevronRight className="h-4 w-4 opacity-30" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

export default Sidebar