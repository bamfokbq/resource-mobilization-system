"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { AdditionalInfo, FormData } from '@/types/forms';

interface AdditionalInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function AdditionalInfoForm({ handleNext, handlePrevious }: AdditionalInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [error, setError] = useState<string>('');
  const [formState, setFormState] = useState<AdditionalInfo>({
    risks: '',
    sustainability: '',
    evaluation: '',
    notes: ''
  });

  const formStateRef = useRef(formState);

  // Sync with store data
  useEffect(() => {
    if (formData) {
      const newFormState: AdditionalInfo = {
        risks: formData.risks || '',
        sustainability: formData.sustainability || '',
        evaluation: formData.evaluation || '',
        notes: formData.notes || ''
      };

      if (JSON.stringify(formStateRef.current) !== JSON.stringify(newFormState)) {
        setFormState(newFormState);
        formStateRef.current = newFormState;
      }
    }
  }, [formData]);

  // Update store whenever form state changes
  useEffect(() => {
    formStateRef.current = formState;
    const updateData: Partial<FormData> = {
      risks: formState.risks,
      sustainability: formState.sustainability,
      evaluation: formState.evaluation,
      notes: formState.notes,
      monitoringPlan: formState.evaluation // Add this line to match FormData interface
    };

    updateFormData(updateData);
  }, [formState, updateFormData]);

  const handleChange = (field: keyof AdditionalInfo, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formState.risks || !formState.sustainability || !formState.evaluation) {
      setError('Please fill in all required fields');
      return;
    }

    const updateData: Partial<FormData> = {
      risks: formState.risks,
      sustainability: formState.sustainability,
      evaluation: formState.evaluation,
      notes: formState.notes,
      monitoringPlan: formState.evaluation // Add this line to match FormData interface
    };

    updateFormData(updateData);
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Additional Information</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div>
        <label className="block mb-1 text-gray-600">Potential Risks and Mitigation Strategies *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={formState.risks}
          onChange={(e) => handleChange('risks', e.target.value)}
          placeholder="Describe potential risks and strategies to mitigate them"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Project Sustainability *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={formState.sustainability}
          onChange={(e) => handleChange('sustainability', e.target.value)}
          placeholder="Explain how the project will be sustained"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Monitoring and Evaluation Plan *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={formState.evaluation}
          onChange={(e) => handleChange('evaluation', e.target.value)}
          placeholder="Describe your monitoring and evaluation plan"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Additional Notes</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={formState.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional information"
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          className="bg-gray-500 rounded-3xl text-white px-6 py-2 hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-navy-blue rounded-3xl text-white px-6 py-2 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  )
}
