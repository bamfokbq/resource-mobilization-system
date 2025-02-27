export interface OrganisationInfo {
  organisationName: string;
  registrationNumber: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ProjectInfo {
  projectName: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  projectSummary: string;
  objectives: string[];
}

export interface ProjectActivities {
  activities: {
    name: string;
    description: string;
    timeline: string;
    budget: number;
  }[];
}

export interface PartnersInfo {
  partners: {
    organisationName: string;
    role: string;
    contribution: string;
    contactPerson: string;
    email: string;
  }[];
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

export interface FormData extends 
  Partial<OrganisationInfo>,
  ProjectInfo,
  ProjectActivities,
  PartnersInfo,
  Partial<AdditionalInfo> {
  projectInfo: ProjectInfoFormData;
}
