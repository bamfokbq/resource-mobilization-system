'use client';

import { Button } from '@/components/ui/button';
import { RiAlertLine, RiRefreshLine } from 'react-icons/ri';
import { useEffect } from 'react';

export default function SurveysError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Surveys page error:', error);
  }, [error]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <RiAlertLine className="h-8 w-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong!
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We encountered an error while loading your surveys. This could be due to a temporary network issue or server problem.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-gray-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <code className="text-sm text-red-600 break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <RiRefreshLine size={20} />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
          <p className="text-sm text-blue-700">
            If this problem persists, please contact our support team or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}
