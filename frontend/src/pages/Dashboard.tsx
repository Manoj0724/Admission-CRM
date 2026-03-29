import React, { useEffect, useState } from 'react'
import { getDashboardStatsAPI } from '../services/api'
import { DashboardStats } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Users, GraduationCap, BookOpen,
  FileWarning, CreditCard
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStatsAPI()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div data-testid="dashboard-stats">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{stats?.totalIntake}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Admitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {stats?.totalAdmitted}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Remaining Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">
                {stats?.remainingSeats}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Pending Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <span className="text-3xl font-bold text-red-600">
                {stats?.pendingFees}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quota Wise Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quota-wise Seat Status</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">Quota</th>
                <th className="text-left py-2 text-gray-500">Total</th>
                <th className="text-left py-2 text-gray-500">Filled</th>
                <th className="text-left py-2 text-gray-500">Remaining</th>
                <th className="text-left py-2 text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.quotaWise.map(q => (
                <tr key={q.type} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{q.type}</td>
                  <td className="py-3">{q.total}</td>
                  <td className="py-3">{q.filled}</td>
                  <td className="py-3">{q.remaining}</td>
                  <td className="py-3">
                    <Badge variant={q.remaining === 0 ? 'destructive' : 'success'}>
                      {q.remaining === 0 ? 'Full' : 'Available'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pending Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-yellow-600" />
              Pending Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-yellow-600">
              {stats?.pendingDocuments}
            </span>
            <p className="text-gray-500 text-sm mt-1">
              applicants with unverified documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Pending Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-red-600">
              {stats?.pendingFees}
            </span>
            <p className="text-gray-500 text-sm mt-1">
              applicants with unpaid fees
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard