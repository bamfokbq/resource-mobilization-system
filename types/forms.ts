import { NCDType } from '@/constant';

export interface OrganisationInfo {
  organisationName: string;
  region: string;
  hasRegionalOffice: boolean;
  regionalOfficeLocation?: string;
  gpsCoordinates: {
    latitude: string;
    longitude: string;
  };
  ghanaPostGPS: string;
  sector: string;
  hqPhoneNumber: string;
  regionalPhoneNumber?: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
}

export type FundingSource =
  | 'Ghana Government'
  | 'Local NGO'
  | 'International NGO'
  | 'Individual Donors'
  | 'Foundation'
  | 'Others'
  | 'Private Sector'
  | 'Academic/Research Institution'
  | 'UN Agency';

export type ContinuumOfCare = 'Health Promotion/Primary prevention' | 'Screening/Risk Assessment' | 'Vaccination';

export type TargetPopulation = 'General Population' | 'Individuals at risk' | 'School Children';

export type AgeRange = 'Children (Under age 10)' | 'Adolescents (Between ages 20-44)';

export type ActivityLevel = 'Purely National level activity' | 'Purely Regional level activity' | 'Purely District level activity';

export type WhoGapTarget = 'Advocacy: raise the priority of NCDs' | 'Research and development';

export type StrategyDomain = 'Primary Prevention' | 'Financing';

export type PreventionArea = 'Rehabilitation' | 'Clinical Care/Case Management';

export type ResearchActivity = 'Nationwide survey on biological and social drivers of NCDs' | 'Longitudinal population-based studies' | 'Studies on compliance and adherence to medication for NCDs';

export interface NCDSpecificInfo {
  districts: string[];
  continuumOfCare: string[];
  activityDescription: string;
  primaryTargetPopulation: string;
  secondaryTargetPopulation?: string;
  ageRanges: string[];
  gender: "male" | "female" | "both";
  activityLevel: string[];
  implementationArea: "Urban" | "Rural" | "Both";
  whoGapTargets: string[];
  strategyDomain: string[];
  secondaryPreventionFocus?: string[];
  researchFocus?: string[];
}

export interface ProjectActivities {
  districts: string[];
  continuumOfCare: string[];
  activityDescription: string;
  primaryTargetPopulation: string;
  secondaryTargetPopulation?: string;
  ageRanges: string[];
  gender: "male" | "female" | "both";
  implementationLevel: string[];
  implementationArea: "urban" | "rural" | "both";
  whoGapTargets: string[];
  ncdStrategyDomain: string;
  preventionFocus?: string;
}

export interface Activity {
  name: string;
  description: string;
  timeline: string;
  budget: number;
}

export interface Partner {
  organisationName: string;
  role: string;
  contribution: string;
  contactPerson: string;
  email: string;
}

export interface ProjectInfo {
  totalProjects: number;
  projectName: string;
  projectDescription?: string;
  startDate: string;
  endDate?: string;
  projectGoal: string;
  projectObjectives?: string;
  targetBeneficiaries?: string;
  projectLocation?: string;
  estimatedBudget?: string; regions: string[];
  targetedNCDs: NCDType[];
  fundingSource?: FundingSource;
  ncdSpecificInfo: { [K in NCDType]?: NCDSpecificInfo };
}

export interface AdditionalInfo {
  risks: string;
  sustainability: string;
  evaluation: string;
  notes: string;
}

export interface FormData {
  projectInfo?: ProjectInfo;
  organisationInfo?: OrganisationInfo;
  projectActivities?: ProjectActivities;
  activities?: Activity[];
  partners?: Partner[];
  risks?: string;
  sustainability?: string;
  monitoringPlan?: string;
  evaluation?: string;
  notes?: string;
}
