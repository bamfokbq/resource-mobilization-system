"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '@/constant'
import { Route } from 'next';

export default function Navigation() {
    const pathname = usePathname();
    return (
        <ul className='flex gap-4'>
            {NAVIGATION.map((nav, index) => <Link className={`text-dark-gray ${pathname === nav.href && "text-blue-navy"}`} key={index} href={nav.href as Route}>{nav.name}</Link>)}
        </ul>
    )
}
