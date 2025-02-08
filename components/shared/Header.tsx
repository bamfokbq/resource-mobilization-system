import Link from 'next/link'
import React from 'react'
import Navigation from './Navigation'
import PrimaryButton from './PrimaryButton'
import MobileNavigation from './MobileNavigation'

export default function Header() {
    return (
        <header className='relative bg-white shadow-2xl p-4 flex justify-between items-center'>
            <Link href="/" className='text-navy-blue text-xl font-black'>
                NCD NAVIGATOR
            </Link>
            <nav className='hidden lg:flex items-center gap-10'>
                <Navigation />
                <PrimaryButton href='/contact' bgColor='bg-navy-blue' text='Contact us' textColor='text-white' />
            </nav>
            <MobileNavigation />
        </header>
    )
}
