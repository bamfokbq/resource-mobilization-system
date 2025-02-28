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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    organisationName: z.string().min(1, { message: "Organization name is required" }),
    region: z.string().min(1, { message: "Region is required" }),
    hasRegionalOffice: z.boolean(),
    regionalOfficeLocation: z.string().optional(),
    gpsCoordinates: z.object({
      latitude: z.string().default(""),
      longitude: z.string().default(""),
    }),
    ghanaPostGPS: z.string().optional(),
    sector: z.string().min(1, { message: "Sector is required" }),
    hqPhoneNumber: z.string().min(1, { message: "HQ phone number is required" }),
    regionalPhoneNumber: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
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
  function onSubmit(values: FormSchema) {
    const organisationInfo: OrganisationInfo = {
      ...values,
      gpsCoordinates: {
        latitude: values.gpsCoordinates.latitude || '',
        longitude: values.gpsCoordinates.longitude || '',
      },
      ghanaPostGPS: values.ghanaPostGPS || ''
    }
    updateFormData({ organisationInfo })
    toast.success("Information saved successfully")
    handleNext()
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Section A: Organisation Information</CardTitle>
        <CardDescription>Please provide accurate information about your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Organization Name */}
            <FormField
              control={form.control}
              name="organisationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    A1. What is the full name of your organization? <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormDescription>
                    Please provide the official name that was used for registration with the Government.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Enter your organization's official registered name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Region Selection */}
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          A2. Head Office Region <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Regional Office Radio */}
                  <FormField
                    control={form.control}
                    name="hasRegionalOffice"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
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
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel>
                          A2.b. Regional Office Location <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the location of your regional office" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* GPS Coordinates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Coordinates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <FormLabel>A3. GPS Coordinates</FormLabel>
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
                          <FormMessage />
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
                          <FormMessage />
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
                      <FormLabel>A3a. GhanaPost GPS Address</FormLabel>
                      <FormDescription>
                        If your HQ is different from your regional office, kindly provide the address of the HQ.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Enter your GhanaPost GPS address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Numbers */}
                  <FormField
                    control={form.control}
                    name="hqPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          A5a. HQ Phone Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormDescription>Enter without country code</FormDescription>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regionalPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A5b. Regional Office Phone</FormLabel>
                        <FormDescription>If different from HQ</FormDescription>
                        <FormControl>
                          <Input type="tel" placeholder="Enter regional office number" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel>
                          A6. Email Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormDescription>Active email address</FormDescription>
                        <FormControl>
                          <Input type="email" placeholder="organization@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A7. Website</FormLabel>
                        <FormDescription>Optional</FormDescription>
                        <FormControl>
                          <Input type="url" placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
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
                <FormItem>
                  <FormLabel>
                    A4. Organization Sector <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your organization's sector" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

