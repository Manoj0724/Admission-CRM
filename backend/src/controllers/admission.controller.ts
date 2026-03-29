import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── ALLOCATE SEAT ────────────────────────────────
export const allocateSeat = async (req: Request, res: Response) => {
  try {
    const { applicantId } = req.body

    // Get applicant with program
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { program: true, admission: true }
    })

    if (!applicant)
      return res.status(404).json({ message: 'Applicant not found' })

    // Check if already admitted
    if (applicant.admission)
      return res.status(400).json({ message: 'Applicant already admitted' })

    // Get quota for this applicant's quota type
    const quota = await prisma.quota.findFirst({
      where: {
        programId: applicant.programId,
        type: applicant.quotaType
      }
    })

    if (!quota)
      return res.status(404).json({ message: 'Quota not found for this program' })

    // RULE 2: Block if quota is full
    if (quota.filled >= quota.total)
      return res.status(400).json({
        message: `Quota full! No seats available in ${applicant.quotaType} quota`,
        remaining: 0
      })

    // Increment quota filled count
    await prisma.quota.update({
      where: { id: quota.id },
      data: { filled: quota.filled + 1 }
    })

    res.json({
      message: 'Seat allocated successfully',
      applicantId,
      quotaType: applicant.quotaType,
      remaining: quota.total - quota.filled - 1
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── CONFIRM ADMISSION ────────────────────────────
export const confirmAdmission = async (req: Request, res: Response) => {
  try {
    const { applicantId } = req.params

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: {
        program: {
          include: {
            department: {
              include: {
                campus: {
                  include: { institution: true }
                }
              }
            }
          }
        },
        admission: true
      }
    })

    if (!applicant)
      return res.status(404).json({ message: 'Applicant not found' })

    // RULE 3: Admission number generated only once
    if (applicant.admission)
      return res.status(400).json({
        message: 'Admission already confirmed',
        admissionNumber: applicant.admission.admissionNumber
      })

    // RULE 4: Fee must be paid
    if (applicant.feeStatus !== 'Paid')
      return res.status(400).json({
        message: 'Fee must be paid before confirming admission'
      })

    // Check document verified
    if (applicant.docStatus !== 'Verified')
      return res.status(400).json({
        message: 'Documents must be verified before confirming admission'
      })

    // Generate admission number
    // Format: INST/2026/UG/CSE/KCET/0001
    const institution = applicant.program.department.campus.institution
    const year = new Date().getFullYear().toString()
    const courseType = applicant.program.courseType
    const deptCode = applicant.program.department.code.toUpperCase()
    const quotaType = applicant.quotaType

    const count = await prisma.admission.count()
    const sequence = String(count + 1).padStart(4, '0')

    const admissionNumber =
      `${institution.code}/${year}/${courseType}/${deptCode}/${quotaType}/${sequence}`

    // Create admission record
    const admission = await prisma.admission.create({
      data: { admissionNumber, applicantId }
    })

    res.status(201).json({
      message: 'Admission confirmed successfully!',
      admissionNumber: admission.admissionNumber,
      confirmedAt: admission.confirmedAt
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}

// ─── GET ALL ADMISSIONS ───────────────────────────
export const getAdmissions = async (req: Request, res: Response) => {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        applicant: {
          include: { program: true }
        }
      },
      orderBy: { confirmedAt: 'desc' }
    })
    res.json(admissions)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}