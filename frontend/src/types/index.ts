export type Role = 'ADMIN' | 'ADMISSION_OFFICER' | 'MANAGEMENT'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Institution {
  id: string
  name: string
  code: string
}

export interface Campus {
  id: string
  name: string
  institutionId: string
  institution?: Institution
}

export interface Department {
  id: string
  name: string
  code: string
  campusId: string
  campus?: Campus
}

export interface Quota {
  id: string
  type: 'KCET' | 'COMEDK' | 'Management'
  total: number
  filled: number
  remaining?: number
}

export interface Program {
  id: string
  name: string
  code: string
  courseType: 'UG' | 'PG'
  entryType: 'Regular' | 'Lateral'
  admissionMode: 'Government' | 'Management'
  academicYear: string
  totalIntake: number
  departmentId: string
  department?: Department
  quotas?: Quota[]
}

export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  gender: string
  category: string
  entryType: string
  quotaType: string
  allotmentNumber?: string
  marks: number
  programId: string
  program?: Program
  docStatus: 'Pending' | 'Submitted' | 'Verified'
  feeStatus: 'Pending' | 'Paid'
  admission?: Admission
  createdAt: string
}

export interface Admission {
  id: string
  admissionNumber: string
  applicantId: string
  confirmedAt: string
}

export interface DashboardStats {
  totalIntake: number
  totalAdmitted: number
  remainingSeats: number
  quotaWise: {
    type: string
    total: number
    filled: number
    remaining: number
  }[]
  pendingDocuments: number
  pendingFees: number
}