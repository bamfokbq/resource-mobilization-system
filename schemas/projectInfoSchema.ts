import { FUNDING_SOURCES, NCD_DATA, type NCDType } from '@/constant'
import * as z from "zod"

// Define the NCD-specific info schema with proper validation
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
  secondaryPreventionFocus: z.array(z.string()).default([]),
  researchFocus: z.array(z.string()).default([])
})

// Export the inferred type for NCDSpecificInfo
export type NCDSpecificInfo = z.infer<typeof ncdSpecificInfoSchema>;

// Define a Zod enum for NCD types for clarity and reuse
const NcdEnum = z.enum(NCD_DATA as readonly [NCDType, ...NCDType[]]);

// Define funding source enum
const FundingSourceEnum = z.enum(FUNDING_SOURCES as readonly [string, ...string[]]);

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
  targetedNCDs: z.array(NcdEnum).min(1, "At least one NCD must be selected"),
  fundingSource: z.string().optional(),
  ncdSpecificInfo: z.record(z.string(), ncdSpecificInfoSchema).optional().default({})
}).refine((data) => {
  // Ensure ncdSpecificInfo has entries for all selected NCDs
  const selectedNCDs = data.targetedNCDs;
  const ncdInfoKeys = Object.keys(data.ncdSpecificInfo || {});
  
  // Check if all selected NCDs have corresponding entries in ncdSpecificInfo
  const missingNCDs = selectedNCDs.filter(ncd => !ncdInfoKeys.includes(ncd));
  
  return missingNCDs.length === 0;
}, {
  message: "NCD specific information is missing for selected NCDs",
  path: ["ncdSpecificInfo"]
})

export type ProjectInfoFormData = z.infer<typeof projectInfoSchema>
