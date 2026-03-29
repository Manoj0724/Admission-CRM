# Admission CRM — Admission Management System

A full-stack web-based Admission Management & CRM system built for colleges to manage programs, applicants, seat allocation, and admissions with quota enforcement.

---

## 🌐 Live Demo

- **Frontend:** https://admission-crm-frontend.onrender.com
- **Backend API:** https://admission-crm-backend.onrender.com
- **Health Check:** https://admission-crm-backend.onrender.com/health

---

## 🔐 Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | password123 |
| Admission Officer | officer@test.com | password123 |
| Management | mgmt@test.com | password123 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (Role-based) |
| Testing (Unit) | Jest + ts-jest |
| Testing (E2E) | Playwright |
| Container | Docker + Docker Compose |
| Deployment | Render (Backend + Frontend) |

---

## ✨ Features

### Master Setup (Admin)
- Create Institution, Campus, Department, Program
- Configure quotas per program (KCET, COMEDK, Management)
- Quota validation — sum must equal total intake

### Applicant Management (Officer)
- Create applicants with 15-field application form
- Track document status (Pending → Submitted → Verified)
- Track fee status (Pending → Paid)
- Search and filter applicants

### Seat Allocation (Officer)
- Real-time seat availability check
- Block allocation when quota is full
- Quota-wise seat counter

### Admission Confirmation (Officer)
- Generate unique admission number
- Format: `INST/2026/UG/CSE/KCET/0001`
- Immutable after creation
- Only confirmed when fee is Paid + Documents Verified

### Dashboard (All Roles)
- Total intake vs admitted
- Quota-wise filled and remaining seats
- Pending documents count
- Pending fees count
- Live data statistics

### User Roles
| Role | Access |
|---|---|
| Admin | Master setup, view all |
| Admission Officer | Create applicants, allocate seats, confirm admissions |
| Management | View-only dashboard |

---

## 🗄️ Database Schema
```
User → role: ADMIN | ADMISSION_OFFICER | MANAGEMENT
Institution → Campus → Department → Program
Program → Quota (KCET, COMEDK, Management)
Applicant → Program
Admission → Applicant (unique, immutable)
```

---

## 📐 Architecture
```
Frontend (React 18)
      ↓ axios
Backend (Express API)
      ↓ Prisma ORM
PostgreSQL Database
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 16
- Docker (optional)

### Option 1 — Manual Setup

**1. Clone the repo**
```bash
git clone https://github.com/Manoj0724/admission-crm.git
cd admission-crm
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/admission_db"
JWT_SECRET="admission_crm_super_secret_2026"
PORT=5000
NODE_ENV=development
```

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
npm start
```

**4. Create Test Users (Postman)**
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Admin", "email": "admin@test.com", "password": "password123", "role": "ADMIN" }

POST http://localhost:5000/api/auth/register
Body: { "name": "Officer", "email": "officer@test.com", "password": "password123", "role": "ADMISSION_OFFICER" }

POST http://localhost:5000/api/auth/register
Body: { "name": "Management", "email": "mgmt@test.com", "password": "password123", "role": "MANAGEMENT" }
```

---

### Option 2 — Docker Setup
```bash
git clone https://github.com/Manoj0724/admission-crm.git
cd admission-crm
docker-compose up --build
```

Visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/health

---

## 🧪 Running Tests

### Unit Tests (Jest)
```bash
cd backend
npx jest tests/unit
```

Expected output:
```
PASS tests/unit/quota.test.ts
PASS tests/unit/admission.test.ts
PASS tests/unit/applicant.test.ts

Test Suites: 3 passed
Tests:       18 passed
```

### E2E Tests (Playwright)
```bash
# Make sure frontend is running on http://localhost:3000
cd admission-crm
npx playwright test
```

Expected output:
```
Running 23 tests using 1 worker
23 passed
```

View HTML report:
```bash
npx playwright show-report
```

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Masters (Admin only)
```
POST /api/masters/institutions
GET  /api/masters/institutions
POST /api/masters/campuses
POST /api/masters/departments
POST /api/masters/programs
POST /api/masters/programs/:id/quotas
GET  /api/masters/programs/:id/seats
```

### Applicants (Officer)
```
POST   /api/applicants
GET    /api/applicants
GET    /api/applicants/:id
PATCH  /api/applicants/:id/documents
PATCH  /api/applicants/:id/fee
```

### Admissions (Officer)
```
POST /api/admissions/allocate
POST /api/admissions/confirm/:applicantId
GET  /api/admissions
```

### Dashboard (All roles)
```
GET /api/dashboard/stats
```

---

## 🔑 Business Rules

| Rule | Description |
|---|---|
| Quota Integrity | Sum of quota totals must equal program intake |
| No Overbooking | Seat blocked if quota is full |
| Admission Number | Generated once, immutable, format: INST/YEAR/COURSE/DEPT/QUOTA/SEQ |
| Fee Required | Admission confirmed only when fee = Paid |
| Doc Required | Admission confirmed only when docs = Verified |
| Allotment Number | Required for KCET and COMEDK quotas |

---

## 🤖 AI Tools Used

| Tool | Usage |
|---|---|
| Claude AI | Architecture planning, code guidance, debugging |
| GitHub Copilot | Code completion and suggestions |

### AI-Assisted Parts
- Initial project structure and folder setup
- Prisma schema design
- Business rule implementation guidance
- UI component structure suggestions
- Test case writing assistance

### Written by Developer
- All business logic implementation
- API controllers and routes
- Frontend pages and components
- Docker configuration
- Final debugging and fixes

---

## 📁 Project Structure
```
admission-crm/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── tests/unit/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── tests/
│   └── e2e/
│       ├── auth.spec.ts
│       ├── masters.spec.ts
│       ├── admission.spec.ts
│       └── dashboard.spec.ts
├── docker-compose.yml
├── playwright.config.ts
└── README.md
```

---

## 👨‍💻 Developer

**Manoj**
- GitHub: https://github.com/Manoj0724