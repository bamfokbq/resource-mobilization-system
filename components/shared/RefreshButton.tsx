'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaSync } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'sonner';

interface RefreshButtonProps {
  onRefresh?: () => Promise<void> | void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function RefreshButton({
  onRefresh,
  variant = 'outline',
  size = 'sm',
  className = ''
}: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      if (onRefresh) {
        await onRefresh();
        toast.success('Data refreshed successfully');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh data');
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ${className}`}
    >
      <FaSync className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}
