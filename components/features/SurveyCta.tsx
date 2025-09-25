import React from 'react'
import PrimaryButton from '../shared/PrimaryButton'

export default function SurveyCta() {
  return (
    <section className='h-fit max-w-4xl mx-auto w-full py-4 md:py-10 rounded-3xl bg-gradient-to-r from-smit-green to-mode-blue'>
      <div className='h-full w-full flex flex-col items-center justify-center gap-5 md:gap-10'>
        <div className='text-center text-white max-w-2xl mx-auto w-full'>
          <h2 className='text-xl md:text-3xl font-bold'>Help transform healthcare delivery in Ghana through your expert insights and feedback.</h2>
        </div>
        <PrimaryButton bgColor='bg-pine-yellow' textColor='text-white' text='Share Your Voice' href='/auth/signin' />
      </div>
    </section>
  )
}