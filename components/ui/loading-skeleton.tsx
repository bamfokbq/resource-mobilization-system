import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Regional Insights Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Active Surveys Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
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
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function RegionalInsightsSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ActiveSurveysSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-4 flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubmittedSurveysTableSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}
