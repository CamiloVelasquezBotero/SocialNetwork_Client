'use client'
import { UserPlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/16/solid'
import { UserInfo } from "@/src/types"
import { useStore } from '@/src/store'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

type UserProps = {
  user: UserInfo
}

export default function User({ user }: UserProps) {
  const sendFriendRequest = useStore((state) => state.sendFriendRequest)
  const userData = useStore((state) => state.userData)
  const friendsUser = useStore((state) => state.userData.friends)
  const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)

  // Check if already friends
  const alreadyFriends = useMemo(() => friendsUser.some(friend => friend.id === user.id), [friendsUser])
  const router = useRouter()

  const profileImage = user.profileImage || '/profile.jpg'

  const handleSubmit = () => {
    if (!alreadyFriends) {
      sendFriendRequest(user.id)
    }
    // Already friend, then we send to the chat panel
    setCurrentIdFriendChat(user.id)
    router.push('/dashboard')
  }

  return (
    <li className="flex flex-wrap sm:flex-nowrap justify-between p-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 rounded-xl items-center w-full gap-3 border border-slate-200 dark:border-gray-600 transition-all">
      <img
        src={profileImage}
        alt="User photo"
        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-gray-500 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm sm:text-base truncate dark:text-white">{user.name}</p>
        <p className="font-medium text-slate-500 dark:text-slate-400 text-xs sm:text-sm truncate">{user.email}</p>
      </div>
      {user.id !== userData.id ? (
        <button
          type='button'
          className='cursor-pointer flex-shrink-0'
          onClick={handleSubmit}
          title={alreadyFriends ? 'Open chat' : 'Send friend request'}
        >
          {alreadyFriends ? (
            <ChatBubbleLeftRightIcon className="shadow-xl text-white rounded-xl bg-blue-500 p-2 w-9 h-9 hover:bg-blue-400 transition" />
          ) : (
            <UserPlusIcon className="shadow-xl text-white rounded-xl bg-green-500 p-2 w-9 h-9 hover:bg-green-400 transition" />
          )}
        </button>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">You</span>
      )}
    </li>
  )
}
