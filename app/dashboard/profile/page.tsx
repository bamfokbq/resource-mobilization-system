import { getUserProfile } from '@/actions/users'
import { auth } from '@/auth'
import DisplayUserProfile from '@/components/features/DisplayUserProfile'
import { ProfileSkeleton } from '@/components/ui/loading-skeleton'
import React, { Suspense } from 'react'
import { RiUserLine, RiSettings2Line } from 'react-icons/ri'

// Async component for Profile Data - loads user profile from database
async function ProfileSection({ userId }: { userId: string }) {
  try {
    const profileResult = await getUserProfile(userId);

    if (!profileResult.success) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <RiSettings2Line className="text-purple-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load profile data</p>
            <p className="text-gray-500">{profileResult.error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <RiSettings2Line className="text-purple-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        </div>

        <DisplayUserProfile initialUserData={profileResult.data} />
      </div>
    );
  } catch (error) {
    console.error('Error loading profile:', error);

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <RiSettings2Line className="text-purple-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">An unexpected error occurred</p>
          <p className="text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <RiUserLine className="text-blue-500" />
            User Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account settings and personal information</p>
        </div>
      </div>

      {/* Profile Section - Streams in with user data */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSection userId={session.user.id} />
      </Suspense>
    </div>
  )
}
