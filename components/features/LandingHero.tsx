import React from 'react'
import LandingHeroContent from './LandingHeroContent'
import LandingHeroArt from './LandingHeroArt'

export default function LandingHero() {
    return (
        <section className='min-h-[85dvh] flex items-center justify-center bg-navy-blue'>
            <div className='container mx-auto p-4 md:p-10 flex gap-10 flex-col md:flex-row justify-between items-center'>
                <LandingHeroContent />
                <LandingHeroArt />
            </div>
        </section>
    )
}
