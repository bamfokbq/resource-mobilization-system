import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import Image from 'next/image'

const Instructions = [
    {
        id: 1,
        content:'Ensure an active internet connection to access the online survey form.'
    },
    {
        id: 2,
        content:"Once the form is open, you may disconnect your internet and proceed to enter all data offline."
    },
    {
        id: 3,
        content:"The information you provide will be saved in your browser and automatically submitted to the server when an internet connection is restored."
    }
]

export default function SurveyInstructions() {
    return (
        <section className='bg-mint-green/30 min-h-[80vh] py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12'>
            <div className='max-w-4xl mx-auto w-full flex gap-10 md:gap-20'>
                <div className='w-1/2 flex flex-col gap-6'>
                    <SectionTitle text='How to Complete the Survey' color='text-navy-blue' />
                    <div>
                        {/* Displaying instructions as card */}
                        {Instructions.map(instruction => (
                            <div key={instruction.id} className="bg-white rounded-lg shadow p-4 mb-4 flex items-start">
                                <div className="w-10 h-10 aspect-square border-2 border-navy-blue rounded-full flex items-center justify-center mr-3 text-2xl font-bold text-navy-blue">
                                    {instruction.id}
                                </div>
                                <p className="text-base text-gray-700">
                                    {instruction.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='relative h-[480px] w-[200px] md:w-[600px]'>
                    <div className='h-full w-full bg-smit-green rounded-[1.5rem_0.5rem_1.5rem_0.5rem]'>
                    </div>
                    <div className='h-full w-full flex items-center justify-center bg-white absolute -bottom-4 -right-4 rounded-[1.5rem_0.5rem_1.5rem_0.5rem]'>
                        <Image src='/complete_chart.svg' alt='Contribute' height={200} width={200} />
                    </div>
                </div>

            </div>
        </section>
    )
}
