"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { OrganisationInfo } from '@/types/forms';

interface OrganisationInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function OrganisationInfoForm({ handleNext, handlePrevious }: OrganisationInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [error, setError] = useState<string>('');
  const [formState, setFormState] = useState<OrganisationInfo>({
    organisationName: '',
    registrationNumber: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  const formStateRef = useRef(formState);

  // Sync with store data
  useEffect(() => {
    if (formData && formData.organisationInfo) {
      const newFormState: OrganisationInfo = {
        organisationName: formData.organisationInfo.organisationName || '',
        registrationNumber: formData.organisationInfo.registrationNumber || '',
        address: formData.organisationInfo.address || '',
        contactPerson: formData.organisationInfo.contactPerson || '',
        email: formData.organisationInfo.email || '',
        phone: formData.organisationInfo.phone || ''
      };

      // Compare the new form state with the current form state
      if (
        newFormState.organisationName !== formStateRef.current.organisationName ||
        newFormState.registrationNumber !== formStateRef.current.registrationNumber ||
        newFormState.address !== formStateRef.current.address ||
        newFormState.contactPerson !== formStateRef.current.contactPerson ||
        newFormState.email !== formStateRef.current.email ||
        newFormState.phone !== formStateRef.current.phone
      ) {
        setFormState(newFormState);
        formStateRef.current = newFormState;
      }
    }
  }, [formData]);

  // Update store whenever form state changes
  useEffect(() => {
    formStateRef.current = formState;
    updateFormData({
      organisationInfo: formState
    });
  }, [formState, updateFormData]);

  const handleChange = (field: keyof OrganisationInfo, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formState.organisationName || !formState.email) {
      setError('Please fill in all required fields');
      return;
    }

    // Update form data in the store before proceeding
    updateFormData({
      organisationInfo: formState
    });

    handleNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Organisation Information</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Organisation Name *</label>
          <input
            type="text"
            value={formState.organisationName}
            onChange={(e) => handleChange('organisationName', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Registration Number</label>
          <input
            type="text"
            value={formState.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Address</label>
          <textarea
            value={formState.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Contact Person</label>
          <input
            type="text"
            value={formState.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Email *</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Phone</label>
          <input
            type="text"
            value={formState.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
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
