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
import { Clock, RefreshCw, AlertTriangle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

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
        const { formData } = usePartnerMappingStore.getState();
        const totalMappings = formData.partnerMappings.length;
        
        toast.success('Draft Loaded Successfully!', {
          id: toastId,
          description: `Loaded ${totalMappings} partner mapping${totalMappings !== 1 ? 's' : ''} from your saved draft`,
          duration: 3000,
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
        // Create detailed success message
        const totalMappings = partnerMappings.length;
        const organizations = [...new Set(partnerMappings.map(m => m.organization))];
        const regions = [...new Set(partnerMappings.map(m => m.projectRegion))];
        const diseases = [...new Set(partnerMappings.map(m => m.disease))];
        
        toast.success('Partner Mappings Submitted Successfully!', {
          description: (
            <div className="space-y-1">
              <div className="font-medium">Partner Mapping ID: {result.partnerMappingId}</div>
              <div className="text-sm opacity-90">
                {totalMappings} mapping{totalMappings !== 1 ? 's' : ''} submitted
              </div>
              <div className="text-xs opacity-75">
                Organizations: {organizations.length} • Regions: {regions.length} • Diseases: {diseases.length}
              </div>
            </div>
          ),
          duration: 8000,
          action: {
            label: 'View Details',
            onClick: () => {
              router.push('/admin/dashboard/partner-mapping');
            },
          },
        });
        
        // Reset the form after successful submission
        resetForm();
        
        // Redirect to admin dashboard partner mapping page after a short delay
        setTimeout(() => {
          router.push('/admin/dashboard/partner-mapping');
        }, 2000);
      } else {
        console.error('Submission failed:', result);
        toast.error('Submission failed', {
          description: result.message || 'An error occurred during submission',
          duration: 5000,
        });
        
        if (result.errors && Object.keys(result.errors).length > 0) {
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
      <div className="flex items-center justify-center min-h-[500px] p-4">
        <Card className="w-full max-w-lg bg-white border-red-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Error Loading Form</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-green-900">Loading Form</h3>
              <p className="text-green-700">Preparing your partner mapping experience...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Draft Prompt */}
      {showDraftPrompt && (
        <Card className="border-green-200 bg-green-50 shadow-lg">
          <CardHeader className="relative overflow-hidden">
            <CardTitle className="flex items-center gap-3 text-green-800">
              <div className="relative">
                <div className="p-2 bg-green-600 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <span className="text-2xl font-bold">Draft Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 text-lg font-medium mb-2">
                  You have a saved draft of your partner mapping form.
                </p>
                <p className="text-green-700">
                  Would you like to continue where you left off, or start with a fresh form?
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleLoadDraft} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Load Draft
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDiscardDraft}
                disabled={isLoading}
                className="border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300"
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
