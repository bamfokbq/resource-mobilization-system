'use client'

import NcdStrategyNav from '@/components/features/NcdStrategyNav'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi2'

export default function ExploreSurveyNavigation() {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className={`
            bg-navy-blue h-screen flex flex-col items-stretch justify-between p-4
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-[300px]' : 'w-[80px]'}
        `}>
            <div className={`
                flex items-center mb-6
                ${isOpen ? 'justify-between' : 'justify-center'}
            `}>
                {isOpen && (
                    <Link
                        href={'/'}
                        className='text-white text-xl font-black flex-shrink-0 hover:text-mint-green transition-colors'
                    >
                        NCD NAVIGATOR
                    </Link>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-mint-green p-1.5 rounded-md transition-all duration-300"
                    aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
                >
                    <HiChevronLeft
                        size={24}
                        className={`transform transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''
                            }`}
                    />
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