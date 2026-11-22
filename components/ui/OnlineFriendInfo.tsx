'use client'
import { useStore } from '@/src/store'
import { FriendOnline } from '@/src/types'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/16/solid'

type OnlineFriendInfoProps = {
    friendInfo: FriendOnline
}

export default function OnlineFriendInfo({ friendInfo }: OnlineFriendInfoProps) {
    const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)
    const idFriendCurrentChat = useStore((state) => state.idFriendCurrentChat)

    const profileImage = friendInfo.profileImage || '/profile.jpg'
    const isActive = idFriendCurrentChat === friendInfo.id

    return (
        <li
            className={`w-full px-3 py-2 rounded-xl cursor-pointer transition-all ${
                isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/50'
                    : 'hover:bg-slate-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setCurrentIdFriendChat(friendInfo.id)}
        >
            <div className="flex gap-3 items-center">
                <div className="relative flex-shrink-0">
                    <img
                        src={profileImage}
                        width={40}
                        height={40}
                        alt="Contact photo"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-gray-600"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-sm truncate dark:text-white">{friendInfo.name}</p>
                    <p className="text-xs text-green-500">Online</p>
                </div>
                <button
                    className="ml-auto flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIdFriendChat(friendInfo.id)
                    }}
                    title="Open chat"
                >
                    <ChatBubbleLeftRightIcon className="w-7 h-7 text-white bg-blue-500 rounded-lg p-1 hover:bg-blue-400 transition" />
                </button>
            </div>
        </li>
    )
}
