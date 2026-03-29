import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgramsAPI, createApplicantAPI } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { UserPlus } from 'lucide-react'

const NewApplicant = () => {
  const [programs, setPrograms] = useState<any[]>([])
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '',
    gender: 'Male', category: 'GM',
    entryType: 'Regular', quotaType: 'KCET',
    allotmentNumber: '', marks: '', programId: ''
  })

  useEffect(() => {
    getProgramsAPI().then(res => setPrograms(res.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createApplicantAPI(form)
      navigate('/applicants')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating applicant')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">New Applicant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input data-testid="applicant-name" placeholder="Full Name"
                  value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input data-testid="applicant-email" type="email" placeholder="Email"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input data-testid="applicant-phone" placeholder="Phone"
                  value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <Input type="date"
                  value={form.dob} onChange={e => set('dob', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={form.category} onChange={e => set('category', e.target.value)}>
                  <option>GM</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>OBC</option>
                  <option>EWS</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Entry Type</label>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={form.entryType} onChange={e => set('entryType', e.target.value)}>
                  <option>Regular</option>
                  <option>Lateral</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quota Type</label>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={form.quotaType} onChange={e => set('quotaType', e.target.value)}>
                  <option>KCET</option>
                  <option>COMEDK</option>
                  <option>Management</option>
                </select>
              </div>
              {(form.quotaType === 'KCET' || form.quotaType === 'COMEDK') && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Allotment Number
                  </label>
                  <Input placeholder="Allotment Number"
                    value={form.allotmentNumber}
                    onChange={e => set('allotmentNumber', e.target.value)} required />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Marks (%)</label>
                <Input type="number" placeholder="Marks"
                  value={form.marks} onChange={e => set('marks', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Program</label>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={form.programId} onChange={e => set('programId', e.target.value)} required>
                  <option value="">Select Program</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" data-testid="submit-btn" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Create Applicant'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/applicants')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewApplicant