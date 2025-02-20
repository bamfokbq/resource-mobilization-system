'use client'

import NcdStrategyNav from '@/components/features/NcdStrategyNav'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function ExploreSurveyNavigation() {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className={`
            bg-navy-blue h-screen flex flex-col items-stretch justify-between p-4
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-[300px]' : 'w-[80px]'}
        `}>
            <div className="flex items-center justify-between mb-4">
                {isOpen && (
                    <Link href={'/'} className='text-white text-xl font-black'>
                        NCD NAVIGATOR
                    </Link>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-mint-green p-2"
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {isOpen ? (
                <ScrollArea className="flex-1">
                    <NcdStrategyNav isOpen={isOpen} />
                </ScrollArea>
            ) : (
                <div className="flex-1">
                    <NcdStrategyNav isOpen={isOpen} />
                </div>
            )}
        </div>
    )
}