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
    { id: 1, name: 'Survey', amount: 3500 },
    { id: 2, name: "Users", amount: 235 },
    { id: 3, name: 'Current year', amount: 2025 },
    { id: 4, name: 'Projects', amount: 219 }
]

export {
    NAVIGATION,
    FEATURES,
    RESOURCES_LINK,
    RESOURCES_ACTION,
    ADMIN_STATS
}