"use client";

import React, { useState } from 'react';
import { partnerMappingDataSchema, PartnerMappingData } from '@/schemas/partnerMappingSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Users, MapPin, Calendar, Building2, FileText, AlertCircle, CheckCircle2, Sparkles, ArrowRight, Target, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { WORK_NATURE_OPTIONS, DISEASE_OPTIONS, YEAR_OPTIONS, REGION_OPTIONS } from '@/types/partner-mapping';

interface PartnerMappingFormProps {
  onSubmit: (data: PartnerMappingData[]) => Promise<void>;
  onSaveDraft?: (data: PartnerMappingData[]) => Promise<void>;
  initialData?: PartnerMappingData[];
  isLoading?: boolean;
}

export default function PartnerMappingForm({ 
  onSubmit, 
  onSaveDraft, 
  initialData = [], 
  isLoading = false 
}: PartnerMappingFormProps) {
  const [partnerMappings, setPartnerMappings] = useState<PartnerMappingData[]>(
    initialData.length > 0 ? initialData : [createEmptyPartnerMapping()]
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);


  function createEmptyPartnerMapping(): PartnerMappingData {
    return {
      year: 2024,
      workNature: 'PROJECT',
      organization: '',
      projectName: '',
      projectRegion: 'GREATER ACCRA',
      district: '',
      disease: 'ALL NCDS - NOT DISEASE SPECIFIC',
      partner: '',
      role: '',
    };
  }

  const addPartnerMapping = () => {
    setPartnerMappings([...partnerMappings, createEmptyPartnerMapping()]);
    
    // Show success toast for adding new partner mapping
    toast.success('New Partner Mapping Added', {
      description: `Partner mapping ${partnerMappings.length + 1} has been added to your form`,
      duration: 2000,
    });
  };

  const removePartnerMapping = (index: number) => {
    if (partnerMappings.length > 1) {
      const removedMapping = partnerMappings[index];
      setPartnerMappings(partnerMappings.filter((_, i) => i !== index));
      
      // Show confirmation toast for removing partner mapping
      toast.success('Partner Mapping Removed', {
        description: `Partner mapping ${index + 1}${removedMapping.organization ? ` (${removedMapping.organization})` : ''} has been removed`,
        duration: 2000,
      });
    } else {
      // Show warning toast if trying to remove the last mapping
      toast.warning('Cannot Remove Last Mapping', {
        description: 'At least one partner mapping is required',
        duration: 3000,
      });
    }
  };

  const updatePartnerMapping = (index: number, field: keyof PartnerMappingData, value: any) => {
    const updated = [...partnerMappings];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerMappings(updated);
    
    // Clear validation errors for this specific field when user starts typing
    if (validationErrors[`mapping-${index}`]) {
      const fieldErrors = validationErrors[`mapping-${index}`].filter(error => 
        !error.toLowerCase().includes(field.toLowerCase())
      );
      
      if (fieldErrors.length === 0) {
        const newErrors = { ...validationErrors };
        delete newErrors[`mapping-${index}`];
        setValidationErrors(newErrors);
      } else {
        setValidationErrors({
          ...validationErrors,
          [`mapping-${index}`]: fieldErrors
        });
      }
    }
  };

  const validateForm = async () => {
    const errors: Record<string, string[]> = {};
    
    for (let i = 0; i < partnerMappings.length; i++) {
      try {
        await partnerMappingDataSchema.parseAsync(partnerMappings[i]);
      } catch (error: any) {
        if (error.errors) {
          errors[`mapping-${i}`] = error.errors.map((err: any) => err.message);
        }
      }
    }
    
    setValidationErrors(errors);
    
    // Show validation error toast if there are errors
    if (Object.keys(errors).length > 0) {
      const totalErrors = Object.values(errors).flat().length;
      toast.error('Validation Errors Found', {
        description: `Please fix ${totalErrors} error${totalErrors !== 1 ? 's' : ''} in ${Object.keys(errors).length} partner mapping${Object.keys(errors).length !== 1 ? 's' : ''}`,
        duration: 5000,
      });
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToastId = toast.loading('Submitting partner mappings...', {
      description: `Processing ${partnerMappings.length} partner mapping${partnerMappings.length !== 1 ? 's' : ''}`,
    });
    
    try {
      const isValid = await validateForm();
      
      if (!isValid) {
        toast.error('Validation Failed', {
          description: 'Please fix the highlighted errors before submitting',
          id: loadingToastId,
        });
        return;
      }

      await onSubmit(partnerMappings);
      setValidationErrors({});
      
      // Show success toast with detailed information
      toast.success('Partner Mappings Submitted Successfully!', {
        description: `Successfully submitted ${partnerMappings.length} partner mapping${partnerMappings.length !== 1 ? 's' : ''} for ${partnerMappings.length > 0 ? partnerMappings[0].year : 'the selected year'}`,
        id: loadingToastId,
        duration: 5000,
        action: {
          label: 'View Details',
          onClick: () => {
            // Navigate to admin dashboard partner mapping page
            window.location.href = '/admin/dashboard/partner-mapping';
          },
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission Failed', {
        description: 'An error occurred while submitting your partner mappings. Please try again.',
        id: loadingToastId,
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(),
        },
      });
      // Don't clear validation errors on submission failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      setIsSavingDraft(true);
      
      // Show loading toast
      const loadingToastId = toast.loading('Saving draft...', {
        description: 'Storing your progress locally',
      });
      
      try {
        await onSaveDraft(partnerMappings);
        toast.success('Draft Saved Successfully!', {
          description: `Your ${partnerMappings.length} partner mapping${partnerMappings.length !== 1 ? 's' : ''} have been saved as a draft`,
          id: loadingToastId,
          duration: 3000,
        });
      } catch (error) {
        console.error('Save draft error:', error);
        toast.error('Failed to Save Draft', {
          description: 'An error occurred while saving your draft. Please try again.',
          id: loadingToastId,
          duration: 4000,
          action: {
            label: 'Retry',
            onClick: () => handleSaveDraft(),
          },
        });
      } finally {
        setIsSavingDraft(false);
      }
    }
  };

  const getFieldError = (mappingIndex: number, fieldName: string) => {
    const mappingErrors = validationErrors[`mapping-${mappingIndex}`] || [];
    return mappingErrors.find(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };

  const getFieldErrorCount = (mappingIndex: number) => {
    return validationErrors[`mapping-${mappingIndex}`]?.length || 0;
  };

  const hasFieldError = (mappingIndex: number, fieldName: string) => {
    return !!getFieldError(mappingIndex, fieldName);
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-green-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-green-600 rounded-2xl shadow-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-green-900">
                    Partner Mapping Form
                  </h1>
                  <p className="text-green-700 text-lg font-medium mt-2">
                    Map partners to projects and initiatives across different regions and disease areas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span>Professional partnership management made simple</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {onSaveDraft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || isSavingDraft}
                  className="min-w-[140px] border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              <Button
                type="button"
                onClick={addPartnerMapping}
                disabled={isLoading || isSubmitting || isSavingDraft}
                className="bg-green-600 hover:bg-green-700 min-w-[160px] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  {partnerMappings.length} Partner{partnerMappings.length !== 1 ? 's' : ''} Added
                </span>
              </div>
              {getFieldErrorCount(0) > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {Object.keys(validationErrors).length} mapping{Object.keys(validationErrors).length !== 1 ? 's' : ''} with errors
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                {partnerMappings.length} mapping{partnerMappings.length !== 1 ? 's' : ''}
              </Badge>
              {(isSubmitting || isSavingDraft) && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  <span className="text-sm font-medium">
                    {isSubmitting ? 'Submitting...' : 'Saving...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Partner Mappings */}
        <div className="space-y-8">
          {partnerMappings.map((mapping, index) => (
            <Card key={index} className="overflow-hidden border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-green-50 border-b border-green-200 relative overflow-hidden">
                <div className="flex flex-row items-center justify-between relative">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="p-3 bg-green-600 rounded-xl shadow-sm">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-green-900">
                        Partner Mapping {index + 1}
                      </CardTitle>
                      <p className="text-sm text-green-700 mt-1 font-medium">
                        {mapping.organization || 'New partner mapping'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getFieldErrorCount(index) > 0 && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {getFieldErrorCount(index)} error{getFieldErrorCount(index) !== 1 ? 's' : ''} found
                        </span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    {partnerMappings.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removePartnerMapping(index)}
                        disabled={isLoading}
                        className="hover:bg-red-600 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Year *
                      </label>
                      <Select
                        value={mapping.year.toString()}
                        onValueChange={(value) => updatePartnerMapping(index, 'year', parseInt(value))}
                      >
                        <SelectTrigger 
                          className={hasFieldError(index, 'year') ? 'border-red-500 focus:border-red-500 ring-red-200' : ''}
                          aria-label="Select year"
                          aria-invalid={hasFieldError(index, 'year')}
                        >
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEAR_OPTIONS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {hasFieldError(index, 'year') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{getFieldError(index, 'year')}</span>
                        </p>
                      )}
                    </div>

                    {/* Work Nature */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Work Nature *
                      </label>
                      <Select
                        value={mapping.workNature}
                        onValueChange={(value) => updatePartnerMapping(index, 'workNature', value)}
                      >
                        <SelectTrigger className={hasFieldError(index, 'workNature') ? 'border-red-500 focus:border-red-500 ring-red-200' : ''}>
                          <SelectValue placeholder="Select work nature" />
                        </SelectTrigger>
                        <SelectContent>
                          {WORK_NATURE_OPTIONS.map((nature) => (
                            <SelectItem key={nature} value={nature}>
                              {nature}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {hasFieldError(index, 'workNature') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{getFieldError(index, 'workNature')}</span>
                        </p>
                      )}
                    </div>

                    {/* Organization */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        Organization *
                      </label>
                      <Input
                        value={mapping.organization}
                        onChange={(e) => updatePartnerMapping(index, 'organization', e.target.value)}
                        placeholder="Enter organization name"
                        className={hasFieldError(index, 'organization') ? 'border-red-500 focus:border-red-500 ring-red-200' : ''}
                        aria-label="Organization name"
                        aria-invalid={!!getFieldError(index, 'organization')}
                        aria-describedby={getFieldError(index, 'organization') ? `org-error-${index}` : undefined}
                      />
                      {hasFieldError(index, 'organization') && (
                        <p id={`org-error-${index}`} className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200" role="alert">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{getFieldError(index, 'organization')}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Project Name *
                      </label>
                      <Input
                        value={mapping.projectName}
                        onChange={(e) => updatePartnerMapping(index, 'projectName', e.target.value)}
                        placeholder="Enter project name"
                        className={getFieldError(index, 'projectName') ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {getFieldError(index, 'projectName') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'projectName')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                {/* Location Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Location Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Project Region */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Project Region *
                      </label>
                      <Select
                        value={mapping.projectRegion}
                        onValueChange={(value) => updatePartnerMapping(index, 'projectRegion', value)}
                      >
                        <SelectTrigger className={getFieldError(index, 'projectRegion') ? 'border-red-500 focus:border-red-500' : ''}>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGION_OPTIONS.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getFieldError(index, 'projectRegion') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'projectRegion')}
                        </p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        District
                      </label>
                      <Input
                        value={mapping.district || ''}
                        onChange={(e) => updatePartnerMapping(index, 'district', e.target.value)}
                        placeholder="Enter district (optional)"
                        className={getFieldError(index, 'district') ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {getFieldError(index, 'district') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'district')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                {/* Partner Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Partner Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Disease */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Disease Focus *
                      </label>
                      <Select
                        value={mapping.disease}
                        onValueChange={(value) => updatePartnerMapping(index, 'disease', value)}
                      >
                        <SelectTrigger className={getFieldError(index, 'disease') ? 'border-red-500 focus:border-red-500' : ''}>
                          <SelectValue placeholder="Select disease" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISEASE_OPTIONS.map((disease) => (
                            <SelectItem key={disease} value={disease}>
                              {disease}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getFieldError(index, 'disease') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'disease')}
                        </p>
                      )}
                    </div>

                    {/* Partner */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Partner Name *
                      </label>
                      <Input
                        value={mapping.partner}
                        onChange={(e) => updatePartnerMapping(index, 'partner', e.target.value)}
                        placeholder="Enter partner name"
                        className={getFieldError(index, 'partner') ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {getFieldError(index, 'partner') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'partner')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Partner Role *
                    </label>
                    <Textarea
                      value={mapping.role}
                      onChange={(e) => updatePartnerMapping(index, 'role', e.target.value)}
                      placeholder="Describe the partner's role in detail"
                      rows={4}
                      className={getFieldError(index, 'role') ? 'border-red-500 focus:border-red-500' : ''}
                      aria-label="Partner role description"
                      aria-invalid={!!getFieldError(index, 'role')}
                      aria-describedby={getFieldError(index, 'role') ? `role-error-${index}` : undefined}
                    />
                    {getFieldError(index, 'role') && (
                      <p id={`role-error-${index}`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError(index, 'role')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-900">Ready to submit your partner mappings?</p>
                  <p className="text-sm text-green-700">
                    {partnerMappings.length} partner{partnerMappings.length !== 1 ? 's' : ''} will be submitted
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {onSaveDraft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || isSavingDraft}
                  className="w-full sm:w-auto min-w-[140px] border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isSubmitting || isSavingDraft}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 min-w-[200px] shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="flex items-center gap-2">
                      Submitting...
                      <span className="text-xs opacity-75">
                        ({partnerMappings.length} mapping{partnerMappings.length !== 1 ? 's' : ''})
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="flex items-center gap-2">
                      Submit Partner Mappings
                      <span className="text-xs opacity-75">
                        ({partnerMappings.length} mapping{partnerMappings.length !== 1 ? 's' : ''})
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
