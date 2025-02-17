import React from 'react'
import Navigation from './Navigation'
import PrimaryButton from './PrimaryButton'
import MobileNavigation from './MobileNavigation'
import Avatar from './Avatar'

interface HeaderProps {
    variant?: 'admin' | 'user' | 'default';
}

export default function Header({ variant = 'default' }: HeaderProps) {
    return (
        <header className={`relative flex-shrink-0 bg-white ${variant === 'default' ? 'shadow-2xl' : 'shadow-md'} p-4 flex justify-between items-center`}>
            <h1 className='text-navy-blue text-xl font-black'>
                NCD NAVIGATOR
            </h1>
            <nav className='hidden lg:flex items-center gap-10'>
                {variant === 'default' && (
                    <>
                        <Navigation />
                        <PrimaryButton href='#assistance' bgColor='bg-navy-blue' text='Contact us' textColor='text-white' />
                    </>
                )}
                {(variant === 'admin' || variant === 'user') && <Avatar variant={variant} />}
            </nav>
            <MobileNavigation />
        </header>
    )
}
