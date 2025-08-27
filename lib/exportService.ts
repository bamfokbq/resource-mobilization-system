import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { toast } from 'sonner'

export interface ExportData {
  [key: string]: any
}

export interface ExportOptions {
  filename?: string
  title?: string
  subtitle?: string
  includeTimestamp?: boolean
  customFields?: { [key: string]: string }
}

export class ExportService {
  /**
   * Export data to Excel format
   */
  static async exportToExcel(
    data: ExportData[],
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_export',
        title = 'NCD Navigator Data Export',
        includeTimestamp = true
      } = options

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Prepare data with timestamp if requested
      const exportData = data.map(item => ({
        ...item,
        ...(includeTimestamp && { 
          export_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss') 
        })
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      const colWidths = Object.keys(exportData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }))
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data')

      // Add metadata sheet
      const metadata = [
        ['Export Information'],
        ['Title:', title],
        ['Export Date:', format(new Date(), 'MMMM dd, yyyy HH:mm:ss')],
        ['Records Count:', data.length.toString()],
        ['Source:', 'NCD Navigator Platform'],
        ...(options.customFields ? Object.entries(options.customFields) : [])
      ]

      const metaWs = XLSX.utils.aoa_to_sheet(metadata)
      XLSX.utils.book_append_sheet(wb, metaWs, 'Export Info')

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
      const finalFilename = `${filename}_${timestamp}.xlsx`

      // Write file
      XLSX.writeFile(wb, finalFilename)

      toast.success('Excel export completed successfully!', {
        description: `File saved as: ${finalFilename}`
      })
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error('Failed to export to Excel', {
        description: 'Please try again or contact support'
      })
      throw error
    }
  }

  /**
   * Export data to CSV format (fallback for PDF)
   */
  static async exportToCSV(
    data: ExportData[],
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_export',
        title = 'NCD Navigator Data Export',
        includeTimestamp = true
      } = options

      // Add header information
      const headerRows = [
        [title],
        [`Export Date: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`],
        [`Records: ${data.length}`],
        ['Source: NCD Navigator Platform'],
        [''], // Empty row
        ...Object.keys(data[0] || {}).length > 0 ? [Object.keys(data[0])] : []
      ]

      // Convert data to CSV format
      const csvData = [
        ...headerRows,
        ...data.map(item => Object.values(item).map(value => 
          typeof value === 'object' ? JSON.stringify(value) : String(value || '')
        ))
      ]

      // Create CSV content
      const csvContent = csvData.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      ).join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
      const finalFilename = `${filename}_${timestamp}.csv`
      
      link.href = url
      link.download = finalFilename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)

      toast.success('CSV export completed successfully!', {
        description: `File saved as: ${finalFilename}`
      })
    } catch (error) {
      console.error('CSV export error:', error)
      toast.error('Failed to export to CSV', {
        description: 'Please try again or contact support'
      })
      throw error
    }
  }

  /**
   * Export data to PDF format using print functionality
   */
  static async exportToPDF(
    data: ExportData[],
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        title = 'NCD Navigator Data Export',
        subtitle = 'Platform Data Report'
      } = options

      // Create a new window with the data
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.')
      }

      // Generate HTML table
      const headers = Object.keys(data[0] || {})
      const tableHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #333; }
            .subtitle { font-size: 16px; color: #666; margin: 5px 0; }
            .meta { font-size: 12px; color: #888; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
            <div class="meta">
              Export Date: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}<br>
              Records: ${data.length}<br>
              Source: NCD Navigator Platform
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  ${headers.map(header => `<td>${item[header] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
        </html>
      `

      printWindow.document.write(tableHTML)
      printWindow.document.close()

      toast.success('PDF export initiated!', {
        description: 'Use your browser\'s print dialog to save as PDF'
      })
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export to PDF', {
        description: 'Please try again or contact support'
      })
      throw error
    }
  }

  /**
   * Export chart/visualization as image using canvas
   */
  static async exportChartAsImage(
    chartElement: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_chart',
      } = options

      // Try to get canvas element from the chart
      const canvas = chartElement.querySelector('canvas') as HTMLCanvasElement
      
      if (canvas) {
        // If there's a canvas, use it directly
        const link = document.createElement('a')
        link.download = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.png`
        link.href = canvas.toDataURL('image/png')
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('Chart exported successfully!', {
          description: `Saved as: ${link.download}`
        })
      } else {
        // Fallback: try to find SVG elements
        const svgElement = chartElement.querySelector('svg') as SVGElement
        
        if (svgElement) {
          await this.exportChartAsSVG(svgElement, options)
        } else {
          throw new Error('No exportable chart found (canvas or SVG)')
        }
      }
    } catch (error) {
      console.error('Chart export error:', error)
      toast.error('Failed to export chart', {
        description: 'Please try again or contact support'
      })
      throw error
    }
  }

  /**
   * Export visualization as SVG
   */
  static async exportChartAsSVG(
    svgElement: SVGElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_chart',
      } = options

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      
      // Set background color
      clonedSvg.style.backgroundColor = '#ffffff'
      
      // Create blob
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(clonedSvg)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.svg`
      link.href = url
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      URL.revokeObjectURL(url)

      toast.success('Chart exported as SVG successfully!', {
        description: `Saved as: ${link.download}`
      })
    } catch (error) {
      console.error('SVG export error:', error)
      toast.error('Failed to export chart as SVG', {
        description: 'Please try again or contact support'
      })
      throw error
    }
  }

  /**
   * Utility function to format data for export
   */
  static formatDataForExport(
    data: any[],
    fieldMapping?: { [key: string]: string }
  ): ExportData[] {
    return data.map(item => {
      const formatted: ExportData = {}
      
      Object.entries(item).forEach(([key, value]) => {
        // Use field mapping if provided
        const displayKey = fieldMapping?.[key] || key
        
        // Format different types of values
        if (value instanceof Date) {
          formatted[displayKey] = format(value, 'yyyy-MM-dd HH:mm:ss')
        } else if (typeof value === 'boolean') {
          formatted[displayKey] = value ? 'Yes' : 'No'
        } else if (Array.isArray(value)) {
          formatted[displayKey] = value.join(', ')
        } else if (typeof value === 'object' && value !== null) {
          formatted[displayKey] = JSON.stringify(value)
        } else {
          formatted[displayKey] = value?.toString() || ''
        }
      })
      
      return formatted
    })
  }

  /**
   * Get export statistics
   */
  static getExportStats(data: any[]): {
    totalRecords: number
    exportSize: string
    estimatedFileSize: string
  } {
    const totalRecords = data.length
    const jsonSize = JSON.stringify(data).length
    const exportSize = `${(jsonSize / 1024).toFixed(2)} KB`
    const estimatedFileSize = `${(jsonSize * 1.5 / 1024).toFixed(2)} KB` // Rough estimate
    
    return {
      totalRecords,
      exportSize,
      estimatedFileSize
    }
  }
}

// Field mapping configurations for different data types
export const FIELD_MAPPINGS = {
  activities: {
    id: 'Activity ID',
    name: 'Activity Name',
    description: 'Description',
    disease: 'Disease Focus',
    region: 'Region',
    implementer: 'Implementing Organization',
    targetPopulation: 'Target Population',
    ageGroup: 'Age Group',
    status: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    budget: 'Budget',
    expectedOutcomes: 'Expected Outcomes',
    challenges: 'Challenges',
    coverage: 'Coverage (%)',
    level: 'Implementation Level'
  },
  users: {
    id: 'User ID',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    role: 'Role',
    region: 'Region',
    organisation: 'Organization',
    createdAt: 'Created Date',
    lastLogin: 'Last Login',
    status: 'Status'
  },
  surveys: {
    id: 'Survey ID',
    title: 'Survey Title',
    status: 'Status',
    submittedBy: 'Submitted By',
    submissionDate: 'Submission Date',
    region: 'Region',
    organization: 'Organization',
    completionRate: 'Completion Rate (%)'
  }
}

export default ExportService
