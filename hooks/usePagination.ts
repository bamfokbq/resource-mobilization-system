'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface PaginationState {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export function usePagination(defaultPageSize: number = 25) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Parse pagination from URL
  const parsePaginationFromURL = useCallback((): Pick<PaginationState, 'page' | 'pageSize'> => {
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || defaultPageSize.toString(), 10)
    
    return {
      page: Math.max(1, page),
      pageSize: Math.max(10, Math.min(100, pageSize)) // Clamp between 10 and 100
    }
  }, [searchParams, defaultPageSize])
  
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    ...parsePaginationFromURL(),
    totalItems: 0,
    totalPages: 0
  }))
  
  // Update pagination when URL changes
  useEffect(() => {
    const urlPagination = parsePaginationFromURL()
    setPagination(prev => ({
      ...prev,
      ...urlPagination
    }))
  }, [parsePaginationFromURL])
  
  // Update URL with new pagination
  const updateURL = useCallback((newPage: number, newPageSize?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    
    if (newPageSize) {
      params.set('pageSize', newPageSize.toString())
    }
    
    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }, [router, searchParams])
  
  // Go to specific page
  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(pagination.totalPages, page))
    setPagination(prev => ({ ...prev, page: newPage }))
    updateURL(newPage)
  }, [pagination.totalPages, updateURL])
  
  // Go to next page
  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      goToPage(pagination.page + 1)
    }
  }, [pagination.page, pagination.totalPages, goToPage])
  
  // Go to previous page
  const previousPage = useCallback(() => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1)
    }
  }, [pagination.page, goToPage])
  
  // Go to first page
  const firstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])
  
  // Go to last page
  const lastPage = useCallback(() => {
    goToPage(pagination.totalPages)
  }, [pagination.totalPages, goToPage])
  
  // Change page size
  const changePageSize = useCallback((newPageSize: number) => {
    const validPageSize = Math.max(10, Math.min(100, newPageSize))
    setPagination(prev => ({
      ...prev,
      pageSize: validPageSize,
      page: 1 // Reset to first page when changing page size
    }))
    updateURL(1, validPageSize)
  }, [updateURL])
  
  // Update total items (usually called after fetching data)
  const updateTotalItems = useCallback((totalItems: number) => {
    const totalPages = Math.ceil(totalItems / pagination.pageSize)
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      page: Math.min(prev.page, totalPages || 1) // Ensure current page is valid
    }))
  }, [pagination.pageSize])
  
  // Get page range info
  const getPageInfo = useCallback(() => {
    const start = (pagination.page - 1) * pagination.pageSize + 1
    const end = Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
    
    return {
      start,
      end,
      total: pagination.totalItems,
      showing: end - start + 1
    }
  }, [pagination])
  
  // Get page numbers for pagination display
  const getPageNumbers = useCallback((maxVisible: number = 5) => {
    const { page, totalPages } = pagination
    const pages: number[] = []
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Calculate start and end based on current page
      const halfVisible = Math.floor(maxVisible / 2)
      let start = Math.max(1, page - halfVisible)
      let end = Math.min(totalPages, start + maxVisible - 1)
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }, [pagination])
  
  // Check if navigation is available
  const canNavigate = {
    previous: pagination.page > 1,
    next: pagination.page < pagination.totalPages,
    first: pagination.page > 1,
    last: pagination.page < pagination.totalPages
  }
  
  return {
    pagination,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    updateTotalItems,
    getPageInfo,
    getPageNumbers,
    canNavigate
  }
}
