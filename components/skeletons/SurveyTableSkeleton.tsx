import React from 'react'

export default function SurveyTableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-28 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Table rows skeleton */}
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-4 w-40 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-8 w-8 bg-slate-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-200 animate-pulse rounded"></div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-9 bg-slate-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
