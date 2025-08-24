'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { ResourceSearchSuggestion } from '@/types/resources'

export function useResourceSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ResourceSearchSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resource-search-history')
      if (stored) {
        const history = JSON.parse(stored)
        setSearchHistory(history)
        setRecentSearches(history.slice(0, 5)) // Last 5 searches
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }, [])
  
  // Save search to history
  const saveToHistory = (query: string) => {
    if (!query.trim() || query.length < 2) return
    
    try {
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 20) // Keep last 20
      setSearchHistory(newHistory)
      setRecentSearches(newHistory.slice(0, 5))
      localStorage.setItem('resource-search-history', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }
  
  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([])
    setRecentSearches([])
    try {
      localStorage.removeItem('resource-search-history')
    } catch (error) {
      console.error('Failed to clear search history:', error)
    }
  }
  
  // Mock function to fetch suggestions (replace with actual API call)
  const fetchSuggestions = async (query: string): Promise<ResourceSearchSuggestion[]> => {
    try {
      // Import the API function dynamically to avoid circular dependencies
      const { searchSuggestions } = await import('@/lib/api/resources')
      return await searchSuggestions(query)
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
      return []
    }
  }
  
  // Debounced suggestion fetch
  const debouncedFetchSuggestions = async (query: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (query.length < 2) {
      setSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }
    
    setIsLoadingSuggestions(true)
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController()
        const results = await fetchSuggestions(query)
        
        if (!abortControllerRef.current.signal.aborted) {
          setSuggestions(results)
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to fetch suggestions:', error)
          setSuggestions([])
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 300)
  }
  
  // Update search query and fetch suggestions
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(true)
    debouncedFetchSuggestions(query)
  }
  
  // Execute search
  const executeSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      saveToHistory(searchTerm.trim())
      setShowSuggestions(false)
      return searchTerm.trim()
    }
    return null
  }
  
  // Select suggestion
  const selectSuggestion = (suggestion: ResourceSearchSuggestion) => {
    setSearchQuery(suggestion.value)
    setShowSuggestions(false)
    return executeSearch(suggestion.value)
  }
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setIsLoadingSuggestions(false)
  }
  
  // Close suggestions
  const closeSuggestions = () => {
    setShowSuggestions(false)
  }
  
  // Open suggestions
  const openSuggestions = () => {
    if (searchQuery.length >= 2 || recentSearches.length > 0) {
      setShowSuggestions(true)
    }
  }
  
  // Get display suggestions (mix of actual suggestions and recent searches)
  const displaySuggestions = useMemo(() => {
    if (searchQuery.length < 2) {
      // Show recent searches when no query
      return recentSearches.map(search => ({
        type: 'resource' as const,
        value: search,
        label: search
      }))
    }
    
    return suggestions
  }, [searchQuery, suggestions, recentSearches])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  return {
    searchQuery,
    suggestions: displaySuggestions,
    isLoadingSuggestions,
    showSuggestions,
    searchHistory,
    recentSearches,
    updateSearchQuery,
    executeSearch,
    selectSuggestion,
    clearSearch,
    closeSuggestions,
    openSuggestions,
    clearSearchHistory
  }
}
