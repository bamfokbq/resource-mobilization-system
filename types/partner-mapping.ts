export interface PartnerMappingData {
  year: number;
  workNature: 'PROJECT' | 'PROGRAM' | 'INITIATIVE' | 'RESEARCH' | 'OTHER';
  organization: string;
  projectName: string;
  projectRegion: string;
  district?: string;
  disease: string;
  partner: string;
  role: string;
}

export interface PartnerMappingFormData {
  partnerMappings: PartnerMappingData[];
}

export interface PartnerMappingSubmissionResult {
  success: boolean;
  message: string;
  partnerMappingId?: string;
  errors?: Record<string, string[]>;
}

export interface PartnerMappingDraft {
  id: string;
  userId: string;
  formData: PartnerMappingFormData;
  currentStep: string;
  lastUpdated: string;
  createdAt: string;
}

export interface PartnerMappingDraftResult {
  success: boolean;
  draft?: PartnerMappingDraft;
  message?: string;
}

// Extract unique values from Partners.json for dropdowns
export const WORK_NATURE_OPTIONS = [
  'PROJECT',
  'PROGRAM', 
  'INITIATIVE',
  'RESEARCH',
  'OTHER'
] as const;

export const DISEASE_OPTIONS = [
  'MENTAL HEALTH CONDITIONS',
  'HYPERTENSION CVD AND STROKE',
  'CERVICAL CANCER',
  'ALL NCDS - NOT DISEASE SPECIFIC',
  'CHILDHOOD CANCERS',
  'BREAST CANCER',
  'HYPERTENSION',
  'DIABETES MELLITUS',
  'SICKLE CELL DISEASE',
  'MENTAL HEALTH CONDITIONS OTHER NCDS NOT LISTED ABOVE (PLEASE SPECIFY)',
  'HYPERTENSION DIABETES MELLITUS',
  'HYPERTENSION DIABETES MELLITUS BREAST CANCER CERVICAL CANCER'
] as const;

export const YEAR_OPTIONS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

export const REGION_OPTIONS = [
  'GREATER ACCRA',
  'ASHANTI',
  'NORTHERN',
  'UPPER WEST',
  'UPPER EAST',
  'BONO',
  'BONO EAST',
  'CENTRAL',
  'EASTERN',
  'VOLTA',
  'OTI',
  'WESTERN',
  'WESTERN NORTH',
  'AHAFO',
  'SAVANNAH',
  'NORTH EAST'
] as const;
