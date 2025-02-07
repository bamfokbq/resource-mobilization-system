import React from 'react'

interface SectionTitleProps {
    text: string,
    color: string
}

export default function SectionTitle({ text, color }: SectionTitleProps) {
    return (
        <div className='mx-auto w-fit'>
            <h3 className={`text-xl font-medium ${color}`}>{text}</h3>
        </div>
    )
}
