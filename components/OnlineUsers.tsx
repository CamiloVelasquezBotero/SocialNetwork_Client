'use client'
import React from 'react'
import OnlineUserInfo from './ui/OnlineFriendInfo'
import { useStore } from '@/src/store'

export default function OnlineUsers() {
    const friendsOnline = useStore((state) => state.friendsOnline)

    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="font-black text-center py-3 px-4 text-sm sm:text-base bg-indigo-700 dark:bg-indigo-900 text-white flex-shrink-0">
                Online Contacts
            </h2>
            {friendsOnline.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
                        No contacts online right now
                    </p>
                </div>
            ) : (
                <ul className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                    {friendsOnline.map(friendInfo => (
                        <OnlineUserInfo
                            key={friendInfo.id}
                            friendInfo={friendInfo}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}
