import React from 'react'
import Link from 'next/link'
import { PrimaryButtonProps } from '@/types/index'

export default function OutlineButton({
    href,
    text,
}: PrimaryButtonProps) {
    return (
        <div>
            <Link href={href}>
                <button className="text-white w-full md:w-auto border-2 border-white hover:opacity-85 cursor-pointer py-3 px-8 rounded-4xl">
                    {text}
                </button>
            </Link>
        </div>
    )
}
