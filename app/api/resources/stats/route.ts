import { NextRequest, NextResponse } from 'next/server'
import { getResourceStats } from '@/actions/resources'

export async function GET(request: NextRequest) {
  try {
    const stats = await getResourceStats()

    // Format storage size for display
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return NextResponse.json({
      ...stats,
      totalStorageUsedFormatted: formatBytes(stats.totalStorageUsed)
    })
  } catch (error) {
    console.error('Error fetching resource stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
