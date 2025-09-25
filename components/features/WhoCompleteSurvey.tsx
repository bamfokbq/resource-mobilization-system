import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import PrimaryButton from '../shared/PrimaryButton'
import Image from 'next/image'

export default function WhoCompleteSurvey() {
  return (
    <section className='bg-pine-yellow/30 py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12'>
      <SectionTitle text='Who Can Complete the Survey?' color='text-navy-blue' />
      <div className='flex flex-col max-w-4xl mx-auto w-full md:flex-row justify-between items-center gap-10'>
        <div className='flex flex-col gap-4 h-auto md:h-[400px] justify-around flex-1'>
          <h3 className='text-lg md:text-2xl text-dark-gray font-medium'>This survey is designed for individuals directly involved in managing or implementing resource mobilization activities within their organisations. If your organisation works to secure funding, partnerships, or other resources for development projects, your input is essential for this coordinated effort.</h3>
          <PrimaryButton href='/explore-data' text='Explore Data' bgColor='bg-pine-yellow' textColor='text-white' />
        </div>
        <div className='relative h-auto md:h-[400px] flex-1'>
          <div className='h-full w-full bg-pine-yellow rounded-2xl'>
          </div>
          <div className='h-full w-full flex items-center justify-center bg-white absolute -top-4 -right-4 rounded-2xl'>
            <Image src='/who_to_complete.svg' alt='Contribute' height={200} width={200} />
          </div>
        </div>
      </div>
    </section>
  )
}
