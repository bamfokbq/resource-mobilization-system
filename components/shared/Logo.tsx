import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
      <Link className='flex items-center gap-4' href={'/'}>
      <Image src={'/rms.png'} priority alt='Logo' height={120} width={120} className='w-auto' />
    </Link>
  )
}
