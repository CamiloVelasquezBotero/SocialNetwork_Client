import { UserInfo } from '@/src/types'
import React from 'react'
import { ChatBubbleLeftRightIcon, UserMinusIcon } from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

type UserInfoProps = {
  friend: UserInfo
}

export default function FriendInfo({friend}:UserInfoProps) {
  const router = useRouter()
  const removeFriend = useStore((state) => state.removeFriend)
  const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)

  const handleSetChatFriend = () => {
    setCurrentIdFriendChat(friend.id)
    router.push('/dashboard')
  }

  const handleDeleteFriend = () => {
    // Confirmacion Sweetalert2
    Swal.fire({
      title: `¿Estas seguro de eliminar a ${friend.name}?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#117D00',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if(result.isConfirmed) {
        removeFriend(friend.id)
      }
    })
  }

  return (
    <li className='flex justify-between items-center shadow-md hover:shadow-lg transition-all p-3 bg-slate-50 border border-slate-200/80 rounded-2xl w-full h-fit'>
      <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
        <img src="/pruebaUser.jpg" alt="friendPhoto" className='w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-slate-300 flex-shrink-0'/>
        <div className='min-w-0'>
          <p className='font-black text-sm sm:text-base truncate'>{friend.name}</p>
          <p className='text-slate-600 font-bold text-xs sm:text-sm truncate'>{friend.email}</p>
        </div>
      </div>
      <div className='flex gap-2 sm:gap-5 flex-shrink-0 items-center'>
        <button 
          className='shadow-2xl'
          onClick={handleSetChatFriend}
        ><ChatBubbleLeftRightIcon className='w-7 h-7 sm:w-8 sm:h-8 text-white bg-blue-500 rounded-xl p-1 hover:bg-blue-600 transition cursor-pointer hover:scale-105' /></button>
        <button 
          className='shadow-2xl' 
          onClick={handleDeleteFriend}
        >
          <UserMinusIcon className='w-7 h-7 sm:w-8 sm:h-8 text-white bg-red-800 rounded-xl p-1 hover:bg-red-600 transition cursor-pointer hover:scale-105' />
        </button>
      </div>
    </li>
  )
}
