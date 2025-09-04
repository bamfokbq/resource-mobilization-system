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
import { ChevronRight, Building2 } from 'lucide-react'
import { REGIONS_GHANA, SECTORS_SELECT } from '@/constant'
import { organisationInfoSchema } from '@/schemas/organisationInfoSchema'

type FormSchema = z.infer<typeof organisationInfoSchema>

interface OrganisationInfoFormProps {
  handleNext: () => void
}

export default function OrganisationInfoForm({ handleNext }: OrganisationInfoFormProps) {
  const { formData, updateFormData } = useFormStore()

  const form = useForm<FormSchema>({
    resolver: zodResolver(organisationInfoSchema),
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
    } as FormSchema,
  })

  // Load existing data from store if available
  useEffect(() => {
    if (formData?.organisationInfo) {
      const orgInfo = formData.organisationInfo;

      const sectorMatch = SECTORS_SELECT.find(s =>
        s.value === orgInfo.sector || s.label === orgInfo.sector
      );

      const resetValues: FormSchema = {
        organisationName: orgInfo.organisationName || "",
        region: orgInfo.region || "",
        hasRegionalOffice: orgInfo.hasRegionalOffice || false,
        regionalOfficeLocation: (orgInfo.hasRegionalOffice ? orgInfo.regionalOfficeLocation : "") || "",
        gpsCoordinates: {
          latitude: orgInfo.gpsCoordinates?.latitude || "",
          longitude: orgInfo.gpsCoordinates?.longitude || "",
        },
        ghanaPostGPS: orgInfo.ghanaPostGPS || "",
        sector: sectorMatch?.value || orgInfo.sector || "",
        hqPhoneNumber: orgInfo.hqPhoneNumber || "",
        regionalPhoneNumber: orgInfo.regionalPhoneNumber || "",
        email: orgInfo.email || "",
        website: orgInfo.website || "",
      };
      form.reset(resetValues);
    }
  }, [formData, form])

  // Handle form submission
  async function onSubmit(values: FormSchema) {
    try {
      // Process values before saving, especially for conditional fields
      const processedValues = { ...values };
      if (!processedValues.hasRegionalOffice) {
        processedValues.regionalOfficeLocation = ""; // Clear if no regional office
      }

      const organisationInfo: OrganisationInfo = {
        ...processedValues,
        gpsCoordinates: {
          latitude: processedValues.gpsCoordinates?.latitude || '',
          longitude: processedValues.gpsCoordinates?.longitude || '',
        },
        ghanaPostGPS: processedValues.ghanaPostGPS || ''
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

  useEffect(() => {
    console.log('Form data from store:', formData?.organisationInfo);
    console.log('Current form values:', form.getValues());
    console.log('Region value:', form.getValues('region'));
    console.log('Sector value:', form.getValues('sector'));
  }, [formData, form]);

  const onError = (errors: any) => {
    toast.error("Please check your inputs", {
      description: "There are some required fields that need to be filled correctly.",
      duration: 5000,
    })
  }

  return (
    <section>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Section A: Organisation Information</h2>
              <p className="text-gray-600 text-lg">Please provide accurate information about your organization</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            {/* Organization Name */}
            <FormField
              control={form.control}
              name="organisationName"
              render={({ field }) => (
                <FormItem className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <FormLabel className="text-lg font-semibold text-gray-800">
                    A1. What is the full name of your organization? <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormDescription className="text-gray-600 mt-2">
                    Please provide the official name that was used for registration with the Government.
                  </FormDescription>
                  <FormControl>
                    <Input 
                      className="mt-3 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter your organization's official registered name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Location Information */}
            <Card className="shadow-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Region Selection */}
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">
                          A2. Head Office Region <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          key={`region-${field.value}`}
                          onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {REGIONS_GHANA.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Regional Office Radio */}
                  <FormField
                    control={form.control}
                    name="hasRegionalOffice"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-gray-700 font-semibold">
                          A2.a. Regional Office <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "true")}
                            defaultValue={field.value ? "true" : "false"}
                            className="flex space-x-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" className="border-blue-500 text-blue-600" />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-700 cursor-pointer">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" className="border-blue-500 text-blue-600" />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-700 cursor-pointer">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
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
                        <FormLabel className="text-gray-700 font-semibold">
                          A2.b. Regional Office Location <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter the location of your regional office" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* GPS Coordinates */}
            <Card className="shadow-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  Location Coordinates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div>
                  <FormLabel className="text-gray-700 font-semibold">A3. GPS Coordinates</FormLabel>
                  <FormDescription className="text-gray-600 mt-1">
                    If your HQ is different from your regional office, kindly provide the coordinates of the HQ.
                  </FormDescription>
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <FormField
                      control={form.control}
                      name="gpsCoordinates.latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              className="bg-white border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                              placeholder="Latitude" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gpsCoordinates.longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              className="bg-white border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                              placeholder="Longitude" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
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
                      <FormLabel className="text-gray-700 font-semibold">A3a. GhanaPost GPS Address</FormLabel>
                      <FormDescription className="text-gray-600 mt-1">
                        If your HQ is different from your regional office, kindly provide the address of the HQ.
                      </FormDescription>
                      <FormControl>
                        <Input 
                          className="bg-white border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          placeholder="Enter your GhanaPost GPS address" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-purple-100 rounded">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Numbers */}
                  <FormField
                    control={form.control}
                    name="hqPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">
                          A5a. HQ Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormDescription className="text-gray-600 mt-1">Enter without country code</FormDescription>
                        <FormControl>
                          <Input 
                            type="tel" 
                            className="bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="Enter phone number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regionalPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">A5b. Regional Office Phone</FormLabel>
                        <FormDescription className="text-gray-600 mt-1">If different from HQ</FormDescription>
                        <FormControl>
                          <Input 
                            type="tel" 
                            className="bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="Enter regional office number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
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
                        <FormLabel className="text-gray-700 font-semibold">
                          A6. Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormDescription className="text-gray-600 mt-1">Active email address</FormDescription>
                        <FormControl>
                          <Input 
                            type="email" 
                            className="bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="organization@example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">A7. Website</FormLabel>
                        <FormDescription className="text-gray-600 mt-1">Optional</FormDescription>
                        <FormControl>
                          <Input 
                            type="url" 
                            className="bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="https://www.example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
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
                <FormItem className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                  <FormLabel className="text-lg font-semibold text-gray-800">
                    A4. Organization Sector <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    key={`sector-${field.value}`}
                    onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="mt-3 bg-white border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select your organization's sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SECTORS_SELECT.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="min-h-[20px] mt-2 text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
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

