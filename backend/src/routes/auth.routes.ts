import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller'
import authMiddleware from '../middleware/auth.middleware'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        authMiddleware(), getMe)

// ─── TEMP: Reset admin password ──────────────────
router.post('/reset-admin', async (req: any, res: any) => {
  try {
    const hashed = await bcrypt.hash('password123', 10)
    await prisma.user.updateMany({
      where: { email: 'admin@test.com' },
      data: { password: hashed }
    })
    await prisma.user.updateMany({
      where: { email: 'officer@test.com' },
      data: { password: hashed }
    })
    await prisma.user.updateMany({
      where: { email: 'mgmt@test.com' },
      data: { password: hashed }
    })
    res.json({ message: 'All passwords reset to password123' })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

export default router