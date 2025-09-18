import { FEATURES } from '@/constant'
import Image from 'next/image'
import React from 'react'
import SectionTitle from '../shared/SectionTitle'

export default function Features() {
    return (
        <section id='features' className='min-h-[70dvh] py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12 bg-mint-green/20'>
            <SectionTitle color='text-ghs-green' text='What the Resource Mobilization System Offers' />
            <div className='max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10'>
                {FEATURES.map((feature) => (
                    <div
                        className='bg-white shadow-xl rounded-2xl p-10 flex flex-col gap-3 items-center hover:scale-105 transition-transform ease-in-out'
                        key={feature.id}>
                        <Image src={feature.icon} alt={feature.title} height={80} width={80} />
                        <h2 className='text-dark-gray font-medium text-xl'>{feature.title}</h2>
                        <p className='text-center text-gray-500'>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
