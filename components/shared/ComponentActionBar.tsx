'use client'

import { Button } from "@/components/ui/button"
import { 
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  BarChart3
} from "lucide-react"

interface ComponentActionBarProps {
  title?: string
  showAddButton?: boolean
  showExportButtons?: boolean
  showVisualizationDownload?: boolean
  onAddClick?: () => void
  onExportExcel?: () => void
  onExportPDF?: () => void
  onDownloadVisualization?: () => void
  className?: string
}

export function ComponentActionBar({
  title = "Actions",
  showAddButton = false,
  showExportButtons = true,
  showVisualizationDownload = true,
  onAddClick,
  onExportExcel,
  onExportPDF,
  onDownloadVisualization,
  className
}: ComponentActionBarProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      
      <div className="flex items-center gap-2">
        {/* Add Button (Admin Only) */}
        {showAddButton && onAddClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddClick}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Activity
          </Button>
        )}

        {/* Export Buttons */}
        {showExportButtons && (
          <>
            {onExportExcel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportExcel}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </Button>
            )}
            
            {onExportPDF && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
            )}
          </>
        )}

        {/* Download Visualization */}
        {showVisualizationDownload && onDownloadVisualization && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadVisualization}
            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Download Chart
          </Button>
        )}
      </div>
    </div>
  )
}
