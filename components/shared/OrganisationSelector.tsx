'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FaBuilding } from 'react-icons/fa6'

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const organisations = [
    "All",
    "Local NGO",
    "International NGO",
    "Ghana Government",
    "Civil Society",
    "Private Sector",
    "Patient Organisation",
    "Foreign Government",
    "Faith-based Organisation",
    "Academia / Research",
    "Multilateral",
]

export function OrganisationSelector({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleOrganisationSelect = (selectedOrg: string) => {
    const params = new URLSearchParams(searchParams)
    if (selectedOrg === "All") {
      params.delete('organisation')
    } else {
      params.set('organisation', selectedOrg)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Select onValueChange={handleOrganisationSelect}>
        <SelectTrigger className="w-[220px] border-gray-200 hover:bg-gray-50 bg-white transition-colors text-gray-500 font-light">
          <div className="flex items-center gap-2">
            <FaBuilding className="h-4 w-4 opacity-50" />
            <SelectValue placeholder="Select Organisation" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {organisations.map((org) => (
            <SelectItem
              key={org}
              value={org}
              className="cursor-pointer hover:bg-gray-50 text-gray-600 font-light"
            >
              {org}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default OrganisationSelector
