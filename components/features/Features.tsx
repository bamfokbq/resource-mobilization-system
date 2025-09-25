import { FEATURES } from '@/constant'
import React from 'react'
import SectionTitle from '../shared/SectionTitle'

export default function Features() {
    return (
        <section id='features' className='min-h-[70dvh] py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12 bg-mint-green/20'>
            <SectionTitle color='text-ghs-green' text='What the Resource Mobilisation System Offers' />
            <div className='max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
                {FEATURES.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <div
                            className='bg-white shadow-xl rounded-2xl p-10 flex flex-col gap-3 items-center hover:scale-105 transition-transform ease-in-out'
                            key={feature.id}>
                            <IconComponent size={80} className="text-ghs-green" />
                            <h2 className='text-dark-gray font-medium text-center text-xl'>{feature.title}</h2>
                            <p className='text-center text-gray-500'>{feature.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
