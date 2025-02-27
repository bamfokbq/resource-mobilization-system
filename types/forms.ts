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
}

export interface ProjectInfo {
  projectName: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  projectSummary: string;
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

export interface AdditionalInfo {
  risks: string;
  sustainability: string;
  evaluation: string;
  notes: string;
}

export interface ProjectInfoFormData {
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  targetBeneficiaries: string;
  projectLocation: string;
  estimatedBudget: string;
}

export interface FormData {
  organisationInfo?: OrganisationInfo;
  projectInfo?: ProjectInfoFormData;
  activities?: Activity[];
  partners?: Partner[];
  risks?: string;
  sustainability?: string;
  monitoringPlan?: string;
  evaluation?: string;
  notes?: string;
}
