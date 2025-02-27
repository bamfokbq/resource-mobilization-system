"use client";

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { Activity } from '@/types/forms';

interface ProjectActivitiesFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [activities, setActivities] = useState<Activity[]>(formData.activities || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.activities) {
      setActivities(formData.activities);
    }
  }, [formData.activities]);

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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Activities</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {activities.map((activity, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Activity {index + 1}</h3>
            <button
              onClick={() => removeActivity(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-600">Activity Name *</label>
              <input
                type="text"
                value={activity.name}
                onChange={(e) => updateActivity(index, 'name', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Description *</label>
              <textarea
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Timeline</label>
              <input
                type="text"
                value={activity.timeline}
                onChange={(e) => updateActivity(index, 'timeline', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                placeholder="e.g., Q1 2024"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Budget</label>
              <input
                type="number"
                value={activity.budget}
                onChange={(e) => updateActivity(index, 'budget', Number(e.target.value))}
                className="w-full p-2 border rounded bg-white"
                min="0"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addActivity}
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Activity
      </button>

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
