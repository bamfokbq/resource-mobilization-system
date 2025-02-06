import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'
import OutlineButton from '../shared/OutlineButton'

export default function LandingHeroContent() {
    return (
        <section className='md:w-[60%] flex flex-col gap-5'>
            <div className='text-white flex flex-col gap-3'>
                <h1 className='text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[3.5rem] leading-tight md:leading-snug font-black tracking-tight'>
                    <span className='text-pine-yellow'>Quality</span> Data for{' '}
                    <span className='text-mint-green'>Strategic</span>{' '}
                    <span className='whitespace-nowrap'>NCD <span className='text-nobe-red-lighter'>Action</span></span>{' '}
                    in Ghana
                </h1>
                <p>Explore comprehensive insights into NCD service distribution, align strategies, and contribute to equitable healthcare solutions.</p>
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
                <PrimaryButton
                    href="/survey"
                    text="Take the Survey"
                    bgColor="bg-pine-yellow"
                    textColor="text-gray-100"
                />
                <OutlineButton
                    href="/explore-data"
                    text="Explore Data"
                />
            </div>
        </section>
    )
}
