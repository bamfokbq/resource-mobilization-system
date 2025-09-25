import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'
import OutlineButton from '../shared/OutlineButton'
import Image from 'next/image'

export default function ResourceMobilizationHero() {
    return (
        <section className='max-w-7xl mx-auto w-full p-2 md:p-4'>
            <div className='rounded-2xl bg-ghs-green'>
                <div className='flex text-center flex-col max-w-4xl w-full mx-auto justify-center items-center gap-5 p-4 md:p-10'>
                    <h1 className='text-center text-white text-4xl md:text-5xl xl:text-[3.8rem] leading-snug font-black tracking-tight'>
                        Mobilise <span className='text-mint-green'>Resources</span> for Change: Build Stronger <span className='text-pine-yellow'>Communities</span> Across Ghana.
                    </h1>
                    <p className='text-center text-light-blue max-w-md mx-auto'>
                        Connect donors with impactful projects. Join our platform to mobilize resources, support community initiatives, and create sustainable development across Ghana.
                    </p>
                    <div className='flex gap-5 justify-between md:justify-start'>
                        <PrimaryButton
                            href="/auth/signin"
                            text="Start Mapping"
                            bgColor="bg-pine-yellow"
                            textColor="text-navy-blue"
                        />
                        <OutlineButton
                            href="#instructions"
                            text="How It Works"
                        />
                    </div>
                    <div>
                        <Image src='/survey_target.svg' width={800} height={800} alt='Resource Mobilization Hero Image' />
                    </div>
                </div>
            </div>
        </section>
    )
}