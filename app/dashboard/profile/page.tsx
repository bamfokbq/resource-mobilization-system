import DisplayUserProfile from '@/components/features/DisplayUserProfile'
import AdminTitle from '@/components/shared/AdminTitle'
import React from 'react'

export default function ProfilePage() {
  return (
    <div className='flex flex-row md:flex-col gap-3 md:gap-6'>
      <div className='flex items-center justify-between'>
        <AdminTitle title="Profile" />
      </div>
      <div>
        <DisplayUserProfile />
      </div>
    </div>
  )
}
