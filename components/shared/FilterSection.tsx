"use client";

import { FaFilter } from 'react-icons/fa'
import { TbFilterOff } from 'react-icons/tb'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  children: React.ReactNode
//   onClearFilters?: () => void
}

export default function FilterSection({ children }: FilterSectionProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const activeFiltersCount = Array.from(searchParams.keys()).length

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams)
        for (const key of Array.from(params.keys())) {
            params.delete(key)
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

  return (
    <div className="relative bg-white rounded-xl shadow-sm p-3 mt-2 border border-gray-100">
      <div 
        className="absolute inset-0 opacity-[0.03] rounded-xl"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaFilter className="w-3.5 h-3.5 text-navy-blue/70" />
            <h2 className="text-base font-medium text-navy-blue/90">
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-navy-blue/10 text-navy-blue rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
          </div>
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      disabled={activeFiltersCount === 0}
                      className={cn(
                          "text-gray-500 px-2 h-8 transition-all duration-200",
                          activeFiltersCount > 0
                              ? "hover:text-red-600 hover:bg-red-50"
                              : "opacity-50 cursor-not-allowed"
                      )}
                  >
                      <TbFilterOff className="w-4 h-4 mr-2" />
                      Clear {activeFiltersCount > 0 ? `(${activeFiltersCount})` : 'filters'}
                  </Button>
        </div>
        <div className="flex flex-wrap gap-3 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
