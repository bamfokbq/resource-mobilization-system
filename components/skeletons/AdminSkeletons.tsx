import React from 'react';

export function AdminDashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Regions and Sectors Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Technical Analytics Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Survey Management Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminAnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-80"></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* User Engagement Charts Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white rounded-xl p-6 shadow-lg gap-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSurveysSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-80"></div>
        </div>
        <div className="animate-pulse">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Surveys Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                <div className="h-4 bg-gray-200 rounded w-1/7"></div>
                <div className="h-4 bg-gray-200 rounded w-1/9"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProfileSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header with Gradient Skeleton */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm"></div>
                <div>
                  <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-12 w-12 bg-white/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Skeleton */}
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            {/* Contact Information Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500 rounded-xl">
                      <div className="h-5 w-5 bg-white rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-purple-300 rounded w-24 mb-2"></div>
                      <div className="h-5 bg-purple-400 rounded w-40"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Actions Skeleton */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <div className="h-5 w-5 bg-white rounded"></div>
                </div>
                <div className="h-6 bg-orange-400 rounded w-32"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-orange-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* Admin Status Badge Skeleton */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-6 bg-red-300 rounded"></div>
                <div className="h-6 bg-red-400 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
