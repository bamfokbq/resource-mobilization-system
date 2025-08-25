'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onFirstPage: () => void
  onLastPage: () => void
  onPreviousPage: () => void
  onNextPage: () => void
  canNavigate: {
    previous: boolean
    next: boolean
    first: boolean
    last: boolean
  }
  className?: string
}

export function PageControls({
  currentPage,
  totalPages,
  onPageChange,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  canNavigate,
  className
}: PageControlsProps) {
  const [jumpToPage, setJumpToPage] = useState('')
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 7 // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of middle section
      const start = Math.max(2, currentPage - 2)
      const end = Math.min(totalPages - 1, currentPage + 2)
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      
      // Always show last page if there's more than one page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(jumpToPage, 10)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpToPage('')
    }
  }
  
  const pageNumbers = getPageNumbers()
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFirstPage}
        disabled={!canNavigate.first}
        className="h-9 w-9 p-0"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousPage}
        disabled={!canNavigate.previous}
        className="h-9 w-9 p-0"
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          page === 'ellipsis' ? (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="h-9 w-9 p-0"
            >
              {page}
            </Button>
          )
        ))}
      </div>
      
      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={!canNavigate.next}
        className="h-9 w-9 p-0"
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={onLastPage}
        disabled={!canNavigate.last}
        className="h-9 w-9 p-0"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
      
      {/* Jump to Page (for larger datasets) */}
      {totalPages > 10 && (
        <form onSubmit={handleJumpToPage} className="flex items-center ml-4">
          <span className="text-sm text-gray-600 mr-2">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="Page"
            className="w-16 h-8 px-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="ml-1 h-8 px-3 text-xs"
          >
            Go
          </Button>
        </form>
      )}
    </div>
  )
}
