import { z } from 'zod';
import { WORK_NATURE_OPTIONS, DISEASE_OPTIONS, YEAR_OPTIONS, REGION_OPTIONS } from '@/types/partner-mapping';

export const partnerMappingDataSchema = z.object({
  year: z.number().min(2020).max(2030, {
    required_error: 'Year is required',
  }),
  workNature: z.enum(WORK_NATURE_OPTIONS, {
    required_error: 'Work nature is required',
  }),
  organization: z.string().min(1, 'Organization name is required').max(255, 'Organization name is too long'),
  projectName: z.string().min(1, 'Project name is required').max(500, 'Project name is too long'),
  projectRegion: z.enum(REGION_OPTIONS.map(String) as [string, ...string[]], {
    required_error: 'Project region is required',
  }),
  district: z.string().optional(),
  disease: z.enum(DISEASE_OPTIONS.map(String) as [string, ...string[]], {
    required_error: 'Disease is required',
  }),
  partner: z.string().min(1, 'Partner name is required').max(255, 'Partner name is too long'),
  role: z.string().min(1, 'Partner role is required').max(500, 'Partner role is too long'),
});

export const partnerMappingFormSchema = z.object({
  partnerMappings: z.array(partnerMappingDataSchema).min(1, 'At least one partner mapping is required'),
});

export type PartnerMappingData = z.infer<typeof partnerMappingDataSchema>;
export type PartnerMappingFormData = z.infer<typeof partnerMappingFormSchema>;
