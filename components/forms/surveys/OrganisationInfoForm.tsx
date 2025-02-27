"use client";

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { OrganisationInfo, FormData } from '@/types/forms';
import { toast } from 'sonner';

const GHANA_REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North'
];

const SECTORS = [
  'Ghana Government',
  'Patient Organisation',
  'Local NGO',
  'International NGO',
  'Foundation'
];

interface OrganisationInfoFormProps {
  handleNext: () => void;
}

export default function OrganisationInfoForm({ handleNext }: OrganisationInfoFormProps) {
  const { formData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState<Partial<Record<keyof OrganisationInfo, string>>>({});
  const [formState, setFormState] = useState<OrganisationInfo>({
    organisationName: '',
    region: '',
    hasRegionalOffice: false,
    regionalOfficeLocation: '',
    gpsCoordinates: {
      latitude: '',
      longitude: ''
    },
    ghanaPostGPS: '',
    sector: '',
    hqPhoneNumber: '',
    regionalPhoneNumber: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    if (formData?.organisationInfo) {
      setFormState(formData.organisationInfo);
    }
  }, [formData]);

  const handleChange = (field: keyof OrganisationInfo, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof OrganisationInfo, string>> = {};
    let hasErrors = false;

    // Validate required fields
    if (!formState.organisationName) {
      newErrors.organisationName = 'Organization name is required';
      hasErrors = true;
    }
    if (!formState.region) {
      newErrors.region = 'Region is required';
      hasErrors = true;
    }
    if (!formState.sector) {
      newErrors.sector = 'Sector is required';
      hasErrors = true;
    }
    if (!formState.hqPhoneNumber) {
      newErrors.hqPhoneNumber = 'HQ phone number is required';
      hasErrors = true;
    }
    if (!formState.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    }
    if (formState.hasRegionalOffice && !formState.regionalOfficeLocation) {
      newErrors.regionalOfficeLocation = 'Regional office location is required';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      toast.error('Please fill in all required fields', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const updateData: Partial<FormData> = {
      organisationInfo: formState
    };

    updateFormData(updateData);
    toast.success('Information saved successfully', {
      position: 'top-center',
      duration: 2000,
    });
    handleNext();
  };

  return (
    <div className=" bg-white rounded-lg shadow-sm p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Section A: Organisation Information</h2>
        <p className="text-gray-600">Please provide accurate information about your organization</p>
      </div>

      <div className="space-y-8">
        {/* Organization Name */}
        <div className="form-group">
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">A1. What is the full name of your organization?</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-sm text-gray-500 mt-1">Please provide the official name that was used for registration with the Government.</p>
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.organisationName ? 'border-red-500' : 'border-gray-300'
              }`}
            value={formState.organisationName}
            onChange={(e) => handleChange('organisationName', e.target.value)}
            placeholder="Enter your organization's official registered name"
            required
          />
          {errors.organisationName && (
            <p className="mt-1 text-red-500 text-sm">{errors.organisationName}</p>
          )}
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Location Details</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Region Selection */}
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A2. Head Office Region</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formState.region}
                onChange={(e) => handleChange('region', e.target.value)}
                required
              >
                <option value="">Select region</option>
                {GHANA_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1 text-red-500 text-sm">{errors.region}</p>
              )}
            </div>

            {/* Regional Office Radio */}
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A2.a. Regional Office</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    checked={formState.hasRegionalOffice}
                    onChange={() => handleChange('hasRegionalOffice', true)}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    checked={!formState.hasRegionalOffice}
                    onChange={() => handleChange('hasRegionalOffice', false)}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Conditional Regional Office Location */}
          {formState.hasRegionalOffice && (
            <div className="mt-4">
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A2.b. Regional Office Location</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.regionalOfficeLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formState.regionalOfficeLocation}
                onChange={(e) => handleChange('regionalOfficeLocation', e.target.value)}
                placeholder="Enter the location of your regional office"
                required
              />
              {errors.regionalOfficeLocation && (
                <p className="mt-1 text-red-500 text-sm">{errors.regionalOfficeLocation}</p>
              )}
            </div>
          )}
        </div>

        {/* GPS Coordinates */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Location Coordinates</h3>

          <div>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">A3. GPS Coordinates</span>
              <p className="text-sm text-gray-500 mt-1">If your HQ is different from your regional office, kindly provide the coordinates of the HQ.</p>
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formState.gpsCoordinates.latitude}
                onChange={(e) => handleChange('gpsCoordinates', { ...formState.gpsCoordinates, latitude: e.target.value })}
                placeholder="Latitude"
              />
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formState.gpsCoordinates.longitude}
                onChange={(e) => handleChange('gpsCoordinates', { ...formState.gpsCoordinates, longitude: e.target.value })}
                placeholder="Longitude"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">A3a. GhanaPost GPS Address</span>
              <p className="text-sm text-gray-500 mt-1">If your HQ is different from your regional office, kindly provide the address of the HQ.</p>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formState.ghanaPostGPS}
              onChange={(e) => handleChange('ghanaPostGPS', e.target.value)}
              placeholder="Enter your GhanaPost GPS address"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A5a. HQ Phone Number</span>
                <span className="text-red-500 ml-1">*</span>
                <p className="text-sm text-gray-500 mt-1">Enter without country code</p>
              </label>
              <input
                type="tel"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.hqPhoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formState.hqPhoneNumber}
                onChange={(e) => handleChange('hqPhoneNumber', e.target.value)}
                placeholder="Enter phone number"
                required
              />
              {errors.hqPhoneNumber && (
                <p className="mt-1 text-red-500 text-sm">{errors.hqPhoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A5b. Regional Office Phone</span>
                <p className="text-sm text-gray-500 mt-1">If different from HQ</p>
              </label>
              <input
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formState.regionalPhoneNumber}
                onChange={(e) => handleChange('regionalPhoneNumber', e.target.value)}
                placeholder="Enter regional office number"
              />
            </div>
          </div>

          {/* Email and Website */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A6. Email Address</span>
                <span className="text-red-500 ml-1">*</span>
                <p className="text-sm text-gray-500 mt-1">Active email address</p>
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formState.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="organization@example.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">A7. Website</span>
                <p className="text-sm text-gray-500 mt-1">Optional</p>
              </label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formState.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Sector Selection */}
        <div className="form-group">
          <label className="block mb-2">
            <span className="text-gray-700 font-medium">A4. Organization Sector</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.sector ? 'border-red-500' : 'border-gray-300'
              }`}
            value={formState.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            required
          >
            <option value="">Select your organization's sector</option>
            {SECTORS.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          {errors.sector && (
            <p className="mt-1 text-red-500 text-sm">{errors.sector}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
