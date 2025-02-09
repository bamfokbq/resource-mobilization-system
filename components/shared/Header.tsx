import Link from 'next/link'
import React from 'react'
import Navigation from './Navigation'
import PrimaryButton from './PrimaryButton'
import MobileNavigation from './MobileNavigation'

interface HeaderProps {
    variant?: 'admin' | 'user' | 'default';
}

export default function Header({ variant = 'default' }: HeaderProps) {
    return (
        <header className={`relative bg-white ${variant === 'default' ? 'shadow-2xl' : 'shadow-md'} p-4 flex justify-between items-center`}>
            <Link href={variant === 'admin' ? '/admin/dashboard' : '/'} className='text-navy-blue text-xl font-black'>
                NCD NAVIGATOR
            </Link>
            <nav className='hidden lg:flex items-center gap-10'>
                {variant === 'default' && (
                    <>
                        <Navigation />
                        <PrimaryButton href='#assistance' bgColor='bg-navy-blue' text='Contact us' textColor='text-white' />
                    </>
                )}
                {(variant === 'admin' || variant === 'user') && (
                    <div className='flex items-center gap-2'>
                        <div className='h-10 text-white w-10 bg-navy-blue rounded-full flex items-center justify-center'>
                            <p>KB</p>
                        </div>
                        <p>{variant === 'admin' ? "ADMIN" : "USER"}</p>
                    </div>
                )}
            </nav>
            <MobileNavigation />
        </header>
    )
}
