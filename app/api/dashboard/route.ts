import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeActivity = searchParams.get('includeActivity') === 'true'
    
    // Fetch dashboard stats
    const statsResult = await getDashboardStats()
    
    if (!statsResult.success) {
      return NextResponse.json(
        { error: statsResult.message },
        { status: 500 }
      )
    }

    let response: any = {
      stats: statsResult.data,
      timestamp: new Date().toISOString()
    }

    // Optionally include recent activity
    if (includeActivity) {
      const activityResult = await getRecentSurveyActivity(10)
      if (activityResult.success) {
        response.recentActivity = activityResult.data
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'refresh':
        // Force refresh of dashboard data
        const statsResult = await getDashboardStats()
        const activityResult = await getRecentSurveyActivity(10)
        
        return NextResponse.json({
          stats: statsResult.success ? statsResult.data : null,
          recentActivity: activityResult.success ? activityResult.data : [],
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
