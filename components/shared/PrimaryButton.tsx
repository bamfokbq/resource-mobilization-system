import React from 'react'
import Link from 'next/link'
import { PrimaryButtonProps } from '@/types'

export default function PrimaryButton({
    href,
    text,
    bgColor,
    textColor
}: PrimaryButtonProps) {
    return (
        <div>
            <Link href={href}>
                <button className={`${bgColor} ${textColor} w-full md:w-auto hover:opacity-85 cursor-pointer py-3 px-6 rounded-3xl border-2 border-transparent`}>
                    {text}
                </button>
            </Link>
        </div>
    )
}
