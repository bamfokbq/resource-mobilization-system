import React from 'react'
import SurveyHero from '@/components/features/SurveyHero'
import WhoCompleteSurvey from '@/components/features/WhoCompleteSurvey'
import ParticipateDetails from '@/components/features/ParticipateDetails'
import Assistance from '@/components/features/Assistance'
import SurveyInstructions from '@/components/features/SurveyInstructions'

export default function SurveyPage() {
    return (
        <section>
            <SurveyHero />
            <WhoCompleteSurvey />
            {/* <ParticipateDetails /> */}
            <SurveyInstructions />
            <Assistance />
        </section>
    )
}
