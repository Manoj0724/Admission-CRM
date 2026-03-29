import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApplicantsAPI } from '../services/api'
import { Applicant } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Plus, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Applicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading]       = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    getApplicantsAPI()
      .then(res => setApplicants(res.data))
      .finally(() => setLoading(false))
  }, [])

  const getDocBadge = (status: string) => {
    if (status === 'Verified')  return <Badge variant="success">Verified</Badge>
    if (status === 'Submitted') return <Badge variant="default">Submitted</Badge>
    return <Badge variant="warning">Pending</Badge>
  }

  const getFeeBadge = (status: string) => {
    if (status === 'Paid') return <Badge variant="success">Paid</Badge>
    return <Badge variant="destructive">Pending</Badge>
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
        </div>
        {user?.role === 'ADMISSION_OFFICER' && (
          <Button onClick={() => navigate('/applicants/new')}>
            <Plus className="h-4 w-4 mr-2" /> New Applicant
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applicants ({applicants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applicants yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Name</th>
                  <th className="text-left py-2 text-gray-500">Program</th>
                  <th className="text-left py-2 text-gray-500">Quota</th>
                  <th className="text-left py-2 text-gray-500">Documents</th>
                  <th className="text-left py-2 text-gray-500">Fee</th>
                  <th className="text-left py-2 text-gray-500">Admission</th>
                  <th className="text-left py-2 text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-gray-400 text-xs">{a.email}</div>
                    </td>
                    <td className="py-3">{a.program?.name}</td>
                    <td className="py-3">{a.quotaType}</td>
                    <td className="py-3">{getDocBadge(a.docStatus)}</td>
                    <td className="py-3">{getFeeBadge(a.feeStatus)}</td>
                    <td className="py-3">
                      {a.admission
                        ? <Badge variant="success">Confirmed</Badge>
                        : <Badge variant="warning">Pending</Badge>
                      }
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/applicants/${a.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Applicants