import { Router } from 'express'
import {
  createInstitution, getInstitutions,
  createCampus, getCampuses,
  createDepartment, getDepartments,
  createProgram, getPrograms,
  createQuotas, getProgramSeats
} from '../controllers/masters.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

// ─── Institution ──────────────────────────────────
router.post('/institutions',     authMiddleware(['ADMIN']), createInstitution)
router.get('/institutions',      authMiddleware(),          getInstitutions)

// ─── Campus ───────────────────────────────────────
router.post('/campuses',         authMiddleware(['ADMIN']), createCampus)
router.get('/campuses',          authMiddleware(),          getCampuses)

// ─── Department ───────────────────────────────────
router.post('/departments',      authMiddleware(['ADMIN']), createDepartment)
router.get('/departments',       authMiddleware(),          getDepartments)

// ─── Program ──────────────────────────────────────
router.post('/programs',         authMiddleware(['ADMIN']), createProgram)
router.get('/programs',          authMiddleware(),          getPrograms)

// ─── Quota ────────────────────────────────────────
router.post('/programs/:programId/quotas', authMiddleware(['ADMIN']), createQuotas)
router.get('/programs/:programId/seats',   authMiddleware(),          getProgramSeats)

export default router