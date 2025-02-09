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
    <div className="flex gap-4 items-center">
      <div>
        <label htmlFor="startDate" className="block text-sm mb-1">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          className="border rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm mb-1">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          className="border rounded p-2"
        />
      </div>
    </div>
  )
}
