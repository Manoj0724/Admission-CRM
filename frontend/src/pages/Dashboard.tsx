import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDashboardStatsAPI } from '../services/api'
import { DashboardStats } from '../types'
import { SkeletonCard } from '../components/Skeleton'
import {
  Users, GraduationCap, BookOpen,
  FileWarning, CreditCard, TrendingUp
} from 'lucide-react'

// ─── Animated Counter ─────────────────────────────
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!value) return
    let start = 0
    const duration = 1500
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return <span>{count}</span>
}

// ─── Stat Card ────────────────────────────────────
const StatCard = ({ title, value, icon, color, bg, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
    </div>
    <div className={`text-3xl font-bold ${color}`}>
      <AnimatedCounter value={value || 0} />
    </div>
    <div className="flex items-center gap-1 mt-2">
      <TrendingUp className="h-3 w-3 text-green-500" />
      <span className="text-xs text-green-500 font-medium">Live data</span>
    </div>
  </motion.div>
)

// ─── Status Badge ─────────────────────────────────
const StatusBadge = ({ total, remaining }: { total: number; remaining: number }) => {
  if (total === 0) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        No Quota Set
      </span>
    )
  }
  if (remaining === 0) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Full
      </span>
    )
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      Available
    </span>
  )
}

// ─── Dashboard ────────────────────────────────────
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

      {/* ── Stat Cards ─────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Intake"
            value={stats?.totalIntake}
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            color="text-blue-600"
            bg="bg-blue-50"
            delay={0}
          />
          <StatCard
            title="Total Admitted"
            value={stats?.totalAdmitted}
            icon={<GraduationCap className="h-5 w-5 text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
            delay={0.1}
          />
          <StatCard
            title="Remaining Seats"
            value={stats?.remainingSeats}
            icon={<Users className="h-5 w-5 text-orange-500" />}
            color="text-orange-500"
            bg="bg-orange-50"
            delay={0.2}
          />
          <StatCard
            title="Pending Fees"
            value={stats?.pendingFees}
            icon={<CreditCard className="h-5 w-5 text-red-500" />}
            color="text-red-500"
            bg="bg-red-50"
            delay={0.3}
          />
        </div>
      )}

      {/* ── Quota-wise Seat Status Table ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6"
      >
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Quota-wise Seat Status</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time seat availability per quota
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Quota','Total','Filled','Remaining','Status'].map(h => (
                    <th
                      key={h}
                      className="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
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
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td className="py-4 font-semibold text-gray-700">{q.type}</td>
                    <td className="py-4 text-gray-600">{q.total}</td>
                    <td className="py-4 text-gray-600">{q.filled}</td>
                    <td className="py-4 text-gray-600">{q.remaining}</td>
                    <td className="py-4">
                      <StatusBadge
                        total={q.total}
                        remaining={q.remaining}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* ── Quota Progress Bars ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
      >
        <div className="mb-5">
          <h2 className="font-semibold text-gray-800">Quota Fill Progress</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Visual seat fill status per quota
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="skeleton h-8 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {stats?.quotaWise.map((q, i) => {
              const pct = q.total > 0
                ? Math.round((q.filled / q.total) * 100)
                : 0
              const colors = ['#378ADD', '#534AB7', '#1D9E75']
              return (
                <motion.div
                  key={q.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: colors[i % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {q.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {q.total === 0
                          ? 'No quota configured'
                          : `${q.filled} / ${q.total} seats`}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: colors[i % colors.length] }}
                      >
                        {q.total === 0 ? '—' : `${pct}%`}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: q.total === 0 ? '0%' : `${pct}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.7 + i * 0.1,
                        ease: 'easeOut'
                      }}
                      className="h-full rounded-full"
                      style={{ background: colors[i % colors.length] }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* ── Pending Info Cards ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-yellow-50 rounded-xl">
              <FileWarning className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Pending Documents</h3>
              <p className="text-xs text-gray-400">Needs verification</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-yellow-500">
            {loading
              ? <div className="skeleton h-10 w-16 rounded-lg" />
              : <AnimatedCounter value={stats?.pendingDocuments || 0} />
            }
          </div>
          <p className="text-gray-400 text-xs mt-2">
            applicants with unverified documents
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Pending Fees</h3>
              <p className="text-xs text-gray-400">Awaiting payment</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-red-500">
            {loading
              ? <div className="skeleton h-10 w-16 rounded-lg" />
              : <AnimatedCounter value={stats?.pendingFees || 0} />
            }
          </div>
          <p className="text-gray-400 text-xs mt-2">
            applicants with unpaid fees
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default Dashboard