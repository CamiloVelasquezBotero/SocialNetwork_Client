'use client'
import React from 'react'
import Link from 'next/link'
import { CursorArrowRaysIcon, ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import FriendInfo from '@/components/contact-list/FriendInfo'
import { useRouter } from 'next/navigation'

export default function ContactList() {
   const friends = useStore((state) => state.userData.friends)
   const router = useRouter()

   return (
      <div className="flex justify-center w-full min-h-[calc(100vh-70px)] p-2 sm:p-5 dark:bg-gray-900">
         <div className="bg-white dark:bg-gray-800 w-full max-w-5xl h-fit min-h-[85vh] shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
               <button
                  className="flex items-center gap-1.5 shadow-md p-2 px-4 transition-all bg-cyan-900 hover:bg-cyan-800 text-white font-bold rounded-xl cursor-pointer text-sm"
                  onClick={() => router.push('/dashboard')}
               >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
               </button>
               <p className="font-black text-2xl sm:text-3xl text-center sm:text-left dark:text-white sm:mx-auto text-shadow-lg">
                  My <span className="text-indigo-700 dark:text-indigo-400">Contacts</span>
                  <span className="ml-2 text-base font-semibold text-slate-400">({friends?.length || 0})</span>
               </p>
            </div>

            {/* Contacts list */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
               {friends && friends.length ? (
                  friends.map(friend => (
                     <FriendInfo
                        key={friend.id}
                        friend={friend}
                     />
                  ))
               ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                     <UserGroupIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                     <p className="font-bold text-xl text-slate-500 dark:text-slate-400 text-center">
                        No contacts added yet
                     </p>
                     <Link href='/add-contact' className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400 hover:underline text-lg">
                        Search and add contacts <CursorArrowRaysIcon className="w-6 h-6" />
                     </Link>
                  </div>
               )}
            </ul>
         </div>
      </div>
   )
}
