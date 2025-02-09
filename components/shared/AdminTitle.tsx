import React from 'react'

export default function AdminTitle({title}:{title: string}) {
  return (
      <div>
          <h3 className='text-navy-blue text-xl md:text-2xl font-medium'>{title}</h3>
    </div>
  )
}
