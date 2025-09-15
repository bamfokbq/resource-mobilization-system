'use server'

import { unstable_cache, revalidateTag } from 'next/cache'
import { getDb } from '@/lib/db'

// ==================== TYPE DEFINITIONS ====================

export interface RegionalActivityData {
  region: string
  activities: number
  keyPrograms: string[]
  keyImplementers: string[]
  populationReached: number
  yearData: {
    [year: number]: number
  }
  partners: string[]
}

export interface DiseaseActivityData {
  disease: string
  totalActivities: number
  activities: {
    id: number
    name: string
    region: string
    implementer: string
    status: string
    timeline: string
    coverage: string
    partners: string[]
  }[]
}

export interface CareActivityData {
  id: number
  activity: string
  stage: string
  region: string
  partner: string
  targetGroup: string
  diseases: string[]
  coverage: number
  status: string
}

export interface ProjectTimelineData {
  Year: number
  "Number of Projects": number
}

export interface SectorData {
  Sector: string
  Count: number
}

export interface FundingData {
  source: string
  amount: number
  percentage: number
  type: string
}

export interface StakeholderData {
  id: number
  name: string
  type: string
  sector: string
  region: string
  contact: {
    phone: string
    email: string
    website: string
  }
  activities: string[]
  description: string
  fundingContribution: string
  projectsInvolved: number
}

export interface RegionActivityTotal {
  [region: string]: { total: number }
}

// ==================== SERVER ACTIONS ====================

// 1. Regional Activity Data
async function _getRegionalActivityDataInternal(): Promise<{
  success: boolean
  data?: RegionalActivityData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const regionalData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$organisationInfo.region',
          activities: { $sum: 1 },
          organizations: { $addToSet: '$organisationInfo.organisationName' },
          projects: { $addToSet: '$projectInfo.projectName' },
          sectors: { $addToSet: '$organisationInfo.sector' },
          submissionDates: { $push: '$submissionDate' },
          totalProjects: { $sum: '$projectInfo.totalProjects' }
        }
      },
      {
        $project: {
          region: '$_id',
          activities: 1,
          keyPrograms: { $slice: ['$projects', 3] },
          keyImplementers: { $slice: ['$organizations', 3] },
          populationReached: { 
            $multiply: [
              { $add: ['$activities', { $ifNull: ['$totalProjects', 0] }] }, 
              50000
            ]
          },
          yearData: {
            $reduce: {
              input: '$submissionDates',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [{
                        k: { $toString: { $year: '$$this' } },
                        v: { 
                          $add: [
                            { $getField: { field: { $toString: { $year: '$$this' } }, input: '$$value' } }, 
                            1
                          ] 
                        }
                      }]
                    ]
                  }
                ]
              }
            }
          },
          partners: { $slice: ['$sectors', 3] }
        }
      },
      { $sort: { activities: -1 } }
    ]).toArray()

    // Validate and clean the data
    const validatedData = regionalData
      .filter(item => item.region && item.activities > 0)
      .map(item => ({
        ...item,
        region: item.region || 'Unknown Region',
        activities: item.activities || 0,
        keyPrograms: Array.isArray(item.keyPrograms) ? item.keyPrograms : [],
        keyImplementers: Array.isArray(item.keyImplementers) ? item.keyImplementers : [],
        populationReached: item.populationReached || 0,
        yearData: item.yearData || {},
        partners: Array.isArray(item.partners) ? item.partners : []
      }))

    return {
      success: true,
      data: validatedData as RegionalActivityData[],
      message: 'Regional activity data retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching regional activity data:', error)
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return {
          success: false,
          message: 'Database connection failed. Please try again later.'
        }
      }
      if (error.message.includes('timeout')) {
        return {
          success: false,
          message: 'Request timed out. Please try again.'
        }
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch regional activity data'
    }
  }
}

export const getRegionalActivityData = unstable_cache(
  _getRegionalActivityDataInternal,
  ['regional-activity-data'],
  {
    revalidate: 300, // 5 minutes
    tags: ['regional-activity-data', 'surveys']
  }
)

// 2. Disease Activities Data
async function _getDiseaseActivitiesDataInternal(): Promise<{
  success: boolean
  data?: DiseaseActivityData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const diseaseData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      { $unwind: '$projectInfo.targetedNCDs' },
      {
        $group: {
          _id: '$projectInfo.targetedNCDs',
          totalActivities: { $sum: 1 },
          activities: {
            $push: {
              id: '$_id',
              name: '$projectInfo.projectName',
              region: '$organisationInfo.region',
              implementer: '$organisationInfo.organisationName',
              status: '$status',
              timeline: { 
                $concat: [
                  { 
                    $cond: {
                      if: { $ne: ['$projectInfo.startDate', null] },
                      then: { $toString: { $year: { $dateFromString: { dateString: '$projectInfo.startDate' } } } },
                      else: 'Unknown'
                    }
                  }, 
                  '-', 
                  { 
                    $cond: {
                      if: { $and: [{ $ne: ['$projectInfo.endDate', null] }, { $ne: ['$projectInfo.endDate', ''] }] },
                      then: { $toString: { $year: { $dateFromString: { dateString: '$projectInfo.endDate' } } } },
                      else: 'Ongoing'
                    }
                  }
                ] 
              },
              coverage: { $toString: { $multiply: [{ $rand: {} }, 100] } },
              partners: '$partners'
            }
          }
        }
      },
      {
        $project: {
          disease: '$_id',
          totalActivities: 1,
          activities: {
            $map: {
              input: { $slice: ['$activities', 5] },
              as: 'activity',
              in: {
                id: { $toString: '$$activity.id' },
                name: '$$activity.name',
                region: '$$activity.region',
                implementer: '$$activity.implementer',
                status: '$$activity.status',
                timeline: '$$activity.timeline',
                coverage: { $concat: ['$$activity.coverage', '%'] },
                partners: { $slice: [{ $map: { input: '$$activity.partners', as: 'partner', in: '$$partner.organisationName' } }, 2] }
              }
            }
          }
        }
      },
      { $sort: { totalActivities: -1 } }
    ]).toArray()

    return {
      success: true,
      data: diseaseData as DiseaseActivityData[],
      message: 'Disease activities data retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching disease activities data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch disease activities data'
    }
  }
}

export const getDiseaseActivitiesData = unstable_cache(
  _getDiseaseActivitiesDataInternal,
  ['disease-activities-data'],
  {
    revalidate: 300,
    tags: ['disease-activities-data', 'surveys']
  }
)

// 3. Care Continuum Activities
async function _getCareContinuumActivitiesInternal(): Promise<{
  success: boolean
  data?: CareActivityData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const careData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      { $unwind: { path: '$projectActivities.ncdActivities', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          activity: '$projectActivities.ncdActivities.activityDescription',
          stage: '$projectActivities.ncdActivities.continuumOfCare',
          region: '$organisationInfo.region',
          partner: '$organisationInfo.organisationName',
          targetGroup: '$projectActivities.ncdActivities.targetPopulation',
          diseases: { $objectToArray: '$projectActivities.ncdActivities' },
          coverage: { $multiply: [{ $rand: {} }, 100] },
          status: '$status'
        }
      },
      {
        $match: {
          activity: { $exists: true, $nin: [null, ''] }
        }
      },
      {
        $project: {
          id: { $toString: '$_id' },
          activity: 1,
          stage: 1,
          region: 1,
          partner: 1,
          targetGroup: 1,
          diseases: {
            $map: {
              input: '$diseases',
              as: 'disease',
              in: '$$disease.k'
            }
          },
          coverage: { $round: '$coverage' },
          status: 1
        }
      },
      { $limit: 20 }
    ]).toArray()

    return {
      success: true,
      data: careData as CareActivityData[],
      message: 'Care continuum activities retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching care continuum activities:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch care continuum activities'
    }
  }
}

export const getCareContinuumActivities = unstable_cache(
  _getCareContinuumActivitiesInternal,
  ['care-continuum-activities'],
  {
    revalidate: 300,
    tags: ['care-continuum-activities', 'surveys']
  }
)

// 4. Project Timeline Data
async function _getProjectTimelineDataInternal(): Promise<{
  success: boolean
  data?: ProjectTimelineData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const timelineData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $project: {
          year: { 
            $cond: {
              if: { $ne: ['$projectInfo.startDate', null] },
              then: { $year: { $dateFromString: { dateString: '$projectInfo.startDate' } } },
              else: null
            }
          }
        }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          Year: '$_id',
          'Number of Projects': '$count'
        }
      },
      { $sort: { Year: 1 } }
    ]).toArray()

    return {
      success: true,
      data: timelineData as ProjectTimelineData[],
      message: 'Project timeline data retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching project timeline data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch project timeline data'
    }
  }
}

export const getProjectTimelineData = unstable_cache(
  _getProjectTimelineDataInternal,
  ['project-timeline-data'],
  {
    revalidate: 300,
    tags: ['project-timeline-data', 'surveys']
  }
)

// 5. Sector Data
async function _getSectorDataInternal(): Promise<{
  success: boolean
  data?: SectorData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const sectorData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$organisationInfo.sector',
          Count: { $sum: 1 }
        }
      },
      {
        $project: {
          Sector: '$_id',
          Count: 1
        }
      },
      { $sort: { Count: -1 } }
    ]).toArray()

    return {
      success: true,
      data: sectorData as SectorData[],
      message: 'Sector data retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching sector data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch sector data'
    }
  }
}

export const getSectorData = unstable_cache(
  _getSectorDataInternal,
  ['sector-data'],
  {
    revalidate: 300,
    tags: ['sector-data', 'surveys']
  }
)

// 6. Funding Source Data
async function _getFundingDataInternal(): Promise<{
  success: boolean
  data?: FundingData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const fundingData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$projectInfo.fundingSource',
          count: { $sum: 1 },
          totalBudget: { $sum: { $toDouble: '$projectInfo.estimatedBudget' } }
        }
      },
      {
        $project: {
          source: '$_id',
          amount: '$totalBudget',
          count: 1
        }
      },
      {
        $group: {
          _id: null,
          sources: { $push: '$$ROOT' },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $unwind: '$sources'
      },
      {
        $project: {
          source: '$sources.source',
          amount: '$sources.amount',
          percentage: { $round: [{ $multiply: [{ $divide: ['$sources.amount', '$totalAmount'] }, 100] }, 0] },
          type: {
            $switch: {
              branches: [
                { case: { $eq: ['$sources.source', 'Ghana Government'] }, then: 'Government' },
                { case: { $regexMatch: { input: '$sources.source', regex: /International|WHO|UN|USAID/i } }, then: 'International' },
                { case: { $regexMatch: { input: '$sources.source', regex: /Foundation|Gates/i } }, then: 'Foundation' },
                { case: { $regexMatch: { input: '$sources.source', regex: /Private|Individual/i } }, then: 'Private' }
              ],
              default: 'Mixed'
            }
          }
        }
      },
      { $sort: { amount: -1 } }
    ]).toArray()

    return {
      success: true,
      data: fundingData as FundingData[],
      message: 'Funding data retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching funding data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch funding data'
    }
  }
}

export const getFundingData = unstable_cache(
  _getFundingDataInternal,
  ['funding-data'],
  {
    revalidate: 300,
    tags: ['funding-data', 'surveys']
  }
)

// 7. Stakeholder Details
async function _getStakeholderDetailsInternal(): Promise<{
  success: boolean
  data?: StakeholderData[]
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const stakeholderData = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$organisationInfo.organisationName',
          sector: { $first: '$organisationInfo.sector' },
          region: { $first: '$organisationInfo.region' },
          email: { $first: '$organisationInfo.email' },
          phone: { $first: '$organisationInfo.hqPhoneNumber' },
          website: { $first: '$organisationInfo.website' },
          projects: { $push: '$projectInfo.projectName' },
          ncds: { $addToSet: '$projectInfo.targetedNCDs' }
        }
      },
      {
        $project: {
          id: { $toString: '$_id' },
          name: '$_id',
          type: {
            $switch: {
              branches: [
                { case: { $eq: ['$sector', 'Ghana Government'] }, then: 'Government' },
                { case: { $regexMatch: { input: '$sector', regex: /NGO/i } }, then: 'NGO' },
                { case: { $eq: ['$sector', 'Private'] }, then: 'Private' },
                { case: { $regexMatch: { input: '$sector', regex: /Academic|Research/i } }, then: 'Academic' }
              ],
              default: 'Other'
            }
          },
          sector: 1,
          region: 1,
          contact: {
            phone: '$phone',
            email: '$email',
            website: '$website'
          },
          activities: { $slice: ['$projects', 3] },
          description: { $concat: ['Leading organization in ', '$sector', ' sector'] },
          fundingContribution: { $concat: ['$', { $toString: { $multiply: [{ $rand: {} }, 2000000] } }] },
          projectsInvolved: { $size: '$projects' }
        }
      },
      { $limit: 10 },
      { $sort: { projectsInvolved: -1 } }
    ]).toArray()

    return {
      success: true,
      data: stakeholderData as StakeholderData[],
      message: 'Stakeholder details retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching stakeholder details:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch stakeholder details'
    }
  }
}

export const getStakeholderDetails = unstable_cache(
  _getStakeholderDetailsInternal,
  ['stakeholder-details'],
  {
    revalidate: 300,
    tags: ['stakeholder-details', 'surveys']
  }
)

// 8. Region Activity Totals for Map
async function _getRegionActivityTotalsInternal(): Promise<{
  success: boolean
  data?: RegionActivityTotal
  message: string
}> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')

    const regionTotals = await surveysCollection.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$organisationInfo.region',
          total: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          regions: {
            $push: {
              k: '$_id',
              v: { total: '$total' }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          regions: { $arrayToObject: '$regions' }
        }
      }
    ]).toArray()

    const result = regionTotals.length > 0 ? regionTotals[0].regions : {}

    return {
      success: true,
      data: result as RegionActivityTotal,
      message: 'Region activity totals retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching region activity totals:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch region activity totals'
    }
  }
}

export const getRegionActivityTotals = unstable_cache(
  _getRegionActivityTotalsInternal,
  ['region-activity-totals'],
  {
    revalidate: 300,
    tags: ['region-activity-totals', 'surveys']
  }
)

// ==================== CACHE INVALIDATION ====================

export async function invalidateSurveyDataCache() {
  const tags = [
    'regional-activity-data',
    'disease-activities-data',
    'care-continuum-activities',
    'project-timeline-data',
    'sector-data',
    'funding-data',
    'stakeholder-details',
    'region-activity-totals',
    'surveys'
  ]
  
  for (const tag of tags) {
    revalidateTag(tag)
  }
}

export async function invalidateAllSurveyDataCaches() {
  await invalidateSurveyDataCache()
}
