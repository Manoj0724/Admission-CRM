import { Router } from 'express'
import {
  createApplicant,
  getApplicants,
  getApplicantById,
  updateDocumentStatus,
  updateFeeStatus
} from '../controllers/applicant.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.post('/',
  authMiddleware(['ADMISSION_OFFICER']),
  createApplicant
)

router.get('/',
  authMiddleware(['ADMIN', 'ADMISSION_OFFICER']),
  getApplicants
)

router.get('/:id',
  authMiddleware(['ADMIN', 'ADMISSION_OFFICER']),
  getApplicantById
)

router.patch('/:id/documents',
  authMiddleware(['ADMISSION_OFFICER']),
  updateDocumentStatus
)

router.patch('/:id/fee',
  authMiddleware(['ADMISSION_OFFICER']),
  updateFeeStatus
)

export default router