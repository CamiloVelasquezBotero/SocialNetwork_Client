import { UserPlusIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/16/solid'
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

  const handleSubmit = () => {
    if (!alreadyFriends) {
      sendFriendRequest(user.id)
    }

    // Already friend, then we send to the chat panel
    setCurrentIdFriendChat(user.id)
    router.push('/dashboard')
  }

  return (
    <li className="flex flex-wrap sm:flex-nowrap justify-between p-2 bg-slate-300 rounded-lg items-center w-full gap-2">
      <p className="hidden sm:block">(FOTO)</p>
      <p className="font-black text-base sm:text-xl truncate max-w-[120px] sm:max-w-none">{user.name}</p>
      <p className="font-black text-slate-700 text-xs sm:text-base truncate max-w-[150px] sm:max-w-none">{user.email}</p>
      {user.id !== userData.id ? (
        <button
          type='button'
          className='cursor-pointer flex-shrink-0'
          onClick={handleSubmit}
        >
          {alreadyFriends ? (
            <ChatBubbleLeftRightIcon className="shadow-xl text-white rounded-xl bg-blue-500 p-2 w-9 hover:bg-blue-400 transition" />
          ) : (
            <UserPlusIcon className="shadow-xl text-white rounded-xl bg-green-500 p-2 w-9 hover:bg-green-400 transition" />
          )}
        </button>
      ) : (
        <UserIcon className="shadow-xl text-white rounded-xl bg-blue-700 p-2 w-9 hover:bg-blue-600 transition flex-shrink-0" />
      )}
    </li>
  )
}
