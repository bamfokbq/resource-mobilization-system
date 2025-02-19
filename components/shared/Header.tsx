import { auth } from '@/auth';
import React from 'react'
import Navigation from './Navigation'
import PrimaryButton from './PrimaryButton'
import MobileNavigation from './MobileNavigation'
import Avatar from './Avatar'

export default async function Header() {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    return (
        <header className={`relative flex-shrink-0 bg-white shadow-md p-4 flex justify-between items-center`}>
            <h1 className='text-navy-blue text-xl font-black'>
                NCD NAVIGATOR
            </h1>
            <nav className='hidden lg:flex items-center gap-10'>
                {!isAuthenticated ? (
                    <>
                        <Navigation />
                        <PrimaryButton href='#assistance' bgColor='bg-navy-blue' text='Contact us' textColor='text-white' />
                    </>
                ) : (
                    <Avatar />
                )}
            </nav>
            <MobileNavigation />
        </header>
    )
}
