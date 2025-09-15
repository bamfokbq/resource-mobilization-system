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
import { ChevronLeft, ChevronRight, Plus, Trash2, Users } from "lucide-react";
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
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Users className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Section C: Project Partners</h2>
              <p className="text-gray-600 text-lg">
                This section captures information about organizations or entities that your organization
                collaborates with in implementing your NCD project(s).
              </p>
              <p className="text-gray-600 mt-2">
                Please provide details about each partner including their role, contribution, and contact information.
                You can add multiple partners as needed.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            <div className="space-y-6">
              {fields.length === 0 && (
                <div className="text-center flex justify-center items-center flex-col py-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-dashed border-cyan-300">
                  <div className="p-4 bg-cyan-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-cyan-600" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-6">No partners added yet</p>
                  <Button
                    type="button"
                    onClick={addPartner}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Partner
                  </Button>
                </div>
              )}

              {fields.map((field, index) => (
                <Card key={field.id} className="border border-cyan-200 shadow-lg bg-gradient-to-br from-white to-cyan-50">
                  <CardHeader className="bg-gradient-to-r from-cyan-100 to-blue-100 border-b border-cyan-200 rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-1 bg-cyan-200 rounded">
                          <Users className="h-4 w-4 text-cyan-700" />
                        </div>
                        Partner {index + 1}
                      </CardTitle>
                      {fields.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 flex items-center gap-1 rounded-lg"
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
                        <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                          <FormLabel className="text-gray-700 font-semibold">
                            Organization Name
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-gray-600 mt-2">
                            Enter the full name of the partner organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter organization name"
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Role */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.role`}
                      render={({ field }) => (
                        <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                          <FormLabel className="text-gray-700 font-semibold">
                            Role in Project
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-gray-600 mt-2">
                            Describe the specific role this partner plays in the project
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Technical advisor, Implementation partner, Funding partner"
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />                    {/* Contribution */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.contribution`}
                      render={({ field }) => (
                        <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                          <FormLabel className="text-gray-700 font-semibold">
                            Contribution/Expertise
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-gray-600 mt-2">
                            Describe what this partner contributes to the project (expertise, resources, etc.)
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter the specific contributions or expertise this partner provides"
                              rows={3}
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Contact Person */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.contactPerson`}
                      render={({ field }) => (
                        <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                          <FormLabel className="text-gray-700 font-semibold">
                            Contact Person
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-gray-600 mt-2">
                            Name of the primary contact person at this organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter contact person's name"
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name={`partners.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="bg-white p-4 rounded-lg border border-gray-200">
                          <FormLabel className="text-gray-700 font-semibold">
                            Email Address
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription className="text-gray-600 mt-2">
                            Email address for the contact person or organization
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter email address"
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500 text-sm" />
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
                    className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-400 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
