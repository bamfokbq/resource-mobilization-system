import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { ProjectInfoFormData } from '@/types/forms';
import { useForm } from 'react-hook-form';

interface ProjectInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectInfoForm({ handleNext, handlePrevious }: ProjectInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectInfoFormData>({
    defaultValues: formData.projectInfo
  });

  const onSubmit = (data: ProjectInfoFormData) => {
    updateFormData({ projectInfo: data });
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Project Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Project Name *</label>
          <input
            type="text"
            {...register("projectName", { required: "Project name is required" })}
            className="w-full p-2 border rounded bg-white"
            required
          />
          {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Project Description *</label>
          <textarea
            {...register("projectDescription", { required: "Description is required" })}
            className="w-full p-2 border rounded bg-white"
            rows={2}
            required
          />
          {errors.projectDescription && <p className="text-red-500 text-sm">{errors.projectDescription.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Start Date *</label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full p-2 border rounded bg-white"
              required
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-gray-600">End Date *</label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="w-full p-2 border rounded bg-white"
              required
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Target Beneficiaries *</label>
          <textarea
            {...register("targetBeneficiaries", { required: "Target beneficiaries is required" })}
            className="w-full p-2 border rounded bg-white"
            rows={2}
            required
          />
          {errors.targetBeneficiaries && <p className="text-red-500 text-sm">{errors.targetBeneficiaries.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Project Location *</label>
          <input
            type="text"
            {...register("projectLocation", { required: "Project location is required" })}
            className="w-full p-2 border rounded bg-white"
            required
          />
          {errors.projectLocation && <p className="text-red-500 text-sm">{errors.projectLocation.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Estimated Budget *</label>
          <input
            type="text"
            {...register("estimatedBudget", { required: "Estimated budget is required" })}
            className="w-full p-2 border rounded bg-white"
            required
          />
          {errors.estimatedBudget && <p className="text-red-500 text-sm">{errors.estimatedBudget.message}</p>}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
