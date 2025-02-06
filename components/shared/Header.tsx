import Link from 'next/link'
import React from 'react'
import { NAVIGATION } from '@/constant'
import Navigation from './Navigation'

export default function Header() {
    return (
        <header className='bg-white shadow-2xl p-4 flex justify-between items-center'>
            <h1>NCD NAVIGATOR</h1>
            <nav className='flex items-center gap-10'>
                <Navigation />
                <Link href="/contact-us">Contact Us</Link>
            </nav>
        </header>
    )
}
