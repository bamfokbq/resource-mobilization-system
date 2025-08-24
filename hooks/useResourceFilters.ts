'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResourceFilters } from '@/types/resources'

// Custom debounce hook
function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
}

export function useResourceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Parse filters from URL
  const parseFiltersFromURL = useCallback((): ResourceFilters => {
    const filters: ResourceFilters = {}
    
    const search = searchParams.get('search')
    if (search) filters.search = search
    
    const type = searchParams.getAll('type')
    if (type.length > 0) filters.type = type as any[]
    
    const partnerId = searchParams.getAll('partner')
    if (partnerId.length > 0) filters.partnerId = partnerId
    
    const projectId = searchParams.getAll('project')
    if (projectId.length > 0) filters.projectId = projectId
    
    const status = searchParams.getAll('status')
    if (status.length > 0) filters.status = status as any[]
    
    const accessLevel = searchParams.getAll('access')
    if (accessLevel.length > 0) filters.accessLevel = accessLevel as any[]
    
    const fileFormat = searchParams.getAll('format')
    if (fileFormat.length > 0) filters.fileFormat = fileFormat as any[]
    
    const tags = searchParams.getAll('tag')
    if (tags.length > 0) filters.tags = tags
    
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const dateField = searchParams.get('dateField') as 'uploadDate' | 'publicationDate'
    
    if (dateFrom || dateTo) {
      filters.dateRange = {
        from: dateFrom || '',
        to: dateTo || '',
        field: dateField || 'uploadDate'
      }
    }
    
    const sortBy = searchParams.get('sortBy')
    if (sortBy) filters.sortBy = sortBy as any
    
    const sortOrder = searchParams.get('sortOrder')
    if (sortOrder) filters.sortOrder = sortOrder as any
    
    return filters
  }, [searchParams])
  
  const [filters, setFilters] = useState<ResourceFilters>(parseFiltersFromURL)
  const [isLoading, setIsLoading] = useState(false)
  
  // Update filters when URL changes
  useEffect(() => {
    setFilters(parseFiltersFromURL())
  }, [parseFiltersFromURL])
  
  // Build URL search params from filters
  const buildURLParams = useCallback((newFilters: ResourceFilters) => {
    const params = new URLSearchParams()
    
    if (newFilters.search) params.set('search', newFilters.search)
    
    newFilters.type?.forEach(type => params.append('type', type))
    newFilters.partnerId?.forEach(id => params.append('partner', id))
    newFilters.projectId?.forEach(id => params.append('project', id))
    newFilters.status?.forEach(status => params.append('status', status))
    newFilters.accessLevel?.forEach(level => params.append('access', level))
    newFilters.fileFormat?.forEach(format => params.append('format', format))
    newFilters.tags?.forEach(tag => params.append('tag', tag))
    
    if (newFilters.dateRange) {
      if (newFilters.dateRange.from) params.set('dateFrom', newFilters.dateRange.from)
      if (newFilters.dateRange.to) params.set('dateTo', newFilters.dateRange.to)
      params.set('dateField', newFilters.dateRange.field)
    }
    
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder)
    
    return params.toString()
  }, [])
  
  // Debounced URL update to prevent excessive history entries
  const debouncedUpdateURL = useDebounceCallback((newFilters: ResourceFilters) => {
    const queryString = buildURLParams(newFilters)
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }, 300)
  
  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ResourceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    debouncedUpdateURL(updatedFilters)
  }, [filters, debouncedUpdateURL])
  
  // Update a specific filter
  const updateFilter = useCallback(<K extends keyof ResourceFilters>(
    key: K,
    value: ResourceFilters[K]
  ) => {
    updateFilters({ [key]: value })
  }, [updateFilters])
  
  // Add to array filter
  const addToFilter = useCallback(<K extends keyof ResourceFilters>(
    key: K,
    value: string
  ) => {
    const currentValue = filters[key] as string[] | undefined
    const newValue = currentValue ? [...currentValue, value] : [value]
    updateFilter(key, newValue as ResourceFilters[K])
  }, [filters, updateFilter])
  
  // Remove from array filter
  const removeFromFilter = useCallback(<K extends keyof ResourceFilters>(
    key: K,
    value: string
  ) => {
    const currentValue = filters[key] as string[] | undefined
    if (currentValue) {
      const newValue = currentValue.filter(item => item !== value)
      updateFilter(key, newValue.length > 0 ? newValue as ResourceFilters[K] : undefined)
    }
  }, [filters, updateFilter])
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    router.push(window.location.pathname, { scroll: false })
  }, [router])
  
  // Clear specific filter
  const clearFilter = useCallback(<K extends keyof ResourceFilters>(key: K) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    debouncedUpdateURL(newFilters)
  }, [filters, debouncedUpdateURL])
  
  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'search' && value) return count + 1
      if (Array.isArray(value) && value.length > 0) return count + value.length
      if (key === 'dateRange' && value) return count + 1
      if (typeof value === 'string' && value) return count + 1
      return count
    }, 0)
  }, [filters])
  
  // Check if specific filter is active
  const isFilterActive = useCallback(<K extends keyof ResourceFilters>(
    key: K,
    value?: string
  ) => {
    const filterValue = filters[key]
    if (!filterValue) return false
    if (value && Array.isArray(filterValue)) {
      return (filterValue as string[]).includes(value)
    }
    return !!filterValue
  }, [filters])
  
  return {
    filters,
    isLoading,
    setIsLoading,
    updateFilters,
    updateFilter,
    addToFilter,
    removeFromFilter,
    clearFilters,
    clearFilter,
    activeFilterCount,
    isFilterActive,
    buildURLParams
  }
}
