'use client'

import * as React from "react"
import { addDays, subDays, subMonths, subYears, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { FaCalendar } from 'react-icons/fa6'

export function DateRangeSelector({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Preset date ranges
  const presetRanges = {
    'Last Week': {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    'Last Month': {
      from: subMonths(new Date(), 1),
      to: new Date()
    },
    'Last Year': {
      from: subYears(new Date(), 1),
      to: new Date()
    }
  }

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  // Handle date selection and update route
  const handleDateSelect = (selectedDate?: DateRange) => {
    setDate(selectedDate)

    if (selectedDate?.from && selectedDate?.to) {
      const params = new URLSearchParams(searchParams)
      params.set('startDate', selectedDate.from.toISOString())
      params.set('endDate', selectedDate.to.toISOString())

      router.push(`?${params.toString()}`)
    }
  }

  // Handle preset range selection
  const handlePresetSelect = (preset: keyof typeof presetRanges) => {
    const selectedRange = presetRanges[preset]
    handleDateSelect(selectedRange)
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Select onValueChange={handlePresetSelect}>
        <SelectTrigger className="w-[140px] border-gray-200 hover:bg-gray-50 bg-white transition-colors text-gray-500 font-light">
          <SelectValue placeholder="Quick Select" />
        </SelectTrigger>
        <SelectContent className="w-[140px]">
          {Object.keys(presetRanges).map((preset) => (
            <SelectItem
              key={preset}
              value={preset}
              className="cursor-pointer hover:bg-gray-50 text-gray-600 font-light"
            >
              {preset}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "min-w-[260px] justify-between text-sm font-light border-gray-200 hover:bg-gray-50 transition-colors text-gray-600",
              !date && "text-gray-400"
            )}
          >
            <span>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM dd, yyyy")} -{" "}
                    {format(date.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Select date range</span>
              )}
            </span>
            <FaCalendar className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto text-gray-500 p-0 border-gray-200 shadow-lg"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}