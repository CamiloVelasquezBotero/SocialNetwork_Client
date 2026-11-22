import { UserInfo } from '@/src/types'
import React from 'react'
import { ChatBubbleLeftRightIcon, UserMinusIcon } from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

type UserInfoProps = {
  friend: UserInfo
}

export default function FriendInfo({ friend }: UserInfoProps) {
  const router = useRouter()
  const removeFriend = useStore((state) => state.removeFriend)
  const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)

  const profileImage = friend.profileImage || '/profile.jpg'

  const handleSetChatFriend = () => {
    setCurrentIdFriendChat(friend.id)
    router.push('/dashboard')
  }

  const handleDeleteFriend = () => {
    // Confirmacion Sweetalert2
    Swal.fire({
      title: `Are you sure you want to remove ${friend.name}?`,
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#117D00',
      confirmButtonText: 'Yes, Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFriend(friend.id)
      }
    })
  }

  return (
    <li className='flex justify-between items-center shadow-md hover:shadow-lg transition-all p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200/80 dark:border-gray-600 rounded-2xl w-full h-fit'>
      <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
        <img
          src={profileImage}
          alt="Friend photo"
          className='w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-gray-500 flex-shrink-0'
        />
        <div className='min-w-0'>
          <p className='font-black text-sm sm:text-base truncate dark:text-white'>{friend.name}</p>
          <p className='text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm truncate'>{friend.email}</p>
        </div>
      </div>
      <div className='flex gap-2 sm:gap-3 flex-shrink-0 items-center'>
        <button
          className='shadow-md'
          onClick={handleSetChatFriend}
          title="Open chat"
        >
          <ChatBubbleLeftRightIcon className='w-8 h-8 text-white bg-blue-500 rounded-xl p-1.5 hover:bg-blue-600 transition cursor-pointer hover:scale-105' />
        </button>
        <button
          className='shadow-md'
          onClick={handleDeleteFriend}
          title="Remove contact"
        >
          <UserMinusIcon className='w-8 h-8 text-white bg-red-700 rounded-xl p-1.5 hover:bg-red-600 transition cursor-pointer hover:scale-105' />
        </button>
      </div>
    </li>
  )
}
