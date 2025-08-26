'use client'

import { Activity } from '@/types/activities'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import React, { useState } from "react"
import { toast } from "sonner"
import { 
  Save, 
  Loader2, 
  Plus,
  Calendar,
  MapPin,
  Users,
  Activity as ActivityIcon,
  Building,
  Target,
  Clock,
  CheckCircle2
} from "lucide-react"

// Form schema
const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  disease: z.string().min(1, "Disease is required"),
  region: z.string().min(1, "Region is required"),
  implementer: z.string().min(1, "Implementer is required"),
  targetPopulation: z.string().min(1, "Target population is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.string().optional(),
  expectedOutcomes: z.string().min(10, "Expected outcomes must be at least 10 characters"),
  challenges: z.string().optional(),
  coverage: z.string().optional(),
  level: z.string().min(1, "Activity level is required"),
})

type ActivityFormData = z.infer<typeof activitySchema>

interface AddEditActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: Activity) => Promise<void>
  activity?: Activity | null
  mode: 'add' | 'edit'
}

// Options for dropdowns
const diseaseOptions = [
  "Hypertension",
  "Diabetes",
  "Mental Health",
  "Cancer",
  "Cardiovascular Disease",
  "Chronic Kidney Disease",
  "Respiratory Disease"
]

const regionOptions = [
  "Greater Accra",
  "Ashanti",
  "Northern",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Upper East",
  "Upper West",
  "Brong Ahafo"
]

const ageGroupOptions = [
  "Under 5",
  "5-17",
  "18-49",
  "50-69",
  "70+",
  "All Ages"
]

const statusOptions = [
  "planned",
  "ongoing",
  "completed",
  "paused",
  "cancelled"
]

const levelOptions = [
  "National",
  "Regional",
  "District",
  "Community",
  "Facility"
]

export function AddEditActivityModal({
  isOpen,
  onClose,
  onSave,
  activity,
  mode
}: AddEditActivityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: activity?.name || "",
      description: activity?.description || "",
      disease: activity?.disease || "",
      region: activity?.region || "",
      implementer: activity?.implementer || "",
      targetPopulation: activity?.targetPopulation || "",
      ageGroup: activity?.ageGroup || "",
      status: activity?.status || "",
      startDate: activity?.startDate || "",
      endDate: activity?.endDate || "",
      budget: activity?.budget || "",
      expectedOutcomes: activity?.expectedOutcomes || "",
      challenges: activity?.challenges || "",
      coverage: activity?.coverage || "",
      level: activity?.level || "",
    }
  })

  // Reset form when activity changes
  React.useEffect(() => {
    if (activity) {
      form.reset(activity)
    } else {
      form.reset({
        name: "",
        description: "",
        disease: "",
        region: "",
        implementer: "",
        targetPopulation: "",
        ageGroup: "",
        status: "",
        startDate: "",
        endDate: "",
        budget: "",
        expectedOutcomes: "",
        challenges: "",
        coverage: "",
        level: "",
      })
    }
  }, [activity, form])

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true)
    
    try {
      const activityData: Activity = {
        ...data,
        id: activity?.id
      }
      
      await onSave(activityData)
      
      setShowSuccessAnimation(true)
      
      // Wait for animation then close
      setTimeout(() => {
        setShowSuccessAnimation(false)
        onClose()
        form.reset()
      }, 2000)
      
      toast.success(
        mode === 'add' ? 'Activity created successfully!' : 'Activity updated successfully!',
        {
          description: `${data.name} has been ${mode === 'add' ? 'added' : 'updated'} successfully.`
        }
      )
    } catch (error) {
      console.error('Error saving activity:', error)
      toast.error(
        mode === 'add' ? 'Failed to create activity' : 'Failed to update activity',
        {
          description: 'Please try again or contact support if the problem persists.'
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paused':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {mode === 'add' ? (
              <>
                <div className="p-2 rounded-lg bg-green-100">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                Add New Activity
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-blue-100">
                  <ActivityIcon className="h-6 w-6 text-blue-600" />
                </div>
                Edit Activity
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {mode === 'add' 
              ? "Create a new NCD activity with detailed information and tracking."
              : "Update the activity information and tracking details."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Success Animation Overlay */}
        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping"></div>
                <div className="relative rounded-full bg-green-500 w-20 h-20 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700">
                  {mode === 'add' ? 'Activity Created!' : 'Activity Updated!'}
                </h3>
                <p className="text-green-600">
                  {mode === 'add' ? 'Your new activity has been saved successfully.' : 'Changes have been saved successfully.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter activity name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="disease"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disease Focus *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select disease" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {diseaseOptions.map((disease) => (
                                <SelectItem key={disease} value={disease}>
                                  {disease}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the activity objectives and approach..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location & Implementation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location & Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {regionOptions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Implementation Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levelOptions.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="implementer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Implementing Organization *</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Target Population */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Target Population
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="targetPopulation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Target Population *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Adults with diabetes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ageGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Group *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select age group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ageGroupOptions.map((ageGroup) => (
                                <SelectItem key={ageGroup} value={ageGroup}>
                                  {ageGroup}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="coverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Coverage (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="e.g., 75" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Timeline & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Timeline & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getStatusColor(status)}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $50,000 or GH₵ 300,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Outcomes & Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Outcomes & Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="expectedOutcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Outcomes *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the expected outcomes and impact..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="challenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenges & Risks (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe potential challenges and mitigation strategies..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Separator />

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {mode === 'add' ? 'Create Activity' : 'Update Activity'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
