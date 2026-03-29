import React, { useEffect, useState } from 'react'
import { getAdmissionsAPI } from '../services/api'
import { Admission } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { GraduationCap } from 'lucide-react'

const Admissions = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    getAdmissionsAPI()
      .then(res => setAdmissions(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Confirmed Admissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Admissions ({admissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {admissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No admissions confirmed yet
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Admission No.</th>
                  <th className="text-left py-2 text-gray-500">Student</th>
                  <th className="text-left py-2 text-gray-500">Program</th>
                  <th className="text-left py-2 text-gray-500">Quota</th>
                  <th className="text-left py-2 text-gray-500">Confirmed On</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((a: any) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <Badge variant="success">{a.admissionNumber}</Badge>
                    </td>
                    <td className="py-3 font-medium">{a.applicant?.name}</td>
                    <td className="py-3">{a.applicant?.program?.name}</td>
                    <td className="py-3">{a.applicant?.quotaType}</td>
                    <td className="py-3">
                      {new Date(a.confirmedAt).toLocaleDateString()}
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

export default Admissions