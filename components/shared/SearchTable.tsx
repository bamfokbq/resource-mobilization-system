'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SearchTable() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams)

        if (searchQuery.trim()) {
            params.set('searchQuery', searchQuery.trim())
        } else {
            params.delete('searchQuery')
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleClear = () => {
        setSearchQuery('')

        const params = new URLSearchParams(searchParams)
        params.delete('searchQuery')
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
        }
    }

    return (
        <form onSubmit={handleSubmit} className='bg-white rounded-md p-2 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
            <div className='border flex-1 font-light border-gray-200 rounded-md h-10 sm:h-full flex items-center gap-2 p-2'>
                <Search className='text-gray-500 text-lg min-w-[20px]' />
                <input
                    className='outline-none border-none w-full text-sm sm:text-base'
                    type="text"
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className='text-gray-500 hover:text-gray-700'
                        aria-label="Clear search"
                    >
                        <X className='h-4 sm:h-5 w-4 sm:w-5' />
                    </button>
                )}
            </div>
            <Button
                type="submit"
                className='bg-green-600 font-light px-4 sm:px-6 h-10 text-white cursor-pointer hover:bg-green-500 w-full sm:w-auto'
            >
                Search
            </Button>
        </form>
    )
}