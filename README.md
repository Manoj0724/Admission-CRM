# Admission CRM — College Admission Management System

A full-stack web-based Admission Management & CRM system built for colleges to manage programs, applicants, seat allocation, and admissions with quota enforcement.

---

## 🌐 Live Demo

- **Frontend:** https://admission-crm-frontend-fynm.onrender.com
- **Backend API:** https://admission-crm-obud.onrender.com
- **Health Check:** https://admission-crm-obud.onrender.com/health

> **Note:** Hosted on Render free tier — first load may take 1-2 minutes to wake up.

---

## 🔐 Test Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@test.com | password123 | Master Setup |
| Admission Officer | officer@test.com | password123 | Applicants + Admissions |
| Management | mgmt@test.com | password123 | Dashboard Only |

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
| Unit Testing | Jest + ts-jest |
| E2E Testing | Playwright |
| Container | Docker + Docker Compose |
| Deployment | Render (Backend + Static Frontend) |

---

## ✅ Features Implemented

### 2.1 Master Setup (Admin Only)
- ✅ Create Institution (with unique code)
- ✅ Create Campus (linked to Institution)
- ✅ Create Department (with code, linked to Campus)
- ✅ Create Program (with Course Type UG/PG, Entry Type Regular/Lateral, Admission Mode Government/Management, Academic Year, Total Intake)

### 2.2 Seat Matrix & Quota
- ✅ Total intake per program
- ✅ Configure KCET, COMEDK, Management quotas
- ✅ Quota totals must equal program intake (enforced)
- ✅ Real-time seat counter per quota
- ✅ Block allocation if quota is full

### 2.3 Applicant Management
- ✅ Application form with exactly 15 fields
- ✅ Category: GM / SC / ST / OBC / EWS
- ✅ Entry Type + Quota Type selection
- ✅ Allotment number (required for KCET/COMEDK)
- ✅ Document checklist: Pending → Submitted → Verified

### 2.4 Admission Allocation
- ✅ Government Flow (KCET/COMEDK) — allotment number required
- ✅ Management Flow — direct allocation
- ✅ System checks seat availability before allocation
- ✅ Seat locked after allocation

### 2.5 Admission Confirmation
- ✅ Unique admission number generated
- ✅ Format: `INST/2026/UG/CSE/KCET/0001`
- ✅ Immutable after creation
- ✅ Generated only once per applicant

### 2.6 Fee Status
- ✅ Fee status: Pending / Paid
- ✅ Seat confirmed only when fee = Paid + Documents = Verified

### 2.7 Dashboard
- ✅ Total intake vs admitted (animated stat cards)
- ✅ Quota-wise filled and remaining seats
- ✅ Pending documents count
- ✅ Pending fees count
- ✅ Quota-wise seat status table

### User Roles (Section 3)
- ✅ Admin — Master setup, configure quotas
- ✅ Admission Officer — Create applicants, allocate seats, verify docs, confirm admission
- ✅ Management — View-only dashboard

---

## ❌ Out of Scope (NOT Built — As Per Assignment)

- Payment gateway
- SMS / WhatsApp notifications
- Advanced CRM
- AI prediction
- Multi-college complexity
- Marketing automation

---

## 🔑 Business Rules Implemented

| Rule | Implementation |
|---|---|
| Quota integrity | Sum of quotas must equal program intake — enforced at API level |
| No overbooking | Allocation blocked if quota.filled >= quota.total |
| Admission number | Generated once, immutable, unique DB constraint |
| Fee before confirmation | Returns 400 if feeStatus != Paid |
| Doc before confirmation | Returns 400 if docStatus != Verified |
| Allotment number | Required for KCET and COMEDK quotas only |

---

## 🗄️ Database Schema
```
User          → role: ADMIN | ADMISSION_OFFICER | MANAGEMENT
Institution   → code (unique)
  └── Campus
        └── Department
              └── Program → totalIntake
                    └── Quota → type: KCET | COMEDK | Management
                                 filled, total
Applicant     → linked to Program
  └── Admission → admissionNumber (unique, immutable)
```

---

## 📐 System Architecture
```
React 18 Frontend (Tailwind + shadcn/ui)
          ↓ axios (JWT Bearer Token)
Node.js + Express Backend (TypeScript)
          ↓ Prisma ORM
PostgreSQL Database
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Docker Desktop (optional)

---

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

Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/admission_db"
JWT_SECRET="admission_crm_super_secret_2026"
PORT=5000
NODE_ENV=development
```

Create database & run migrations:
```bash
psql -U postgres -c "CREATE DATABASE admission_db;"
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

**4. Create Test Users (Postman or curl)**
```bash
# Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"password123","role":"ADMIN"}'

# Officer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Officer","email":"officer@test.com","password":"password123","role":"ADMISSION_OFFICER"}'

# Management
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Management","email":"mgmt@test.com","password":"password123","role":"MANAGEMENT"}'
```

**5. Open App**
```
http://localhost:3000
```

---

### Option 2 — Docker Setup (Recommended)
```bash
git clone https://github.com/Manoj0724/admission-crm.git
cd admission-crm
docker-compose up --build
```

Services started:
- Frontend → http://localhost:3000
- Backend → http://localhost:5000
- PostgreSQL → localhost:5432

---

## 🧪 Running Tests

### Unit Tests (Jest) — 18 tests
```bash
cd backend
npx jest tests/unit
```

Expected output:
```
PASS tests/unit/quota.test.ts       ← Quota integrity & overbooking rules
PASS tests/unit/admission.test.ts   ← Admission number format & fee rules
PASS tests/unit/applicant.test.ts   ← Applicant validation rules

Test Suites: 3 passed
Tests:       18 passed
```

### E2E Tests (Playwright) — 23 tests

Make sure frontend is running on http://localhost:3000, then:
```bash
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

Test coverage:
- Auth flows (login, role-based redirect)
- Masters setup (institution, quota tabs)
- Applicant creation and form validation
- Admission confirmation rules
- Dashboard visibility per role
- Role-based access control (unauthorized redirect)

---

## 📡 API Reference

### Auth
```
POST /api/auth/register     → Create user
POST /api/auth/login        → Login, returns JWT
GET  /api/auth/me           → Get current user (requires token)
```

### Masters (Admin only)
```
POST /api/masters/institutions              → Create institution
GET  /api/masters/institutions              → List institutions
POST /api/masters/campuses                  → Create campus
GET  /api/masters/campuses                  → List campuses
POST /api/masters/departments               → Create department
GET  /api/masters/departments               → List departments
POST /api/masters/programs                  → Create program
GET  /api/masters/programs                  → List programs
POST /api/masters/programs/:id/quotas       → Configure quotas
GET  /api/masters/programs/:id/seats        → Get seat availability
```

### Applicants (Admission Officer)
```
POST  /api/applicants                       → Create applicant
GET   /api/applicants                       → List applicants (with filters)
GET   /api/applicants/:id                   → Get applicant detail
PATCH /api/applicants/:id/documents         → Update document status
PATCH /api/applicants/:id/fee               → Update fee status
```

### Admissions (Admission Officer)
```
POST /api/admissions/allocate               → Allocate seat (quota check)
POST /api/admissions/confirm/:applicantId   → Confirm admission (fee + doc check)
GET  /api/admissions                        → List all admissions
```

### Dashboard (All Roles)
```
GET /api/dashboard/stats                    → Get all dashboard statistics
```

---

## 📁 Project Structure
```
admission-crm/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          ← All DB models & enums
│   │   └── migrations/            ← Auto-generated migrations
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── masters.controller.ts
│   │   │   ├── applicant.controller.ts
│   │   │   ├── admission.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── masters.routes.ts
│   │   │   ├── applicant.routes.ts
│   │   │   ├── admission.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts  ← JWT + role-based guard
│   │   └── utils/
│   │       └── generateAdmissionNumber.ts
│   ├── tests/
│   │   └── unit/
│   │       ├── quota.test.ts       ← Quota & overbooking rules
│   │       ├── admission.test.ts   ← Admission number & fee rules
│   │       └── applicant.test.ts   ← Applicant validation rules
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html             ← Custom title + shimmer loader
│   │   └── favicon.svg            ← Custom graduation cap icon
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx      ← Charts + stats
│   │   │   ├── Masters.tsx        ← Tabbed master setup
│   │   │   ├── Applicants.tsx     ← List + search
│   │   │   ├── NewApplicant.tsx   ← 15-field form
│   │   │   ├── ApplicantDetail.tsx← Doc/fee/admission actions
│   │   │   ├── Admissions.tsx     ← Confirmed admissions list
│   │   │   └── Unauthorized.tsx
│   │   ├── components/
│   │   │   ├── Sidebar.tsx        ← Collapsible sidebar
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx ← Role-based route guard
│   │   │   ├── PageLoader.tsx     ← Shimmer loading screen
│   │   │   ├── Skeleton.tsx       ← Loading skeletons
│   │   │   └── ui/                ← Button, Input, Card, Badge
│   │   ├── context/
│   │   │   └── AuthContext.tsx    ← Global auth state
│   │   ├── services/
│   │   │   └── api.ts             ← All API calls (axios)
│   │   └── types/
│   │       └── index.ts           ← TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
│
├── tests/
│   └── e2e/
│       ├── auth.spec.ts           ← Login & redirect tests
│       ├── masters.spec.ts        ← Masters access tests
│       ├── admission.spec.ts      ← Applicant & admission tests
│       └── dashboard.spec.ts      ← Dashboard visibility tests
│
├── docker-compose.yml             ← Full stack with PostgreSQL
├── playwright.config.ts           ← E2E test config
└── README.md
```

---
## 📐 Development Methodology

### SDD — Spec Driven Development

Before writing a single line of code, the entire system was **specified first**:

**1. Data Models Spec** — All models defined upfront:
- User (roles: ADMIN, ADMISSION_OFFICER, MANAGEMENT)
- Institution → Campus → Department → Program → Quota
- Applicant → Admission (unique, immutable)

**2. API Spec** — All endpoints defined before coding:
```
AUTH
POST   /api/auth/register
POST   /api/auth/login

MASTERS (Admin only)
POST   /api/masters/institutions
POST   /api/masters/programs
POST   /api/masters/programs/:id/quotas
GET    /api/masters/programs/:id/seats

APPLICANTS (Officer)
POST   /api/applicants
PATCH  /api/applicants/:id/documents
PATCH  /api/applicants/:id/fee

ADMISSIONS (Officer)
POST   /api/admissions/allocate
POST   /api/admissions/confirm/:applicantId

DASHBOARD (All roles)
GET    /api/dashboard/stats
```

**3. Business Rules Spec** — All rules documented before implementation:
```
RULE 1: Sum of quota totals must equal program intake
RULE 2: Block seat allocation if quota is full
RULE 3: Admission number generated only once (immutable)
RULE 4: Fee must be Paid before confirming admission
RULE 5: Documents must be Verified before confirming admission
RULE 6: Allotment number required for KCET/COMEDK quotas
```

**4. Role Access Matrix Spec** — Defined before coding:
```
ENDPOINT                    ADMIN   OFFICER   MANAGEMENT
/api/masters/*  (POST)        ✅       ❌          ❌
/api/applicants (POST)        ❌       ✅          ❌
/api/admissions/allocate      ❌       ✅          ❌
/api/admissions/confirm       ❌       ✅          ❌
/api/dashboard/stats          ✅       ✅          ✅
```

**5. UI Pages Spec** — All pages planned before building:
```
/login              → All users
/masters            → Admin only
/applicants         → Admin + Officer
/applicants/new     → Officer only
/applicants/:id     → Admin + Officer
/admissions         → All roles
/dashboard          → All roles
/unauthorized       → Access denied page
```

---

### TDD — Test Driven Development

Tests were written **before or alongside** the implementation of each feature.

#### Unit Tests (Jest) — Written First, Then Code

**`tests/unit/quota.test.ts`** — Tests written before quota controller:
```
✅ RULE 1: Quota totals equal program intake → PASS
❌ RULE 1: Quota totals do NOT equal intake  → BLOCK
✅ RULE 2: Seat available when quota not full → PASS
❌ RULE 2: Seat NOT available when quota full → BLOCK
❌ RULE 2: Seat NOT available when overfilled → BLOCK
```

**`tests/unit/admission.test.ts`** — Tests written before admission controller:
```
✅ RULE 3: Admission number matches correct format → PASS
❌ RULE 3: Wrong format is rejected              → BLOCK
✅ RULE 4: Confirm when fee is Paid              → PASS
❌ RULE 4: Cannot confirm when fee is Pending    → BLOCK
✅ RULE 5: Management quota needs no allotment   → PASS
❌ RULE 5: KCET quota needs allotment number     → BLOCK
✅ RULE 5: KCET with allotment number is valid   → PASS
```

**`tests/unit/applicant.test.ts`** — Tests written before applicant controller:
```
✅ Valid applicant has all required fields   → PASS
❌ Applicant missing required fields         → BLOCK
✅ Document status Verified is valid         → PASS
❌ Invalid document status is rejected       → BLOCK
✅ Fee status Paid is valid                  → PASS
❌ Invalid fee status is rejected            → BLOCK
```

**Total Unit Tests: 18 passing ✅**

#### E2E Tests (Playwright) — Written to Verify User Journeys

**`tests/e2e/auth.spec.ts`** — Login flows:
```
✅ Admin login → redirected to /masters
✅ Officer login → redirected to /applicants
✅ Management login → redirected to /dashboard
✅ Invalid credentials → shows error toast
```

**`tests/e2e/masters.spec.ts`** — Master setup access:
```
✅ Admin can see masters page
✅ Admin can see institution tab
✅ Admin can see quota tab
✅ Admin can see program tab
✅ Management cannot access masters → /unauthorized
```

**`tests/e2e/admission.spec.ts`** — Applicant workflow:
```
✅ Officer can see applicants page
✅ Officer can see New Applicant button
✅ Officer can navigate to new applicant form
✅ New applicant form has all required fields
✅ Submit button exists on applicant form
✅ Confirm button disabled when fee pending
✅ Fee paid button visible on applicant detail
```

**`tests/e2e/dashboard.spec.ts`** — Dashboard access:
```
✅ Management can view dashboard stats
✅ Management cannot access applicant creation
✅ Admin can see dashboard
✅ Dashboard shows quota wise seat status
✅ Dashboard shows pending documents section
✅ Dashboard shows pending fees section
✅ Dashboard shows stat cards
```

**Total E2E Tests: 23 passing ✅**

#### TDD Cycle Followed
```
🔴 Write failing test first
🟢 Write minimum code to pass
🔵 Refactor and clean up
       ↑______repeat______↑
```

---

## 🤖 AI Tools Used

| Tool | How It Was Used |
|---|---|
| Claude AI | Architecture planning, step-by-step guidance, debugging |
| GitHub Copilot | Code completion and suggestions |

### What Was AI-Assisted
- Initial project structure setup
- Prisma schema design guidance
- Business rule implementation advice
- UI component structure suggestions
- Test case writing assistance
- Debugging deployment issues

### What Was Written by Developer
- All business logic implementation
- All API controllers and routes
- All frontend pages and components
- Docker and deployment configuration
- Final debugging, testing and fixes

---

## 👨‍💻 Developer

**Manoj**
GitHub: https://github.com/Manoj0724
Repository: https://github.com/Manoj0724/admission-crm