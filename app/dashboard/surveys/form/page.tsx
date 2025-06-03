"use client";

import React, { useEffect, useState } from 'react';
import FormSidebar from '@/components/forms/surveys/FormSidebar';
import AdditionalInfoForm from '@/components/forms/surveys/AdditionalInfoForm';
import FinalSubmissionForm from '@/components/forms/surveys/FinalSubmissionForm';
import OrganisationInfoForm from '@/components/forms/surveys/OrganisationInfoForm';
import PartnersInfoForm from '@/components/forms/surveys/PartnersInfoForm';
import ProjectActivitiesForm from '@/components/forms/surveys/ProjectActivitiesForm';
import ProjectInfoForm from '@/components/forms/surveys/ProjectInfoForm';
import { useFormStore } from '@/store/useFormStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SurveyFormPage() {
  const { 
    activeForm, 
    setActiveForm, 
    handleNext, 
    handlePrevious, 
    isFirstStep,
    getFormProgress,
    saveAsDraft,
    loadUserDraft,
    clearDraft,
    formData,
    draftInfo,
    hasDraft,
    isLoading
  } = useFormStore();

  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing draft on component mount
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        const hasDraftData = await loadUserDraft();
        if (hasDraftData) {
          setShowDraftPrompt(true);
        }
      } catch (error) {
        console.error('Failed to check for draft:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      checkForDraft();
    }
  }, [loadUserDraft, isInitialized]);

  const handleLoadDraft = async () => {
    const toastId = toast.loading('Loading your draft...');
    
    try {
      const success = await loadUserDraft();
      if (success) {
        toast.success('Draft loaded successfully', {
          id: toastId,
          duration: 2000,
        });
        setShowDraftPrompt(false);
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

  const handleDiscardDraft = async () => {
    const toastId = toast.loading('Discarding draft...');
    
    try {
      const success = await clearDraft();
      if (success) {
        toast.success('Draft discarded', {
          id: toastId,
          duration: 2000,
        });
      }
      setShowDraftPrompt(false);
    } catch (error) {
      toast.error('Failed to discard draft', {
        id: toastId,
        duration: 3000,
      });
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      // Only auto-save if there's meaningful data
      if (formData.organisationInfo || formData.projectInfo) {
        try {
          await saveAsDraft();
          console.log('Auto-saved successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    // Auto-save every 2 minutes
    const autoSaveInterval = setInterval(autoSave, 120000);

    // Auto-save before page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.organisationInfo || formData.projectInfo) {
        autoSave();
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, saveAsDraft]);

  const renderForm = () => {
    const formProps = {
      handleNext,
      handlePrevious,
      isFirstStep
    };

    const forms = {
      organisation: OrganisationInfoForm,
      project: ProjectInfoForm,
      activities: ProjectActivitiesForm,
      partners: PartnersInfoForm,
      additional: AdditionalInfoForm,
      final: FinalSubmissionForm
    };

    const FormComponent = forms[activeForm] || forms.organisation;
    return <FormComponent {...formProps} />;
  };

  const progress = getFormProgress();

  const handleManualSave = async () => {
    const toastId = toast.loading('Saving draft...');
    
    try {
      const success = await saveAsDraft();
      
      if (success) {
        toast.success('Draft saved successfully', {
          id: toastId,
          duration: 2000,
        });
      } else {
        toast.error('Failed to save draft', {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to save draft', {
        id: toastId,
        duration: 3000,
      });
    }
  };
  return (
    <div className="space-y-4">
      {/* Draft Recovery Prompt */}
      {showDraftPrompt && draftInfo && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 mb-1">
                  Saved Draft Found
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  We found a draft from {new Date(draftInfo.lastSaved).toLocaleString()}. 
                  Would you like to continue where you left off?
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleLoadDraft}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Continue Draft'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDiscardDraft}
                    disabled={isLoading}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Start Fresh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-gray-900">Survey Form</h1>
              <Badge variant="secondary" className="text-xs">
                Step {['organisation', 'project', 'activities', 'partners', 'additional', 'final'].indexOf(activeForm) + 1} of 6
              </Badge>
              {hasDraft && draftInfo && (
                <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                  Draft Available
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Auto-saving</span>
              </div>
              
              <button
                onClick={handleManualSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-md transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? 'Saving...' : 'Save Draft'}</span>
              </button>
            </div>
          </div>
            <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
              {progress}%
            </span>
          </div>
          
          {hasDraft && draftInfo && (
            <p className="text-xs text-green-600 mt-2">
              Last saved: {new Date(draftInfo.lastSaved).toLocaleString()}
            </p>
          )}
          
          {progress < 50 && (
            <p className="text-xs text-amber-600 mt-2">
              Complete more sections to improve your progress score
            </p>
          )}
        </CardContent>
      </Card>

      {/* Main Form Section */}
      <section className='bg-white h-[75dvh] 2xl:h-[80dvh] rounded-lg p-4 flex shadow-lg w-full'>
        <FormSidebar
          activeForm={activeForm}
          onFormChange={setActiveForm}
        />
        <ScrollArea className='bg-gray-50 h-auto flex-1 rounded-r-lg p-6'>
          {renderForm()}
        </ScrollArea>
      </section>
    </div>
  );
}
