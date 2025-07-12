import Link from 'next/link';
import { RiSurveyLine, RiRefreshLine, RiSettings3Line } from 'react-icons/ri';

interface DashboardHeaderProps {
  userName?: string;
  enableReactQuery?: boolean;
  onToggleReactQuery?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardHeader({ 
  userName, 
  enableReactQuery = false,
  onToggleReactQuery,
  onRefresh,
  isRefreshing = false
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              {userName ? `Welcome back, ${userName}! ` : ''}
              Comprehensive survey insights and predictions
            </p>
          </div>
          
          {/* React Query Status Indicator */}
          {enableReactQuery && (
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
              }`}></div>
              <span className="text-sm text-green-700 font-medium">
                {isRefreshing ? 'Syncing...' : 'Real-time Mode'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* React Query Toggle */}
        {onToggleReactQuery && (
          <button
            onClick={onToggleReactQuery}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              enableReactQuery
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={enableReactQuery ? 'Switch to Server-side Mode' : 'Switch to Real-time Mode'}
          >
            <RiSettings3Line size={16} />
            <span>{enableReactQuery ? 'Real-time' : 'Standard'}</span>
          </button>
        )}

        {/* Manual Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
            title="Refresh dashboard data"
          >
            <RiRefreshLine className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        )}

        {/* New Survey Button */}
        <Link
          href="/dashboard/surveys/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiSurveyLine size={20} />
          Start New Survey
        </Link>
      </div>
    </div>
  );
}
