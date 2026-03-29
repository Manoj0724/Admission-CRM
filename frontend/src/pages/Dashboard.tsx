import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDashboardStatsAPI } from '../services/api'
import { DashboardStats } from '../types'
import { SkeletonCard } from '../components/Skeleton'
import {
  Users, GraduationCap, BookOpen,
  FileWarning, CreditCard, TrendingUp
} from 'lucide-react'

const StatCard = ({ title, value, icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card group"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className={`p-2 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    <div className="flex items-center gap-1 mt-2">
      <TrendingUp className="h-3 w-3 text-green-500" />
      <span className="text-xs text-green-500 font-medium">Live data</span>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStatsAPI()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div data-testid="dashboard-stats">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Real-time admission statistics
        </p>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Intake" value={stats?.totalIntake}
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            color="bg-blue-50" delay={0} />
          <StatCard title="Total Admitted" value={stats?.totalAdmitted}
            icon={<GraduationCap className="h-5 w-5 text-green-600" />}
            color="bg-green-50" delay={0.1} />
          <StatCard title="Remaining Seats" value={stats?.remainingSeats}
            icon={<Users className="h-5 w-5 text-orange-600" />}
            color="bg-orange-50" delay={0.2} />
          <StatCard title="Pending Fees" value={stats?.pendingFees}
            icon={<CreditCard className="h-5 w-5 text-red-600" />}
            color="bg-red-50" delay={0.3} />
        </div>
      )}

      {/* Quota Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6"
      >
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Quota-wise Seat Status</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Quota','Total','Filled','Remaining','Status'].map(h => (
                    <th key={h} className="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.quotaWise.map((q, i) => (
                  <motion.tr
                    key={q.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="table-row"
                  >
                    <td className="py-4 font-semibold text-gray-700">{q.type}</td>
                    <td className="py-4 text-gray-600">{q.total}</td>
                    <td className="py-4 text-gray-600">{q.filled}</td>
                    <td className="py-4 text-gray-600">{q.remaining}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        q.remaining === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {q.remaining === 0 ? 'Full' : 'Available'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 rounded-xl">
              <FileWarning className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Pending Documents</h3>
          </div>
          <div className="text-4xl font-bold text-yellow-600">
            {loading ? <div className="skeleton h-10 w-16" /> : stats?.pendingDocuments}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            applicants with unverified documents
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-xl">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Pending Fees</h3>
          </div>
          <div className="text-4xl font-bold text-red-600">
            {loading ? <div className="skeleton h-10 w-16" /> : stats?.pendingFees}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            applicants with unpaid fees
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard