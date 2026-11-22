import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { BellAlertIcon, BellIcon } from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import { useEffect, useState } from 'react'
import RequestsNotification from '../users/RequestsNotification'

export default function PopOverNotification() {
   const [existsNotifications, setExistsNotifications] = useState(false)
   const requestsReceived = useStore((state) => state.userData.requestsReceived)

   useEffect(() => {
      setExistsNotifications(requestsReceived.length > 0)
   }, [requestsReceived])

   return (
      <div className="">
         <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-m px-3 py-2 text-sm/6 font-semibold text-white shadow-lg rounded-2xl border-slate-700 shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700 cursor-pointer transition-all">
               {existsNotifications ? (
                  <BellAlertIcon className='text-lime-300 w-7 cursor-pointer hover:scale-120 transition-all duration-200' />
               ) : (
                  <BellIcon className='text-white w-7 cursor-pointer hover:scale-120 transition-all duration-200' />
               )}
            </MenuButton>

            <MenuItems
               transition
               anchor="bottom end"
               className="w-80 sm:w-96 origin-top-right rounded-xl bg-slate-700 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50 shadow-2xl"
            >
               <div className="h-px bg-white/5" />
               <div className="pb-4">
                  {requestsReceived.length ? (
                     <ul>
                        {requestsReceived.map(request => (
                           <RequestsNotification
                              key={request.id}
                              request={request}
                           />
                        ))}
                     </ul>
                  ) : (
                     <p className='text-white text-base py-4 text-center'>You have no notifications at the moment</p>
                  )}
               </div>
            </MenuItems>
         </Menu>
      </div>
   )
}
