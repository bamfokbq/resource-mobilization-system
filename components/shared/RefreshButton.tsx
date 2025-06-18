'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaSync } from 'react-icons/fa';
import { useState } from 'react';

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // Reset loading state after a short delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
    >
      <FaSync className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}
