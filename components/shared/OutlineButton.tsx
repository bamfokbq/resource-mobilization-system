import React from 'react'
import Link from 'next/link'
import { PrimaryButtonProps } from '@/types'

export default function OutlineButton({
    href,
    text,
}: PrimaryButtonProps) {
    return (
        <div>
            <Link href={href}>
                <button className="text-white border-2 border-white hover:opacity-85 cursor-pointer py-3 px-6 rounded-3xl">
                    {text}
                </button>
            </Link>
        </div>
    )
}
