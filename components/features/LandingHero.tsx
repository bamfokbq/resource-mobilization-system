import React from 'react'
import LandingHeroContent from './LandingHeroContent'
import LandingHeroArt from './LandingHeroArt'

export default function LandingHero() {
    return (
        <section className='min-h-[85dvh] flex justify-center'>
            <div className='flex flex-col md:flex-row w-full'>
                <LandingHeroContent />
                <LandingHeroArt />
            </div>
        </section>
    )
}
