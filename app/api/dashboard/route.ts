import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchDashboardData } from '@/lib/dashboard/dashboardService';
import { getDashboardStats, getRecentSurveyActivity } from '@/actions/dashboardStats';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const includeActivity = searchParams.get('includeActivity') === 'true';

    // Get the authenticated session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // If userId is provided, use new dashboard service
    if (userId) {
      // Verify user can access this data (basic security check)
      if (userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot access other user data' },
          { status: 403 }
        );
      }

      // Fetch dashboard data using our new service
      const dashboardData = await fetchDashboardData(userId);

      // Return the data with cache headers
      const response = NextResponse.json(dashboardData);

      // Set cache headers for better performance
      response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes

      return response;
    }
    
    // Legacy support: original dashboard stats API
    const statsResult = await getDashboardStats();
    
    if (!statsResult.success) {
      return NextResponse.json(
        { error: statsResult.message },
        { status: 500 }
      );
    }

    let response: any = {
      stats: statsResult.data,
      timestamp: new Date().toISOString()
    };

    // Optionally include recent activity
    if (includeActivity) {
      const activityResult = await getRecentSurveyActivity(10);
      if (activityResult.success) {
        response.recentActivity = activityResult.data;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
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
