import { FUNDING_SOURCES, NCD_DATA, type NCDType } from '@/constant'
import * as z from "zod"

const ncdSpecificInfoSchema = z.object({
  districts: z.array(z.string()).optional(),
  continuumOfCare: z.array(z.string()).optional(),
  activityDescription: z.string().optional(),
  primaryTargetPopulation: z.string().optional(),
  secondaryTargetPopulation: z.string().optional(),
  ageRanges: z.array(z.string()).optional(),
  gender: z.enum(["male", "female", "both"]).optional(),
  activityLevel: z.array(z.string()).optional(),
  implementationArea: z.enum(["Urban", "Rural", "Both"]).optional(),
  whoGapTargets: z.array(z.string()).optional(),
  strategyDomain: z.array(z.string()).optional(),
  secondaryPreventionFocus: z.array(z.string()).optional(),
  researchFocus: z.array(z.string()).optional()
})

// Export the inferred type for NCDSpecificInfo
export type NCDSpecificInfo = z.infer<typeof ncdSpecificInfoSchema>;

// Define a Zod enum for NCD types for clarity and reuse
const NcdEnum = z.enum(NCD_DATA as readonly [NCDType, ...NCDType[]]);

export const projectInfoSchema = z.object({
  totalProjects: z.number().min(0, "Number must be 0 or greater"),
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  projectGoal: z.string().min(1, "Project goal is required"),
  projectObjectives: z.string().optional(),
  targetBeneficiaries: z.string().optional(),
  projectLocation: z.string().optional(), estimatedBudget: z.string().optional(),
  regions: z.array(z.string()).min(1, "At least one region must be selected"),
  targetedNCDs: z.array(NcdEnum).min(1, "At least one NCD must be selected"),
  fundingSource: z.enum(FUNDING_SOURCES, {
    message: "Please select a valid funding source"
  }).optional(),
  ncdSpecificInfo: z.record(NcdEnum, ncdSpecificInfoSchema)
})

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>
