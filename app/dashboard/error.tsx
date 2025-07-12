'use client';

import { useEffect } from 'react';
import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <RiErrorWarningLine size={64} className="mx-auto text-red-400 mb-6" />
        <h2 className="text-2xl font-bold text-red-800 mb-4">Something went wrong!</h2>
        <p className="text-red-600 mb-6">
          There was an error loading your dashboard. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors duration-300"
        >
          <RiRefreshLine className="mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
}
