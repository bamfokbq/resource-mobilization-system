"use server"

import { getDb } from "@/lib/db"

// Interface definitions for admin analytics
export interface AdminKPIs {
  totalUsers: number
  totalSurveys: number
  totalDrafts: number
  completionRate: number
  avgTimeToComplete: number
  activeUsers: number
  userGrowthRate: number
  surveyGrowthRate: number
}

export interface SystemMetrics {
  dailyActiveUsers: Array<{ date: string; users: number }>
  surveySubmissionTrend: Array<{ date: string; submitted: number; drafts: number }>
  userRegistrationTrend: Array<{ date: string; registrations: number }>
  regionDistribution: Array<{ region: string; users: number; surveys: number }>
  sectorAnalysis: Array<{ sector: string; count: number; completion: number }>
  ncdFocusAreas: Array<{ area: string; count: number; percentage: number }>
}

export interface UserEngagementMetrics {
  averageSessionTime: number
  surveyCompletionByStep: Array<{ step: string; dropoffRate: number; avgTime: number }>
  userRetention: Array<{ period: string; retained: number; churned: number }>
  featureUsage: Array<{ feature: string; usage: number; trend: number }>
}

// Main function to get comprehensive admin analytics
export async function getAdminAnalytics(): Promise<{
  success: boolean;
  data?: {
    kpis: AdminKPIs;
    systemMetrics: SystemMetrics;
    userEngagement: UserEngagementMetrics;
  };
  message: string;
}> {
  try {
    const db = await getDb()
    
    // Fetch all data in parallel
    const [kpis, systemMetrics, userEngagement] = await Promise.all([
      getAdminKPIs(db),
      getSystemMetrics(db),
      getUserEngagementMetrics(db)
    ])

    return {
      success: true,
      data: {
        kpis,
        systemMetrics,
        userEngagement
      },
      message: 'Admin analytics generated successfully'
    }
  } catch (error) {
    console.error('Error generating admin analytics:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate admin analytics'
    }
  }
}

// Get Key Performance Indicators
async function getAdminKPIs(db: any): Promise<AdminKPIs> {
  const usersCollection = db.collection('users')
  const surveysCollection = db.collection('surveys')
  const draftsCollection = db.collection('survey_drafts')

  // Get current counts
  const [totalUsers, totalSurveys, totalDrafts] = await Promise.all([
    usersCollection.countDocuments(),
    surveysCollection.countDocuments({ status: 'submitted' }),
    draftsCollection.countDocuments()
  ])

  // Calculate completion rate
  const totalAttempts = totalSurveys + totalDrafts
  const completionRate = totalAttempts > 0 ? (totalSurveys / totalAttempts) * 100 : 0

  // Get active users (users who logged in in the last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const activeUsers = await usersCollection.countDocuments({
    lastLoginAt: { $gte: thirtyDaysAgo }
  })

  // Calculate growth rates (last 30 days vs previous 30 days)
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const [currentPeriodUsers, previousPeriodUsers] = await Promise.all([
    usersCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    usersCollection.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    })
  ])

  const [currentPeriodSurveys, previousPeriodSurveys] = await Promise.all([
    surveysCollection.countDocuments({ 
      submissionDate: { $gte: thirtyDaysAgo },
      status: 'submitted'
    }),
    surveysCollection.countDocuments({ 
      submissionDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      status: 'submitted'
    })
  ])

  const userGrowthRate = previousPeriodUsers > 0 
    ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
    : 0

  const surveyGrowthRate = previousPeriodSurveys > 0 
    ? ((currentPeriodSurveys - previousPeriodSurveys) / previousPeriodSurveys) * 100 
    : 0

  // Calculate average time to complete (mock for now - would need session tracking)
  const avgTimeToComplete = 45 // minutes - this would need actual session tracking

  return {
    totalUsers,
    totalSurveys,
    totalDrafts,
    completionRate: Math.round(completionRate),
    avgTimeToComplete,
    activeUsers,
    userGrowthRate: Math.round(userGrowthRate * 10) / 10,
    surveyGrowthRate: Math.round(surveyGrowthRate * 10) / 10
  }
}

// Get system-wide metrics
async function getSystemMetrics(db: any): Promise<SystemMetrics> {
  const usersCollection = db.collection('users')
  const surveysCollection = db.collection('surveys')
  const draftsCollection = db.collection('survey_drafts')

  // Generate daily active users (last 30 days)
  const dailyActiveUsers = await generateDailyUserActivity(usersCollection)

  // Generate survey submission trends
  const surveySubmissionTrend = await generateSurveyTrends(surveysCollection, draftsCollection)

  // Generate user registration trends
  const userRegistrationTrend = await generateUserRegistrationTrends(usersCollection)

  // Get region distribution
  const regionDistribution = await getRegionDistribution(usersCollection, surveysCollection)

  // Get sector analysis
  const sectorAnalysis = await getSectorAnalysis(usersCollection, surveysCollection)

  // Get NCD focus areas from surveys
  const ncdFocusAreas = await getNCDFocusAreas(surveysCollection)

  return {
    dailyActiveUsers,
    surveySubmissionTrend,
    userRegistrationTrend,
    regionDistribution,
    sectorAnalysis,
    ncdFocusAreas
  }
}

// Get user engagement metrics
async function getUserEngagementMetrics(db: any): Promise<UserEngagementMetrics> {
  const surveysCollection = db.collection('surveys')
  const draftsCollection = db.collection('survey_drafts')

  // Average session time (mock - would need session tracking)
  const averageSessionTime = 35 // minutes

  // Survey completion by step
  const surveyCompletionByStep = await calculateStepDropoffRates(surveysCollection, draftsCollection)

  // User retention (mock data - would need proper session tracking)
  const userRetention = [
    { period: 'Week 1', retained: 85, churned: 15 },
    { period: 'Week 2', retained: 78, churned: 22 },
    { period: 'Month 1', retained: 72, churned: 28 },
    { period: 'Month 3', retained: 65, churned: 35 },
    { period: 'Month 6', retained: 58, churned: 42 }
  ]

  // Feature usage (mock data - would need proper tracking)
  const featureUsage = [
    { feature: 'Survey Creation', usage: 92, trend: 5 },
    { feature: 'Draft Saving', usage: 78, trend: 12 },
    { feature: 'Data Export', usage: 34, trend: -2 },
    { feature: 'Analytics View', usage: 56, trend: 8 }
  ]

  return {
    averageSessionTime,
    surveyCompletionByStep,
    userRetention,
    featureUsage
  }
}

// Helper functions for detailed analytics

async function generateDailyUserActivity(usersCollection: any): Promise<Array<{ date: string; users: number }>> {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Mock data - in real implementation, you'd track daily logins
    const users = Math.floor(Math.random() * 50) + 20

    data.push({ date: dateStr, users })
  }

  return data
}

async function generateSurveyTrends(surveysCollection: any, draftsCollection: any): Promise<Array<{ date: string; submitted: number; drafts: number }>> {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dateStr = date.toISOString().split('T')[0]

    const [submitted, drafts] = await Promise.all([
      surveysCollection.countDocuments({
        submissionDate: {
          $gte: date,
          $lt: nextDate
        },
        status: 'submitted'
      }),
      draftsCollection.countDocuments({
        lastSaved: {
          $gte: date,
          $lt: nextDate
        }
      })
    ])

    data.push({ date: dateStr, submitted, drafts })
  }

  return data
}

async function generateUserRegistrationTrends(usersCollection: any): Promise<Array<{ date: string; registrations: number }>> {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dateStr = date.toISOString().split('T')[0]

    const registrations = await usersCollection.countDocuments({
      createdAt: {
        $gte: date,
        $lt: nextDate
      }
    })

    data.push({ date: dateStr, registrations })
  }

  return data
}

async function getRegionDistribution(usersCollection: any, surveysCollection: any): Promise<Array<{ region: string; users: number; surveys: number }>> {
  const [usersByRegion, surveysByRegion] = await Promise.all([
    usersCollection.aggregate([
      { $group: { _id: "$region", users: { $sum: 1 } } },
      { $sort: { users: -1 } }
    ]).toArray(),
    surveysCollection.aggregate([
      { $match: { "organisationInfo.region": { $exists: true } } },
      { $group: { _id: "$organisationInfo.region", surveys: { $sum: 1 } } },
      { $sort: { surveys: -1 } }
    ]).toArray()
  ])

  // Combine user and survey data by region
  const regionMap = new Map()

  usersByRegion.forEach((item: any) => {
    if (item._id) {
      regionMap.set(item._id, { region: item._id, users: item.users, surveys: 0 })
    }
  })

  surveysByRegion.forEach((item: any) => {
    if (item._id) {
      const existing = regionMap.get(item._id)
      if (existing) {
        existing.surveys = item.surveys
      } else {
        regionMap.set(item._id, { region: item._id, users: 0, surveys: item.surveys })
      }
    }
  })

  return Array.from(regionMap.values())
}

async function getSectorAnalysis(usersCollection: any, surveysCollection: any): Promise<Array<{ sector: string; count: number; completion: number }>> {
  const sectorStats = await surveysCollection.aggregate([
    { $match: { "organisationInfo.sector": { $exists: true } } },
    {
      $group: {
        _id: "$organisationInfo.sector",
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "submitted"] }, 1, 0]
          }
        }
      }
    },
    { $sort: { total: -1 } }
  ]).toArray()

  return sectorStats.map((item: any) => ({
    sector: item._id || 'Unknown',
    count: item.total,
    completion: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0
  }))
}

async function getNCDFocusAreas(surveysCollection: any): Promise<Array<{ area: string; count: number; percentage: number }>> {
  const ncdStats = await surveysCollection.aggregate([
    { $match: { "projectInfo.targetedNCDs": { $exists: true } } },
    { $unwind: "$projectInfo.targetedNCDs" },
    { $group: { _id: "$projectInfo.targetedNCDs", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray()

  const total = ncdStats.reduce((sum: number, item: any) => sum + item.count, 0)

  return ncdStats.map((item: any) => ({
    area: item._id,
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
  }))
}

async function calculateStepDropoffRates(surveysCollection: any, draftsCollection: any): Promise<Array<{ step: string; dropoffRate: number; avgTime: number }>> {
  const steps = [
    { key: 'organisationInfo', name: 'Organization Info', avgTime: 8 },
    { key: 'projectInfo', name: 'Project Info', avgTime: 12 },
    { key: 'projectActivities', name: 'Activities', avgTime: 15 },
    { key: 'partners', name: 'Partners', avgTime: 10 },
    { key: 'sustainability', name: 'Background', avgTime: 8 }
  ]

  const totalSurveys = await surveysCollection.countDocuments()
  const totalDrafts = await draftsCollection.countDocuments()
  const totalAttempts = totalSurveys + totalDrafts

  return steps.map(step => {
    // Calculate dropoff rate (this is simplified - you'd need more sophisticated tracking)
    const dropoffRate = Math.max(0, Math.min(50, Math.random() * 30 + (steps.indexOf(step) * 5)))

    return {
      step: step.name,
      dropoffRate: Math.round(dropoffRate),
      avgTime: step.avgTime
    }
  })
}

// Additional utility functions for performance metrics
export async function getSystemPerformanceMetrics(): Promise<{
  success: boolean;
  data?: {
    databaseSize: string;
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
  message: string;
}> {
  try {
    const db = await getDb()
    
    // Get database statistics
    const stats = await db.stats()
    const databaseSize = `${Math.round(stats.dataSize / (1024 * 1024))} MB`
    
    // Mock performance metrics (in real implementation, you'd track these)
    const responseTime = Math.round(Math.random() * 50 + 100) // ms
    const uptime = 99.8 // percentage
    const errorRate = Math.round(Math.random() * 10) / 10 // percentage

    return {
      success: true,
      data: {
        databaseSize,
        responseTime,
        uptime,
        errorRate
      },
      message: 'Performance metrics retrieved successfully'
    }
  } catch (error) {
    console.error('Error getting performance metrics:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get performance metrics'
    }
  }
}