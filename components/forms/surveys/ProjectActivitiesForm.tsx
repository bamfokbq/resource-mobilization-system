import React from 'react'

interface ProjectActivitiesFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  return (
    <div>
      <div>ProjectActivitiesForm</div>
      <div className='flex justify-between mt-4'>
        <button onClick={handlePrevious} className='bg-blue-500 text-white px-4 py-2 rounded'>Previous</button>
        <button onClick={handleNext} className='bg-blue-500 text-white px-4 py-2 rounded'>Next</button>
      </div>
    </div>
  )
}
