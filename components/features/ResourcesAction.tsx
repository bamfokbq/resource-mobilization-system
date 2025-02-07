import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import { RESOURCES_ACTION } from '@/constant'
import { FaDownload } from "react-icons/fa6";


export default function ResourcesAction() {
    return (
        <section id="resources" className='min-h-[50dvh] border border-navy-blue py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12'>
            <SectionTitle text='Resources for Action' color='text-navy-blue' />
            <div className='max-w-lg w-full flex flex-col gap-6 mx-auto'>
                {RESOURCES_ACTION.map((action) => <div key={action.id} className='bg-navy-blue shadow-lg h-full flex items-center rounded-xl px-4 py-3 justify-between'>
                    <p className='text-white text-lg font-medium'>{action.title}</p>
                    <div className='h-12 w-12 flex items-center justify-center rounded-full bg-mint-green'>
                        <FaDownload className='text-navy-blue text-2xl' />
                    </div>
                </div>)}
            </div>
        </section>
    )
}
