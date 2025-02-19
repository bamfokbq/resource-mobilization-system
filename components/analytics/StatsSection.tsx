import { ADMIN_STATS } from '@/constant'

export default function StatsSection() {
  return (
    <div className='h-fit w-full flex flex-col lg:flex-row gap-8'>
      <div className='h-fit flex-1 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {ADMIN_STATS.map((stat) => (
          <div className='bg-white flex flex-col justify-between gap-4 rounded-lg px-4 py-6' key={stat.id}>
            <div className="flex items-center gap-2">
              <stat.icon className="w-5 h-5 text-navy-blue" />
              <p className='text-gray-800 font-light'>{stat.name}</p>
            </div>
            <h1 className='text-4xl text-navy-blue'>{stat.amount}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}
