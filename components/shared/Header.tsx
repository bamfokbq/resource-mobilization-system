import Link from 'next/link'
import React from 'react'
import { NAVIGATION } from '@/constant'
import Navigation from './Navigation'

export default function Header() {
    return (
        <header className='bg-white shadow-2xl p-4 flex justify-between items-center'>
            <Link href="/" className='text-navy-blue text-xl font-black'>
                NCD NAVIGATOR
            </Link>
            <nav className='flex items-center gap-10'>
                <Navigation />
                <Link href="/contact-us">Contact Us</Link>
            </nav>
        </header>
    )
}
