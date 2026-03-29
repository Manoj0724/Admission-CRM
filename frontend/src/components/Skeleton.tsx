import React from 'react'

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="skeleton h-4 w-24 mb-4" />
    <div className="skeleton h-8 w-16 mb-2" />
    <div className="skeleton h-3 w-32" />
  </div>
)

export const SkeletonRow = () => (
  <tr>
    {[1,2,3,4,5].map(i => (
      <td key={i} className="py-3 px-4">
        <div className="skeleton h-4 w-full" />
      </td>
    ))}
  </tr>
)

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <table className="w-full">
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </tbody>
  </table>
)