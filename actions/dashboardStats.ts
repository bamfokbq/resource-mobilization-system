"use server"

import { getDb } from "@/lib/db"

export interface DashboardStats {
  totalSurveys: number
  totalDrafts: number
  totalUsers: number
  recentSurveys: number
  completionRate: number
  topRegions: Array<{ region: string; count: number }>
  topSectors: Array<{ sector: string; count: number }>
  monthlyTrends: Array<{ month: string; surveys: number; drafts: number }>
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  data?: DashboardStats;
  message: string;
}> {
  try {
    const db = await getDb()
    
    const surveysCollection = db.collection('surveys')
    const draftsCollection = db.collection('survey_drafts')
    const usersCollection = db.collection('users')

    // Get basic counts
    const [totalSurveys, totalDrafts, totalUsers] = await Promise.all([
      surveysCollection.countDocuments({ status: 'submitted' }),
      draftsCollection.countDocuments(),
      usersCollection.countDocuments()
    ])

    // Get recent surveys (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentSurveys = await surveysCollection.countDocuments({
      submissionDate: { $gte: thirtyDaysAgo },
      status: 'submitted'
    })

    // Calculate completion rate
    const totalAttempts = totalSurveys + totalDrafts
    const completionRate = totalAttempts > 0 ? Math.round((totalSurveys / totalAttempts) * 100) : 0

    // Get monthly trends date range (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Run all aggregation queries in parallel
    const [regionStats, sectorStats, surveyTrends, draftTrends] = await Promise.all([
      // Get top regions
      surveysCollection.aggregate([
        { $match: { status: 'submitted', 'organisationInfo.region': { $exists: true } } },
        { $group: { _id: '$organisationInfo.region', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { region: '$_id', count: 1, _id: 0 } }
      ]).toArray(),

      // Get top sectors
      surveysCollection.aggregate([
        { $match: { status: 'submitted', 'organisationInfo.sector': { $exists: true } } },
        { $group: { _id: '$organisationInfo.sector', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { sector: '$_id', count: 1, _id: 0 } }
      ]).toArray(),

      // Get survey trends (last 6 months)
      surveysCollection.aggregate([
        {
          $match: {
            status: 'submitted',
            submissionDate: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$submissionDate' },
              month: { $month: '$submissionDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]).toArray(),

      // Get draft trends (last 6 months)
      draftsCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]).toArray()
    ])

    // Format monthly trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyTrends = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      
      const surveyCount = surveyTrends.find(t => t._id.year === year && t._id.month === month)?.count || 0
      const draftCount = draftTrends.find(t => t._id.year === year && t._id.month === month)?.count || 0
      
      monthlyTrends.push({
        month: monthNames[date.getMonth()],
        surveys: surveyCount,
        drafts: draftCount
      })
    }

    const dashboardStats: DashboardStats = {
      totalSurveys,
      totalDrafts,
      totalUsers,
      recentSurveys,
      completionRate,
      topRegions: regionStats as Array<{ region: string; count: number }>,
      topSectors: sectorStats as Array<{ sector: string; count: number }>,
      monthlyTrends
    }

    return {
      success: true,
      data: dashboardStats,
      message: 'Dashboard stats retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
    }
  }
}

// Get recent survey activity for dashboard
export async function getRecentSurveyActivity(limit: number = 10): Promise<{
  success: boolean;
  data?: Array<{
    organisationName: string;
    projectName: string;
    region: string;
    submissionDate: string;
    status: string;
    createdBy: string;
  }>;
  message: string;
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const recentActivity = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      { $sort: { submissionDate: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          organisationName: '$organisationInfo.organisationName',
          projectName: '$projectInfo.projectName',
          region: '$organisationInfo.region',
          submissionDate: 1,
          status: 1,
          createdBy: '$createdBy.name'
        }
      }
    ]).toArray()

    // Convert submissionDate to ISO string for serialization
    const serializedActivity = recentActivity.map(activity => ({
      organisationName: activity.organisationName,
      projectName: activity.projectName,
      region: activity.region,
      submissionDate: activity.submissionDate instanceof Date
        ? activity.submissionDate.toISOString()
        : String(activity.submissionDate),
      status: activity.status,
      createdBy: activity.createdBy,
    }))

    return {
      success: true,
      data: serializedActivity,
      message: 'Recent survey activity retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching recent survey activity:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch recent survey activity'
    }
  }
}
