import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Total intake across all programs
    const programs = await prisma.program.findMany({
      include: { quotas: true }
    })

    const totalIntake = programs.reduce(
      (sum, p) => sum + p.totalIntake, 0
    )

    // Total admitted
    const totalAdmitted = await prisma.admission.count()

    // Quota wise stats
    const quotas = await prisma.quota.findMany({
      include: { program: true }
    })

    const quotaWise = ['KCET', 'COMEDK', 'Management'].map(type => {
      const filtered = quotas.filter(q => q.type === type)
      const total = filtered.reduce((s, q) => s + q.total, 0)
      const filled = filtered.reduce((s, q) => s + q.filled, 0)
      return { type, total, filled, remaining: total - filled }
    })

    // Pending documents
    const pendingDocuments = await prisma.applicant.count({
      where: { docStatus: { not: 'Verified' } }
    })

    // Pending fees
    const pendingFees = await prisma.applicant.count({
      where: { feeStatus: 'Pending' }
    })

    res.json({
      totalIntake,
      totalAdmitted,
      remainingSeats: totalIntake - totalAdmitted,
      quotaWise,
      pendingDocuments,
      pendingFees
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}