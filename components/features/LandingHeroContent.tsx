import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'
import OutlineButton from '../shared/OutlineButton'

export default function LandingHeroContent() {
    return (
        <section className='md:w-[60%] flex flex-col gap-5'>
            <div className='text-white flex flex-col gap-3'>
                <h1 className='text-center md:text-left text-3xl md:text-4xl lg:text-5xl xl:text-[4rem] leading-snug font-black tracking-tight'>
                    <span className='text-pine-yellow'>Quality</span> Data for{' '}
                    <span className='text-mint-green'>Strategic</span>{' '}
                    <span className='whitespace-nowrap'>NCD <span className='text-nobe-red-lighter'>Action</span></span>{' '}
                    in Ghana
                </h1>
                <p className='text-center md:text-left text-light-blue'>Explore comprehensive insights into NCD service distribution, align strategies, and contribute to equitable healthcare solutions.</p>
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
