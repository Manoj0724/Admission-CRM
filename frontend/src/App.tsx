import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Masters from './pages/Masters'
import Applicants from './pages/Applicants'
import NewApplicant from './pages/NewApplicant'
import ApplicantDetail from './pages/ApplicantDetail'
import Admissions from './pages/Admissions'
import Unauthorized from './pages/Unauthorized'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 }
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <Sidebar />}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
        className={`flex-1 p-8 ${user ? 'ml-[260px]' : ''}`}
      >
        {children}
      </motion.main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#2563eb', secondary: '#fff' }
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' }
              }
            }}
          />
          <AnimatePresence mode="wait">
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/masters" element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <Masters />
                  </ProtectedRoute>
                } />
                <Route path="/applicants" element={
                  <ProtectedRoute roles={['ADMIN', 'ADMISSION_OFFICER']}>
                    <Applicants />
                  </ProtectedRoute>
                } />
                <Route path="/applicants/new" element={
                  <ProtectedRoute roles={['ADMISSION_OFFICER']}>
                    <NewApplicant />
                  </ProtectedRoute>
                } />
                <Route path="/applicants/:id" element={
                  <ProtectedRoute roles={['ADMIN', 'ADMISSION_OFFICER']}>
                    <ApplicantDetail />
                  </ProtectedRoute>
                } />
                <Route path="/admissions" element={
                  <ProtectedRoute roles={['ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']}>
                    <Admissions />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </AnimatePresence>
        </>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App