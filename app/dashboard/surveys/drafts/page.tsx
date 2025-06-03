"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { getUserDraft, deleteDraft } from '@/actions/surveyActions';
import { useFormStore } from '@/store/useFormStore';
import { toast } from 'sonner';

interface DraftInfo {
  _id: string;
  userId: string;
  lastSaved: Date;
  formData: any;
  currentStep: string;
  progress: number;
}

export default function DraftManagementPage() {
  const [draft, setDraft] = useState<DraftInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { loadUserDraft, clearDraft } = useFormStore();

  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    setIsLoading(true);
    try {
      const result = await getUserDraft();
      if (result.success && result.draft) {
        setDraft(result.draft);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      toast.error('Failed to load draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueDraft = async () => {
    if (!draft) return;
    
    const toastId = toast.loading('Loading your draft...');
    
    try {
      const success = await loadUserDraft();
      if (success) {
        toast.success('Draft loaded successfully', {
          id: toastId,
          duration: 2000,
        });
        router.push('/dashboard/surveys/form');
      } else {
        toast.error('Failed to load draft', {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to load draft', {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const handleDeleteDraft = async () => {
    if (!draft) return;
    
    setIsDeleting(true);
    const toastId = toast.loading('Deleting draft...');
    
    try {
      const result = await deleteDraft();
      if (result.success) {
        toast.success('Draft deleted successfully', {
          id: toastId,
          duration: 2000,
        });
        await clearDraft();
        setDraft(null);
      } else {
        toast.error('Failed to delete draft', {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to delete draft', {
        id: toastId,
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStepDisplayName = (step: string) => {
    const stepNames: Record<string, string> = {
      organisation: 'Organisation Information',
      project: 'Project Information',
      activities: 'Project Activities',
      partners: 'Partners Information',
      additional: 'Additional Information',
      final: 'Final Review'
    };
    return stepNames[step] || step;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Survey Drafts</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Drafts</h1>
          <p className="text-gray-600 mt-1">
            Manage your saved survey drafts and continue where you left off
          </p>
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard/surveys/form')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          New Survey
        </Button>
      </div>

      {!draft ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Drafts Found
                </h3>
                <p className="text-gray-500 mb-6">
                  You don't have any saved survey drafts yet. Start a new survey to begin collecting data.
                </p>
                <Button 
                  onClick={() => router.push('/dashboard/surveys/form')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Start New Survey
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Survey Draft</span>
              </CardTitle>
              <Badge className={getProgressColor(draft.progress)}>
                {draft.progress}% Complete
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Draft Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Last Saved</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {new Date(draft.lastSaved).toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Current Step</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {getStepDisplayName(draft.currentStep)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Progress</span>
              </div>
              <div className="ml-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${draft.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                    {draft.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Organization Info Preview */}
            {draft.formData.organisationInfo && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Organisation</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {draft.formData.organisationInfo.organisationName || 'Not specified'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button 
                onClick={handleContinueDraft}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Continue Editing
              </Button>
              
              <Button 
                onClick={handleDeleteDraft}
                variant="outline"
                disabled={isDeleting}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Draft
                  </>
                )}
              </Button>
            </div>

            {/* Warning */}
            <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>Note:</strong> Drafts are automatically saved while you work. 
                You can safely close your browser and return later to continue.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
