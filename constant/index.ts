import { MdOutlinePoll } from "react-icons/md"
import { FiUsers } from "react-icons/fi"
import { BsCalendar3 } from "react-icons/bs"
import { AiOutlineProject } from "react-icons/ai"
import regionsData from './regions.json';

const NAVIGATION = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Features',
        href: '/#features',
    },
    {
        name: 'Survey',
        href: '/survey',
    },
    {
        name: 'Explore Data',
        href: '/survey-data',
    },
    {
        name: 'Resources',
        href: '/#resources',
    }
]

const FEATURES = [
    {
        id: 1,
        title: "Stakehoder Mapping",
        description: "Identify who is doing what, where, and for whom.",
        icon: "/mind-mapping.svg",
    },
    {
        id: 2,
        title: "Data Visualisation",
        description: "Analyse and understand NCD service distribution.",
        icon: "/business-analysis.svg",
    },
    {
        id: 3,
        title: "Resource Optimisation",
        description: "Prioritise investments effectively.",
        icon: "/resource-optimization.svg",
    },
    {
        id: 4,
        title: "Real-Time Reporting",
        description: "Access live updates and metrics from stakeholders.",
        icon: "/real-time-reporting.svg",
    }
]

const RESOURCES_LINK = [
    {
        id: 1,
        title: "Take the Mapping",
        description: "Provide insights on NCD-related activities.",
        link: '/survey',
    },
    {
        id: 2,
        title: "Explore Data",
        description: "Access and analyse data on NCD services.",
        link: '/explore-data',
    },
    {
        id: 3,
        title: "Join as a Partner",
        description: "Collaborate on initiatives and funding.",
        link: '/partners',
    }
]

const RESOURCES_ACTION = [
    {
        id: 1,
        title: "Ghana NCD Strategy 2023",
        download: '/resources/stakeholder-mapping.pdf',
    },
    {
        id: 2,
        title: "Latest NCD Navigator Report",
        download: '/resources/data-visualisation.pdf',
    },
    {
        id: 3,
        title: "NCD Service Distribution",
        download: '/resources/resource-optimisation.pdf',
    },
    {
        id: 4,
        title: "Tutorial for using the Navigator",
        download: '/resources/real-time-reporting.pdf',
    }
]

const ADMIN_STATS = [
    { id: 1, name: 'Survey', amount: 3500, icon: MdOutlinePoll },
    { id: 2, name: "Users", amount: 235, icon: FiUsers },
    { id: 3, name: 'Current year', amount: 2025, icon: BsCalendar3 },
    { id: 4, name: 'Projects', amount: 219, icon: AiOutlineProject }
]

const SURVEY_LISTS = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    organisation: [
        "Green Earth", "Ocean Savers", "Wildlife Protectors", "City Planners",
        "Farmers United", "Tech Innovators", "Health Advocates", "Clean Energy",
        "Water Guardians", "Education for All", "Housing for All", "Food Security",
        "Tech for Good", "Healthcare Providers", "Green Transport", "Disaster Relief",
        "Climate Action", "Renewable Energy Network", "Smart Agriculture", "Urban Sustainability",
        "Public Safety Initiative", "Eco Warriors", "Medical Outreach", "STEM for Kids",
        "Women Empowerment Network", "Youth Leadership Program", "Digital Inclusion",
        "Biodiversity Conservation", "Forest Restoration", "Affordable Healthcare",
        "Access to Clean Water", "Mental Health Awareness", "AI for Social Good",
        "Sustainable Fisheries", "Wildlife Conservation Fund", "Solar Energy Solutions",
        "Zero Waste Initiative", "Road Safety Alliance", "Community Resilience",
        "Green Building Council", "Disaster Preparedness", "Food Waste Reduction",
        "Coastal Protection", "Public Health Research", "Educational Equity",
        "Tech for Seniors", "Waste Management Coalition", "Local Economic Development",
        "Renewable Infrastructure"
    ][index % 50],
    region: ["North America", "Europe", "Asia", "Africa", "South America", "Australia", "Middle East"][Math.floor(Math.random() * 7)],
    project_name: [
        "Tree Plantation", "Beach Cleanup", "Elephant Conservation", "Urban Development",
        "Sustainable Agriculture", "Smart City Solutions", "Public Health Awareness",
        "Solar Panel Installation", "River Restoration", "School Building",
        "Affordable Housing", "Community Gardens", "Tech Education",
        "Medical Clinics", "Electric Buses", "Disaster Relief Operations",
        "Climate Change Mitigation", "Wind Power Expansion", "Precision Farming",
        "Sustainable Urban Planning", "Emergency Response Training",
        "Reforestation Projects", "Rural Health Campaign", "Coding for Kids",
        "Women's Rights Advocacy", "Youth Empowerment Workshops", "Bridging the Digital Divide",
        "Endangered Species Protection", "Forest Regeneration", "Telemedicine Services",
        "Clean Drinking Water Projects", "Suicide Prevention Awareness",
        "AI-driven Disaster Response", "Sustainable Fishing Practices",
        "Animal Rehabilitation Centers", "Off-Grid Solar Installations",
        "Zero Waste Lifestyle Education", "Traffic Safety Improvements",
        "Community Resilience Training", "Eco-friendly Architecture",
        "Emergency Relief Supplies", "Reducing Food Waste Campaigns",
        "Marine Habitat Conservation", "Epidemiological Studies",
        "Access to Quality Education", "Senior Digital Literacy Programs",
        "Plastic-Free Living Campaigns", "Microfinance for Small Businesses",
        "Green Infrastructure Projects"
    ][index % 50],
    description: `This is a detailed description of the '${[
            "Tree Plantation", "Beach Cleanup", "Elephant Conservation", "Urban Development",
            "Sustainable Agriculture", "Smart City Solutions", "Public Health Awareness",
            "Solar Panel Installation", "River Restoration", "School Building",
            "Affordable Housing", "Community Gardens", "Tech Education",
            "Medical Clinics", "Electric Buses", "Disaster Relief Operations",
            "Climate Change Mitigation", "Wind Power Expansion", "Precision Farming",
            "Sustainable Urban Planning", "Emergency Response Training",
            "Reforestation Projects", "Rural Health Campaign", "Coding for Kids",
            "Women's Rights Advocacy", "Youth Empowerment Workshops", "Bridging the Digital Divide",
            "Endangered Species Protection", "Forest Regeneration", "Telemedicine Services",
            "Clean Drinking Water Projects", "Suicide Prevention Awareness",
            "AI-driven Disaster Response", "Sustainable Fishing Practices",
            "Animal Rehabilitation Centers", "Off-Grid Solar Installations",
            "Zero Waste Lifestyle Education", "Traffic Safety Improvements",
            "Community Resilience Training", "Eco-friendly Architecture",
            "Emergency Relief Supplies", "Reducing Food Waste Campaigns",
            "Marine Habitat Conservation", "Epidemiological Studies",
            "Access to Quality Education", "Senior Digital Literacy Programs",
            "Plastic-Free Living Campaigns", "Microfinance for Small Businesses",
            "Green Infrastructure Projects"
        ][index % 50]
        }' initiative, led by '${[
            "Green Earth", "Ocean Savers", "Wildlife Protectors", "City Planners",
            "Farmers United", "Tech Innovators", "Health Advocates", "Clean Energy",
            "Water Guardians", "Education for All", "Housing for All", "Food Security",
            "Tech for Good", "Healthcare Providers", "Green Transport", "Disaster Relief",
            "Climate Action", "Renewable Energy Network", "Smart Agriculture", "Urban Sustainability",
            "Public Safety Initiative", "Eco Warriors", "Medical Outreach", "STEM for Kids",
            "Women Empowerment Network", "Youth Leadership Program", "Digital Inclusion",
            "Biodiversity Conservation", "Forest Restoration", "Affordable Healthcare",
            "Access to Clean Water", "Mental Health Awareness", "AI for Social Good",
            "Sustainable Fisheries", "Wildlife Conservation Fund", "Solar Energy Solutions",
            "Zero Waste Initiative", "Road Safety Alliance", "Community Resilience",
            "Green Building Council", "Disaster Preparedness", "Food Waste Reduction",
            "Coastal Protection", "Public Health Research", "Educational Equity",
            "Tech for Seniors", "Waste Management Coalition", "Local Economic Development",
            "Renewable Infrastructure"
        ][index % 50]
        }'.`,
    contact: `contact${index + 1}@example.com`,
    status: ["Active", "In Progress", "Completed", "On Hold"][Math.floor(Math.random() * 4)]
}));

const SURVEY_HISTORY_LISTS = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    organisation: [
        "Green Earth", "Ocean Savers", "Wildlife Protectors", "City Planners",
        "Farmers United", "Tech Innovators", "Health Advocates", "Clean Energy",
        "Water Guardians", "Education for All", "Housing for All", "Food Security",
        "Tech for Good", "Healthcare Providers", "Green Transport", "Disaster Relief",
        "Climate Action", "Renewable Energy Network", "Smart Agriculture", "Urban Sustainability",
        "Public Safety Initiative", "Eco Warriors", "Medical Outreach", "STEM for Kids",
        "Women Empowerment Network", "Youth Leadership Program", "Digital Inclusion",
        "Biodiversity Conservation", "Forest Restoration", "Affordable Healthcare",
        "Access to Clean Water", "Mental Health Awareness", "AI for Social Good",
        "Sustainable Fisheries", "Wildlife Conservation Fund", "Solar Energy Solutions",
        "Zero Waste Initiative", "Road Safety Alliance", "Community Resilience",
        "Green Building Council", "Disaster Preparedness", "Food Waste Reduction",
        "Coastal Protection", "Public Health Research", "Educational Equity",
        "Tech for Seniors", "Waste Management Coalition", "Local Economic Development",
        "Renewable Infrastructure"
    ][index % 50],
    region: ["North America", "Europe", "Asia", "Africa", "South America", "Australia", "Middle East"][Math.floor(Math.random() * 7)],
    project_name: [
        "Tree Plantation", "Beach Cleanup", "Elephant Conservation", "Urban Development",
        "Sustainable Agriculture", "Smart City Solutions", "Public Health Awareness",
        "Solar Panel Installation", "River Restoration", "School Building",
        "Affordable Housing", "Community Gardens", "Tech Education",
        "Medical Clinics", "Electric Buses", "Disaster Relief Operations",
        "Climate Change Mitigation", "Wind Power Expansion", "Precision Farming",
        "Sustainable Urban Planning", "Emergency Response Training",
        "Reforestation Projects", "Rural Health Campaign", "Coding for Kids",
        "Women's Rights Advocacy", "Youth Empowerment Workshops", "Bridging the Digital Divide",
        "Endangered Species Protection", "Forest Regeneration", "Telemedicine Services",
        "Clean Drinking Water Projects", "Suicide Prevention Awareness",
        "AI-driven Disaster Response", "Sustainable Fishing Practices",
        "Animal Rehabilitation Centers", "Off-Grid Solar Installations",
        "Zero Waste Lifestyle Education", "Traffic Safety Improvements",
        "Community Resilience Training", "Eco-friendly Architecture",
        "Emergency Relief Supplies", "Reducing Food Waste Campaigns",
        "Marine Habitat Conservation", "Epidemiological Studies",
        "Access to Quality Education", "Senior Digital Literacy Programs",
        "Plastic-Free Living Campaigns", "Microfinance for Small Businesses",
        "Green Infrastructure Projects"
    ][index % 50],
    description: `This is a detailed description of the '${[
        "Tree Plantation", "Beach Cleanup", "Elephant Conservation", "Urban Development",
        "Sustainable Agriculture", "Smart City Solutions", "Public Health Awareness",
        "Solar Panel Installation", "River Restoration", "School Building",
        "Affordable Housing", "Community Gardens", "Tech Education",
        "Medical Clinics", "Electric Buses", "Disaster Relief Operations",
        "Climate Change Mitigation", "Wind Power Expansion", "Precision Farming",
        "Sustainable Urban Planning", "Emergency Response Training",
        "Reforestation Projects", "Rural Health Campaign", "Coding for Kids",
        "Women's Rights Advocacy", "Youth Empowerment Workshops", "Bridging the Digital Divide",
        "Endangered Species Protection", "Forest Regeneration", "Telemedicine Services",
        "Clean Drinking Water Projects", "Suicide Prevention Awareness",
        "AI-driven Disaster Response", "Sustainable Fishing Practices",
        "Animal Rehabilitation Centers", "Off-Grid Solar Installations",
        "Zero Waste Lifestyle Education", "Traffic Safety Improvements",
        "Community Resilience Training", "Eco-friendly Architecture",
        "Emergency Relief Supplies", "Reducing Food Waste Campaigns",
        "Marine Habitat Conservation", "Epidemiological Studies",
        "Access to Quality Education", "Senior Digital Literacy Programs",
        "Plastic-Free Living Campaigns", "Microfinance for Small Businesses",
        "Green Infrastructure Projects"
    ][index % 50]
        }' initiative, led by '${[
            "Green Earth", "Ocean Savers", "Wildlife Protectors", "City Planners",
            "Farmers United", "Tech Innovators", "Health Advocates", "Clean Energy",
            "Water Guardians", "Education for All", "Housing for All", "Food Security",
            "Tech for Good", "Healthcare Providers", "Green Transport", "Disaster Relief",
            "Climate Action", "Renewable Energy Network", "Smart Agriculture", "Urban Sustainability",
            "Public Safety Initiative", "Eco Warriors", "Medical Outreach", "STEM for Kids",
            "Women Empowerment Network", "Youth Leadership Program", "Digital Inclusion",
            "Biodiversity Conservation", "Forest Restoration", "Affordable Healthcare",
            "Access to Clean Water", "Mental Health Awareness", "AI for Social Good",
            "Sustainable Fisheries", "Wildlife Conservation Fund", "Solar Energy Solutions",
            "Zero Waste Initiative", "Road Safety Alliance", "Community Resilience",
            "Green Building Council", "Disaster Preparedness", "Food Waste Reduction",
            "Coastal Protection", "Public Health Research", "Educational Equity",
            "Tech for Seniors", "Waste Management Coalition", "Local Economic Development",
            "Renewable Infrastructure"
        ][index % 50]
        }'.`,
    contact: `contact${index + 1}@example.com`,
    status: ["Active", "In Progress", "Completed", "On Hold"][Math.floor(Math.random() * 4)]
}));


const REGIONS_GHANA = [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
    "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West",
    "Volta", "Western", "Western North"
];

const USER_LISTS = Array.from({ length: 50 }, (_, index) => {
    const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "James", "Lisa", "Robert", "Mary"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const organisations = ["Ministry of Health", "Ghana Health Service", "WHO Ghana", "UNICEF Ghana", "PATH Ghana", "NCD Alliance"];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
        id: index + 1,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        region: REGIONS_GHANA[Math.floor(Math.random() * REGIONS_GHANA.length)],
        telephone: `+233${Math.floor(Math.random() * 900000000 + 100000000)}`,
        organisation: organisations[Math.floor(Math.random() * organisations.length)]
    };
});

const ADMIN_PROFILE = {
    firstName: "Paa",
    lastName: "Bamfo",
    email: "paa@gmail.com",
    telephone: "+233 123 456 789",
    bio: "I am a software engineer with a passion for building products that solve real-world problems. I am currently working on a project that aims to improve the quality of healthcare in Ghana.",
}

const CONTINUUM_OF_CARE_DATA = [
    { name: "Health Promotion / Primary Prevention", value: 2987 },
    { name: "Link Patients to Care", value: 2218 },
    { name: "Care / Treatment with Follow-up", value: 1848 },
    { name: "Screening / Risk Assessment", value: 1779 },
    { name: "Policy / Systems Strength", value: 1778 },
    { name: "Diagnosis / Testing", value: 1562 },
    { name: "Access to Products / Devices / Diagnostics", value: 1463 },
    { name: "Access to Medicines", value: 1404 },
    { name: "Reintegration / Rehabilitation", value: 890 },
    { name: "Palliative Care", value: 860 },
    { name: "Care / Treatment without Follow-up", value: 432 },
    { name: "Vaccination", value: 104 },
];
const ACTIVITIES_BY_REGION_DATA = [
    { name: "Hypertension", value: 980 },
    { name: "Diabetes Mellitus", value: 832 },
    { name: "Breast Cancer", value: 234 },
    { name: "Cervical Cancer", value: 273 },
    { name: "Mental Health", value: 100 },
    { name: "Childhood Cancers", value: 50 },
    { name: "Prostate Cancer", value: 500 },
    { name: "Road Accidents", value: 129 },
    { name: "Domestic Injuries", value: 30 },
    { name: "Childhood Cancers (Dup)", value: 10 },
    { name: "COPD & Asthma", value: 60 },
    { name: "Sickle Cell Disease", value: 901 },
    { name: "CVD & Stroke", value: 875 },
    { name: "All NCDs (General)", value: 89 },
    { name: "Other NCDs", value: 89 }
];

const NCDs_LISTS = [
    { label: "Hypertension", value: 'Hypertension' },
    { label: "Diabetes Mellitus", value: 'Diabetes Mellitus' },
    { label: "Breast Cancer", value: 'Breast Cancer' },
    { label: "Cervical Cancer", value: 'Cervical Cancer' },
    { label: "Mental Health", value: 'Mental Health' },
    { label: "Childhood Cancers", value: 'Childhood Cancers' },
    { label: "Prostate Cancer", value: 'Prostate Cancer' },
    { label: "Road Accidents", value: 'Road Accidents' },
    { label: "Domestic Injuries", value: 'Domestic Injuries' },
    { label: "Childhood Cancers (Dup)", value: 'Childhood Cancers (Dup)' },
    { label: "COPD & Asthma", value: 'COPD & Asthma' },
    { label: "Sickle Cell Disease", value: 'Sickle Cell Disease' },
    { label: "CVD & Stroke", value: 'CVD & Stroke' },
    { label: "All NCDs (General)", value: 'All NCDs (General)' },
    { label: "Other NCDs", value: 'Other NCDs' }
];

const YEARLY_DATA = [
    { name: '2022', value: 400 },
    { name: '2023', value: 300 },
    { name: '2024', value: 600 },
    { name: '2025', value: 0 },
];

const SECTORS_DATA = [
    { name: 'Local NGO', value: 100 },
    { name: 'International NGO', value: 200 },
    { name: 'Civil Society Organisation', value: 300 },
    { name: 'Ghana Government', value: 300 },
    { name: 'Faith-based Organisation', value: 400 },
    { name: 'Multilateral', value: 4 },
    { name: 'Private', value: 500 },
    { name: 'Academic/Research', value: 600 },
    { name: 'Foundation', value: 70 },
    { name: "Patient Organisation", value: 80 },
    { name: 'Foreign Government', value: 90 },
]

const SECTORS = {
    CivilSocietyOrganization: "Civil Society Organization",
    LocalNGO: "Local NGO",
    InternationalNGO: "International NGO",
    ForeignGovernment: "Foreign Government",
    PatientOrganization: "Patient Organization",
    Foundation: "Foundation",
    AcademiaResearch: "Academia / Research",
    Multilateral: "Multilateral",
    Private: "Private"
};

const SECTORS_SELECT = [
    { value: "GhanaGovernment", label: "Ghana Government" },
    { value: "PatientOrganization", label: "Patient Organization" },
    { value: "LocalNGO", label: "Local NGO" },
    { value: "InternationalNGO", label: "International NGO" },
    { value: "CivilSocietyOrganization", label: "Civil Society Organization" },
    { value: "Foundation", label: "Foundation" },
    { value: "FaithBasedOrganisation", label: "Faith-based Organisation" },
    { value: "ForeignGovernment", label: "Foreign Government" },
    { value: "Private", label: "Private" },
    { value: "AcademiaResearch", label: "Academia / Research" },
    { value: "Multilateral", label: "Multilateral" },
    { value: "FunderDonor", label: "Funder / Donor" },
    { value: "OtherSector", label: "Other Sector" }
];

const STAKEHOLDERS_BY_REGIONS = [
    {
        region: "Ahafo",
        stakeholders: [
            {
                category: "Civil Society Organisation",
                organisations: ["Human Care and Maintenance Foundation HUCA"]
            },
            {
                category: "Foundation",
                organisations: ["Firm Foundation and Environment Ghana"]
            }
        ]
    },
    {
        region: "Ashanti",
        stakeholders: [
            {
                category: "International NGO",
                organisations: ["World Vision Ghana", "CARE International"]
            },
            {
                category: "Local NGO",
                organisations: ["Kumasi Youth Foundation", "Ashanti Development"]
            }
        ]
    },
    {
        region: "Bono",
        stakeholders: [
            {
                category: "Academia / Research",
                organisations: ["University of Energy and Natural Resources Research Institute"]
            },
            {
                category: "Private",
                organisations: ["Bono Business Network"]
            }
        ]
    },
    {
        region: "Bono East",
        stakeholders: [
            {
                category: "Local NGO",
                organisations: ["Eastern Corridor Development Foundation"]
            },
            {
                category: "Multilateral",
                organisations: ["UNICEF Ghana"]
            }
        ]
    },
    {
        region: "Central",
        stakeholders: [
            {
                category: "Civil Society Organisation",
                organisations: ["Central Regional Development Network"]
            },
            {
                category: "Academia / Research",
                organisations: ["University of Cape Coast Research Hub"]
            }
        ]
    },
    {
        region: "Eastern",
        stakeholders: [
            {
                category: "Local NGO",
                organisations: ["Eastern Volunteers Association"]
            },
            {
                category: "Foundation",
                organisations: ["The Rural Empowerment Foundation"]
            }
        ]
    },
    {
        region: "Greater Accra",
        stakeholders: [
            {
                category: "International NGO",
                organisations: ["Plan International Ghana", "Oxfam Ghana"]
            },
            {
                category: "Multilateral",
                organisations: ["United Nations Development Programme (UNDP)"]
            },
            {
                category: "Private",
                organisations: ["Accra Chamber of Commerce"]
            }
        ]
    },
    {
        region: "North East",
        stakeholders: [
            {
                category: "Foreign Government",
                organisations: ["USAID Ghana"]
            },
            {
                category: "Local NGO",
                organisations: ["North East Youth Development Initiative"]
            }
        ]
    },
    {
        region: "Northern",
        stakeholders: [
            {
                category: "International NGO",
                organisations: ["Savannah Women Empowerment Group"]
            },
            {
                category: "Multilateral",
                organisations: ["World Food Programme (WFP)"]
            }
        ]
    },
    {
        region: "Oti",
        stakeholders: [
            {
                category: "Local NGO",
                organisations: ["Oti Region Community Development Association"]
            },
            {
                category: "Foundation",
                organisations: ["Oti Foundation for Rural Progress"]
            }
        ]
    },
    {
        region: "Savannah",
        stakeholders: [
            {
                category: "Academia / Research",
                organisations: ["Savannah Agricultural Research Institute"]
            },
            {
                category: "Civil Society Organisation",
                organisations: ["Savannah Development Union"]
            }
        ]
    },
    {
        region: "Upper East",
        stakeholders: [
            {
                category: "International NGO",
                organisations: ["ActionAid Ghana"]
            },
            {
                category: "Local NGO",
                organisations: ["Upper East Women's Empowerment Coalition"]
            }
        ]
    },
    {
        region: "Upper West",
        stakeholders: [
            {
                category: "Foreign Government",
                organisations: ["Embassy of Canada in Ghana"]
            },
            {
                category: "Local NGO",
                organisations: ["Upper West Development Foundation"]
            }
        ]
    },
    {
        region: "Volta",
        stakeholders: [
            {
                category: "Multilateral",
                organisations: ["World Health Organization (WHO) Ghana"]
            },
            {
                category: "Local NGO",
                organisations: ["Volta Youth Empowerment Group"]
            }
        ]
    },
    {
        region: "Western",
        stakeholders: [
            {
                category: "International NGO",
                organisations: ["Friends of the Earth Ghana"]
            },
            {
                category: "Foundation",
                organisations: ["Western Coastal Development Foundation"]
            }
        ]
    },
    {
        region: "Western North",
        stakeholders: [
            {
                category: "Local NGO",
                organisations: ["Western North Community Empowerment Group"]
            },
            {
                category: "Academia / Research",
                organisations: ["Forestry Research Institute of Ghana"]
            }
        ]
    }
];

const REGIONAL_SECTOR_DATA = {
    "Greater Accra": { total: 23 },
    "Ashanti": { total: 20 },
    "Western": { total: 19 },
    "Western North": { total: 23 },
    "Central": { total: 37 },
    "Eastern": { total: 5 },
    "Volta": { total: 21 },
    "Oti": { total: 21 },
    "Northern": { total: 35 },
    "Savannah": { total: 33 },
    "North East": { total: 34 },
    "Upper East": { total: 31 },
    "Upper West": { total: 27 },
    "Bono": { total: 27 },
    "Bono East": { total: 27 },
    "Ahafo": { total: 23 }
}


const GHANA_REGIONS = [
    "Ahafo",
    "Ashanti",
    "Bono",
    "Bono East",
    "Central",
    "Eastern",
    "Greater Accra",
    "North East",
    "Northern",
    "Oti",
    "Savannah",
    "Upper East",
    "Upper West",
    "Volta",
    "Western",
    "Western North",
]

// "Hypertension",
//   "Diabetes Mellitus",
//   "Breast Cancer",
//   "Cervical Cancer",
//   "Mental Health",
//   "Childhood Cancers",
//   "Prostate Cancer",
//   "Road Accidents",
//   "Domestic Injuries",
//   "Childhood Cancers (Dup)",
//   "COPD & Asthma",
//   "Sickle Cell Disease",
//   "CVD & Stroke",
//   "All NCDs (General)",
//   "Other NCDs"

export const NCD_DATA = [
    "Hypertension",
    "Diabetes Mellitus",
    "Breast Cancer",
    "Cervical Cancer",
    "Mental Health",
    "Childhood Cancers",
    "Prostate Cancer",
    "Road Accidents",
    "Domestic Injuries",
    "Childhood Cancers (Dup)",
    "COPD & Asthma",
    "Sickle Cell Disease",
    "CVD & Stroke",
    "All NCDs (General)",
    "Other NCDs"
] as const

export type NCDType = typeof NCD_DATA[number];


export const FUNDING_SOURCES = [
    'Ghana Government',
    'Local NGO',
    'International NGO',
    'Individual Donors',
    'Foundation',
    'Others',
    'Private Sector',
    'Academic/Research Institution',
    'UN Agency'
] as const

export const getDistrictsByRegion = (regionName: string): string[] => {
    const region = regionsData.regions.find(r => r.region === regionName);
    if (!region) return [];
    return region.districts.map(district => district.district);
};

// You can also add a type definition for better TypeScript support
export type RegionData = typeof regionsData;


export {
    NAVIGATION,
    FEATURES,
    RESOURCES_LINK,
    RESOURCES_ACTION,
    ADMIN_STATS,
    SURVEY_LISTS,
    USER_LISTS,
    ADMIN_PROFILE,
    SURVEY_HISTORY_LISTS,
    GHANA_REGIONS,
    CONTINUUM_OF_CARE_DATA,
    ACTIVITIES_BY_REGION_DATA,
    SECTORS_DATA,
    YEARLY_DATA,
    STAKEHOLDERS_BY_REGIONS,
    REGIONAL_SECTOR_DATA,
    REGIONS_GHANA,
    SECTORS,
    SECTORS_SELECT,
    NCDs_LISTS
}