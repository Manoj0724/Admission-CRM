import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import mastersRoutes from './routes/masters.routes'
import applicantRoutes from './routes/applicant.routes'
import admissionRoutes from './routes/admission.routes'
import dashboardRoutes from './routes/dashboard.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// ─── Health Check ────────────────────────────────
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK', message: 'Admission CRM API Running 🚀' })
})

// ─── Routes ──────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/masters',    mastersRoutes)
app.use('/api/applicants', applicantRoutes)
app.use('/api/admissions', admissionRoutes)
app.use('/api/dashboard',  dashboardRoutes)

// ─── Start Server ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})