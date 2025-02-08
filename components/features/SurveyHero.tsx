import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'
import OutlineButton from '../shared/OutlineButton'
import Image from 'next/image'

export default function SurveyHero() {
    return (
        <section className='max-w-7xl mx-auto w-full p-4'>
            <div className='rounded-2xl bg-navy-blue'>
                <div className='flex text-center flex-col max-w-4xl w-full mx-auto justify-center items-center gap-5 p-10'>
                     <h1 className='text-center text-white text-4xl md:text-5xl xl:text-[4rem] leading-snug font-black tracking-tight'>Your <span className='text-mint-green'>Insights</span> Matter: Share Your Work on NCDs <span className='text-pine-yellow'>Across</span> Ghana.</h1>
                <p className='text-center text-light-blue max-w-md mx-auto'>Your feedback is crucial in driving change. Participate in our survey to help us improve services, meet community needs, and create lasting, positive impacts.</p>
                <div className='flex gap-5 justify-between md:justify-start'>
                    <PrimaryButton
                        href="/survey"
                        text="Take the Survey"
                        bgColor="bg-pine-yellow"
                        textColor="text-gray-100"
                    />
                    <OutlineButton
                        href="#instructions"
                        text="Read Instructions"
                    />
                    </div>
                    <div>
                        <Image src='/survey_target.svg' width={800} height={800} alt='Survey Hero Image' />
                    </div>
               </div>
            </div>
        </section>
    )
}
