"use client";

import React, { useState } from 'react';
import { useFormStore } from '@/store/useFormStore';

interface FinalSubmissionFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function FinalSubmissionForm({ handleNext, handlePrevious }: FinalSubmissionFormProps) {
  const { formData } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      handleNext();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Review and Submit</h2>

      <div className="space-y-8">
        {/* Organization Information */}
        <section className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Organization Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><strong className="text-gray-800">Name:</strong> {formData.organisationName}</p>
            <p><strong className="text-gray-800">Registration Number:</strong> {formData.registrationNumber}</p>
            <p><strong className="text-gray-800">Address:</strong> {formData.address}</p>
            <p><strong className="text-gray-800">Contact Person:</strong> {formData.contactPerson}</p>
            <p><strong className="text-gray-800">Email:</strong> {formData.email}</p>
            <p><strong className="text-gray-800">Phone:</strong> {formData.phone}</p>
          </div>
        </section>

        {/* Project Information */}
        <section className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><strong className="text-gray-800">Project Name:</strong> {formData.projectName}</p>
            <p><strong className="text-gray-800">Duration:</strong> {formData.startDate} to {formData.endDate}</p>
            <p><strong className="text-gray-800">Total Budget:</strong> ${formData.totalBudget}</p>
            <p><strong className="text-gray-800">Summary:</strong> {formData.projectSummary}</p>
          </div>
        </section>

        {/* Activities Summary */}
        <section className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Activities</h3>
          <div className="space-y-3 text-gray-600">
            {formData.activities?.map((activity, index) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <p><strong className="text-gray-800">Activity {index + 1}:</strong> {activity.name}</p>
                <p className="text-sm text-gray-600">Budget: ${activity.budget}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Summary */}
        <section className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Project Partners</h3>
          <div className="space-y-3 text-gray-600">
            {formData.partners?.map((partner, index) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <p><strong className="text-gray-800">{partner.organisationName}</strong></p>
                <p className="text-sm text-gray-600">Role: {partner.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Information */}
        <section className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Additional Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><strong className="text-gray-800">Risks & Mitigation:</strong> {formData.risks}</p>
            <p><strong className="text-gray-800">Sustainability Plan:</strong> {formData.sustainability}</p>
            <p><strong className="text-gray-800">Monitoring Plan:</strong> {formData.monitoringPlan}</p>
          </div>
        </section>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className="bg-gray-500 rounded-3xl text-white px-6 py-2 hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className={`bg-red-500 text-white px-6 rounded-3xl py-2 hover:bg-red-600 flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
              'Submit Survey'
          )}
        </button>
      </div>
    </div>
  );
}
