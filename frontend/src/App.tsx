import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Masters from './pages/Masters'
import Applicants from './pages/Applicants'
import NewApplicant from './pages/NewApplicant'
import ApplicantDetail from './pages/ApplicantDetail'
import Admissions from './pages/Admissions'
import Unauthorized from './pages/Unauthorized'
import { useAuth } from './context/AuthContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className="p-6">{children}</main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route path="/masters" element={
              <ProtectedRoute roles={['ADMIN']}>
                <Masters />
              </ProtectedRoute>
            } />

            {/* Officer Routes */}
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

            {/* All Roles */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App