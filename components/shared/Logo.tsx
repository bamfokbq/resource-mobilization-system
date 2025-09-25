import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
      <Link className='flex items-center gap-4' href={'/'}>
      <Image src={'/ghs-official.png'} priority alt='Logo' height={50} width={50} className='w-auto' />
      <h2 className='text-gray-700 font-bold text-xl md:text-2xl flex flex-col'><span>Ghana Health Service</span>
        <span>Resource Mobilisation System</span>
      </h2>
    </Link>
  )
}
