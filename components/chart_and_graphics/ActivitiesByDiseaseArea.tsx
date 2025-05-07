"use client";

import GeneralChart, { ChartDataItem } from "./GeneralChart";

const data: ChartDataItem[] = [
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

const ActivitiesByDiseaseArea = () => {
    const handleBarClick = (entry: any) => {
        console.log('Selected:', entry);
        // Add your click handler logic here
    };

    return (
        <GeneralChart
            data={data}
            title="Activities by Disease Area"
            layout="vertical"
            showAverage={true}
            showSort={true}
            height={600}
            barGradient={{
                startColor: "#4F46E5",
                endColor: "#818CF8"
            }}
            onBarClick={handleBarClick}
        />
    );
};

export default ActivitiesByDiseaseArea;
