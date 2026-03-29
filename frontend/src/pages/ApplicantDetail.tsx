import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getApplicantByIdAPI, updateDocStatusAPI,
  updateFeeStatusAPI, allocateSeatAPI, confirmAdmissionAPI
} from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ArrowLeft, GraduationCap } from 'lucide-react'

const ApplicantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [message, setMessage]     = useState('')
  const [error, setError]         = useState('')

  const load = () => {
    getApplicantByIdAPI(id!)
      .then(res => setApplicant(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const showMsg = (msg: string, isError = false) => {
    if (isError) setError(msg)
    else setMessage(msg)
    setTimeout(() => { setMessage(''); setError('') }, 3000)
  }

  const handleDocStatus = async (status: string) => {
    try {
      await updateDocStatusAPI(id!, status)
      showMsg('Document status updated!')
      load()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleFeeStatus = async () => {
    try {
      await updateFeeStatusAPI(id!, 'Paid')
      showMsg('Fee marked as paid!')
      load()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleAllocate = async () => {
    try {
      await allocateSeatAPI(id!)
      showMsg('Seat allocated successfully!')
      load()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleConfirm = async () => {
    try {
      const res = await confirmAdmissionAPI(id!)
      showMsg(`Admission confirmed! Number: ${res.data.admissionNumber}`)
      load()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (!applicant) return <div>Applicant not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/applicants')}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Applicants
      </button>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Admission Number Banner */}
      {applicant.admission && (
        <div className="bg-green-600 text-white px-6 py-4 rounded-lg mb-4 flex items-center gap-3">
          <GraduationCap className="h-6 w-6" />
          <div>
            <div className="text-sm opacity-80">Admission Confirmed</div>
            <div
              data-testid="admission-number"
              className="text-xl font-bold"
            >
              {applicant.admission.admissionNumber}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Details */}
        <Card>
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ['Name', applicant.name],
              ['Email', applicant.email],
              ['Phone', applicant.phone],
              ['DOB', new Date(applicant.dob).toLocaleDateString()],
              ['Gender', applicant.gender],
              ['Category', applicant.category],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-1">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admission Details */}
        <Card>
          <CardHeader><CardTitle>Admission Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ['Program', applicant.program?.name],
              ['Quota', applicant.quotaType],
              ['Entry Type', applicant.entryType],
              ['Allotment No.', applicant.allotmentNumber || 'N/A'],
              ['Marks', `${applicant.marks}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-1">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Documents
              <Badge variant={
                applicant.docStatus === 'Verified' ? 'success' :
                applicant.docStatus === 'Submitted' ? 'default' : 'warning'
              }>
                {applicant.docStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline"
                onClick={() => handleDocStatus('Submitted')}
                disabled={applicant.docStatus === 'Submitted'}>
                Mark Submitted
              </Button>
              <Button size="sm" variant="outline"
                onClick={() => handleDocStatus('Verified')}
                disabled={applicant.docStatus === 'Verified'}>
                Mark Verified
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fee Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Fee Status
              <Badge variant={applicant.feeStatus === 'Paid' ? 'success' : 'destructive'}>
                {applicant.feeStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              data-testid="mark-fee-paid"
              size="sm"
              onClick={handleFeeStatus}
              disabled={applicant.feeStatus === 'Paid'}
            >
              Mark Fee Paid
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {!applicant.admission && (
        <Card className="mt-4">
          <CardHeader><CardTitle>Admission Actions</CardTitle></CardHeader>
          <CardContent className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAllocate}
            >
              Allocate Seat
            </Button>
            <Button
              data-testid="confirm-admission"
              onClick={handleConfirm}
              disabled={
                applicant.feeStatus !== 'Paid' ||
                applicant.docStatus !== 'Verified'
              }
            >
              Confirm Admission
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ApplicantDetail