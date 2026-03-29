import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getApplicantsAPI } from '../services/api'
import { Applicant } from '../types'
import { SkeletonTable } from '../components/Skeleton'
import { Button } from '../components/ui/button'
import { Plus, Users, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Applicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filtered, setFiltered]     = useState<Applicant[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    getApplicantsAPI()
      .then(res => {
        setApplicants(res.data)
        setFiltered(res.data)
      })
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(applicants.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.quotaType.toLowerCase().includes(q)
    ))
  }, [search, applicants])

  const statusBadge = (label: string, color: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  )

  const getDocBadge = (s: string) => {
    if (s === 'Verified')  return statusBadge(s, 'bg-green-100 text-green-700')
    if (s === 'Submitted') return statusBadge(s, 'bg-blue-100 text-blue-700')
    return statusBadge(s, 'bg-yellow-100 text-yellow-700')
  }

  const getFeeBadge = (s: string) =>
    s === 'Paid'
      ? statusBadge(s, 'bg-green-100 text-green-700')
      : statusBadge(s, 'bg-red-100 text-red-700')

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
            <p className="text-gray-400 text-sm">{filtered.length} total applicants</p>
          </div>
        </div>
        {user?.role === 'ADMISSION_OFFICER' && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => navigate('/applicants/new')}
              className="flex items-center gap-2 rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4" /> New Applicant
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or quota..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Applicants</h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            {filtered.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6"><SkeletonTable rows={5} /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No applicants found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Applicant','Program','Quota','Documents','Fee','Admission',''].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                          {a.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{a.name}</div>
                          <div className="text-gray-400 text-xs">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{(a as any).program?.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {a.quotaType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getDocBadge(a.docStatus)}</td>
                    <td className="px-6 py-4">{getFeeBadge(a.feeStatus)}</td>
                    <td className="px-6 py-4">
                      {(a as any).admission
                        ? statusBadge('Confirmed', 'bg-green-100 text-green-700')
                        : statusBadge('Pending', 'bg-yellow-100 text-yellow-700')
                      }
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/applicants/${a.id}`)}
                        className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Applicants