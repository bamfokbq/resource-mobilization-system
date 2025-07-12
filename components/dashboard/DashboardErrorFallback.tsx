import React from 'react';

interface DashboardErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export default function DashboardErrorFallback({ error, resetErrorBoundary }: DashboardErrorFallbackProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-700 mb-2">Dashboard Error</h2>
        <p className="text-red-600 mb-4">
          Something went wrong loading your dashboard: {error.message}
        </p>
        <div className="space-y-2">
          <p className="text-sm text-red-500">
            This could be due to a network issue or a temporary server problem.
          </p>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
