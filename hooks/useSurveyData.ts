import { useState, useEffect } from 'react'
import {
  getRegionalActivityData,
  getDiseaseActivitiesData,
  getCareContinuumActivities,
  getProjectTimelineData,
  getSectorData,
  getFundingData,
  getStakeholderDetails,
  getRegionActivityTotals,
  getPartnerMappingData
} from '@/actions'

// Generic hook interface
interface UseSurveyDataReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Regional Activity Data Hook
export function useRegionalActivityData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getRegionalActivityData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch regional activity data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching regional activity data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Disease Activities Data Hook
export function useDiseaseActivitiesData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getDiseaseActivitiesData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch disease activities data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching disease activities data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Care Continuum Activities Hook
export function useCareContinuumActivities(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getCareContinuumActivities()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch care continuum activities')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching care continuum activities:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Project Timeline Data Hook
export function useProjectTimelineData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getProjectTimelineData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch project timeline data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching project timeline data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Sector Data Hook
export function useSectorData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getSectorData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch sector data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching sector data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Funding Data Hook
export function useFundingData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getFundingData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch funding data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching funding data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Stakeholder Details Hook
export function useStakeholderDetails(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getStakeholderDetails()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch stakeholder details')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching stakeholder details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Region Activity Totals Hook
export function useRegionActivityTotals(): UseSurveyDataReturn<any> {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getRegionActivityTotals()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch region activity totals')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching region activity totals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Partner Mapping Data Hook
export function usePartnerMappingData(): UseSurveyDataReturn<any[]> {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await getPartnerMappingData()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch partner mapping data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching partner mapping data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}