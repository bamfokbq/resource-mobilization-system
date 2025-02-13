import { MdOutlinePoll } from "react-icons/md"
import { FiUsers } from "react-icons/fi"
import { BsCalendar3 } from "react-icons/bs"
import { AiOutlineProject } from "react-icons/ai"

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
        href: '/explore-data',
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
        title: "Take the Survey",
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

export {
    NAVIGATION,
    FEATURES,
    RESOURCES_LINK,
    RESOURCES_ACTION,
    ADMIN_STATS,
    SURVEY_LISTS,
    USER_LISTS,
    ADMIN_PROFILE,
    SURVEY_HISTORY_LISTS
}