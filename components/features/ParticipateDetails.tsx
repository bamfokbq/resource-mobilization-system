import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import Image from 'next/image'

export default function ParticipateDetails() {
    return (
        <section className='min-h-[60vh] py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12'>
            <SectionTitle color='text-navy-blue' text='How to Complete the Survey' />
            <div className='bg-ligher-gray max-w-4xl flex flex-col md:flex-row gap-4 md:gap-10 items-center justify-between  mx-auto w-full rounded-2xl shadow-xl min-h-[400px] py-10 px-6'>
                <div className='relative size-[200px] md:size-[300px]'>
                    <div className='h-full w-full bg-navy-blue rounded-full'>
                    </div>
                    <div className='h-full w-full flex items-center justify-center bg-white absolute -top-2 -right-2 md:-top-4 md:-right-4 rounded-full'>
                        <Image src='/chart.svg' alt='Contribute' className='w-[100px] h-[100px] md:w-[200px] md:h-[200px]' width={100} height={100} />
                    </div>
                </div>
                <div className='md:w-1/2 flex flex-col gap-4'>
                    <h3 className='text-lg md:text-2xl text-dark-gray font-medium'><span className='text-navy-blue'>Voluntary:</span> Your participation in this survey is entirely voluntary. It will not impact you, your organisation, or your work in any way.</h3>
                    <h3 className='text-lg md:text-2xl text-dark-gray font-medium'><span className='text-navy-blue'>Confidentiality:</span> All responses will be treated with confidentiality and used solely to enhance NCD program coordination and impact.</h3>
                </div>
            </div>
        </section>
    )
}
