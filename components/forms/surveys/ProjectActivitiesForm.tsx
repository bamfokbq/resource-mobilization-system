"use client"

import { useEffect } from "react"
import { useFormStore } from "@/store/useFormStore"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronLeft } from 'lucide-react'

const DISTRICTS = [
  "Krachi East Municipal",
  "Krachi Nchumuru",
  "Krachi West",
  "Nkwanta North",
  "Nkwanta South Municipal",
  "Guan",
  "Jasikan",
  "Kadjebi",
  "Biakoye"
]

const CONTINUUM_OF_CARE = [
  "Health Promotion/Primary prevention",
  "Screening/Risk Assessment",
  "Vaccination",
  "Early Detection/Diagnosis",
  "Treatment/Disease Management",
  "Rehabilitation",
  "Palliative Care"
]

const AGE_RANGES = [
  "0-4 years",
  "5-9 years",
  "10-19 years",
  "20-39 years",
  "40-59 years",
  "60+ years"
]

const IMPLEMENTATION_LEVELS = [
  "National",
  "Regional",
  "District",
  "Community"
]

const WHO_GAP_TARGETS = [
  "Reduction in premature mortality from NCDs",
  "Reduction in harmful use of alcohol",
  "Reduction in prevalence of insufficient physical activity",
  "Reduction in mean population intake of salt/sodium",
  "Reduction in prevalence of tobacco use",
  "Reduction in prevalence of raised blood pressure",
  "Halt the rise in diabetes and obesity",
  "Increase coverage of drug therapy and counselling",
  "Improve availability of affordable technologies and medicines"
]

const formSchema = z.object({
  districts: z.array(z.string()).min(1, "Select at least one district"),
  continuumOfCare: z.array(z.string()).min(1, "Select at least one continuum of care"),
  activityDescription: z.string().min(10, "Please provide a detailed description"),
  primaryTargetPopulation: z.string().min(5, "Please describe the primary target population"),
  secondaryTargetPopulation: z.string().optional(),
  ageRanges: z.array(z.string()).min(1, "Select at least one age range"),
  gender: z.enum(["male", "female", "both"]),
  implementationLevel: z.array(z.string()).min(1, "Select at least one implementation level"),
  implementationArea: z.enum(["urban", "rural", "both"]),
  whoGapTargets: z.array(z.string()).min(1, "Select at least one WHO GAP target"),
  ncdStrategyDomain: z.string().min(1, "Select a strategy domain"),
  preventionFocus: z.string().optional()
})

interface ProjectActivitiesFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData, updateFormData } = useFormStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      districts: [],
      continuumOfCare: [],
      activityDescription: "",
      primaryTargetPopulation: "",
      secondaryTargetPopulation: "",
      ageRanges: [],
      gender: "both",
      implementationLevel: [],
      implementationArea: "both",
      whoGapTargets: [],
      ncdStrategyDomain: "",
      preventionFocus: ""
    }
  })

  // Load existing data
  useEffect(() => {
    if (formData?.projectActivities) {
      form.reset(formData.projectActivities)
    }
  }, [formData, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      updateFormData({ projectActivities: values })
      toast.success("Project activities saved successfully")
      handleNext()
    } catch (error) {
      toast.error("Failed to save project activities")
    }
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Section B.3: Project Activities</h2>
        <p className="text-gray-600 text-lg">
          Please provide information about your project activities and their alignment with various strategies.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Implementation Details Card */}
          <Card className="shadow-none border-none bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {/* Districts Selection */}
              <FormField
                control={form.control}
                name="districts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.0i. Which district(s) in Oti Region is the project being implemented? <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange([...field.value, value])}
                      value={field.value?.[0] || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select districts" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      {field.value?.map((district) => (
                        <div key={district} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                          {district}
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value.filter(d => d !== district))}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Continuum of Care */}
              <FormField
                control={form.control}
                name="continuumOfCare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.1. At what point in the continuum of care are your activities working to improve access to NCD prevention and care? <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      Select all that apply. Align your project activities to the continuum of care.
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {CONTINUUM_OF_CARE.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), item]
                                : field.value?.filter((value) => value !== item) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Description */}
              <FormField
                control={form.control}
                name="activityDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.2. Activity Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      Please briefly describe (2-3 sentences) the key activities associated with the project.
                      Which risk factors are you addressing and how?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your activities..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Target Population */}
              <FormField
                control={form.control}
                name="primaryTargetPopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.3. Primary Target Population <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      The primary target population is the group of people that your activity seeks to directly influence or prompt to action.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your primary target population..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secondary Target Population */}
              <FormField
                control={form.control}
                name="secondaryTargetPopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">B3.3.b Secondary Target Population</FormLabel>
                    <FormDescription>
                      This population are not your primary target from the onset but they do benefit from the activity in other ways.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your secondary target population..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age Ranges */}
              <FormField
                control={form.control}
                name="ageRanges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.4. Age Ranges <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      What is the general age range of the target population for this activity? Select all that apply.
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {AGE_RANGES.map((age) => (
                        <div key={age} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(age)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), age]
                                : field.value?.filter((value) => value !== age) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {age}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.5. Gender <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      Are the beneficiaries of your activities primarily (&gt;80%) male, female, or both?
                    </FormDescription>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Implementation Level */}
              <FormField
                control={form.control}
                name="implementationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.12. Implementation Level <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      At what level is the activity being implemented? Check all that apply.
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {IMPLEMENTATION_LEVELS.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(level)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), level]
                                : field.value?.filter((value) => value !== level) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Implementation Area */}
              <FormField
                control={form.control}
                name="implementationArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.13. Implementation Area <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      Are the activities being implemented in urban, rural, or both areas?
                    </FormDescription>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urban">Urban</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WHO GAP Targets */}
              <FormField
                control={form.control}
                name="whoGapTargets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">
                      B3.14. WHO GAP Targets Alignment <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormDescription>
                      Where does this activity align with the WHO GAP targets?
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {WHO_GAP_TARGETS.map((target) => (
                        <div key={target} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(target)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), target]
                                : field.value?.filter((value) => value !== target) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {target}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={handlePrevious}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
