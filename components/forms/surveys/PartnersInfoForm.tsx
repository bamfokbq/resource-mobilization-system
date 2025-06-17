"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormStore } from '@/store/useFormStore';
import { Partner } from '@/types/forms';
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartnersInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

// Validation schema for partners
const partnerSchema = z.object({
  organisationName: z.string().min(1, "Organization name is required"),
  role: z.string().min(1, "Role is required"),
  contribution: z.string().min(1, "Contribution is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const partnersFormSchema = z.object({
  partners: z.array(partnerSchema).min(0, "At least one partner is required"),
});

type PartnersFormData = z.infer<typeof partnersFormSchema>;

export default function PartnersInfoForm({ handleNext, handlePrevious }: PartnersInfoFormProps) {
  const { formData, updateFormData } = useFormStore();

  const form = useForm<PartnersFormData>({
    resolver: zodResolver(partnersFormSchema),
    defaultValues: {
      partners: formData?.partners?.length ? formData.partners : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partners",
  });

  useEffect(() => {
    if (formData?.partners) {
      form.reset({ partners: formData.partners });
    }
  }, [formData, form]);

  const addPartner = () => {
    append({
      organisationName: '',
      role: '',
      contribution: '',
      contactPerson: '',
      email: ''
    });
  };

  const onSubmit = (data: PartnersFormData) => {
    try {
      updateFormData({ partners: data.partners });
      handleNext();

      toast.success("Partners information saved successfully", {
        description: "Your changes have been saved and you can proceed to the next section.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to save information", {
        description: error instanceof Error ? error.message : "Please try again or contact support if the issue persists.",
        duration: 5000,
      });
    }
  };

  const onError = (errors: any) => {
    toast.error("Please check your inputs", {
      description: "There are some required fields that need to be filled correctly.",
      duration: 5000,
    });
  };
  return (
    <section>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Section C: Project Partners</h2>
          <p className="text-gray-600 mb-2">
            This section captures information about organizations or entities that your organization
            collaborates with in implementing your NCD project(s).
          </p>
          <p className="text-gray-600">
            Please provide details about each partner including their role, contribution, and contact information.
            You can add multiple partners as needed.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            <div className="space-y-6">
              {fields.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">No partners added yet</p>
                  <Button
                    type="button"
                    onClick={addPartner}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Partner
                  </Button>
                </div>
              )}

              {fields.map((field, index) => (
                <Card key={field.id} className="border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium text-gray-800">
                        Partner {index + 1}
                      </CardTitle>
                      {fields.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Organization Name */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.organisationName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Organization Name
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Enter the full name of the partner organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter organization name"
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Role */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Role in Project
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Describe the specific role this partner plays in the project
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Technical advisor, Implementation partner, Funding partner"
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />                    {/* Contribution */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.contribution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Contribution/Expertise
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Describe what this partner contributes to the project (expertise, resources, etc.)
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter the specific contributions or expertise this partner provides"
                              rows={3}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Contact Person */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.contactPerson`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Contact Person
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Name of the primary contact person at this organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter contact person's name"
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Email Address
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Email address for the contact person or organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter email address"
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}

              {fields.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={addPartner}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Partner
                  </Button>
                </div>
              )}
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
  );
}
