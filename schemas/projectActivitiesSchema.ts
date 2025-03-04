
import * as z from "zod";

export const projectActivitiesSchema = z.object({
  districts: z.array(z.string()).min(1, "Select at least one district"),
  continuumOfCare: z.array(z.string()).min(1, "Select at least one continuum of care"),
  activityDescription: z.string().min(10, "Please provide a detailed description"),
  primaryTargetPopulation: z.string().min(5, "Please describe the primary target population"),
  secondaryTargetPopulation: z.string().optional(),
  ageRanges: z.array(z.string()).min(1, "Select at least one age range"),
  gender: z.enum(["male", "female", "both"]),
  implementationLevel: z.array(z.string()).min(1, "Select at least one implementation level"),
  implementationArea: z.enum(["urban", "rural", "both"]),
  whoGapTargets: z.array(z.string()).min(1, "Select at least one WHO GAP target"),
  ncdStrategyDomain: z.string().min(1, "Select a strategy domain"),
  preventionFocus: z.string().optional()
})