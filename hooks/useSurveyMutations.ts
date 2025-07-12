import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardData } from '@/lib/dashboard/types';

// Types for survey operations
interface CreateSurveyInput {
  projectName: string;
  description: string;
  // Add other survey fields as needed
}

interface UpdateSurveyInput {
  surveyId: string;
  updates: Partial<CreateSurveyInput>;
}

// API functions for mutations
async function createSurvey(input: CreateSurveyInput) {
  const response = await fetch('/api/surveys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create survey');
  }
  
  return response.json();
}

async function updateSurvey(input: UpdateSurveyInput) {
  const response = await fetch(`/api/surveys/${input.surveyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input.updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update survey');
  }
  
  return response.json();
}

async function deleteSurvey(surveyId: string) {
  const response = await fetch(`/api/surveys/${surveyId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete survey');
  }
  
  return response.json();
}

/**
 * Hook for creating a new survey with optimistic updates
 */
export function useCreateSurvey(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSurvey,
    onMutate: async (newSurvey) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dashboard', userId] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<DashboardData>(['dashboard', userId]);
      
      // Optimistically update the dashboard
      if (previousData) {
        queryClient.setQueryData<DashboardData>(['dashboard', userId], {
          ...previousData,
          metrics: {
            ...previousData.metrics,
            totalSurveys: previousData.metrics.totalSurveys + 1,
            inProgressSurveys: previousData.metrics.inProgressSurveys + 1,
          },
        });
      }
      
      return { previousData };
    },
    onError: (err, newSurvey, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['dashboard', userId], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    },
  });
}

/**
 * Hook for updating a survey with optimistic updates
 */
export function useUpdateSurvey(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateSurvey,
    onSuccess: () => {
      // Invalidate dashboard data on success
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    },
  });
}

/**
 * Hook for deleting a survey with optimistic updates
 */
export function useDeleteSurvey(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSurvey,
    onMutate: async (surveyId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dashboard', userId] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<DashboardData>(['dashboard', userId]);
      
      // Optimistically remove the survey
      if (previousData) {
        const updatedSurveys = previousData.userSurveys.filter(
          survey => survey._id !== surveyId
        );
        
        queryClient.setQueryData<DashboardData>(['dashboard', userId], {
          ...previousData,
          userSurveys: updatedSurveys,
          metrics: {
            ...previousData.metrics,
            totalSurveys: updatedSurveys.length,
          },
        });
      }
      
      return { previousData };
    },
    onError: (err, surveyId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['dashboard', userId], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    },
  });
}

/**
 * Hook for batch operations on surveys
 */
export function useBatchSurveyOperations(userId: string) {
  const queryClient = useQueryClient();
  
  const batchUpdate = useMutation({
    mutationFn: async (operations: Array<{ type: 'update' | 'delete'; surveyId: string; data?: any }>) => {
      const promises = operations.map(op => {
        if (op.type === 'update') {
          return updateSurvey({ surveyId: op.surveyId, updates: op.data });
        } else {
          return deleteSurvey(op.surveyId);
        }
      });
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    },
  });
  
  return { batchUpdate };
}
