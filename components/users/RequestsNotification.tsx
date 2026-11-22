import { useStore } from '@/src/store'
import { BellIcon, MinusCircleIcon, UserPlusIcon } from '@heroicons/react/16/solid'
import React from 'react'

type RequestsNotificationProps = {
  request: {
    id: number,
    name: string,
    email: string,
  }
}

export default function RequestsNotification({ request }: RequestsNotificationProps) {
  const acceptRequest = useStore((state) => state.acceptRequest)
  
  const handleRequest = (condition: string) => {
    acceptRequest({ idSender: request.id, action: condition })
  }

  return (
    <li className='shadow-2xl p-2'>
        <div className='mb-2 rounded-xl flex items-center gap-2 p-2 hover:bg-slate-600 transition last:border-t last:border-gray-400'>
          <BellIcon className='w-5 text-lime-400 flex-shrink-0' />
          <div className="min-w-0">
            <p className='font-black text-white text-sm truncate'>{request.name} sent you a friend request</p>
            <p className='text-slate-400 text-xs text-start truncate'>{request.email}</p>
          </div>
        </div>
        <div className='flex gap-3'>
          <button 
            className='shadow-xl p-1.5 px-3 ml-2 bg-sky-700 hover:bg-sky-800 flex gap-1.5 items-center cursor-pointer rounded-md text-white font-bold text-xs'
            onClick={() => handleRequest('accept')}
          >
             Accept <UserPlusIcon className='w-4 h-4'/>
          </button>
          <button 
            className='shadow-xl p-1.5 px-3 bg-red-700 hover:bg-red-800 flex gap-1.5 items-center cursor-pointer rounded-md text-white font-bold text-xs'
            onClick={() => handleRequest('decline')}
          >
             Decline <MinusCircleIcon className='w-4 h-4'/>
          </button>
        </div>
    </li>
  )
}
