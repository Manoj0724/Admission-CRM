import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const generateAdmissionNumber = async (
  institutionCode: string,
  year: string,
  courseType: string,
  departmentCode: string,
  quotaType: string
): Promise<string> => {
  // Count existing admissions to generate sequence
  const count = await prisma.admission.count()
  const sequence = String(count + 1).padStart(4, '0')

  // Format: INST/2026/UG/CSE/KCET/0001
  return `${institutionCode}/${year}/${courseType}/${departmentCode}/${quotaType}/${sequence}`
}
