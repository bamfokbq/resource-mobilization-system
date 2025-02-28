"use client";

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { Activity, NCDType, NCDSpecificInfo, ContinuumOfCare } from '@/types/forms';

interface ProjectActivitiesFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [activities, setActivities] = useState<Activity[]>(formData?.activities || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData?.activities) {
      setActivities(formData.activities);
    }
  }, [formData?.activities]);

  useEffect(() => {
    updateFormData({ activities });
  }, [activities, updateFormData]);

  const addActivity = () => {
    setActivities([...activities, {
      name: '',
      description: '',
      timeline: '',
      budget: 0
    }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: keyof Activity, value: string | number) => {
    const updatedActivities = activities.map((activity, i) => {
      if (i === index) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const handleSubmit = () => {
    if (activities.length === 0) {
      setError('Please add at least one activity');
      return;
    }

    if (activities.some(activity => !activity.name || !activity.description)) {
      setError('Please fill in all required fields');
      return;
    }

    updateFormData({ activities });
    handleNext();
  };

  const handleNCDInfoChange = (ncd: NCDType, field: keyof NCDSpecificInfo, value: any) => {
    if (!formData?.projectInfo?.ncdSpecificInfo) return;

    const updatedFormData = {
      ...formData,
      projectInfo: {
        ...formData.projectInfo,
        ncdSpecificInfo: {
          ...formData.projectInfo.ncdSpecificInfo,
          [ncd]: {
            ...formData.projectInfo.ncdSpecificInfo[ncd],
            [field]: value
          }
        }
      }
    };

    updateFormData(updatedFormData);
  };

  const continuumOfCareOptions: ContinuumOfCare[] = [
    'Health Promotion/Primary prevention',
    'Screening/Risk Assessment',
    'Vaccination'
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Section B.3: Project Activities</h2>
        <p className="text-gray-600 mb-6">
          Activities are the day to day, month to month tasks that you do to achieve your objectives.
          Activities have a focus in that they are done in a specific place (region/district/community),
          they target a certain population, address a set of disease area(s) and seek to improve a section
          on the continuum of care.
        </p>

        {formData?.projectInfo?.targetedNCDs?.map((ncd) => (
          <div key={ncd} className="border p-4 rounded-lg space-y-4 bg-gray-50 mb-6">
            <h3 className="text-lg font-semibold">{ncd}</h3>

            {/* Districts */}
            <div className="form-group">
              <label className="block mb-2">
                <span className="text-gray-700">B3.0e. Which district(s) is the project being implemented?</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                multiple
                className="w-full p-2 border rounded"
                value={formData?.projectInfo?.ncdSpecificInfo[ncd]?.districts || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  handleNCDInfoChange(ncd, 'districts', values);
                }}
              >
                {/* Add your district options here */}
              </select>
            </div>

            {/* Continuum of Care */}
            <div className="form-group">
              <label className="block mb-2">
                <span className="text-gray-700">B3.1. Continuum of care</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                multiple
                className="w-full p-2 border rounded"
                value={formData?.projectInfo?.ncdSpecificInfo[ncd]?.continuumOfCare || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value) as ContinuumOfCare[];
                  handleNCDInfoChange(ncd, 'continuumOfCare', values);
                }}
              >
                {continuumOfCareOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Activity Description */}
            <div className="form-group">
              <label className="block mb-2">
                <span className="text-gray-700">B3.2. Activity description</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData?.projectInfo?.ncdSpecificInfo[ncd]?.activityDescription || ''}
                onChange={(e) => handleNCDInfoChange(ncd, 'activityDescription', e.target.value)}
                placeholder="Please briefly describe (2-3 sentences) the key activities associated with the project."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
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
