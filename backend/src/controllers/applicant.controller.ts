import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── CREATE APPLICANT ─────────────────────────────
export const createApplicant = async (req: Request, res: Response) => {
  try {
    const {
      name, email, phone, dob, gender,
      category, entryType, quotaType,
      allotmentNumber, marks, programId
    } = req.body

    // Validate required fields
    if (!name || !email || !phone || !dob || !gender ||
        !category || !entryType || !quotaType || !marks || !programId)
      return res.status(400).json({ message: 'All fields are required' })

    // RULE 5: allotmentNumber required for KCET/COMEDK
    if ((quotaType === 'KCET' || quotaType === 'COMEDK') && !allotmentNumber)
      return res.status(400).json({
        message: 'Allotment number is required for KCET/COMEDK quota'
      })

    // Check program exists
    const program = await prisma.program.findUnique({
      where: { id: programId }
    })
    if (!program)
      return res.status(404).json({ message: 'Program not found' })

    const applicant = await prisma.applicant.create({
      data: {
        name, email, phone,
        dob: new Date(dob),
        gender, category, entryType,
        quotaType, allotmentNumber,
        marks: parseFloat(marks),
        programId
      },
      include: { program: true }
    })

    res.status(201).json(applicant)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── GET ALL APPLICANTS ───────────────────────────
export const getApplicants = async (req: Request, res: Response) => {
  try {
    const { programId, docStatus, feeStatus, quotaType } = req.query

    const applicants = await prisma.applicant.findMany({
      where: {
        ...(programId && { programId: String(programId) }),
        ...(docStatus && { docStatus: docStatus as any }),
        ...(feeStatus && { feeStatus: feeStatus as any }),
        ...(quotaType && { quotaType: quotaType as any }),
      },
      include: {
        program: true,
        admission: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(applicants)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── GET SINGLE APPLICANT ─────────────────────────
export const getApplicantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: { program: true, admission: true }
    })

    if (!applicant)
      return res.status(404).json({ message: 'Applicant not found' })

    res.json(applicant)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── UPDATE DOCUMENT STATUS ───────────────────────
export const updateDocumentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { docStatus } = req.body

    const validStatuses = ['Pending', 'Submitted', 'Verified']
    if (!validStatuses.includes(docStatus))
      return res.status(400).json({ message: 'Invalid document status' })

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { docStatus }
    })

    res.json(applicant)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── UPDATE FEE STATUS ────────────────────────────
export const updateFeeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { feeStatus } = req.body

    const validStatuses = ['Pending', 'Paid']
    if (!validStatuses.includes(feeStatus))
      return res.status(400).json({ message: 'Invalid fee status' })

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { feeStatus }
    })

    res.json(applicant)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}