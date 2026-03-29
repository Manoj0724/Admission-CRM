import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── INSTITUTION ─────────────────────────────────

export const createInstitution = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body
    if (!name || !code)
      return res.status(400).json({ message: 'Name and code are required' })

    const existing = await prisma.institution.findUnique({ where: { code } })
    if (existing)
      return res.status(400).json({ message: 'Institution code already exists' })

    const institution = await prisma.institution.create({
      data: { name, code }
    })
    res.status(201).json(institution)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

export const getInstitutions = async (req: Request, res: Response) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: { campuses: true }
    })
    res.json(institutions)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── CAMPUS ──────────────────────────────────────

export const createCampus = async (req: Request, res: Response) => {
  try {
    const { name, institutionId } = req.body
    if (!name || !institutionId)
      return res.status(400).json({ message: 'Name and institutionId are required' })

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId }
    })
    if (!institution)
      return res.status(404).json({ message: 'Institution not found' })

    const campus = await prisma.campus.create({
      data: { name, institutionId }
    })
    res.status(201).json(campus)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

export const getCampuses = async (req: Request, res: Response) => {
  try {
    const campuses = await prisma.campus.findMany({
      include: { institution: true, departments: true }
    })
    res.json(campuses)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── DEPARTMENT ───────────────────────────────────

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, code, campusId } = req.body
    if (!name || !code || !campusId)
      return res.status(400).json({ message: 'All fields are required' })

    const campus = await prisma.campus.findUnique({ where: { id: campusId } })
    if (!campus)
      return res.status(404).json({ message: 'Campus not found' })

    const department = await prisma.department.create({
      data: { name, code, campusId }
    })
    res.status(201).json(department)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: { campus: true, programs: true }
    })
    res.json(departments)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── PROGRAM ──────────────────────────────────────

export const createProgram = async (req: Request, res: Response) => {
  try {
    const {
      name, code, courseType, entryType,
      admissionMode, academicYear, totalIntake, departmentId
    } = req.body

    if (!name || !code || !courseType || !entryType ||
        !admissionMode || !academicYear || !totalIntake || !departmentId)
      return res.status(400).json({ message: 'All fields are required' })

    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })
    if (!department)
      return res.status(404).json({ message: 'Department not found' })

    const program = await prisma.program.create({
      data: {
        name, code, courseType, entryType,
        admissionMode, academicYear,
        totalIntake: parseInt(totalIntake),
        departmentId
      }
    })
    res.status(201).json(program)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      include: {
        department: { include: { campus: { include: { institution: true } } } },
        quotas: true
      }
    })
    res.json(programs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── QUOTA ────────────────────────────────────────

export const createQuotas = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params
    const { quotas } = req.body

    // Get program
    const program = await prisma.program.findUnique({
      where: { id: programId }
    })
    if (!program)
      return res.status(404).json({ message: 'Program not found' })

    // BUSINESS RULE: Sum of quotas must equal totalIntake
    const totalQuota = quotas.reduce(
      (sum: number, q: { type: string; total: number }) => sum + q.total, 0
    )
    if (totalQuota !== program.totalIntake)
      return res.status(400).json({
        message: `Quota total (${totalQuota}) must equal program intake (${program.totalIntake})`
      })

    // Delete existing quotas and recreate
    await prisma.quota.deleteMany({ where: { programId } })

    const createdQuotas = await prisma.quota.createMany({
      data: quotas.map((q: { type: string; total: number }) => ({
        type: q.type,
        total: q.total,
        programId
      }))
    })

    res.status(201).json({
      message: 'Quotas created successfully',
      programId,
      quotas: createdQuotas
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

export const getProgramSeats = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { quotas: true }
    })
    if (!program)
      return res.status(404).json({ message: 'Program not found' })

    const seatInfo = {
      programId: program.id,
      programName: program.name,
      totalIntake: program.totalIntake,
      quotas: program.quotas.map(q => ({
        type: q.type,
        total: q.total,
        filled: q.filled,
        remaining: q.total - q.filled
      }))
    }
    res.json(seatInfo)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}