import React, { useState, useEffect, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { ProjectInfoFormData } from '@/types/forms';

interface ProjectInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectInfoForm({ handleNext, handlePrevious }: ProjectInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [error, setError] = useState<string>('');
  const [formState, setFormState] = useState<ProjectInfoFormData>({
    projectName: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    targetBeneficiaries: '',
    projectLocation: '',
    estimatedBudget: ''
  });

  const formStateRef = useRef(formState);

  // Sync with store data
  useEffect(() => {
    if (formData && formData.projectInfo) {
      const newFormState: ProjectInfoFormData = {
        projectName: formData.projectInfo.projectName || '',
        projectDescription: formData.projectInfo.projectDescription || '',
        startDate: formData.projectInfo.startDate || '',
        endDate: formData.projectInfo.endDate || '',
        targetBeneficiaries: formData.projectInfo.targetBeneficiaries || '',
        projectLocation: formData.projectInfo.projectLocation || '',
        estimatedBudget: formData.projectInfo.estimatedBudget || ''
      };

      if (
        newFormState.projectName !== formStateRef.current.projectName ||
        newFormState.projectDescription !== formStateRef.current.projectDescription ||
        newFormState.startDate !== formStateRef.current.startDate ||
        newFormState.endDate !== formStateRef.current.endDate ||
        newFormState.targetBeneficiaries !== formStateRef.current.targetBeneficiaries ||
        newFormState.projectLocation !== formStateRef.current.projectLocation ||
        newFormState.estimatedBudget !== formStateRef.current.estimatedBudget
      ) {
        setFormState(newFormState);
        formStateRef.current = newFormState;
      }
    }
  }, [formData]);

  // Update store whenever form state changes
  useEffect(() => {
    formStateRef.current = formState;
    updateFormData({ projectInfo: formState });
  }, [formState, updateFormData]);

  const handleChange = (field: keyof ProjectInfoFormData, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formState.projectName || !formState.projectDescription || !formState.startDate || !formState.endDate || !formState.targetBeneficiaries || !formState.projectLocation || !formState.estimatedBudget) {
      setError('Please fill in all required fields');
      return;
    }

    updateFormData({ projectInfo: formState });
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Project Information</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Project Name *</label>
          <input
            type="text"
            value={formState.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Project Description *</label>
          <textarea
            value={formState.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Start Date *</label>
            <input
              type="date"
              value={formState.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">End Date *</label>
            <input
              type="date"
              value={formState.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Target Beneficiaries *</label>
          <textarea
            value={formState.targetBeneficiaries}
            onChange={(e) => handleChange('targetBeneficiaries', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Project Location *</label>
          <input
            type="text"
            value={formState.projectLocation}
            onChange={(e) => handleChange('projectLocation', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Estimated Budget *</label>
          <input
            type="text"
            value={formState.estimatedBudget}
            onChange={(e) => handleChange('estimatedBudget', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>
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
  );
}
