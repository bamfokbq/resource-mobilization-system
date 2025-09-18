import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import { RESOURCES_LINK } from '@/constant'
import Image from 'next/image'

export default function Contributions() {
    return (
        <section className='bg-ghs-green/10 min-h-[70dvh] py-10 px-5 md:py-20 md:px-10 flex flex-col gap-12'>
            <SectionTitle text='How You Can Contribute' color='text-ghs-green' />
            <div className='max-w-3xl gap-10 w-full mx-auto flex flex-col md:flex-row justify-between items-center'>
                <div className='relative h-[380px] w-[300px] md:w-[600px]'>
                    <div className='h-full w-full bg-ghs-green rounded-[1.5rem_0.5rem_1.5rem_0.5rem]'>
                    </div>
                    <div className='h-full w-full flex items-center justify-center bg-white absolute -top-4 -right-4 rounded-[1.5rem_0.5rem_1.5rem_0.5rem]'>
                        <Image src='/contribute-icon.svg' alt='Contribute' height={200} width={200} />
                    </div>
                </div>
                <div className='w-full flex flex-col gap-6 justify-between'>
                    {RESOURCES_LINK.map((link) => <div key={link.id} className='bg-white shadow-xl h-full flex items-center rounded-xl px-4 py-6'>
                        <div>
                            <h3>{link.title}</h3>
                            <p>{link.description}</p>
                        </div>
                    </div>)}
                </div>
            </div>
        </section>
    )
}
