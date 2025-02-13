"use client";

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';

interface PartnersInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

interface Partner {
  organisationName: string;
  role: string;
  contribution: string;
  contactPerson: string;
  email: string;
}

export default function PartnersInfoForm({ handleNext, handlePrevious }: PartnersInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [partners, setPartners] = useState<Partner[]>(formData.partners || []);
  const [error, setError] = useState('');

  // Sync with store data
  useEffect(() => {
    if (formData.partners) {
      setPartners(formData.partners);
    }
  }, [formData.partners]);

  // Update store whenever partners change
  useEffect(() => {
    updateFormData({ partners });
  }, [partners, updateFormData]);

  const addPartner = () => {
    setPartners([...partners, {
      organisationName: '',
      role: '',
      contribution: '',
      contactPerson: '',
      email: ''
    }]);
  };

  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const updatePartner = (index: number, field: keyof Partner, value: string) => {
    const updatedPartners = partners.map((partner, i) => {
      if (i === index) {
        return { ...partner, [field]: value };
      }
      return partner;
    });
    setPartners(updatedPartners);
  };

  const handleSubmit = () => {
    if (partners.some(partner => !partner.organisationName || !partner.role)) {
      setError('Please fill in all required fields (Organization Name and Role)');
      return;
    }

    updateFormData({ partners });
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Partners</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {partners.map((partner, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Partner {index + 1}</h3>
            <button
              onClick={() => removePartner(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-600">Organization Name *</label>
              <input
                type="text"
                value={partner.organisationName}
                onChange={(e) => updatePartner(index, 'organisationName', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Role in Project *</label>
              <input
                type="text"
                value={partner.role}
                onChange={(e) => updatePartner(index, 'role', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Contribution/Expertise</label>
              <textarea
                value={partner.contribution}
                onChange={(e) => updatePartner(index, 'contribution', e.target.value)}
                className="w-full p-2 border rounded bg-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Contact Person</label>
              <input
                type="text"
                value={partner.contactPerson}
                onChange={(e) => updatePartner(index, 'contactPerson', e.target.value)}
                className="w-full p-2 border rounded bg-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Email</label>
              <input
                type="email"
                value={partner.email}
                onChange={(e) => updatePartner(index, 'email', e.target.value)}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addPartner}
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Partner
      </button>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
