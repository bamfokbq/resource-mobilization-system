"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PartnerMappingForm from '@/components/forms/partner-mapping/PartnerMappingForm';
import { usePartnerMappingStore } from '@/store/usePartnerMappingStore';
import { submitPartnerMappingData } from '@/actions/partnerMappingActions';
import { PartnerMappingData } from '@/schemas/partnerMappingSchema';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';

export default function PartnerMappingFormPageClient() {
  const [error, setError] = useState<string | null>(null);
  
  const { 
    formData, 
    updateFormData, 
    resetForm, 
    saveAsDraft, 
    loadUserDraft, 
    clearDraft, 
    isLoading, 
    hasDraft 
  } = usePartnerMappingStore();
  
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
        setError('Failed to load form data. Please try again.');
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
        setShowDraftPrompt(false);
      } else {
        toast.error('Failed to discard draft', {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to discard draft', {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (partnerMappings: PartnerMappingData[]) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitPartnerMappingData({ partnerMappings });
      
      if (result.success) {
        toast.success('Partner mapping submitted successfully!', {
          description: `Partner Mapping ID: ${result.partnerMappingId}`,
          duration: 5000,
        });
        
        // Reset the form after successful submission
        resetForm();
        
        // Redirect to success page with partner mapping ID
        router.push(`/dashboard/partner-mapping/success?partnerMappingId=${result.partnerMappingId}` as any);
      } else {
        toast.error('Submission failed', {
          description: result.message,
          duration: 5000,
        });
        
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred', {
        description: 'Please try again or contact support',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (partnerMappings: PartnerMappingData[]) => {
    try {
      updateFormData({ partnerMappings });
      await saveAsDraft();
    } catch (error) {
      console.error('Save draft error:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Form</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Draft Prompt */}
      {showDraftPrompt && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <Clock className="w-5 h-5" />
              <span>Draft Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              You have a saved draft of your partner mapping form. Would you like to continue where you left off?
            </p>
            <div className="flex space-x-2">
              <Button onClick={handleLoadDraft} disabled={isLoading}>
                Load Draft
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDiscardDraft}
                disabled={isLoading}
              >
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <PartnerMappingForm
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        initialData={formData.partnerMappings}
        isLoading={isSubmitting || isLoading}
      />
    </div>
  );
}
