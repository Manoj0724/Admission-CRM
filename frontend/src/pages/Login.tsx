import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/api'
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginAPI({ email, password })
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}! 👋`)
      const role = res.data.user.role
      if (role === 'ADMIN') navigate('/masters')
      else if (role === 'ADMISSION_OFFICER') navigate('/applicants')
      else navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admission CRM</h1>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  data-testid="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  data-testid="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              data-testid="login-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-100 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </motion.button>
          </form>

          {/* Credentials Hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 mb-2">Test Credentials:</p>
            <div className="space-y-1 text-xs text-blue-600">
              <div>👤 Admin: admin@test.com / password123</div>
              <div>👤 Officer: officer@test.com / password123</div>
              <div>👤 Management: mgmt@test.com / password123</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login