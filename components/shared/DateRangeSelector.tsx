"use client";

import React, { useState } from 'react'

export default function DateRangeSelector() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    setDateRange(newDateRange);
    console.log('Selected date range:', newDateRange);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  )
}
