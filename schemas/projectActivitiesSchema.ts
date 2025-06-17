import * as z from "zod";

export const ncdActivitySchema = z.object({
  projectDistrict: z.array(z.string()).optional(),
  continuumOfCare: z.string().optional(),
  activityDescription: z.string().optional(),
  targetPopulation: z.string().optional(),
  secondaryTargetPopulation: z.string().optional(),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  activityLevel: z.string().optional(),
  activityImplementedArea: z.string().optional(),
  nationalNCDStrategyWHOGapTarget: z.string().optional(),
  domainAreaOfStrategy: z.string().optional(),
  preventionStrategicArea: z.string().optional(),
  expectedOutcomes: z.string().optional(),
  challenges: z.string().optional(),
});

export const projectActivitiesSchema = z.object({
  ncdActivities: z.record(z.string(), ncdActivitySchema),
});