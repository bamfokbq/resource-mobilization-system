"use client";

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormStore } from '@/store/useFormStore';
import { AdditionalInfo } from '@/types/forms';
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdditionalInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

// Validation schema for additional information
const additionalInfoSchema = z.object({
  risks: z.string().min(1, "Potential risks and mitigation strategies are required"),
  sustainability: z.string().min(1, "Project sustainability plan is required"),
  evaluation: z.string().min(1, "Monitoring and evaluation plan is required"),
  notes: z.string().optional(),
});

type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;

export default function AdditionalInfoForm({ handleNext, handlePrevious }: AdditionalInfoFormProps) {
  const { formData, updateFormData } = useFormStore();

  const form = useForm<AdditionalInfoFormData>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      risks: "",
      sustainability: "",
      evaluation: "",
      notes: "",
    }
  });

  useEffect(() => {
    if (formData) {
      const additionalInfoData = {
        risks: formData.risks || "",
        sustainability: formData.sustainability || "",
        evaluation: formData.evaluation || "",
        notes: formData.notes || "",
      };
      form.reset(additionalInfoData);
    }
  }, [formData, form]);

  const onSubmit = (data: AdditionalInfoFormData) => {
    try {
      updateFormData({
        risks: data.risks,
        sustainability: data.sustainability,
        evaluation: data.evaluation,
        notes: data.notes,
        monitoringPlan: data.evaluation // Add this line to match FormData interface
      });

      handleNext();

      toast.success("Additional information saved successfully", {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Section D: Additional Information</h2>
          <p className="text-gray-600 mb-2">
            This section captures important details about project sustainability, risk management, and monitoring approaches.
          </p>
          <p className="text-gray-600">
            Please provide comprehensive information to help understand the long-term viability and impact measurement of your project.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              {/* D1. Potential Risks */}
              <FormField
                control={form.control}
                name="risks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      D1. Potential Risks and Mitigation Strategies
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Identify potential risks that could affect your project and describe strategies to mitigate them
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe potential risks and strategies to mitigate them (e.g., funding delays, staff turnover, regulatory changes, etc.)"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* D2. Project Sustainability */}
              <FormField
                control={form.control}
                name="sustainability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      D2. Project Sustainability Plan
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Explain how the project will be sustained beyond the current funding period
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe sustainability strategies (e.g., future funding sources, community ownership, institutional integration, etc.)"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* D3. Monitoring and Evaluation */}
              <FormField
                control={form.control}
                name="evaluation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      D3. Monitoring and Evaluation Plan
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Describe your approach to monitoring progress and evaluating project impact
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your monitoring and evaluation plan (e.g., key indicators, data collection methods, evaluation timeline, etc.)"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* D4. Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      D4. Additional Notes or Comments
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500 mt-1">
                      Any additional information, challenges, or insights about your project that you would like to share
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share any additional information, challenges, achievements, or insights about your project"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500 text-sm" />
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
                Complete Survey
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
