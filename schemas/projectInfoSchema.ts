import * as z from "zod"

export const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
]

export const NCD_TYPES = [
  "Cancer",
  "Cardiovascular Disease",
  "Diabetes",
  "Chronic Respiratory Disease",
  "Mental Health",
  "Sickle Cell Disease"
] as const

export type NCDType = typeof NCD_TYPES[number]

export const FUNDING_SOURCES = [
  'Ghana Government',
  'Local NGO',
  'International NGO',
  'Individual Donors',
  'Foundation',
  'Others',
  'Private Sector',
  'Academic/Research Institution',
  'UN Agency'
] as const

const ncdSpecificInfoSchema = z.object({
  districts: z.array(z.string()).default([]),
  continuumOfCare: z.array(z.string()).default([]),
  activityDescription: z.string().default(""),
  primaryTargetPopulation: z.string().default("General Population"),
  secondaryTargetPopulation: z.string().optional(),
  ageRanges: z.array(z.string()).default([]),
  gender: z.enum(["male", "female", "both"]).default("both"),
  activityLevel: z.array(z.string()).default([]),
  implementationArea: z.enum(["Urban", "Rural", "Both"]).default("Both"),
  whoGapTargets: z.array(z.string()).default([]),
  strategyDomain: z.array(z.string()).default([]),
  secondaryPreventionFocus: z.array(z.string()).optional(),
  researchFocus: z.array(z.string()).optional()
})

export const projectInfoSchema = z.object({
  totalProjects: z.number().min(0, "Number must be 0 or greater"),
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  projectGoal: z.string().min(1, "Project goal is required"),
  projectObjectives: z.string().optional(),
  targetBeneficiaries: z.string().optional(),
  projectLocation: z.string().optional(),
  estimatedBudget: z.string().optional(),
  regions: z.array(z.string()).min(1, "At least one region must be selected"),
  targetedNCDs: z.array(z.enum(NCD_TYPES)).min(1, "At least one NCD must be selected"),
  fundingSource: z.enum(FUNDING_SOURCES),
  ncdSpecificInfo: z.record(z.enum(NCD_TYPES), ncdSpecificInfoSchema).optional().default({})
})

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>
