'use client'
import React from 'react'
import ChatInfo from './ChatInfo'
import { useStore } from '@/src/store'

export default function Chats() {
    const friendsOnline = useStore((state) => state.friendsOnline)

    return (
        <div>
            {friendsOnline.length === 0 ? (
                <p className="text-center text-slate-400 dark:text-slate-500 mt-6 text-xs px-2">
                    No contacts online
                </p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {friendsOnline.map(friend => (
                        <ChatInfo
                            key={friend.id}
                            friendInfo={friend}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}
