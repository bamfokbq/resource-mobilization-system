import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'
import OutlineButton from '../shared/OutlineButton'

export default function LandingHeroContent() {
    return (
        <section className='md:w-[60%] flex flex-col gap-5'>
            <div className='text-white flex flex-col gap-3'>
                <h1 className='text-center md:text-left text-4xl md:text-5xl xl:text-[3.5rem] leading-snug font-black tracking-tight'>
                    Quality Data for Effective and Efficient Resource Mobilisation in the Ghana Health Service.
                    {/* <span className='text-pine-yellow'>Quality</span> Data for{' '}
                    <span className='text-mint-green'>Effective</span> {' '} and Efficient
                    <span className='whitespace-nowrap'>Resource <span className='text-nobe-red-lighter'>Mobilization</span></span>{' '}
                    in Ghana Health Service */}
                </h1>
                <p className='text-center md:text-left text-green-200'>Gain comprehensive insights into all activities and streamline resource distribution. Our system empowers you to track every action, ensuring resources are deployed effectively to the regions and communities that need them most.</p>
            </div>
            <div className='flex gap-5 justify-between md:justify-start'>
                <PrimaryButton
                    href="/auth/signin"
                    text="Take the Mapping"
                    bgColor="bg-pine-yellow"
                    textColor="text-ghs-green"
                />
                <OutlineButton
                    href="/survey-data"
                    text="Explore Data"
                />
            </div>
        </section>
    )
}
