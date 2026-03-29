import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ShieldX } from 'lucide-react'

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <ShieldX className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6">
        You don't have permission to view this page.
      </p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  )
}

export default Unauthorized