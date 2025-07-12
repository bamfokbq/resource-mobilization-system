'use client';

import React, { useState } from 'react';
import { useDashboardData, useInvalidateDashboard, useRefreshDashboard } from '@/hooks/useDashboardData';
import { useCreateSurvey, useDeleteSurvey } from '@/hooks/useSurveyMutations';
import DashboardStats from './DashboardStats';
import { RiRefreshLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri';

interface RealTimeDashboardProps {
  userId: string;
}

export default function RealTimeDashboard({ userId }: RealTimeDashboardProps) {
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Main dashboard data with real-time refetching
  const {
    data: dashboardData,
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
    refetch
  } = useDashboardData(userId, {
    enabled: !!userId,
    refetchInterval: autoRefresh ? 30000 : undefined, // Refetch every 30 seconds when enabled
    refetchOnWindowFocus: true,
  });

  // Mutation hooks
  const createSurveyMutation = useCreateSurvey(userId);
  const deleteSurveyMutation = useDeleteSurvey(userId);
  
  // Utility hooks
  const invalidateDashboard = useInvalidateDashboard();
  const refreshDashboard = useRefreshDashboard();

  const handleCreateSurvey = async () => {
    try {
      await createSurveyMutation.mutateAsync({
        projectName: `New Project ${Date.now()}`,
        description: 'Sample project description',
      });
    } catch (error) {
      console.error('Failed to create survey:', error);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      await deleteSurveyMutation.mutateAsync(surveyId);
    } catch (error) {
      console.error('Failed to delete survey:', error);
    }
  };

  const handleManualRefresh = () => {
    refreshDashboard(userId);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-700 font-semibold">Error loading dashboard</h3>
        <p className="text-red-600">{error?.message}</p>
        <button
          onClick={handleManualRefresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Controls */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">Real-time Dashboard</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isFetching ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isFetching ? 'Syncing...' : 'Connected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={toggleAutoRefresh}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Auto-refresh (30s)</span>
            </label>
            
            <button
              onClick={handleManualRefresh}
              disabled={isFetching}
              className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Manual refresh"
            >
              <RiRefreshLine className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {dataUpdatedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Demo Actions */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Demo Actions</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateSurvey}
            disabled={createSurveyMutation.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <RiAddLine className="w-4 h-4" />
            <span>
              {createSurveyMutation.isPending ? 'Creating...' : 'Create Survey'}
            </span>
          </button>
          
          {dashboardData && dashboardData.userSurveys && dashboardData.userSurveys.length > 0 && (
            <button
              onClick={() => handleDeleteSurvey(dashboardData.userSurveys[0]._id)}
              disabled={deleteSurveyMutation.isPending}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              <RiDeleteBinLine className="w-4 h-4" />
              <span>
                {deleteSurveyMutation.isPending ? 'Deleting...' : 'Delete First Survey'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && !isLoading && (
        <DashboardStats metrics={dashboardData.metrics} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mutation Status */}
      {(createSurveyMutation.error || deleteSurveyMutation.error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            {createSurveyMutation.error?.message || deleteSurveyMutation.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}
