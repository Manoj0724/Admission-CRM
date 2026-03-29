import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center">

      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200">
          <GraduationCap className="h-10 w-10 text-white" />
        </div>
      </motion.div>

      {/* App Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800">Admission CRM</h1>
        <p className="text-gray-400 text-sm mt-1">Loading your workspace...</p>
      </motion.div>

      {/* Shimmer Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md px-6 space-y-3"
      >
        {/* Shimmer Bar 1 */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="h-full w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          />
        </div>

        {/* Shimmer Bar 2 */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden w-3/4">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: 0.2 }}
            className="h-full w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          />
        </div>

        {/* Shimmer Bar 3 */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden w-1/2">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: 0.4 }}
            className="h-full w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          />
        </div>
      </motion.div>

      {/* Dots Loader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-2 mt-8"
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </motion.div>

    </div>
  )
}

export default PageLoader