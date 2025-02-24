'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { FaGlobe } from 'react-icons/fa6'

export function RegionSelector({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Predefined regions of Ghana
  const regions = [
    'Ahafo Region',
    'Ashanti Region',
    'Bono East Region',
    'Bono Region',
    'Central Region',
    'Eastern Region',
    'Greater Accra Region',
    'North East Region',
    'Northern Region',
    'Oti Region',
    'Savannah Region',
    'Upper East Region',
    'Upper West Region',
    'Volta Region',
    'Western North Region',
    'Western Region'
  ]

  // Handle region selection
  const handleRegionSelect = (selectedRegion: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('region', selectedRegion)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Select onValueChange={handleRegionSelect}>
        <SelectTrigger className="w-[220px] border-gray-200 hover:bg-gray-50 bg-white transition-colors text-gray-500 font-light">
          <div className="flex items-center gap-2">
            <FaGlobe className="h-4 w-4 opacity-50" />
            <SelectValue placeholder="Select Region" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem
              key={region}
              value={region}
              className="cursor-pointer hover:bg-gray-50 text-gray-600 font-light"
            >
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RegionSelector
