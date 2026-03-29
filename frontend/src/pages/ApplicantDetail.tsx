import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  getApplicantByIdAPI, updateDocStatusAPI,
  updateFeeStatusAPI, allocateSeatAPI, confirmAdmissionAPI
} from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react'

const ApplicantDetail = () => {
  const { id }                        = useParams()
  const navigate                      = useNavigate()
  const [applicant, setApplicant]     = useState<any>(null)
  const [loading, setLoading]         = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    getApplicantByIdAPI(id!)
      .then(res => setApplicant(res.data))
      .catch(() => toast.error('Failed to load applicant'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const handleDocStatus = async (status: string) => {
    try {
      await updateDocStatusAPI(id!, status)
      toast.success(`Documents marked as ${status}!`)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating documents')
    }
  }

  const handleFeeStatus = async () => {
    try {
      await updateFeeStatusAPI(id!, 'Paid')
      toast.success('Fee marked as paid! ✅')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating fee')
    }
  }

  const handleAllocate = async () => {
    try {
      await allocateSeatAPI(id!)
      toast.success('Seat allocated successfully! 🎯')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Quota full or error')
    }
  }

  const handleConfirm = async () => {
    try {
      const res = await confirmAdmissionAPI(id!)
      toast.success(`Admission confirmed! ${res.data.admissionNumber} 🎓`)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error confirming admission')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (!applicant) return (
    <div className="text-center py-16 text-gray-400">Applicant not found</div>
  )

  return (
    <div className="max-w-3xl mx-auto">

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/applicants')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Applicants
      </motion.button>

      {/* Admission Number Banner */}
      {applicant.admission && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-2xl mb-6 flex items-center gap-4 shadow-lg shadow-blue-100"
        >
          <div className="p-2 bg-white/20 rounded-xl">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <div className="text-sm text-blue-100">Admission Confirmed ✅</div>
            <div
              data-testid="admission-number"
              className="text-2xl font-bold tracking-wide"
            >
              {applicant.admission.admissionNumber}
            </div>
          </div>
        </motion.div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ['Name',     applicant.name],
                ['Email',    applicant.email],
                ['Phone',    applicant.phone],
                ['DOB',      new Date(applicant.dob).toLocaleDateString()],
                ['Gender',   applicant.gender],
                ['Category', applicant.category],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="font-semibold text-gray-700">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Admission Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Admission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ['Program',      applicant.program?.name],
                ['Quota',        applicant.quotaType],
                ['Entry Type',   applicant.entryType],
                ['Allotment No.',applicant.allotmentNumber || 'N/A'],
                ['Marks',        `${applicant.marks}%`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="font-semibold text-gray-700">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documents
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  applicant.docStatus === 'Verified'
                    ? 'bg-green-100 text-green-700'
                    : applicant.docStatus === 'Submitted'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {applicant.docStatus}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button
                size="sm" variant="outline"
                onClick={() => handleDocStatus('Submitted')}
                disabled={applicant.docStatus === 'Submitted' || applicant.docStatus === 'Verified'}
              >
                Mark Submitted
              </Button>
              <Button
                size="sm" variant="outline"
                onClick={() => handleDocStatus('Verified')}
                disabled={applicant.docStatus === 'Verified'}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Verified
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fee Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Fee Status
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  applicant.feeStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {applicant.feeStatus}
                </span>
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
        </motion.div>
      </div>

      {/* Admission Actions */}
      {!applicant.admission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Admission Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" onClick={handleAllocate}>
                  🎯 Allocate Seat
                </Button>
                <Button
                  data-testid="confirm-admission"
                  onClick={handleConfirm}
                  disabled={
                    applicant.feeStatus !== 'Paid' ||
                    applicant.docStatus !== 'Verified'
                  }
                  className="shadow-lg shadow-blue-100"
                >
                  🎓 Confirm Admission
                </Button>
              </div>
              {(applicant.feeStatus !== 'Paid' || applicant.docStatus !== 'Verified') && (
                <p className="text-xs text-gray-400 mt-3">
                  ⚠️ Fee must be Paid and Documents must be Verified to confirm admission
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default ApplicantDetail
