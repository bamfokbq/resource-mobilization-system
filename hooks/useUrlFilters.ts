'use client'

import { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { DateRange } from 'react-day-picker'

export interface FilterState {
  dateRange?: string
  startDate?: string
  endDate?: string
  region?: string
  organization?: string
  disease?: string
  status?: string
  ageGroup?: string
  implementer?: string
  [key: string]: string | undefined
}

export interface UseUrlFiltersReturn {
  filters: FilterState
  updateFilter: (key: string, value: string | undefined) => void
  updateMultipleFilters: (updates: Partial<FilterState>) => void
  clearAllFilters: () => void
  clearFilter: (key: string) => void
  setDateRange: (dateRange?: DateRange) => void
  getActiveFilterCount: () => number
  buildQueryString: (additionalParams?: Record<string, string>) => string
}

/**
 * Custom hook for managing URL-based filters
 * Provides a clean interface for reading and updating filter state in the URL
 */
export function useUrlFilters(): UseUrlFiltersReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const filters = useMemo<FilterState>(() => ({
    dateRange: searchParams.get('dateRange') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    region: searchParams.get('region') || undefined,
    organization: searchParams.get('organization') || undefined,
    disease: searchParams.get('disease') || undefined,
    status: searchParams.get('status') || undefined,
    ageGroup: searchParams.get('ageGroup') || undefined,
    implementer: searchParams.get('implementer') || undefined,
  }), [searchParams])

  // Update a single filter
  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (!value || value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Update multiple filters at once
  const updateMultipleFilters = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all' || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    router.push(window.location.pathname as Route, { scroll: false })
  }, [router])

  // Clear a specific filter
  const clearFilter = useCallback((key: string) => {
    updateFilter(key, undefined)
  }, [updateFilter])

  // Set date range (handles both preset and custom ranges)
  const setDateRange = useCallback((dateRange?: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (dateRange?.from && dateRange?.to) {
      params.set('startDate', dateRange.from.toISOString())
      params.set('endDate', dateRange.to.toISOString())
      // Keep dateRange param if it was set by a preset
      if (!searchParams.get('dateRange')) {
        params.delete('dateRange')
      }
    } else {
      params.delete('startDate')
      params.delete('endDate')
      params.delete('dateRange')
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Get count of active filters
  const getActiveFilterCount = useCallback(() => {
    return Object.entries(filters).filter(([key, value]) => {
      // Don't count empty or undefined values
      if (!value || value === 'all') return false
      // Don't count endDate separately if startDate exists (they're one filter)
      if (key === 'endDate' && filters.startDate) return false
      return true
    }).length
  }, [filters])

  // Build query string with current filters plus additional params
  const buildQueryString = useCallback((additionalParams?: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
    }
    
    return params.toString()
  }, [searchParams])

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    clearAllFilters,
    clearFilter,
    setDateRange,
    getActiveFilterCount,
    buildQueryString
  }
}

// Helper functions for working with filters

/**
 * Apply filters to a dataset
 */
export function applyFilters<T extends Record<string, any>>(
  data: T[],
  filters: FilterState,
  fieldMappings?: Record<string, keyof T>
): T[] {
  return data.filter(item => {
    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      
      // Check multiple possible date fields
      const dateFields = ['startDate', 'endDate', 'createdAt', 'submissionDate', 'uploadDate']
      const hasValidDate = dateFields.some(field => {
        const itemDate = item[field] ? new Date(item[field]) : null
        return itemDate && itemDate >= startDate && itemDate <= endDate
      })
      
      if (!hasValidDate) return false
    }

    // Apply other filters
    const filterEntries = Object.entries(filters).filter(([key, value]) => 
      value && value !== 'all' && key !== 'startDate' && key !== 'endDate' && key !== 'dateRange'
    )

    return filterEntries.every(([filterKey, filterValue]) => {
      const itemField = fieldMappings?.[filterKey] || filterKey
      const itemValue = item[itemField]
      
      if (!itemValue) return false
      
      // Handle array values (e.g., tags, categories)
      if (Array.isArray(itemValue)) {
        return itemValue.some((val: any) => 
          val.toString().toLowerCase().includes(filterValue!.toLowerCase())
        )
      }
      
      // Handle string values
      return itemValue.toString().toLowerCase().includes(filterValue!.toLowerCase())
    })
  })
}

/**
 * Get filter options from a dataset
 */
export function getFilterOptions<T extends Record<string, any>>(
  data: T[],
  fieldMappings: Record<string, keyof T>
): Record<string, string[]> {
  const options: Record<string, string[]> = {}
  
  Object.entries(fieldMappings).forEach(([filterKey, dataField]) => {
    const values = new Set<string>()
    
    data.forEach(item => {
      const value = item[dataField]
      
      if (Array.isArray(value)) {
        value.forEach((v: any) => values.add(v.toString()))
      } else if (value) {
        values.add(value.toString())
      }
    })
    
    options[filterKey] = Array.from(values).sort()
  })
  
  return options
}

/**
 * Create URL-safe filter state from object
 */
export function createFilterState(filters: Record<string, any>): FilterState {
  const state: FilterState = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      if (value instanceof Date) {
        state[key] = value.toISOString()
      } else {
        state[key] = value.toString()
      }
    }
  })
  
  return state
}

/**
 * Parse filter state from URL params
 */
export function parseFilterState(searchParams: URLSearchParams): FilterState {
  const state: FilterState = {}
  
  searchParams.forEach((value, key) => {
    if (value && value !== 'all') {
      state[key] = value
    }
  })
  
  return state
}

export default useUrlFilters
