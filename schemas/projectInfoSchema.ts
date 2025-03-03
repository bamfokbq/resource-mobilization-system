import { FUNDING_SOURCES, NCD_DATA, type NCDType } from '@/constant'
import * as z from "zod"

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
  targetedNCDs: z.array(z.enum(NCD_DATA as readonly [NCDType, ...NCDType[]])).min(1, "At least one NCD must be selected"),
  fundingSource: z.enum(FUNDING_SOURCES),
  ncdSpecificInfo: z.record(z.enum(NCD_DATA), ncdSpecificInfoSchema).optional().default({})
})

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>
