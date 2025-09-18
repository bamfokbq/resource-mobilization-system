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
import { Plus, Trash2, Save, Users, MapPin, Calendar, Building2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  };

  const removePartnerMapping = (index: number) => {
    if (partnerMappings.length > 1) {
      setPartnerMappings(partnerMappings.filter((_, i) => i !== index));
    }
  };

  const updatePartnerMapping = (index: number, field: keyof PartnerMappingData, value: any) => {
    const updated = [...partnerMappings];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerMappings(updated);
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
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isValid = await validateForm();
      
      if (!isValid) {
        toast.error('Please fix validation errors before submitting');
        return;
      }

      await onSubmit(partnerMappings);
      setValidationErrors({});
      toast.success('Partner mappings submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit partner mappings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      setIsSavingDraft(true);
      try {
        await onSaveDraft(partnerMappings);
        toast.success('Draft saved successfully');
      } catch (error) {
        console.error('Save draft error:', error);
        toast.error('Failed to save draft');
      } finally {
        setIsSavingDraft(false);
      }
    }
  };

  const getFieldError = (mappingIndex: number, fieldName: string) => {
    const mappingErrors = validationErrors[`mapping-${mappingIndex}`] || [];
    return mappingErrors.find(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Partner Mapping Form</h1>
              </div>
              <p className="text-slate-600 text-sm">
                Map partners to projects and initiatives across different regions and disease areas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {onSaveDraft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || isSavingDraft}
                  className="min-w-[120px]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              <Button
                type="button"
                onClick={addPartnerMapping}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 min-w-[140px] cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">
                {partnerMappings.length} Partner{partnerMappings.length !== 1 ? 's' : ''} Added
              </span>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              Step {partnerMappings.length} of {Math.max(partnerMappings.length, 1)}
            </Badge>
          </div>
        </div> */}

        {/* Partner Mappings */}
        <div className="space-y-6">
          {partnerMappings.map((mapping, index) => (
            <Card key={index} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-900">
                        Partner Mapping {index + 1}
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {mapping.organization || 'New partner mapping'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {validationErrors[`mapping-${index}`] && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {validationErrors[`mapping-${index}`].length} error{validationErrors[`mapping-${index}`].length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {partnerMappings.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removePartnerMapping(index)}
                        disabled={isLoading}
                        className="hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
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
                          className={getFieldError(index, 'year') ? 'border-red-500 focus:border-red-500' : ''}
                          aria-label="Select year"
                          aria-invalid={!!getFieldError(index, 'year')}
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
                      {getFieldError(index, 'year') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'year')}
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
                        <SelectTrigger className={getFieldError(index, 'workNature') ? 'border-red-500 focus:border-red-500' : ''}>
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
                      {getFieldError(index, 'workNature') && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'workNature')}
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
                        className={getFieldError(index, 'organization') ? 'border-red-500 focus:border-red-500' : ''}
                        aria-label="Organization name"
                        aria-invalid={!!getFieldError(index, 'organization')}
                        aria-describedby={getFieldError(index, 'organization') ? `org-error-${index}` : undefined}
                      />
                      {getFieldError(index, 'organization') && (
                        <p id={`org-error-${index}`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError(index, 'organization')}
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

                <Separator className="my-6" />

                {/* Location Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Location Information</h3>
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

                <Separator className="my-6" />

                {/* Partner Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Partner Information</h3>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              <p>Ready to submit your partner mappings?</p>
              <p className="text-xs mt-1">
                {partnerMappings.length} partner{partnerMappings.length !== 1 ? 's' : ''} will be submitted
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {onSaveDraft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || isSavingDraft}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isSubmitting}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit Partner Mappings
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
