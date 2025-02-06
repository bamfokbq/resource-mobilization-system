import Image from 'next/image'
import React from 'react'

export default function LandingHeroArt() {
    return (
        <section className='md:w-[40%] h-auto p-[1.5rem_1rem_0.5rem_1rem] bg-white  rounded-xl flex items-center justify-center'>
            <Image src='/analysis.svg' alt='Landing Hero Art' width={700} height={400} />
        </section>
    )
}