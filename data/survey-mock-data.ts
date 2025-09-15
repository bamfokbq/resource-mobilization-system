/**
 * Central Mock Data Repository for Survey Data Components
 * 
 * This file contains all mock data used across survey data components.
 * Replace with actual data when ready for production integration.
 */

// ==================== BACKGROUND PAGE DATA ====================

// Number of Projects by Year
export const PROJECT_TIMELINE_DATA = [
  {
    "Year": 2020,
    "Number of Projects": 28
  },
  {
    "Year": 2021,
    "Number of Projects": 17
  },
  {
    "Year": 2022,
    "Number of Projects": 24
  },
  {
    "Year": 2023,
    "Number of Projects": 20
  },
  {
    "Year": 2024,
    "Number of Projects": 10
  }
];

// Organizational Sectors Data
export const SECTOR_DATA = [
  { "Sector": "Local NGO", "Count": 74 },
  { "Sector": "International NGO", "Count": 17 },
  { "Sector": "Ghana Government", "Count": 16 },
  { "Sector": "Civil Society Organization", "Count": 16 },
  { "Sector": "Private", "Count": 8 },
  { "Sector": "Patient Organization", "Count": 3 },
  { "Sector": "Foundation", "Count": 3 },
  { "Sector": "Foreign Government", "Count": 3 },
  { "Sector": "Faith-based Organization", "Count": 2 },
  { "Sector": "Academia / Research", "Count": 2 },
  { "Sector": "Multilateral", "Count": 1 }
];

// Funding Sources Data
export const FUNDING_DATA = [
  { 
    source: "World Health Organization", 
    amount: 2500000, 
    percentage: 35, 
    type: "International" 
  },
  { 
    source: "Ghana Ministry of Health", 
    amount: 1800000, 
    percentage: 25, 
    type: "Government" 
  },
  { 
    source: "Bill & Melinda Gates Foundation", 
    amount: 1200000, 
    percentage: 17, 
    type: "Foundation" 
  },
  { 
    source: "USAID", 
    amount: 800000, 
    percentage: 11, 
    type: "International" 
  },
  { 
    source: "Private Donations", 
    amount: 500000, 
    percentage: 7, 
    type: "Private" 
  },
  { 
    source: "Other Sources", 
    amount: 350000, 
    percentage: 5, 
    type: "Mixed" 
  }
];

// Stakeholder Details Data
export const STAKEHOLDER_DETAILS = [
  {
    id: 1,
    name: "Ghana Health Service",
    type: "Government",
    sector: "Healthcare",
    region: "National",
    contact: {
      phone: "+233 302 681109",
      email: "info@ghanahealthservice.org",
      website: "www.ghanahealthservice.org"
    },
    activities: ["Policy Development", "Healthcare Delivery", "Public Health Programs"],
    description: "Lead government agency for health service delivery in Ghana",
    fundingContribution: "$1.8M",
    projectsInvolved: 12
  },
  {
    id: 2,
    name: "World Health Organization",
    type: "International",
    sector: "Health Organization",
    region: "National",
    contact: {
      phone: "+233 302 501524",
      email: "ghawco@who.int",
      website: "www.who.int/countries/gha"
    },
    activities: ["Technical Support", "Capacity Building", "Policy Guidance"],
    description: "UN specialized agency for international public health",
    fundingContribution: "$2.5M",
    projectsInvolved: 18
  },
  {
    id: 3,
    name: "Diabetes Association of Ghana",
    type: "NGO",
    sector: "Patient Advocacy",
    region: "National",
    contact: {
      phone: "+233 244 123456",
      email: "info@diabetesgh.org",
      website: "www.diabetesassociationghana.org"
    },
    activities: ["Patient Education", "Advocacy", "Community Outreach"],
    description: "Leading patient advocacy organization for diabetes care",
    fundingContribution: "$0.3M",
    projectsInvolved: 8
  },
  {
    id: 4,
    name: "University of Ghana Medical School",
    type: "Academic",
    sector: "Research & Education",
    region: "Greater Accra",
    contact: {
      phone: "+233 302 500381",
      email: "medschool@ug.edu.gh",
      website: "www.ug.edu.gh/sms"
    },
    activities: ["Research", "Training", "Clinical Services"],
    description: "Premier medical education and research institution",
    fundingContribution: "$0.8M",
    projectsInvolved: 15
  }
];

// ==================== OVERVIEW PAGE DATA ====================

// Regional Activity Data
export const REGIONAL_ACTIVITY_DATA = [
  {
    region: "Greater Accra",
    activities: 31,
    keyPrograms: ["Hypertension Management", "Diabetes Prevention", "Cancer Screening"],
    keyImplementers: ["Ghana Health Service", "Local NGOs", "Private Clinics"],
    populationReached: 2500000,
    yearData: {
      2020: 45,
      2021: 38,
      2022: 42,
      2023: 44
    },
    partners: ["WHO", "USAID", "Local Government"]
  },
  {
    region: "Ashanti",
    activities: 17,
    keyPrograms: ["Mental Health", "Cardiovascular Disease", "Stroke Prevention"],
    keyImplementers: ["Kumasi Medical Center", "Regional NGOs", "Community Groups"],
    populationReached: 1800000,
    yearData: {
      2020: 25,
      2021: 22,
      2022: 21,
      2023: 22
    },
    partners: ["Gates Foundation", "Local NGOs"]
  },
  {
    region: "Western",
    activities: 89,
    keyPrograms: ["Diabetes Care", "Hypertension", "Community Health"],
    keyImplementers: ["Regional Health Directorate", "Faith-based Organizations"],
    populationReached: 950000,
    yearData: {
      2020: 20,
      2021: 24,
      2022: 23,
      2023: 22
    },
    partners: ["EU Health Initiative", "World Bank"]
  },
  {
    region: "Eastern",
    activities: 35,
    keyPrograms: ["Rural Health", "Chronic Disease Management"],
    keyImplementers: ["District Health Centers", "Mobile Clinics"],
    populationReached: 720000,
    yearData: {
      2020: 8,
      2021: 9,
      2022: 9,
      2023: 9
    },
    partners: ["UNICEF", "Local Partners"]
  },
  {
    region: "Central",
    activities: 37,
    keyPrograms: ["Maternal Health", "NCD Prevention"],
    keyImplementers: ["Central Regional Hospital", "Community Health Workers"],
    populationReached: 680000,
    yearData: {
      2020: 9,
      2021: 9,
      2022: 10,
      2023: 9
    },
    partners: ["UNFPA", "Government"]
  },
  {
    region: "Volta",
    activities: 25,
    keyPrograms: ["Border Health", "Disease Surveillance"],
    keyImplementers: ["Border Health Posts", "NGO Partners"],
    populationReached: 450000,
    yearData: {
      2020: 6,
      2021: 6,
      2022: 7,
      2023: 6
    },
    partners: ["Border Health Initiative"]
  },
  {
    region: "Northern",
    activities: 16,
    keyPrograms: ["Community Health Education", "Nutrition Programs", "Basic Healthcare"],
    keyImplementers: ["Northern Regional Health", "International NGOs", "Faith-based Organizations"],
    populationReached: 1200000,
    yearData: {
      2020: 32,
      2021: 28,
      2022: 15,
      2023: 14
    },
    partners: ["UNICEF", "World Vision", "Local Chiefs"]
  }
];

// Disease Activities Data
export const DISEASE_ACTIVITIES_DATA = [
  {
    disease: "Hypertension",
    totalActivities: 24,
    activities: [
      { 
        id: 1, 
        name: "Community Blood Pressure Screening", 
        region: "Greater Accra", 
        implementer: "Ghana Health Service", 
        status: "ongoing", 
        timeline: "2023-2025", 
        coverage: "85%", 
        partners: ["WHO", "Local Clinics"] 
      },
      { 
        id: 2, 
        name: "Hypertension Management Training", 
        region: "Ashanti", 
        implementer: "Kumasi Medical Center", 
        status: "completed", 
        timeline: "2022-2023", 
        coverage: "92%", 
        partners: ["USAID", "Medical Schools"] 
      },
      { 
        id: 3, 
        name: "Mobile Health Monitoring", 
        region: "Western", 
        implementer: "Regional Health Directorate", 
        status: "ongoing", 
        timeline: "2023-2024", 
        coverage: "67%", 
        partners: ["Gates Foundation"] 
      },
      { 
        id: 4, 
        name: "Community Health Worker Program", 
        region: "Northern", 
        implementer: "Local NGOs", 
        status: "ongoing", 
        timeline: "2023-2025", 
        coverage: "78%", 
        partners: ["WHO", "Community Groups"] 
      },
      { 
        id: 5, 
        name: "Digital Health Records", 
        region: "Eastern", 
        implementer: "Private Clinics", 
        status: "completed", 
        timeline: "2022-2023", 
        coverage: "95%", 
        partners: ["Tech Companies"] 
      }
    ]
  },
  {
    disease: "Diabetes",
    totalActivities: 18,
    activities: [
      { 
        id: 6, 
        name: "Diabetes Prevention Campaign", 
        region: "Ashanti", 
        implementer: "Regional Health Authority", 
        status: "ongoing", 
        timeline: "2023-2024", 
        coverage: "88%", 
        partners: ["Diabetes Foundation", "Local Media"] 
      },
      { 
        id: 7, 
        name: "Blood Sugar Testing Program", 
        region: "Greater Accra", 
        implementer: "Metropolitan Health", 
        status: "completed", 
        timeline: "2022-2023", 
        coverage: "94%", 
        partners: ["WHO", "Private Labs"] 
      },
      { 
        id: 8, 
        name: "Insulin Access Initiative", 
        region: "Central", 
        implementer: "Pharmaceutical Partners", 
        status: "ongoing", 
        timeline: "2023-2025", 
        coverage: "76%", 
        partners: ["Government", "Pharma Companies"] 
      }
    ]
  },
  {
    disease: "Cancer",
    totalActivities: 15,
    activities: [
      { 
        id: 9, 
        name: "Breast Cancer Screening", 
        region: "Western", 
        implementer: "Cancer Society Ghana", 
        status: "ongoing", 
        timeline: "2023-2024", 
        coverage: "72%", 
        partners: ["International Cancer Foundation"] 
      },
      { 
        id: 10, 
        name: "Cervical Cancer Prevention", 
        region: "Volta", 
        implementer: "Regional Women's Health", 
        status: "ongoing", 
        timeline: "2023-2025", 
        coverage: "68%", 
        partners: ["UN Women", "Local Clinics"] 
      }
    ]
  },
  {
    disease: "Cardiovascular Disease",
    totalActivities: 12,
    activities: [
      { 
        id: 11, 
        name: "Heart Health Education", 
        region: "Northern", 
        implementer: "Cardiac Care Foundation", 
        status: "ongoing", 
        timeline: "2023-2024", 
        coverage: "65%", 
        partners: ["Heart Foundation", "Media Partners"] 
      },
      { 
        id: 12, 
        name: "ECG Screening Program", 
        region: "Eastern", 
        implementer: "District Health Service", 
        status: "completed", 
        timeline: "2022-2023", 
        coverage: "89%", 
        partners: ["Medical Equipment Donors"] 
      }
    ]
  },
  {
    disease: "Mental Health",
    totalActivities: 8,
    activities: [
      { 
        id: 13, 
        name: "Mental Health Awareness Campaign", 
        region: "Greater Accra", 
        implementer: "Mental Health Authority", 
        status: "ongoing", 
        timeline: "2023-2024", 
        coverage: "83%", 
        partners: ["WHO", "Social Media Influencers"] 
      },
      { 
        id: 14, 
        name: "Community Counseling Services", 
        region: "Ashanti", 
        implementer: "Regional Mental Health", 
        status: "ongoing", 
        timeline: "2023-2025", 
        coverage: "71%", 
        partners: ["Training Institutes"] 
      }
    ]
  }
];

// Care Continuum Activities Data
export const CARE_CONTINUUM_ACTIVITIES = [
  {
    id: 1,
    activity: "Community Health Education",
    stage: "Prevention",
    region: "Greater Accra",
    partner: "Ghana Health Service",
    targetGroup: "General Population",
    diseases: ["Hypertension", "Diabetes"],
    coverage: 85,
    status: "ongoing"
  },
  {
    id: 2,
    activity: "Blood Pressure Screening",
    stage: "Screening",
    region: "Ashanti",
    partner: "WHO",
    targetGroup: "Adults 40+",
    diseases: ["Hypertension"],
    coverage: 78,
    status: "ongoing"
  },
  {
    id: 3,
    activity: "Diabetes Management Program",
    stage: "Treatment",
    region: "Western",
    partner: "Regional Health Directorate",
    targetGroup: "Diabetic Patients",
    diseases: ["Diabetes"],
    coverage: 92,
    status: "completed"
  },
  {
    id: 4,
    activity: "Cancer Screening Initiative",
    stage: "Screening",
    region: "Central",
    partner: "Cancer Society",
    targetGroup: "Women 30-65",
    diseases: ["Breast Cancer", "Cervical Cancer"],
    coverage: 65,
    status: "ongoing"
  },
  {
    id: 5,
    activity: "Cardiovascular Surgery",
    stage: "Treatment",
    region: "Greater Accra",
    partner: "Korle Bu Teaching Hospital",
    targetGroup: "CVD Patients",
    diseases: ["Cardiovascular Disease"],
    coverage: 45,
    status: "ongoing"
  },
  {
    id: 6,
    activity: "Mental Health Counseling",
    stage: "Treatment",
    region: "Northern",
    partner: "Mental Health Authority",
    targetGroup: "All Ages",
    diseases: ["Mental Health"],
    coverage: 38,
    status: "ongoing"
  },
  {
    id: 7,
    activity: "Stroke Rehabilitation",
    stage: "Rehabilitation",
    region: "Eastern",
    partner: "Rehabilitation Centers",
    targetGroup: "Stroke Patients",
    diseases: ["Stroke"],
    coverage: 67,
    status: "ongoing"
  },
  {
    id: 8,
    activity: "COPD Management",
    stage: "Treatment",
    region: "Volta",
    partner: "Respiratory Care Unit",
    targetGroup: "COPD Patients",
    diseases: ["COPD"],
    coverage: 54,
    status: "ongoing"
  },
  {
    id: 9,
    activity: "Kidney Disease Prevention",
    stage: "Prevention",
    region: "Central",
    partner: "Nephrology Association",
    targetGroup: "High Risk Adults",
    diseases: ["Kidney Disease"],
    coverage: 71,
    status: "ongoing"
  },
  {
    id: 10,
    activity: "Nutrition Education Program",
    stage: "Prevention",
    region: "Northern",
    partner: "Nutrition Society",
    targetGroup: "All Ages",
    diseases: ["Obesity", "Diabetes"],
    coverage: 82,
    status: "ongoing"
  }
];

// ==================== DASHBOARD/MAP DATA ====================

// Regional Activity Totals for Map
export const REGION_ACTIVITY_TOTALS = {
  "Greater Accra": { total: 169 },
  "Ashanti": { total: 90 },
  "Western": { total: 89 },
  "Western North": { total: 23 },
  "Central": { total: 37 },
  "Eastern": { total: 35 },
  "Volta": { total: 25 },
  "Oti": { total: 21 },
  "Northern": { total: 35 },
  "Savannah": { total: 33 },
  "North East": { total: 34 },
  "Upper East": { total: 31 },
  "Upper West": { total: 27 },
  "Bono": { total: 27 },
  "Bono East": { total: 27 },
  "Ahafo": { total: 23 }
};

// Region Label Positions for Map
export const REGION_LABEL_POSITIONS = {
  "Greater Accra": [5.7, 0.1] as [number, number],
  "Ashanti": [6.7, -1.5] as [number, number],
  "Western": [5.5, -2.2] as [number, number],
  "Western North": [6.2, -2.8] as [number, number],
  "Central": [5.5, -1.0] as [number, number],
  "Eastern": [6.3, -0.4] as [number, number],
  "Volta": [6.5, 0.5] as [number, number],
  "Oti": [7.9, 0.2] as [number, number],
  "Northern": [9.6, -0.3] as [number, number],
  "Savannah": [9.2, -1.7] as [number, number],
  "North East": [10.4, -0.6] as [number, number],
  "Upper East": [10.8, -0.9] as [number, number],
  "Upper West": [10.3, -2.2] as [number, number],
  "Bono": [7.6, -2.4] as [number, number],
  "Bono East": [7.9, -1.2] as [number, number],
  "Ahafo": [6.9, -2.6] as [number, number]
};

// Dashboard Stats
export const DASHBOARD_STATS = {
  totalRegions: 10,
  totalActivities: 245,
  totalOrganizations: 89,
  totalParticipants: "15.2K"
};

// ==================== COMPUTED DATA HELPERS ====================

// Sector Chart Data
export const SECTOR_CHART_DATA = SECTOR_DATA.map(item => ({
  name: item.Sector,
  value: item.Count
}));

// Total Organizations
export const TOTAL_ORGANIZATIONS = SECTOR_DATA.reduce((sum, item) => sum + item.Count, 0);

// Total Funding
export const TOTAL_FUNDING = FUNDING_DATA.reduce((sum, item) => sum + item.amount, 0);

// Top Funding Source
export const TOP_FUNDING_SOURCE = FUNDING_DATA[0];

// Total Projects (from timeline data)
export const TOTAL_PROJECTS = PROJECT_TIMELINE_DATA.reduce((sum, item) => sum + item["Number of Projects"], 0);

// ==================== TYPE DEFINITIONS ====================

export interface ProjectTimelineData {
  Year: number;
  "Number of Projects": number;
}

export interface SectorData {
  Sector: string;
  Count: number;
}

export interface FundingData {
  source: string;
  amount: number;
  percentage: number;
  type: string;
}

export interface StakeholderData {
  id: number;
  name: string;
  type: string;
  sector: string;
  region: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  activities: string[];
  description: string;
  fundingContribution: string;
  projectsInvolved: number;
}

export interface RegionalActivityData {
  region: string;
  activities: number;
  keyPrograms: string[];
  keyImplementers: string[];
  populationReached: number;
  yearData: {
    [year: number]: number;
  };
  partners: string[];
}

export interface DiseaseActivityData {
  disease: string;
  totalActivities: number;
  activities: {
    id: number;
    name: string;
    region: string;
    implementer: string;
    status: string;
    timeline: string;
    coverage: string;
    partners: string[];
  }[];
}

export interface CareActivityData {
  id: number;
  activity: string;
  stage: string;
  region: string;
  partner: string;
  targetGroup: string;
  diseases: string[];
  coverage: number;
  status: string;
}

export interface RegionActivityTotal {
  total: number;
}

// Export all data as a single object for easy importing
export const SURVEY_MOCK_DATA = {
  // Background Page
  projectTimeline: PROJECT_TIMELINE_DATA,
  sectors: SECTOR_DATA,
  funding: FUNDING_DATA,
  stakeholders: STAKEHOLDER_DETAILS,
  
  // Overview Page
  regionalActivities: REGIONAL_ACTIVITY_DATA,
  diseaseActivities: DISEASE_ACTIVITIES_DATA,
  careContinuum: CARE_CONTINUUM_ACTIVITIES,
  
  // Dashboard/Map
  regionTotals: REGION_ACTIVITY_TOTALS,
  regionLabels: REGION_LABEL_POSITIONS,
  dashboardStats: DASHBOARD_STATS,
  
  // Computed
  sectorChart: SECTOR_CHART_DATA,
  totals: {
    organizations: TOTAL_ORGANIZATIONS,
    funding: TOTAL_FUNDING,
    projects: TOTAL_PROJECTS
  },
  top: {
    fundingSource: TOP_FUNDING_SOURCE
  }
};
