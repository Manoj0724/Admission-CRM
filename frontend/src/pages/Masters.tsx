import React, { useEffect, useState } from 'react'
import {
  getInstitutionsAPI, createInstitutionAPI,
  getCampusesAPI, createCampusAPI,
  getDepartmentsAPI, createDepartmentAPI,
  getProgramsAPI, createProgramAPI,
  createQuotasAPI
} from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Building2, Plus } from 'lucide-react'

const Masters = () => {
  const [tab, setTab]                   = useState('institution')
  const [institutions, setInstitutions] = useState<any[]>([])
  const [campuses, setCampuses]         = useState<any[]>([])
  const [departments, setDepartments]   = useState<any[]>([])
  const [programs, setPrograms]         = useState<any[]>([])
  const [message, setMessage]           = useState('')
  const [error, setError]               = useState('')

  // Forms
  const [instForm, setInstForm] = useState({ name: '', code: '' })
  const [campForm, setCampForm] = useState({ name: '', institutionId: '' })
  const [deptForm, setDeptForm] = useState({ name: '', code: '', campusId: '' })
  const [progForm, setProgForm] = useState({
    name: '', code: '', courseType: 'UG', entryType: 'Regular',
    admissionMode: 'Government', academicYear: '2025-26',
    totalIntake: '', departmentId: ''
  })
  const [quotaForm, setQuotaForm] = useState({
    programId: '',
    KCET: '', COMEDK: '', Management: ''
  })

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    const [i, c, d, p] = await Promise.all([
      getInstitutionsAPI(),
      getCampusesAPI(),
      getDepartmentsAPI(),
      getProgramsAPI()
    ])
    setInstitutions(i.data)
    setCampuses(c.data)
    setDepartments(d.data)
    setPrograms(p.data)
  }

  const showMsg = (msg: string, isError = false) => {
    if (isError) setError(msg)
    else setMessage(msg)
    setTimeout(() => { setMessage(''); setError('') }, 3000)
  }

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createInstitutionAPI(instForm)
      showMsg('Institution created!')
      setInstForm({ name: '', code: '' })
      loadAll()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleCreateCampus = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCampusAPI(campForm)
      showMsg('Campus created!')
      setCampForm({ name: '', institutionId: '' })
      loadAll()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDepartmentAPI(deptForm)
      showMsg('Department created!')
      setDeptForm({ name: '', code: '', campusId: '' })
      loadAll()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProgramAPI(progForm)
      showMsg('Program created!')
      loadAll()
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const handleCreateQuotas = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const quotas = [
        { type: 'KCET',       total: parseInt(quotaForm.KCET) },
        { type: 'COMEDK',     total: parseInt(quotaForm.COMEDK) },
        { type: 'Management', total: parseInt(quotaForm.Management) },
      ].filter(q => q.total > 0)
      await createQuotasAPI(quotaForm.programId, { quotas })
      showMsg('Quotas configured!')
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Error', true)
    }
  }

  const tabs = ['institution', 'campus', 'department', 'program', 'quota']

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Master Setup</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Messages */}
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

      {/* Institution Tab */}
      {tab === 'institution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Institution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateInstitution} className="space-y-4">
                <Input placeholder="Institution Name" value={instForm.name}
                  onChange={e => setInstForm({ ...instForm, name: e.target.value })} required />
                <Input placeholder="Institution Code (e.g. INST)" value={instForm.code}
                  onChange={e => setInstForm({ ...instForm, code: e.target.value.toUpperCase() })} required />
                <Button type="submit" className="w-full">Create Institution</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Institutions ({institutions.length})</CardTitle></CardHeader>
            <CardContent>
              {institutions.map((i: any) => (
                <div key={i.id} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{i.name}</span>
                  <span className="text-gray-500 text-sm">{i.code}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campus Tab */}
      {tab === 'campus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Campus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampus} className="space-y-4">
                <Input placeholder="Campus Name" value={campForm.name}
                  onChange={e => setCampForm({ ...campForm, name: e.target.value })} required />
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={campForm.institutionId}
                  onChange={e => setCampForm({ ...campForm, institutionId: e.target.value })} required>
                  <option value="">Select Institution</option>
                  {institutions.map((i: any) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
                <Button type="submit" className="w-full">Create Campus</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Campuses ({campuses.length})</CardTitle></CardHeader>
            <CardContent>
              {campuses.map((c: any) => (
                <div key={c.id} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-gray-500 text-sm">{c.institution?.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Tab */}
      {tab === 'department' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <Input placeholder="Department Name" value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} required />
                <Input placeholder="Department Code (e.g. CSE)" value={deptForm.code}
                  onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })} required />
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={deptForm.campusId}
                  onChange={e => setDeptForm({ ...deptForm, campusId: e.target.value })} required>
                  <option value="">Select Campus</option>
                  {campuses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button type="submit" className="w-full">Create Department</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Departments ({departments.length})</CardTitle></CardHeader>
            <CardContent>
              {departments.map((d: any) => (
                <div key={d.id} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-gray-500 text-sm">{d.code}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Program Tab */}
      {tab === 'program' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProgram} className="space-y-3">
                <Input placeholder="Program Name (e.g. B.E Computer Science)"
                  value={progForm.name}
                  onChange={e => setProgForm({ ...progForm, name: e.target.value })} required />
                <Input placeholder="Program Code (e.g. CSE)"
                  value={progForm.code}
                  onChange={e => setProgForm({ ...progForm, code: e.target.value.toUpperCase() })} required />
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={progForm.courseType}
                  onChange={e => setProgForm({ ...progForm, courseType: e.target.value })}>
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={progForm.entryType}
                  onChange={e => setProgForm({ ...progForm, entryType: e.target.value })}>
                  <option value="Regular">Regular</option>
                  <option value="Lateral">Lateral</option>
                </select>
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={progForm.admissionMode}
                  onChange={e => setProgForm({ ...progForm, admissionMode: e.target.value })}>
                  <option value="Government">Government</option>
                  <option value="Management">Management</option>
                </select>
                <Input placeholder="Academic Year (e.g. 2025-26)"
                  value={progForm.academicYear}
                  onChange={e => setProgForm({ ...progForm, academicYear: e.target.value })} required />
                <Input type="number" placeholder="Total Intake (e.g. 60)"
                  value={progForm.totalIntake}
                  onChange={e => setProgForm({ ...progForm, totalIntake: e.target.value })} required />
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={progForm.departmentId}
                  onChange={e => setProgForm({ ...progForm, departmentId: e.target.value })} required>
                  <option value="">Select Department</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <Button type="submit" className="w-full">Create Program</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Programs ({programs.length})</CardTitle></CardHeader>
            <CardContent>
              {programs.map((p: any) => (
                <div key={p.id} className="py-2 border-b">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">
                    {p.courseType} | Intake: {p.totalIntake} | {p.academicYear}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quota Tab */}
      {tab === 'quota' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Configure Quotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuotas} className="space-y-4">
                <select className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
                  value={quotaForm.programId}
                  onChange={e => setQuotaForm({ ...quotaForm, programId: e.target.value })} required>
                  <option value="">Select Program</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Intake: {p.totalIntake})
                    </option>
                  ))}
                </select>
                <Input type="number" placeholder="KCET seats"
                  value={quotaForm.KCET}
                  onChange={e => setQuotaForm({ ...quotaForm, KCET: e.target.value })} />
                <Input type="number" placeholder="COMEDK seats"
                  value={quotaForm.COMEDK}
                  onChange={e => setQuotaForm({ ...quotaForm, COMEDK: e.target.value })} />
                <Input type="number" placeholder="Management seats"
                  value={quotaForm.Management}
                  onChange={e => setQuotaForm({ ...quotaForm, Management: e.target.value })} />
                <p className="text-xs text-gray-500">
                  ⚠️ Sum of all quota seats must equal program total intake
                </p>
                <Button type="submit" className="w-full">Save Quotas</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Programs with Quotas</CardTitle></CardHeader>
            <CardContent>
              {programs.map((p: any) => (
                <div key={p.id} className="py-2 border-b">
                  <div className="font-medium">{p.name}</div>
                  <div className="flex gap-2 mt-1">
                    {p.quotas?.map((q: any) => (
                      <span key={q.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {q.type}: {q.filled}/{q.total}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Masters