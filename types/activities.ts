export interface Activity {
  id?: string
  name: string
  description: string
  disease: string
  region: string
  implementer: string
  targetPopulation: string
  ageGroup: string
  status: string
  startDate: string
  endDate: string
  coverage?: string
  level?: string
  expectedOutcomes: string
  challenges?: string
  budget?: string
  timeline?: string
  partners?: string[]
}
