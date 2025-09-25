import Image from 'next/image'
import React from 'react'

export default function LandingHeroArt() {
    return (
        <section
            style={{
                backgroundImage: `
                    linear-gradient(135deg, rgba(255, 182, 193, 0.2) 0%, rgba(255, 255, 224, 0.2) 100%),
                    url('/ghs-mapping.png')
                `,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}
            className='md:w-[40%] h-auto p-[1.5rem_1rem_0.5rem_1rem] bg-white flex items-center justify-center'>
            {/* <Image src='/analysis.svg' alt='Landing Hero Art' width={700} height={400} /> */}
        </section>
    )
}