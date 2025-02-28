"use client"

import { useEffect } from "react"
import { useFormStore } from "@/store/useFormStore"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { OrganisationInfo } from "@/types/forms"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
]

const SECTORS = ["Ghana Government", "Patient Organisation", "Local NGO", "International NGO", "Foundation"]

// Create a schema for form validation
const formSchema = z
  .object({
    organisationName: z.string().min(1, { message: "Please enter your organization's name" }),
    region: z.string().min(1, { message: "Please select your head office region" }),
    hasRegionalOffice: z.boolean(),
    regionalOfficeLocation: z.string()
      .optional()
      .refine((val) => {
        return true;
      }, { message: "Please enter the regional office location" }),
    gpsCoordinates: z.object({
      latitude: z.string().default(""),
      longitude: z.string().default(""),
    }),
    ghanaPostGPS: z.string().optional(),
    sector: z.string().min(1, { message: "Please select your organization's sector" }),
    hqPhoneNumber: z.string().min(1, { message: "Please enter your HQ phone number" })
      .regex(/^[0-9]+$/, { message: "Phone number must contain only numbers" })
      .min(10, { message: "Phone number must be at least 10 digits" }),
    regionalPhoneNumber: z.string().optional(),
    email: z.string()
      .min(1, { message: "Please enter your email address" })
      .email({ message: "Please enter a valid email address" }),
    website: z.string().url({ message: "Please enter a valid URL (e.g., https://www.example.com)" }).optional().or(z.literal("")),
    registrationNumber: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().optional(),
  })

type FormSchema = z.infer<typeof formSchema>

interface OrganisationInfoFormProps {
  handleNext: () => void
}

export default function OrganisationInfoForm({ handleNext }: OrganisationInfoFormProps) {
  const { formData, updateFormData } = useFormStore()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisationName: "",
      region: "",
      hasRegionalOffice: false,
      regionalOfficeLocation: "",
      gpsCoordinates: {
        latitude: "",
        longitude: "",
      },
      ghanaPostGPS: "",
      sector: "",
      hqPhoneNumber: "",
      regionalPhoneNumber: "",
      email: "",
      website: "",
    },
  })

  // Load existing data from store if available
  useEffect(() => {
    if (formData?.organisationInfo) {
      form.reset(formData.organisationInfo)
    }
  }, [formData, form])

  // Handle form submission
  async function onSubmit(values: FormSchema) {
    try {
      const organisationInfo: OrganisationInfo = {
        ...values,
        gpsCoordinates: {
          latitude: values.gpsCoordinates.latitude || '',
          longitude: values.gpsCoordinates.longitude || '',
        },
        ghanaPostGPS: values.ghanaPostGPS || ''
      }

      updateFormData({ organisationInfo })

      toast.success("Organisation information saved successfully", {
        description: "Your changes have been saved and you can proceed to the next section.",
        duration: 3000,
      })

      handleNext()
    } catch (error) {
      toast.error("Failed to save information", {
        description: error instanceof Error ? error.message : "Please try again or contact support if the issue persists.",
        duration: 5000,
      })
    }
  }

  const onError = (errors: any) => {
    console.log(errors);

    toast.error("Please check your inputs", {
      description: "There are some required fields that need to be filled correctly.",
      duration: 5000,
    })
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Section A: Organisation Information</h2>
        <p className="text-gray-600 text-lg">Please provide accurate information about your organization</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Organization Name */}
          <FormField
            control={form.control}
            name="organisationName"
            render={({ field }) => (
              <FormItem className="bg-gray-50 p-6 rounded-lg">
                <FormLabel className="text-lg font-semibold !text-current">
                  A1. What is the full name of your organization? <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription className="text-gray-600">
                  Please provide the official name that was used for registration with the Government.
                </FormDescription>
                <FormControl>
                  <Input className="mt-2" placeholder="Enter your organization's official registered name" {...field} />
                </FormControl>
                <FormMessage className="min-h-[20px] mt-2" />
              </FormItem>
            )}
          />

          {/* Location Information */}
          <Card className="shadow-none border-none bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Region Selection */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!text-current'>
                        A2. Head Office Region <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GHANA_REGIONS.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />

                {/* Regional Office Radio */}
                <FormField
                  control={form.control}
                  name="hasRegionalOffice"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className='!text-current'>
                        A2.a. Regional Office <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "true")}
                          defaultValue={field.value ? "true" : "false"}
                          className="flex space-x-6"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal !text-current">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Regional Office Location */}
              {form.watch("hasRegionalOffice") && (
                <FormField
                  control={form.control}
                  name="regionalOfficeLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!text-current'>
                        A2.b. Regional Office Location <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the location of your regional office" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* GPS Coordinates */}
          <Card className="shadow-none border-none bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Location Coordinates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div>
                <FormLabel className='!text-current'>A3. GPS Coordinates</FormLabel>
                <FormDescription>
                  If your HQ is different from your regional office, kindly provide the coordinates of the HQ.
                </FormDescription>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="gpsCoordinates.latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Latitude" {...field} />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gpsCoordinates.longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Longitude" {...field} />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="ghanaPostGPS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='!text-current'>A3a. GhanaPost GPS Address</FormLabel>
                    <FormDescription>
                      If your HQ is different from your regional office, kindly provide the address of the HQ.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Enter your GhanaPost GPS address" {...field} />
                    </FormControl>
                    <FormMessage className="min-h-[20px] mt-2" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-none border-none bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone Numbers */}
                <FormField
                  control={form.control}
                  name="hqPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!text-current'>
                        A5a. HQ Phone Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription>Enter without country code</FormDescription>
                      <FormControl>
                        <Input type="tel" placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regionalPhoneNumber"
                  render={({ field }) => (
                    <FormItem className='!text-current'>
                      <FormLabel>A5b. Regional Office Phone</FormLabel>
                      <FormDescription>If different from HQ</FormDescription>
                      <FormControl>
                        <Input type="tel" placeholder="Enter regional office number" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email and Website */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!text-current'>
                        A6. Email Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription>Active email address</FormDescription>
                      <FormControl>
                        <Input type="email" placeholder="organization@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!text-current'>A7. Website</FormLabel>
                      <FormDescription>Optional</FormDescription>
                      <FormControl>
                        <Input type="url" placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sector Selection */}
          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="bg-gray-50 p-6 rounded-lg">
                <FormLabel className="text-lg font-semibold !text-current">
                  A4. Organization Sector <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="mt-2">
                      <SelectValue defaultValue={field.value} placeholder="Select your organization's sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="min-h-[20px] mt-2" />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
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
  )
}

