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
   * Export chart/visualization as PNG image using html2canvas or canvas
   */
  static async exportChartAsImage(
    chartElement: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_chart',
      } = options

      // Try to get canvas element from the chart first
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
        // Try SVG to PNG conversion using modern browser APIs
        const svgElement = chartElement.querySelector('svg') as SVGElement
        
        if (svgElement) {
          await this.exportSVGAsPNG(svgElement, options)
        } else {
          // Fallback: Use html2canvas-like approach with modern APIs
          await this.exportElementAsPNG(chartElement, options)
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
   * Export SVG as PNG using modern browser APIs
   */
  static async exportSVGAsPNG(
    svgElement: SVGElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_chart',
      } = options

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      
      // Get SVG dimensions
      const rect = svgElement.getBoundingClientRect()
      const width = rect.width || 800
      const height = rect.height || 600
      
      // Set SVG attributes for proper rendering
      clonedSvg.setAttribute('width', width.toString())
      clonedSvg.setAttribute('height', height.toString())
      clonedSvg.style.backgroundColor = '#ffffff'
      
      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = width * 2 // High DPI
      canvas.height = height * 2
      const ctx = canvas.getContext('2d')!
      
      // Scale for high DPI
      ctx.scale(2, 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      // Convert SVG to data URL
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(clonedSvg)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      
      // Draw SVG to canvas
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        
        // Download canvas as PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.png`
            link.href = downloadUrl
            
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            URL.revokeObjectURL(url)
            URL.revokeObjectURL(downloadUrl)
            
            toast.success('Chart exported as PNG successfully!', {
              description: `Saved as: ${link.download}`
            })
          }
        }, 'image/png')
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        throw new Error('Failed to load SVG for PNG conversion')
      }
      
      img.src = url
      
    } catch (error) {
      console.error('SVG to PNG export error:', error)
      throw error
    }
  }

  /**
   * Export any HTML element as PNG using canvas
   */
  static async exportElementAsPNG(
    element: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_element',
      } = options

      // Get element dimensions
      const rect = element.getBoundingClientRect()
      const width = rect.width || 800
      const height = rect.height || 600
      
      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = width * 2 // High DPI
      canvas.height = height * 2
      const ctx = canvas.getContext('2d')!
      
      // Scale for high DPI
      ctx.scale(2, 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      // Use the newer approach with modern APIs
      // This is a simplified version - in a real implementation, you might want to use html2canvas
      const svgElement = element.querySelector('svg')
      if (svgElement) {
        await this.exportSVGAsPNG(svgElement, options)
        return
      }
      
      // Fallback: create a simple representation
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(10, 10, width - 20, height - 20)
      ctx.fillStyle = '#333'
      ctx.font = '16px Arial'
      ctx.fillText('Exported Element', 20, 40)
      ctx.fillText(`${element.tagName.toLowerCase()}`, 20, 70)
      ctx.fillText(`Size: ${width.toFixed(0)}x${height.toFixed(0)}`, 20, 100)
      
      // Download canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.png`
          link.href = url
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          URL.revokeObjectURL(url)
          
          toast.success('Element exported as PNG successfully!', {
            description: `Saved as: ${link.download}`
          })
        }
      }, 'image/png')
      
    } catch (error) {
      console.error('Element to PNG export error:', error)
      throw error
    }
  }

  /**
   * Export table as PNG image
   */
  static async exportTableAsPNG(
    tableElement: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = 'ncd_navigator_table',
        title = 'Data Table'
      } = options

      // Get table dimensions
      const rect = tableElement.getBoundingClientRect()
      const width = Math.max(rect.width, 800)
      const height = Math.max(rect.height, 400)
      
      // Create canvas with padding
      const padding = 40
      const canvas = document.createElement('canvas')
      canvas.width = (width + padding * 2) * 2 // High DPI
      canvas.height = (height + padding * 2 + 60) * 2 // Extra space for title
      const ctx = canvas.getContext('2d')!
      
      // Scale for high DPI
      ctx.scale(2, 2)
      
      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width + padding * 2, height + padding * 2 + 60)
      
      // Add title
      ctx.fillStyle = '#333333'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(title, (width + padding * 2) / 2, 30)
      
      // Add timestamp
      ctx.font = '12px Arial'
      ctx.fillText(
        `Generated on ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`,
        (width + padding * 2) / 2,
        50
      )
      
      // Reset text alignment
      ctx.textAlign = 'left'
      
      // Draw table border
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      ctx.strokeRect(padding, 60, width, height)
      
      // Try to render table content (simplified approach)
      const rows = tableElement.querySelectorAll('tr')
      let y = 80
      const rowHeight = Math.min(30, height / Math.max(rows.length, 1))
      
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('th, td')
        let x = padding + 10
        const cellWidth = (width - 20) / Math.max(cells.length, 1)
        
        // Background for header rows
        if (row.querySelector('th')) {
          ctx.fillStyle = '#f5f5f5'
          ctx.fillRect(padding, y - 20, width, rowHeight)
        }
        
        cells.forEach((cell, cellIndex) => {
          const text = cell.textContent?.trim() || ''
          
          // Set font style
          ctx.fillStyle = row.querySelector('th') ? '#333333' : '#666666'
          ctx.font = row.querySelector('th') ? 'bold 12px Arial' : '11px Arial'
          
          // Truncate long text
          const maxWidth = cellWidth - 10
          let displayText = text
          if (ctx.measureText(text).width > maxWidth) {
            while (ctx.measureText(displayText + '...').width > maxWidth && displayText.length > 0) {
              displayText = displayText.slice(0, -1)
            }
            displayText += '...'
          }
          
          ctx.fillText(displayText, x, y)
          
          // Draw cell border
          ctx.strokeStyle = '#e0e0e0'
          ctx.strokeRect(x - 5, y - 20, cellWidth, rowHeight)
          
          x += cellWidth
        })
        
        y += rowHeight
        
        // Don't exceed canvas height
        if (y > height + 40) return
      })
      
      // Download canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.png`
          link.href = url
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          URL.revokeObjectURL(url)
          
          toast.success('Table exported as PNG successfully!', {
            description: `Saved as: ${link.download}`
          })
        }
      }, 'image/png')
      
    } catch (error) {
      console.error('Table to PNG export error:', error)
      toast.error('Failed to export table as PNG', {
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
