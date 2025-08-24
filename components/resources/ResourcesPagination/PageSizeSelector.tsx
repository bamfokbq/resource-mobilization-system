'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface PageSizeSelectorProps {
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  options?: number[]
  className?: string
}

const defaultOptions = [10, 25, 50, 100]

export function PageSizeSelector({ 
  pageSize, 
  onPageSizeChange, 
  options = defaultOptions,
  className 
}: PageSizeSelectorProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Label htmlFor="page-size" className="text-sm text-gray-600">
        Show:
      </Label>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
      >
        <SelectTrigger id="page-size" className="w-20 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600">per page</span>
    </div>
  )
}
