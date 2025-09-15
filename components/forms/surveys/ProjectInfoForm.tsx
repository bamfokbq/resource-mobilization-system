"use client"

import { useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStore } from "@/store/useFormStore"
import { projectInfoSchema, ProjectInfoFormData, type NCDSpecificInfo } from "@/schemas/projectInfoSchema"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Target } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FUNDING_SOURCES, NCD_DATA, REGIONS_GHANA, type NCDType } from '@/constant'

interface ProjectInfoFormProps {
  handleNext: () => void
  handlePrevious: () => void
}

// Helper function to create default NCD specific info
const createDefaultNCDInfo = (): NCDSpecificInfo => ({
  districts: [],
  continuumOfCare: [],
  activityDescription: "",
  primaryTargetPopulation: "General Population",
  secondaryTargetPopulation: undefined,
  ageRanges: [],
  gender: "both",
  activityLevel: [],
  implementationArea: "Both",
  whoGapTargets: [],
  strategyDomain: [],
  secondaryPreventionFocus: [],
  researchFocus: []
})

export default function ProjectInfoForm({ handleNext, handlePrevious }: ProjectInfoFormProps) {
  const { formData, updateFormData } = useFormStore()

  const form = useForm<ProjectInfoFormData>({
    resolver: zodResolver(projectInfoSchema) as any,
    defaultValues: {
      totalProjects: 0,
      projectName: "",
      projectDescription: "",
      startDate: "",
      endDate: "",
      projectGoal: "",
      projectObjectives: "",
      targetBeneficiaries: "",
      projectLocation: "",
      estimatedBudget: "",
      regions: [],
      targetedNCDs: [],
      fundingSource: undefined,
      ncdSpecificInfo: {}
    }
  })

  // Memoize the form reset data to prevent unnecessary re-renders
  const formResetData = useMemo(() => {
    if (!formData?.projectInfo) return null;
    
    return {
      ...formData.projectInfo,
      ncdSpecificInfo: formData.projectInfo.ncdSpecificInfo || {},
      fundingSource: formData.projectInfo.fundingSource || undefined,
    };
  }, [formData?.projectInfo]);

  useEffect(() => {
    if (formResetData) {
      form.reset(formResetData);
    }
  }, [formResetData, form])

  const onSubmit = useCallback((data: ProjectInfoFormData) => {
    try {
      const {
        totalProjects,
        projectName,
        projectDescription,
        startDate,
        endDate,
        projectGoal,
        projectObjectives,
        targetBeneficiaries,
        projectLocation,
        estimatedBudget,
        regions,
        targetedNCDs,
        fundingSource,
        ncdSpecificInfo
      } = data;

      // Process NCD specific info to ensure all required fields have default values
      const processedNcdSpecificInfo: Record<string, NCDSpecificInfo> = {} as any;
      
      // Initialize NCD specific info for all selected NCDs
      targetedNCDs.forEach(ncd => {
        processedNcdSpecificInfo[ncd] = {
          ...createDefaultNCDInfo(),
          ...(ncdSpecificInfo[ncd] || {})
        };
      });

      updateFormData({
        projectInfo: {
          totalProjects,
          projectName,
          projectDescription,
          startDate,
          endDate,
          projectGoal,
          projectObjectives,
          targetBeneficiaries,
          projectLocation,
          estimatedBudget,
          regions,
          targetedNCDs,
          fundingSource: (fundingSource || 'Ghana Government') as any,
          ncdSpecificInfo: processedNcdSpecificInfo
        }
      });

      handleNext();

      toast.success("Project information saved successfully", {
        description: "Your changes have been saved and you can proceed to the next section.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to save information", {
        description: error instanceof Error ? error.message : "Please try again or contact support if the issue persists.",
        duration: 5000,
      });
    }
  }, [updateFormData, handleNext])

  const onError = useCallback((errors: any) => {
    console.log('Validation errors:', errors);
    
    // Extract field names and their error messages
    const errorFields = Object.keys(errors).map(fieldName => {
      const fieldError = errors[fieldName];
      let fieldDisplayName = '';
      
      // Map field names to user-friendly display names
      switch (fieldName) {
        case 'totalProjects':
          fieldDisplayName = 'Total number of projects';
          break;
        case 'projectName':
          fieldDisplayName = 'Project name';
          break;
        case 'startDate':
          fieldDisplayName = 'Project start date';
          break;
        case 'projectGoal':
          fieldDisplayName = 'Project goal';
          break;
        case 'regions':
          fieldDisplayName = 'Project regions';
          break;
        case 'targetedNCDs':
          fieldDisplayName = 'Targeted NCDs';
          break;
        case 'fundingSource':
          fieldDisplayName = 'Funding source';
          break;
        case 'ncdSpecificInfo':
          fieldDisplayName = 'NCD specific information';
          break;
        default:
          fieldDisplayName = fieldName;
      }
      
      return `${fieldDisplayName}: ${fieldError.message || 'This field is required'}`;
    });
    
    const errorMessage = errorFields.length > 0 
      ? `Please fix the following fields:\n• ${errorFields.join('\n• ')}`
      : "There are some required fields that need to be filled correctly.";
    
    toast.error("Please check your inputs", {
      description: errorMessage,
      duration: 8000,
    });
  }, [])

  const toggleRegion = useCallback((region: string) => {
    const currentRegions = form.getValues("regions")
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter((r) => r !== region)
      : [...currentRegions, region]
    form.setValue("regions", newRegions, { shouldValidate: true })
  }, [form])

  const toggleNCD = useCallback((ncd: NCDType) => {
    const currentNCDs = form.getValues("targetedNCDs")
    const isCurrentlySelected = currentNCDs.includes(ncd)
    const newNCDs = isCurrentlySelected
      ? currentNCDs.filter((n) => n !== ncd)
      : [...currentNCDs, ncd]

    form.setValue("targetedNCDs", newNCDs, { shouldValidate: true })

    // Update NCD specific info
    const currentNCDInfo = form.getValues("ncdSpecificInfo") || {}
    const updatedNCDInfo = { ...currentNCDInfo }

    if (isCurrentlySelected) {
      // Remove NCD from specific info
      delete updatedNCDInfo[ncd]
    } else {
      // Add NCD with default values
      updatedNCDInfo[ncd] = createDefaultNCDInfo()
    }

    form.setValue("ncdSpecificInfo", updatedNCDInfo, { shouldValidate: true })
  }, [form])

  // Memoize form values to prevent unnecessary re-renders
  const watchedRegions = form.watch("regions")
  const watchedNCDs = form.watch("targetedNCDs")
  const watchedFundingSource = form.watch("fundingSource")
  
  // Memoize form state for better performance
  const formState = form.formState
  const isSubmitting = formState.isSubmitting
  const isValid = formState.isValid

  return (
    <section>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Section B: Project Information</h2>
              <p className="text-gray-600 text-lg">
                This section focuses on your project(s). Projects have a definitive start and end date, specific
                deliverables and funding to achieve a certain set goals and objectives.
              </p>
              <p className="text-gray-600 mt-2">
                We want to ensure your work is represented accurately in the database and to other stakeholders. Please take
                time to complete all the requested information for each project.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            {/* B1.2 Total Projects */}
            <div className="form-group">
              <FormField
                control={form.control}
                name="totalProjects"
                render={({ field }) => (
                  <FormItem className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <FormLabel className="text-lg font-semibold text-gray-800">
                      B1.2 What is the total number of Noncommunicable Disease (NCD) projects your organization is
                      currently implementing?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">
                      Enter only the number of distinct project(s).
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={0}
                        max={999}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors max-w-xs"
                      />
                    </FormControl>
                    <FormMessage className="mt-2 text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Section B2: Project(s) Overview</h3>
              </div>

              {/* B2.1 Project Name */}
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.1. What is the project name?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter project name" 
                        aria-required="true" 
                        aria-invalid={!!form.formState.errors.projectName} 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </FormControl>
                    {form.formState.errors.projectName && <FormMessage className="mt-2 text-red-500 text-sm">{form.formState.errors.projectName.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.2 Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.2. When did this project start? (yyyy-mm)
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.startDate}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
                      />
                    </FormControl>
                    {form.formState.errors.startDate && <FormMessage className="mt-2 text-red-500 text-sm">{form.formState.errors.startDate.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.3 End Date (Optional) */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.3. When is this project expected to end? (yyyy-mm)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* B2.4a Project Goal */}
              <FormField
                control={form.control}
                name="projectGoal"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.4a. What is the goal of the project?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">This should be concise and specific to the project</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the main goal of your project"
                        rows={3}
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.projectGoal}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.projectGoal && <FormMessage className="mt-2 text-red-500 text-sm">{form.formState.errors.projectGoal.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.4b Project Objectives */}
              <FormField
                control={form.control}
                name="projectObjectives"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.4b. What are the objectives of the project?
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">
                      Please provide each objective in a sentence separated by a semi colon (;)
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter project objectives separated by semicolons"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* B2.5 Regions */}
              <FormField
                control={form.control}
                name="regions"
                render={() => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.5. Which Region(s) is the project being implemented?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">Select all regions where the project is active</FormDescription>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-3">
                      <ScrollArea className="h-60 w-full pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {REGIONS_GHANA.map((region) => (
                            <div key={region} className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-md transition-colors">
                              <Checkbox
                                id={`region-${region}`}
                                checked={watchedRegions.includes(region)}
                                onCheckedChange={() => toggleRegion(region)}
                                className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                              />
                              <label
                                htmlFor={`region-${region}`}
                                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {region} Region
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    {watchedRegions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {watchedRegions.map((region) => (
                          <Badge key={region} variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                            {region} Region
                          </Badge>
                        ))}
                      </div>
                    )}
                    {form.formState.errors.regions && <FormMessage className="mt-2 text-red-500 text-sm">{form.formState.errors.regions.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.6 NCDs */}
              <FormField
                control={form.control}
                name="targetedNCDs"
                render={() => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.6. Which NCDs does this project address?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">
                      Please select the disease(s) the project focuses on. Please note that questions will be asked
                      for each disease that you select.
                    </FormDescription>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {NCD_DATA.map((ncd, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-green-50 rounded-md transition-colors">
                            <Checkbox
                              id={`ncd-${ncd}`}
                              checked={watchedNCDs.includes(ncd)}
                              onCheckedChange={() => toggleNCD(ncd)}
                              className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                            <label
                              htmlFor={`ncd-${ncd}`}
                              className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {ncd}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {watchedNCDs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {watchedNCDs.map((ncd) => (
                          <Badge key={ncd} variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {ncd}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {form.formState.errors.targetedNCDs?.message && <FormMessage className="mt-2 text-red-500 text-sm">{form.formState.errors.targetedNCDs.message || 'Please select at least one NCD'}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.7 Project Description (Optional) */}
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">B2.7. Brief description of the project</FormLabel>
                    <FormDescription className="text-gray-600 mt-2">Provide a short overview of what the project entails</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter a brief description of your project"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />              {/* B2.8 Funding Source */}
              <FormField
                control={form.control}
                name="fundingSource"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">
                      B2.8. What is the main source of funding for this project?
                    </FormLabel>
                    <FormDescription className="text-gray-600 mt-2">
                      Your main source of funding contributes at least 60% of funds for your project.
                    </FormDescription>
                    <Select
                      value={watchedFundingSource}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-md">
                          <SelectValue placeholder="Select funding source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUNDING_SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* B2.9 Estimated Budget (Optional) */}
              <FormField
                control={form.control}
                name="estimatedBudget"
                render={({ field }) => (
                  <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                    <FormLabel className="text-gray-700 font-semibold">B2.9. Estimated project budget (GHS)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter estimated budget"
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Saving...' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

