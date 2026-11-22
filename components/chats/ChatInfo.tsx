'use client'
import { useStore } from '@/src/store'
import { FriendOnline } from '@/src/types'

type ChatInfoProps = {
    friendInfo: FriendOnline
}

export default function ChatInfo({ friendInfo }: ChatInfoProps) {
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
                        alt="Contact photo"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-gray-600"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
                <p className="font-bold text-sm truncate dark:text-white">{friendInfo.name}</p>
            </div>
        </li>
    )
}
