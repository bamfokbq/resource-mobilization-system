'use server'

import { unstable_cache, revalidateTag } from 'next/cache'
import { getDb } from '@/lib/db'

export interface AdminStat {
  id: number
  name: string
  amount: number
}

export interface AdminStatsData {
  stats: AdminStat[]
  lastUpdated: string
}

// Internal function that performs the actual database operations
async function _getAdminStatsInternal(): Promise<{
  success: boolean
  data?: AdminStatsData
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    // Get all submitted surveys
    const surveys = await surveysCollection.find({ status: 'submitted' }).toArray()

    // Calculate statistics
    const totalActivities = surveys.length

    // Get unique organizations (active partners)
    const uniqueOrganizations = new Set(
      surveys
        .filter(survey => survey.organisationInfo?.organisationName)
        .map(survey => survey.organisationInfo.organisationName)
    )
    const activePartners = uniqueOrganizations.size

    // Get unique regions covered
    const uniqueRegions = new Set(
      surveys
        .filter(survey => survey.organisationInfo?.region)
        .map(survey => survey.organisationInfo.region)
    )
    const regionsCovered = uniqueRegions.size

    // Get unique NCD focus areas from all surveys
    const allNCDs = new Set<string>()
    surveys.forEach(survey => {
      if (survey.projectInfo?.targetedNCDs && Array.isArray(survey.projectInfo.targetedNCDs)) {
        survey.projectInfo.targetedNCDs.forEach((ncd: string) => {
          if (ncd && ncd.trim()) {
            allNCDs.add(ncd.trim())
          }
        })
      }
      
      // Also check projectActivities for NCD activities
      if (survey.projectActivities?.ncdActivities) {
        Object.keys(survey.projectActivities.ncdActivities).forEach(ncd => {
          if (ncd && ncd.trim()) {
            allNCDs.add(ncd.trim())
          }
        })
      }
    })
    const ncdFocusAreas = allNCDs.size

    // Create stats array matching the original format
    const stats: AdminStat[] = [
      { 
        id: 1, 
        name: 'Total Activities', 
        amount: totalActivities
      },
      { 
        id: 2, 
        name: 'Active Partners', 
        amount: activePartners
      },
      { 
        id: 3, 
        name: 'Regions Covered', 
        amount: regionsCovered
      },
      { 
        id: 4, 
        name: 'NCD Focus Areas', 
        amount: ncdFocusAreas
      }
    ]

    const adminStatsData: AdminStatsData = {
      stats,
      lastUpdated: new Date().toISOString()
    }

    return {
      success: true,
      data: adminStatsData,
      message: 'Admin stats retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch admin stats'
    }
  }
}

// Cached version of getAdminStats with 5-minute revalidation
export const getAdminStats = unstable_cache(
  _getAdminStatsInternal,
  ['admin-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: ['admin-stats', 'surveys']
  }
)

// Cache invalidation functions
export async function invalidateAdminStatsCache() {
  revalidateTag('admin-stats')
  revalidateTag('surveys')
}

// Fallback function that returns mock data if database fails
export async function getAdminStatsWithFallback(): Promise<{
  success: boolean
  data?: AdminStatsData
  message: string
}> {
  try {
    const result = await getAdminStats()
    
    // If database query fails, return mock data
    if (!result.success || !result.data) {
      console.warn('Database query failed, returning mock data')
      
      const mockStats: AdminStat[] = [
        { id: 1, name: 'Total Activities', amount: 640 },
        { id: 2, name: "Active Partners", amount: 156 },
        { id: 3, name: 'Regions Covered', amount: 16 },
        { id: 4, name: 'NCD Focus Areas', amount: 15 }
      ]

      const mockData: AdminStatsData = {
        stats: mockStats,
        lastUpdated: new Date().toISOString()
      }

      return {
        success: true,
        data: mockData,
        message: 'Mock data returned due to database unavailability'
      }
    }

    return result
  } catch (error) {
    console.error('Error in getAdminStatsWithFallback:', error)
    
    // Return mock data as final fallback
    const mockStats: AdminStat[] = [
      { id: 1, name: 'Total Activities', amount: 640 },
      { id: 2, name: "Active Partners", amount: 156 },
      { id: 3, name: 'Regions Covered', amount: 16 },
      { id: 4, name: 'NCD Focus Areas', amount: 15 }
    ]

    const mockData: AdminStatsData = {
      stats: mockStats,
      lastUpdated: new Date().toISOString()
    }

    return {
      success: true,
      data: mockData,
      message: 'Mock data returned due to system error'
    }
  }
}
