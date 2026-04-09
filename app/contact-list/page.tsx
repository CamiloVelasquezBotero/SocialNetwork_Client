'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { CursorArrowRaysIcon } from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import FriendInfo from '@/components/contact-list/FriendInfo'
import { useRouter } from 'next/navigation'

export default function contactList() {
  const friends = useStore((state) => state.userData.friends)

  const router = useRouter()

  return (
    <div className='flex justify-center w-full h-screen p-2 sm:p-5'>
      <div className='bg-white w-full max-w-7xl h-[85%] shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-10 pt-3 sm:pt-5'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 mb-5'>
          <button 
            className="sm:ml-[5%] shadow-2xl p-2 transition-all bg-cyan-900 hover:bg-cyan-800 hover:scale-101 text-white font-bold text-base sm:text-xl rounded-xl cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            Regresar
          </button>
          <p className="font-black text-xl sm:text-2xl text-center sm:text-left hover:text-slate-700 transition-all text-shadow-lg sm:ml-auto sm:mr-auto text-shadow-2xl">
            Tu lista de <span className="text-indigo-800 hover:text-indigo-700">Contactos</span>
          </p>
        </div>
        <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 px-2 sm:px-6 lg:px-30 overflow-y-auto h-[90%] p-2'>
          {friends && friends.length ? (
            friends.map(friend => (
              <FriendInfo 
                key={friend.id}
                friend={friend}
              />
            ))
          ) : (
            <p className="flex flex-wrap font-bold text-lg sm:text-2xl text-slate-600 gap-2 col-span-full">
              Aun no tienes friends agregados,
              <Link href={'/add-contact'} className='flex font-bold text-lime-500 gap-2 hover:text-shadow-md'>
                empieza a agregarlos <CursorArrowRaysIcon className='w-8 h-8 sm:w-10 sm:h-10' />
              </Link>
              
            </p>
          )}
        </ul>
      </div>
    </div>
  )
}
