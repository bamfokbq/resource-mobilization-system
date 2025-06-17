"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStore } from "@/store/useFormStore"
import { projectInfoSchema, ProjectInfoFormData, type NCDSpecificInfo as ZodNCDSpecificInfo } from "@/schemas/projectInfoSchema" // Import ZodNCDSpecificInfo
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FUNDING_SOURCES, NCD_DATA, REGIONS_GHANA, type NCDType as ConstantNCDType } from '@/constant'

interface ProjectInfoFormProps {
  handleNext: () => void
  handlePrevious: () => void
}

// Define a type where optional array fields from ZodNCDSpecificInfo are made strictly string[]
type NCDArrayFieldKeys = "districts" | "continuumOfCare" | "ageRanges" | "activityLevel" | "whoGapTargets" | "strategyDomain" | "secondaryPreventionFocus" | "researchFocus";

type StrictNCDSpecificInfoItem =
  // Omit fields that will be redefined with stricter (non-optional) types
  Omit<ZodNCDSpecificInfo,
    NCDArrayFieldKeys |
    "activityDescription" |
    "primaryTargetPopulation" |
    "gender" |
    "implementationArea"
  > &
  { [K in NCDArrayFieldKeys]: string[]; } &
  {
    activityDescription: string;
    primaryTargetPopulation: string;
    gender: "male" | "female" | "both";
    implementationArea: "Urban" | "Rural" | "Both";
  };

export default function ProjectInfoForm({ handleNext, handlePrevious }: ProjectInfoFormProps) {
  const { formData, updateFormData } = useFormStore()

  const form = useForm<ProjectInfoFormData>({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: {
      totalProjects: 0,
      projectName: "",
      projectDescription: "",
      startDate: "",
      endDate: "",
      projectGoal: "",
      projectObjectives: "",
      targetBeneficiaries: "",
      projectLocation: "", estimatedBudget: "",
      regions: [],
      targetedNCDs: [],
      fundingSource: undefined,
      ncdSpecificInfo: {} as Record<string, {
        districts: string[];
        continuumOfCare: string[];
        activityDescription: string;
        primaryTargetPopulation: string;
        ageRanges: string[];
        gender: string; activityLevel: string[];
        implementationArea: string;
        whoGapTargets: string[];
        strategyDomain: string[];
      }>
    }
  })

  useEffect(() => {
    if (formData?.projectInfo) {
      // Ensure ncdSpecificInfo is always an object when resetting the form,
      // as react-hook-form might expect an object based on defaultValues.
      const projectInfoForReset = {
        ...formData.projectInfo,
        ncdSpecificInfo: formData.projectInfo.ncdSpecificInfo || {},
        // Ensure fundingSource is properly set for the Select component
        fundingSource: formData.projectInfo.fundingSource || undefined,
      };
      console.log('Resetting form with data:', projectInfoForReset);
      console.log('FundingSource value:', projectInfoForReset.fundingSource);
      form.reset(projectInfoForReset);
    }
  }, [formData, form])

  const onSubmit = (data: ProjectInfoFormData) => {
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
        ncdSpecificInfo: rawNcdSpecificInfo
      } = data;

      const tempProcessedNcdSpecificInfo = JSON.parse(JSON.stringify(rawNcdSpecificInfo)) as Record<
        keyof typeof rawNcdSpecificInfo,
        ZodNCDSpecificInfo
      >;

      for (const ncdKey in tempProcessedNcdSpecificInfo) {
        if (Object.prototype.hasOwnProperty.call(tempProcessedNcdSpecificInfo, ncdKey)) {
          const ncdDetail = tempProcessedNcdSpecificInfo[ncdKey as keyof typeof tempProcessedNcdSpecificInfo];
          if (ncdDetail) {
            // Initialize all required fields with default values
            ncdDetail.districts = ncdDetail.districts ?? [];
            ncdDetail.continuumOfCare = ncdDetail.continuumOfCare ?? [];
            ncdDetail.ageRanges = ncdDetail.ageRanges ?? [];
            ncdDetail.activityLevel = ncdDetail.activityLevel ?? [];
            ncdDetail.whoGapTargets = ncdDetail.whoGapTargets ?? [];
            ncdDetail.strategyDomain = ncdDetail.strategyDomain ?? [];
            ncdDetail.secondaryPreventionFocus = ncdDetail.secondaryPreventionFocus ?? [];
            ncdDetail.researchFocus = ncdDetail.researchFocus ?? [];
            ncdDetail.activityDescription = ncdDetail.activityDescription ?? '';
            ncdDetail.primaryTargetPopulation = ncdDetail.primaryTargetPopulation ?? 'General Population';
            ncdDetail.gender = ncdDetail.gender ?? 'both';
            ncdDetail.implementationArea = ncdDetail.implementationArea ?? 'Both';
          }
        }
      }

      // After processing, cast to the stricter type expected by the store.
      const finalNcdSpecificInfo = tempProcessedNcdSpecificInfo as Record<
        keyof typeof rawNcdSpecificInfo,
        StrictNCDSpecificInfoItem
        >; updateFormData({
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
          fundingSource: fundingSource || 'Ghana Government', // Default to Ghana Government if undefined
          ncdSpecificInfo: finalNcdSpecificInfo
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
  }

  const onError = (errors: any) => {
    toast.error("Please check your inputs", {
      description: "There are some required fields that need to be filled correctly.",
      duration: 5000,
    })
  }

  const toggleRegion = (region: string) => {
    const currentRegions = form.getValues("regions")
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter((r) => r !== region)
      : [...currentRegions, region]
    form.setValue("regions", newRegions, { shouldValidate: true })
  }

  type NCDType = ConstantNCDType;

  const toggleNCD = (ncd: NCDType) => {
    const currentNCDs = form.getValues("targetedNCDs")
    const newNCDs = currentNCDs.includes(ncd)
      ? currentNCDs.filter((n) => n !== ncd)
      : [...currentNCDs, ncd]

    form.setValue("targetedNCDs", newNCDs, { shouldValidate: true })

    // Update NCD specific info
    const currentNCDInfo = form.getValues("ncdSpecificInfo") || {}
    const updatedNCDInfo = { ...currentNCDInfo }

    if (!currentNCDs.includes(ncd)) {
      delete updatedNCDInfo[ncd]
    } else if (!updatedNCDInfo[ncd]) {
      updatedNCDInfo[ncd] = {
        districts: [],
        continuumOfCare: [],
        activityDescription: "",
        primaryTargetPopulation: "General Population",
        ageRanges: [],
        gender: "both",
        activityLevel: [],
        implementationArea: "Both",
        whoGapTargets: [],
        strategyDomain: []
      }
    }

    form.setValue("ncdSpecificInfo", updatedNCDInfo)
  }

  return (
    <section>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Section B: Project Information</h2>
          <p className="text-gray-600 mb-2">
            This section focuses on your project(s). Projects have a definitive start and end date, specific
            deliverables and funding to achieve a certain set goals and objectives.
          </p>
          <p className="text-gray-600">
            We want to ensure your work is represented accurately in the database and to other stakeholders. Please take
            time to complete all the requested information for each project.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            {/* B1.2 Total Projects */}
            <div className="form-group">
              <FormField
                control={form.control}
                name="totalProjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B1.2 What is the total number of Noncommunicable Disease (NCD) projects your organization is
                      currently implementing?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Enter only the number of distinct project(s).
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={0}

                        className="w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Section B2: Project(s) Overview</h3>

              {/* B2.1 Project Name */}
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.1. What is the project name?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" aria-required="true" aria-invalid={!!form.formState.errors.projectName} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </FormControl>
                    {form.formState.errors.projectName && <FormMessage className="mt-1 text-red-500 text-sm">{form.formState.errors.projectName.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.2 Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.2. When did this project start? (yyyy-mm)
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.startDate}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
                      />
                    </FormControl>
                    {form.formState.errors.startDate && <FormMessage className="mt-1 text-red-500 text-sm">{form.formState.errors.startDate.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.3 End Date (Optional) */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.3. When is this project expected to end? (yyyy-mm)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.4a. What is the goal of the project?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">This should be concise and specific to the project</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the main goal of your project"
                        rows={3}
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.projectGoal}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    {form.formState.errors.projectGoal && <FormMessage className="mt-1 text-red-500 text-sm">{form.formState.errors.projectGoal.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.4b Project Objectives */}
              <FormField
                control={form.control}
                name="projectObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.4b. What are the objectives of the project?
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Please provide each objective in a sentence separated by a semi colon (;)
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter project objectives separated by semicolons"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.5. Which Region(s) is the project being implemented?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">Select all regions where the project is active</FormDescription>
                    <div className="border rounded-md p-4 bg-white">
                      <ScrollArea className="h-60 w-full pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {REGIONS_GHANA.map((region) => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-${region}`}
                                checked={form.watch("regions").includes(region)}
                                onCheckedChange={() => toggleRegion(region)}
                              />
                              <label
                                htmlFor={`region-${region}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {region} Region
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    {form.watch("regions").length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.watch("regions").map((region) => (
                          <Badge key={region} variant="outline" className="bg-primary/10">
                            {region} Region
                          </Badge>
                        ))}
                      </div>
                    )}
                    {form.formState.errors.regions && <FormMessage className="mt-1 text-red-500 text-sm">{form.formState.errors.regions.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.6 NCDs */}
              <FormField
                control={form.control}
                name="targetedNCDs"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.6. Which NCDs does this project address?
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Please select the disease(s) the project focuses on. Please note that questions will be asked
                      for each disease that you select.
                    </FormDescription>
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {NCD_DATA.map((ncd, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ncd-${ncd}`}
                              checked={form.watch("targetedNCDs").includes(ncd)}
                              onCheckedChange={() => toggleNCD(ncd)}
                              className="border-navy-blue data-[state=checked]:bg-navy-blue"
                            />
                            <label
                              htmlFor={`ncd-${ncd}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {ncd}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {form.watch("targetedNCDs").length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.watch("targetedNCDs").map((ncd) => (
                          <Badge key={ncd} variant="secondary">
                            {ncd}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {form.formState.errors.targetedNCDs?.message && <FormMessage className="mt-1 text-red-500 text-sm">{form.formState.errors.targetedNCDs.message || 'Please select at least one NCD'}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* B2.7 Project Description (Optional) */}
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">B2.7. Brief description of the project</FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">Provide a short overview of what the project entails</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter a brief description of your project"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />              {/* B2.8 Funding Source */}
              <FormField
                control={form.control}
                name="fundingSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      B2.8. What is the main source of funding for this project?
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Your main source of funding contributes at least 60% of funds for your project.
                    </FormDescription>
                    <Select
                      key={field.value}
                      value={field.value}
                      onValueChange={(value) => {
                        console.log('FundingSource value changed to:', value);
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-md">
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">B2.9. Estimated project budget (GHS)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter estimated budget"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
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
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

