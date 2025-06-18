"use client";

import React, { useState } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { submitSurveyData } from '@/actions/surveyActions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FinalSubmissionFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function FinalSubmissionForm({ handleNext, handlePrevious }: FinalSubmissionFormProps) {
  const { formData, resetForm, saveAsDraft, getFormProgress, isFormValid } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate that all required sections are complete
      const requiredSteps = ['organisation', 'project', 'additional'] as const;
      const incompleteSteps = requiredSteps.filter(step => !isFormValid(step));
      
      if (incompleteSteps.length > 0) {
        toast.error('Please complete all required sections', {
          description: `Missing: ${incompleteSteps.join(', ')}`
        });
        setIsSubmitting(false);
        return;
      }

      // Submit the form data
      const result = await submitSurveyData(formData);
      
      if (result.success) {
        toast.success('Survey submitted successfully!', {
          description: `Survey ID: ${result.surveyId}`,
          duration: 5000,
        });
          // Reset the form after successful submission
        resetForm();
        
        // Redirect to success page with survey ID
        router.push(`/dashboard/surveys/success?surveyId=${result.surveyId}`);
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

  const handleSaveAsDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      const success = await saveAsDraft();
      
      if (success) {
        toast.success('Draft saved successfully', {
          description: 'You can continue later from where you left off',
        });
      } else {
        toast.error('Failed to save draft', {
          description: 'Please try again',
        });
      }
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const progress = getFormProgress();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Review and Submit</h2>
        <p className="text-gray-600">Please review your information before submitting the survey</p>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
      </div>

      {/* Validation Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Form Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { step: 'organisation', label: 'Organisation Info', required: true },
              { step: 'project', label: 'Project Info', required: true },
              { step: 'activities', label: 'Project Activities', required: false },
              { step: 'partners', label: 'Partners Info', required: false },
              { step: 'additional', label: 'Additional Info', required: true },
            ].map(({ step, label, required }) => {
              const isValid = isFormValid(step as any);
              return (
                <div key={step} className="flex items-center space-x-2">
                  {isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className={`text-sm ${isValid ? 'text-green-700' : 'text-yellow-700'}`}>
                    {label}
                  </span>
                  {required && <Badge variant="outline" className="text-xs">Required</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {formData.organisationInfo?.organisationName || 'Not provided'}</p>
              <p><strong>Region:</strong> {formData.organisationInfo?.region || 'Not provided'}</p>
              <p><strong>Sector:</strong> {formData.organisationInfo?.sector || 'Not provided'}</p>
              <p><strong>Phone (HQ):</strong> {formData.organisationInfo?.hqPhoneNumber || 'Not provided'}</p>
              <p><strong>Email:</strong> {formData.organisationInfo?.email || 'Not provided'}</p>
              {formData.organisationInfo?.website && (
                <p><strong>Website:</strong> {formData.organisationInfo.website}</p>
              )}
              {formData.organisationInfo?.ghanaPostGPS && (
                <p><strong>Ghana Post GPS:</strong> {formData.organisationInfo.ghanaPostGPS}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p><strong>Project Name:</strong> {formData.projectInfo?.projectName || 'Not provided'}</p>
              <p><strong>Total Projects:</strong> {formData.projectInfo?.totalProjects || 'Not provided'}</p>
              <p><strong>Start Date:</strong> {formData.projectInfo?.startDate || 'Not provided'}</p>
              {formData.projectInfo?.endDate && (
                <p><strong>End Date:</strong> {formData.projectInfo.endDate}</p>
              )}
              <p><strong>Funding Source:</strong> {formData.projectInfo?.fundingSource || 'Not provided'}</p>
              {formData.projectInfo?.estimatedBudget && (
                <p><strong>Budget:</strong> GHS {formData.projectInfo.estimatedBudget}</p>
              )}
              {formData.projectInfo?.regions && formData.projectInfo.regions.length > 0 && (
                <div>
                  <strong>Regions:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.projectInfo.regions.map((region) => (
                      <Badge key={region} variant="secondary" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.projectInfo?.targetedNCDs && formData.projectInfo.targetedNCDs.length > 0 && (
                <div>
                  <strong>Targeted NCDs:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.projectInfo.targetedNCDs.map((ncd) => (
                      <Badge key={ncd} variant="outline" className="text-xs">
                        {ncd}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Goal */}
      {formData.projectInfo?.projectGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Project Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{formData.projectInfo.projectGoal}</p>
          </CardContent>
        </Card>
      )}

      {/* Activities Summary */}
      {formData.activities && formData.activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Project Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.activities.map((activity, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Timeline: {activity.timeline}</span>
                    <span className="text-xs font-medium">Budget: ${activity.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners Summary */}
      {formData.partners && formData.partners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Project Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.partners.map((partner, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <p className="font-medium text-sm">{partner.organisationName}</p>
                  <p className="text-sm text-gray-600">Role: {partner.role}</p>
                  <p className="text-sm text-gray-600">Contact: {partner.contactPerson} ({partner.email})</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.risks && (
            <div>
              <h4 className="font-medium text-sm text-gray-800 mb-1">Risks & Mitigation</h4>
              <p className="text-sm text-gray-600">{formData.risks}</p>
            </div>
          )}
          {formData.sustainability && (
            <div>
              <h4 className="font-medium text-sm text-gray-800 mb-1">Sustainability Plan</h4>
              <p className="text-sm text-gray-600">{formData.sustainability}</p>
            </div>
          )}
          {formData.evaluation && (
            <div>
              <h4 className="font-medium text-sm text-gray-800 mb-1">Monitoring & Evaluation</h4>
              <p className="text-sm text-gray-600">{formData.evaluation}</p>
            </div>
          )}
          {formData.notes && (
            <div>
              <h4 className="font-medium text-sm text-gray-800 mb-1">Additional Notes</h4>
              <p className="text-sm text-gray-600">{formData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <div className="flex space-x-2">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={exportData}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleSaveAsDraft}
            variant="secondary"
            disabled={isSubmitting || isSavingDraft}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSavingDraft ? 'Saving...' : 'Save as Draft'}</span>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || progress < 70}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Survey</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {progress < 70 && (
        <div className="text-center">
          <p className="text-sm text-amber-600">
            Complete at least 70% of the form to submit. Current progress: {progress}%
          </p>
        </div>
      )}
    </div>
  );
}
