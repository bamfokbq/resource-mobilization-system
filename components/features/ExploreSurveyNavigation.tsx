'use client'

import NcdStrategyNav from '@/components/features/NcdStrategyNav'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ExploreSurveyNavigation() {
    const pathname = usePathname()

    const linkClass = (path: string) => `
    flex items-center gap-2 text-lg
    ${(pathname === path || (path === '/dashboard/surveys' && pathname.startsWith('/dashboard/surveys/form')))
            ? 'text-mint-green'
            : 'text-light-blue'
        } 
    hover:text-mint-green/70 transition-colors duration-200
  `
    return (
        <div className='bg-navy-blue flex-shrink-0 w-[300px] h-screen flex flex-col items-stretch justify-between p-4'>
            <Link href={'/'}  className='text-white mb-4 text-center text-xl font-black'>
                NCD NAVIGATOR
            </Link>
            <ScrollArea className="flex-1">
                <NcdStrategyNav />
            </ScrollArea>
        </div>
    )
}