import React from 'react'

export default function SearchTableSkeletion() {
  return (
    <div className='bg-white rounded-md p-2 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
      <div className='border flex-1 font-light border-gray-200 rounded-md h-10 sm:h-full flex items-center gap-2 p-2'>
        {/* Search Icon Skeleton */}
        <div className='w-5 h-5 bg-gray-200 animate-pulse rounded'></div>
        {/* Input Field Skeleton */}
        <div className='flex-1 h-6 bg-gray-200 animate-pulse rounded'></div>
      </div>
      {/* Search Button Skeleton */}
      <div className='h-10 w-full sm:w-24 bg-gray-200 animate-pulse rounded'></div>
    </div>
  )
}
