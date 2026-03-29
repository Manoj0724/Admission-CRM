import { Router } from 'express'
import {
  allocateSeat,
  confirmAdmission,
  getAdmissions
} from '../controllers/admission.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.post('/allocate',
  authMiddleware(['ADMISSION_OFFICER']),
  allocateSeat
)

router.post('/confirm/:applicantId',
  authMiddleware(['ADMISSION_OFFICER']),
  confirmAdmission
)

router.get('/',
  authMiddleware(['ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']),
  getAdmissions
)

export default router