import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboard.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.get('/stats',
  authMiddleware(['ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']),
  getDashboardStats
)

export default router