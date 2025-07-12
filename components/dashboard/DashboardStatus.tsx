"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react'

interface DashboardStatusProps {
  lastUpdated: Date
  isLoading: boolean
  error: string | null
  onRefresh: () => void
  isAutoRefreshEnabled?: boolean
}

const DashboardStatus: React.FC<DashboardStatusProps> = ({
  lastUpdated,
  isLoading,
  error,
  onRefresh,
  isAutoRefreshEnabled = true
}) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    
    if (diffMinutes < 1) {
      return 'Just now'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isAutoRefreshEnabled ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">
            Dashboard Status
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
        </div>
        
        {error && (
          <Badge variant="destructive" className="text-xs">
            Connection Error
          </Badge>
        )}
        
        {isLoading && (
          <Badge variant="secondary" className="text-xs">
            Updating...
          </Badge>
        )}
        
        {!error && !isLoading && isAutoRefreshEnabled && (
          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
            Live
          </Badge>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-8 px-3"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}

export default DashboardStatus
