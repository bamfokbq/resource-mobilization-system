'use client'

import { RiUserLine } from 'react-icons/ri'

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <RiUserLine className="text-blue-500" />
            User Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account settings and personal information</p>
        </div>
      </div>

      {/* Error Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <RiUserLine className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading your profile. This might be a temporary issue.
            </p>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={reset}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
