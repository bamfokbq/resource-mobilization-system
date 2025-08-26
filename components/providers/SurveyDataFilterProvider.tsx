'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUrlFilters, FilterState } from '@/hooks/useUrlFilters'

interface SurveyDataFilterContextType {
  globalFilters: FilterState
  updateGlobalFilter: (key: string, value: string | undefined) => void
  clearGlobalFilters: () => void
  getActiveFilterCount: () => number
}

const SurveyDataFilterContext = createContext<SurveyDataFilterContextType | undefined>(undefined)

export function useSurveyDataFilters() {
  const context = useContext(SurveyDataFilterContext)
  if (context === undefined) {
    throw new Error('useSurveyDataFilters must be used within a SurveyDataFilterProvider')
  }
  return context
}

interface SurveyDataFilterProviderProps {
  children: React.ReactNode
}

export function SurveyDataFilterProvider({ children }: SurveyDataFilterProviderProps) {
  const { filters, updateFilter, clearAllFilters, getActiveFilterCount } = useUrlFilters()

  // Only expose global filters (date, region, organization, disease)
  const globalFilters: FilterState = {
    dateRange: filters.dateRange,
    startDate: filters.startDate,
    endDate: filters.endDate,
    region: filters.region,
    organization: filters.organization,
    disease: filters.disease,
  }

  const updateGlobalFilter = (key: string, value: string | undefined) => {
    // Only allow updates to global filter keys
    const allowedKeys = ['dateRange', 'startDate', 'endDate', 'region', 'organization', 'disease']
    if (allowedKeys.includes(key)) {
      updateFilter(key, value)
    }
  }

  const clearGlobalFilters = () => {
    // Clear only global filters, preserve component-specific filters
    const allowedKeys = ['dateRange', 'startDate', 'endDate', 'region', 'organization', 'disease']
    allowedKeys.forEach(key => updateFilter(key, undefined))
  }

  const value: SurveyDataFilterContextType = {
    globalFilters,
    updateGlobalFilter,
    clearGlobalFilters,
    getActiveFilterCount: () => {
      return Object.entries(globalFilters).filter(([key, value]) => {
        if (!value || value === 'all') return false
        if (key === 'endDate' && globalFilters.startDate) return false
        return true
      }).length
    }
  }

  return (
    <SurveyDataFilterContext.Provider value={value}>
      {children}
    </SurveyDataFilterContext.Provider>
  )
}
