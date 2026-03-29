import axios from 'axios'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
})

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── AUTH ─────────────────────────────────────────
export const loginAPI = (data: { email: string; password: string }) =>
  API.post('/auth/login', data)

export const registerAPI = (data: {
  name: string; email: string; password: string; role: string
}) => API.post('/auth/register', data)

export const getMeAPI = () => API.get('/auth/me')

// ─── MASTERS ──────────────────────────────────────
export const getInstitutionsAPI = () => API.get('/masters/institutions')
export const createInstitutionAPI = (data: any) => API.post('/masters/institutions', data)

export const getCampusesAPI = () => API.get('/masters/campuses')
export const createCampusAPI = (data: any) => API.post('/masters/campuses', data)

export const getDepartmentsAPI = () => API.get('/masters/departments')
export const createDepartmentAPI = (data: any) => API.post('/masters/departments', data)

export const getProgramsAPI = () => API.get('/masters/programs')
export const createProgramAPI = (data: any) => API.post('/masters/programs', data)

export const createQuotasAPI = (programId: string, data: any) =>
  API.post(`/masters/programs/${programId}/quotas`, data)

export const getProgramSeatsAPI = (programId: string) =>
  API.get(`/masters/programs/${programId}/seats`)

// ─── APPLICANTS ───────────────────────────────────
export const getApplicantsAPI = (params?: any) =>
  API.get('/applicants', { params })

export const getApplicantByIdAPI = (id: string) =>
  API.get(`/applicants/${id}`)

export const createApplicantAPI = (data: any) =>
  API.post('/applicants', data)

export const updateDocStatusAPI = (id: string, docStatus: string) =>
  API.patch(`/applicants/${id}/documents`, { docStatus })

export const updateFeeStatusAPI = (id: string, feeStatus: string) =>
  API.patch(`/applicants/${id}/fee`, { feeStatus })

// ─── ADMISSIONS ───────────────────────────────────
export const allocateSeatAPI = (applicantId: string) =>
  API.post('/admissions/allocate', { applicantId })

export const confirmAdmissionAPI = (applicantId: string) =>
  API.post(`/admissions/confirm/${applicantId}`)

export const getAdmissionsAPI = () => API.get('/admissions')

// ─── DASHBOARD ────────────────────────────────────
export const getDashboardStatsAPI = () => API.get('/dashboard/stats')       