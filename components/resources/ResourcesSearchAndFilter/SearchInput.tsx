'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, History, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useResourceSearch } from '@/hooks/useResourceSearch'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "Search resources, partners, projects...",
  className 
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  const {
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    recentSearches,
    updateSearchQuery,
    executeSearch,
    selectSuggestion,
    clearSearch,
    closeSuggestions,
    openSuggestions,
    clearSearchHistory
  } = useResourceSearch()
  
  // Handle input change
  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    updateSearchQuery(newValue)
  }
  
  // Handle search execution
  const handleSearch = () => {
    const query = executeSearch(value)
    if (query) {
      onSearch(query)
    }
  }
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    const query = selectSuggestion(suggestion)
    if (query) {
      onSearch(query)
    }
  }
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      closeSuggestions()
      inputRef.current?.blur()
    }
  }
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true)
    openSuggestions()
  }
  
  // Handle blur with delay to allow clicking suggestions
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
      closeSuggestions()
    }, 200)
  }
  
  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        closeSuggestions()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeSuggestions])
  
  // Clear search
  const handleClear = () => {
    clearSearch()
    onChange('')
    inputRef.current?.focus()
  }
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-20",
            isFocused && "ring-2 ring-blue-500 border-blue-500"
          )}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoadingSuggestions && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="h-8 px-3 text-sm font-medium"
          >
            Search
          </Button>
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.length === 0 && recentSearches.length > 0 && (
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearchHistory}
                  className="h-6 px-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}-${index}`}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                {suggestion.type === 'resource' && !recentSearches.includes(suggestion.value) && (
                  <Search className="h-3 w-3 text-gray-400" />
                )}
                {recentSearches.includes(suggestion.value) && (
                  <History className="h-3 w-3 text-gray-400" />
                )}
                <span className="text-sm text-gray-900">{suggestion.label}</span>
              </div>
              {'count' in suggestion && suggestion.count && (
                <span className="text-xs text-gray-400">{suggestion.count} results</span>
              )}
            </button>
          ))}
          
          {suggestions.length === 0 && value.length >= 2 && !isLoadingSuggestions && (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
