"use client"

import { useEffect } from "react"
import { useFormStore } from "@/store/useFormStore"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { projectActivitiesSchema } from "@/schemas/projectActivitiesSchema"
import { toast } from "sonner"
import { Checkbox } from '@/components/ui/checkbox'
import { getDistrictsByRegion } from '@/constant'

interface ProjectActivitiesFormProps {
  handleNext: () => void
  handlePrevious: () => void
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData, updateFormData } = useFormStore()
  const ncdsSelectedFromProjectInfoForm = formData?.projectInfo?.targetedNCDs || []
  const regionsSelectedFromProjectInfoForm = formData?.projectInfo?.regions || [];
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof projectActivitiesSchema>>({
    resolver: zodResolver(projectActivitiesSchema),
    defaultValues: {
      ncdActivities: ncdsSelectedFromProjectInfoForm.reduce((acc, ncd) => ({
        ...acc,
        [ncd]: {
          projectDistrict: [] as string[],
          continuumOfCare: "",
          activityDescription: "",
          targetPopulation: "",
          secondaryTargetPopulation: "",
          ageRange: "",
          gender: "",
          activityLevel: "",
          activityImplementedArea: "",
          nationalNCDStrategyWHOGapTarget: "",
          domainAreaOfStrategy: "",
          expectedOutcomes: "",
          challenges: ""
        }
      }), {})
    }
  })

  // Load existing data
  useEffect(() => {
    if (formData?.projectActivities) {
      form.reset(formData.projectActivities)
    }
  }, [formData, form])

  const onSubmit = async (values: z.infer<typeof projectActivitiesSchema>) => {
    try {
      updateFormData({ projectActivities: values })
      toast.success("Project activities saved successfully")
      handleNext()
    } catch (error) {
      toast.error("Failed to save project activities")
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b border-blue-200 pb-4">
              Section B.3: Project Activities
            </h2>

            <div className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Info className="text-blue-500" />
                Important Notes
              </h3>
              {[
                "Activities are the day to day, month to month tasks that you do to achieve your objectives. Activities have a focus in that they are done in a specific place (region/district/community), they target a certain population, address a set of disease area(s) and seek to improve a section on the continuum of care.",
                "For questions on continuum of care, please condense your project activities and outputs to align with at least one of the sections on the continuum of care.",
                "For the primary target population, this is the group of people that your project activity seeks to directly inﬂuence or affect. While other groups may beneﬁt from the activity, the primary target population is the group to which your project was awarded the funding."
              ].map((text, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 hover:bg-blue-50/50 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-500 mt-1" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {ncdsSelectedFromProjectInfoForm.length > 0 && (
              <div className="mt-8 space-y-6">
                {ncdsSelectedFromProjectInfoForm.map((ncd, index) => (
                  <Accordion
                    key={index}
                    type="single"
                    value={activeAccordion}
                    onValueChange={setActiveAccordion}
                    collapsible
                    className="bg-gradient-to-r from-background to-background/80 rounded-xl shadow-sm border border-border/40 overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <AccordionItem value={`item-${index}`} className="px-6 border-none">
                      <AccordionTrigger className="hover:bg-muted/30 rounded-lg py-5 px-4 transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-smit-green to-mint-green shadow-sm"></div>
                          <span className="text-dark-gray font-semibold tracking-wide">
                            {ncd}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-8 p-8 bg-muted/20 rounded-xl border border-border/30 my-3 backdrop-blur-sm">
                          {/* Activity Details */}
                          <div className="space-y-8">
                            <div className="bg-white/50 p-6 rounded-lg border border-border/50 shadow-sm">
                              <FormField
                                control={form.control}
                                name={`ncdActivities.${ncd}.projectDistrict`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='!text-current'>
                                      B3.0e. For {ncd}: Which district(s) in {regionsSelectedFromProjectInfoForm[0]} Region is the project being implemented?
                                    </FormLabel>
                                    <FormControl>
                                      <div className="grid grid-cols-2 gap-4 mt-2">
                                        {getDistrictsByRegion(regionsSelectedFromProjectInfoForm[0]).map((district, index) => (
                                          <div className="flex items-center space-x-3 p-2 hover:bg-blue-50/50 rounded-md transition-colors" key={index}>
                                            <Checkbox
                                              id={`district-${index}`}
                                              checked={(field.value as string[])?.includes(district)}
                                              onCheckedChange={(checked) => {
                                                const currentValue = field.value as string[] || [];
                                                const newValue = checked
                                                  ? [...currentValue, district]
                                                  : currentValue.filter((d: string) => d !== district);
                                                field.onChange(newValue);
                                              }}
                                            />
                                            <label
                                              htmlFor={`district-${index}`}
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              {district}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {[
                              {
                                name: "continuumOfCare",
                                label: `B3.1. Continuum of care: For ${ncd}, at what point in the continuum of care are your activities working to improve access to NCD prevention and care?`,
                                placeholder: `Describe your activities related to ${ncd}...`
                              },
                              {
                                name: "activityDescription",
                                label: `B3.2. Activity description: For ${ncd}, please provide a description of your activities`,
                                placeholder: `Describe your activities related to ${ncd}...`
                              },
                              {
                                name: "targetPopulation",
                                label: `B3.3. Primary target population: For ${ncd}, How would you characterize the primary target population of your activities?`,
                                placeholder: "Describe the target population..."
                              },
                              {
                                name: "secondaryTargetPopulation",
                                label: `B3.3.b Who are your secondary target population for the activity on for ${ncd}?`,
                                placeholder: "Describe the secondary target population..."
                              },
                              {
                                name: "ageRange",
                                label: ` B3.4. AGE: For ${ncd}, What is the general age range of the target population for this activity? Select all that apply`,
                                placeholder: "Describe the age range of the target population..."
                              },
                              {
                                name: "gender",
                                label: ` B3.5. Gender: For ${ncd}, are the beneﬁciaries of your activities primarily ({'>'}80%) male, female, or both?`,
                                placeholder: "Describe the age range of the target population..."
                              },
                              {
                                name: "activityLevel",
                                label: ` B3.12. For ${ncd}: At what level is the activity being implement? Check all that apply.`,
                                placeholder: "Describe the activity level..."
                              },
                              {
                                name: "activityImplementedArea",
                                label: `B3.13. For ${ncd}: Are the activities being implemented at the urban, rural or both?`,
                                placeholder: "Describe the activity implemented area..."
                              }
                            ].map((field, index) => (
                              <div key={index} className="bg-white/50 p-6 rounded-lg border border-border/50 shadow-sm">
                                <FormField
                                  control={form.control}
                                  name={`ncdActivities.${ncd}.${field.name}`}
                                  render={({ field: formField }) => (
                                    <FormItem>
                                      <FormLabel className="text-base text-gray-700 mb-3 block">
                                        {field.label}
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder={field.placeholder}
                                          className="min-h-[120px] resize-none bg-white"
                                          {...formField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}

                            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
                              <h3 className="text-lg text-gray-700 mb-6 flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-500" />
                                National NCD Strategy
                              </h3>
                              <FormField
                                control={form.control}
                                name={`ncdActivities.${ncd}.nationalNCDStrategyWHOGapTarget`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base text-gray-700 mb-3 block">
                                      B3.14 {ncd}: Where does this activity align with the WHO GAP targets?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Describe the target population..."
                                        className="min-h-[100px] resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
                              <div className="mb-6">
                                <h3 className="text-lg text-gray-700 mb-2">
                                  Ghana NCD Strategy Alignment
                                </h3>
                                <p className='text-gray-600'>
                                  The following section collects information on how your activities on {ncd} aligns with the National NCD strategy.
                                </p>
                              </div>
                              <FormField
                                control={form.control}
                                name={`ncdActivities.${ncd}.domainAreaOfStrategy`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base text-gray-700 mb-3 block">
                                      B3.15. {ncd}: Which domain area of the strategy are your activities focusing?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Describe the target population..."
                                        className="min-h-[100px] resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`ncdActivities.${ncd}.domainAreaOfStrategy`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base text-gray-700 mb-3 block">
                                      B3.17. {ncd}: For secondary and tertiary prevention: Which strategic area are you focusing?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Describe the target population..."
                                        className="min-h-[100px] resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
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
