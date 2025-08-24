'use client'

import { PageControls } from './ResourcesPagination/PageControls'
import { PageSizeSelector } from './ResourcesPagination/PageSizeSelector'
import { usePagination } from '@/hooks/usePagination'
import { cn } from '@/lib/utils'

interface ResourcesPaginationProps {
    className?: string
}

export default function ResourcesPagination({ className }: ResourcesPaginationProps) {
    const {
        pagination,
        goToPage,
        nextPage,
        previousPage,
        firstPage,
        lastPage,
        changePageSize,
        getPageInfo,
        canNavigate
    } = usePagination(25)

    const pageInfo = getPageInfo()

    // Don't render if there's only one page or no data
    if (pagination.totalPages <= 1) {
        return null
    }

  return (
      <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-6", className)}>
          {/* Page Info and Size Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{pageInfo.start}</span> to{' '}
                  <span className="font-medium">{pageInfo.end}</span> of{' '}
                  <span className="font-medium">{pageInfo.total}</span> results
              </div>

              <PageSizeSelector
                  pageSize={pagination.pageSize}
                  onPageSizeChange={changePageSize}
                  options={[10, 25, 50, 100]}
              />
          </div>

          {/* Page Controls */}
          <PageControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
              onFirstPage={firstPage}
              onLastPage={lastPage}
              onPreviousPage={previousPage}
              onNextPage={nextPage}
              canNavigate={canNavigate}
          />
      </div>
  )
}
