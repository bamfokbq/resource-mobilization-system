"use client";

import React, { useState } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { submitSurveyData } from '@/actions/surveyActions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Download, Save, Eye, FileText, Users, Building2, Target, Shield, BarChart3, Clock, DollarSign, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Enhanced Header with Glass Effect */}
        <div className="text-center space-y-4 relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg -z-10"></div>
          <div className="p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Review and Submit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please review your information before submitting the survey. All data has been validated and is ready for submission.
            </p>

            {/* Enhanced Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="w-full max-w-lg bg-gray-200 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-in-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right min-w-[4rem]">
                <span className="text-lg font-bold text-gray-800">{progress}%</span>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Validation Status */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-800">Form Validation Status</span>
                <p className="text-sm text-gray-600 font-normal mt-1">Review completion status for each section</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { step: 'organisation', label: 'Organisation Info', required: true, icon: Building2 },
                { step: 'project', label: 'Project Info', required: true, icon: Target },
                { step: 'activities', label: 'Project Activities', required: false, icon: BarChart3 },
                { step: 'partners', label: 'Partners Info', required: false, icon: Users },
                { step: 'additional', label: 'Additional Info', required: true, icon: FileText },
              ].map(({ step, label, required, icon: Icon }) => {
                const isValid = isFormValid(step as any);
                return (
                  <div key={step} className={`p-4 rounded-lg border-2 transition-all duration-200 ${isValid
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                    }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${isValid ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                        <Icon className={`h-5 w-5 ${isValid ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${isValid ? 'text-green-700' : 'text-yellow-700'
                            }`}>
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {required && (
                            <Badge variant="outline" className="text-xs border-red-200 text-red-600">
                              Required
                            </Badge>
                          )}
                          <Badge variant={isValid ? "default" : "secondary"} className="text-xs">
                            {isValid ? "Complete" : "Incomplete"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Enhanced Organization Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xl font-semibold text-gray-800">Organization Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organization Name</p>
                      <p className="text-gray-800 font-semibold">{formData.organisationInfo?.organisationName || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Region</p>
                      <p className="text-gray-800">{formData.organisationInfo?.region || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sector</p>
                      <p className="text-gray-800">{formData.organisationInfo?.sector || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone (HQ)</p>
                      <p className="text-gray-800">{formData.organisationInfo?.hqPhoneNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{formData.organisationInfo?.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {formData.organisationInfo?.website && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <p className="text-blue-600 hover:underline">{formData.organisationInfo.website}</p>
                      </div>
                    </div>
                  )}

                  {formData.organisationInfo?.ghanaPostGPS && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ghana Post GPS</p>
                        <p className="text-gray-800">{formData.organisationInfo.ghanaPostGPS}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Enhanced Project Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-xl font-semibold text-gray-800">Project Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Target className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Project Name</p>
                      <p className="text-gray-800 font-semibold">{formData.projectInfo?.projectName || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Projects</p>
                      <p className="text-gray-800">{formData.projectInfo?.totalProjects || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p className="text-gray-800">{formData.projectInfo?.startDate || 'Not provided'}</p>
                    </div>
                  </div>

                  {formData.projectInfo?.endDate && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Date</p>
                        <p className="text-gray-800">{formData.projectInfo.endDate}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Funding Source</p>
                      <p className="text-gray-800">{formData.projectInfo?.fundingSource || 'Not provided'}</p>
                    </div>
                  </div>

                  {formData.projectInfo?.estimatedBudget && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget</p>
                        <p className="text-gray-800 font-semibold">GHS {formData.projectInfo.estimatedBudget}</p>
                      </div>
                    </div>
                  )}

                  {formData.projectInfo?.regions && formData.projectInfo.regions.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="w-full">
                        <p className="text-sm font-medium text-gray-500 mb-2">Regions</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.projectInfo.regions.map((region) => (
                            <Badge key={region} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.projectInfo?.targetedNCDs && formData.projectInfo.targetedNCDs.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="w-full">
                        <p className="text-sm font-medium text-gray-500 mb-2">Targeted NCDs</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.projectInfo.targetedNCDs.map((ncd) => (
                            <Badge key={ncd} variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                              {ncd}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Project Goal */}
        {formData.projectInfo?.projectGoal && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-xl font-semibold text-gray-800">Project Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-300">
                <p className="text-gray-700 leading-relaxed">{formData.projectInfo.projectGoal}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Activities Summary */}
        {formData.activities && formData.activities.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-800">Project Activities</span>
                  <p className="text-sm text-gray-600 font-normal mt-1">{formData.activities.length} activities planned</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="relative p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-300 hover:shadow-md transition-all duration-200">
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          Activity {index + 1}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 pr-20">{activity.name}</h4>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">{activity.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center space-x-1 bg-white/70 px-3 py-1 rounded-full">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600">Timeline: {activity.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/70 px-3 py-1 rounded-full">
                          <DollarSign className="h-3 w-3 text-gray-500" />
                          <span className="font-medium text-gray-700">Budget: ${activity.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Partners Summary */}
        {formData.partners && formData.partners.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 rounded-full">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-800">Project Partners</span>
                  <p className="text-sm text-gray-600 font-normal mt-1">{formData.partners.length} partner organizations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {formData.partners.map((partner, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{partner.organisationName}</h4>
                        <Badge variant="outline" className="bg-cyan-100 text-cyan-700 border-cyan-200">
                          Partner {index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Role: <span className="font-medium text-gray-800">{partner.role}</span></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Contact: <span className="font-medium text-gray-800">{partner.contactPerson}</span></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-blue-600 hover:underline">{partner.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Additional Information */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-violet-100 rounded-full">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
              <span className="text-xl font-semibold text-gray-800">Additional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {formData.risks && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-300">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-gray-800">Risks & Mitigation</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{formData.risks}</p>
                </div>
              )}

              {formData.sustainability && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-300">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Sustainability Plan</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{formData.sustainability}</p>
                </div>
              )}

              {formData.evaluation && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-300">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Monitoring & Evaluation</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{formData.evaluation}</p>
                </div>
              )}

              {formData.notes && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-300">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-gray-800">Additional Notes</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{formData.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Enhanced Action Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-0">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-white/80 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <span>← Previous</span>
              </Button>

              <Button
                onClick={exportData}
                variant="outline"
                className="flex items-center space-x-2 bg-white/80 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-600 transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSaveAsDraft}
                variant="secondary"
                disabled={isSubmitting || isSavingDraft}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                <span>{isSavingDraft ? 'Saving...' : 'Save as Draft'}</span>
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || progress < 70}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Submit Survey</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {progress < 70 && (
          <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">
                Complete at least 70% of the form to submit. Current progress: {progress}%
              </p>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}
